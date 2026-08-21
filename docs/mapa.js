'use strict';
//
// Mapa: kafle ortofotomapy GUGiK, przesuwanie, przybliżanie, rysowanie obrysu.
//
// Wszystko liczone w metrach układu PUWG 1992 (EPSG:2180), tak samo jak w wersji androidowej —
// bo tak samo liczy wspólny rdzeń w `AgroErpMobile-geo-shared.js`. Stopni nie ma tu nigdzie poza
// wejściem z GPS i wyjściem do udostępnienia.

// Rdzeń jest modułem UMD i w przeglądarce **nie tworzy globalnego `com`** — kładzie się pod
// nazwą modułu, z dwukropkiem w środku, więc trzeba po niego sięgnąć nawiasem. W node ten sam
// plik ładuje się przez `require` i wygląda inaczej; stąd dwie drogi zamiast jednej.
const _rdzen = globalThis['AgroErpMobile:geo-shared'] || globalThis;
const Geo = _rdzen.com.agroerp.geo.Geo;

// Dwie usługi ortofoto, bo **ich pokrycie jest rozłączne** — to samo, co na Androidzie.
// Zmierzone 2026-08-13: HighResolution zwraca zdjęcie pod Kaliszem i czystą biel w Puszczy
// Kampinoskiej, StandardResolution odwrotnie. Ta, która ostatnio odpowiedziała obrazem, idzie
// pierwsza — inaczej każdy kafel w okolicy tej drugiej płaci najpierw za pełne pytanie do
// pierwszej, a te potrafią trwać kilkanaście sekund.
const USLUGI = [
  'https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/HighResolution',
  'https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution',
];
let uslugaPreferowana = null;

const PX_KAFLA = Geo.pikseliKafla();

/**
 * Najdalej, jak wolno się oddalić — 64 m na piksel, czyli mniej więcej 26 km w poprzek telefonu.
 *
 * To nie jest liczba wzięta z sufitu ani ostrożność na zapas. Przy tej skali siatka schodzi do
 * poziomu 0, gdzie **jeden kafel obejmuje 65 km** — a każdy dalszy krok w tył nie zmniejsza już
 * poziomu, tylko każe pobrać kilkanaście takich kafli naraz. Zmierzone: przy 128 m/px robi się
 * ich sześć, przy 400 m/px osiemnaście. Usługa GUGiK przestaje wtedy nadążać i zdjęcie po prostu
 * znika — co wygląda dokładnie jak zepsute oddalanie, a jest lawiną żądań, których nikt nie
 * potrzebuje. Pole ogląda się z kilkuset metrów, nie z orbity.
 */
const MAX_M_NA_PX = 64;

class Mapa {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Środek widoku w metrach + skala. Start: środek Polski, żeby cokolwiek było widać, zanim
    // GPS odpowie.
    this.srodekE = 570000;
    this.srodekN = 380000;
    this.mNaPx = 2.0;

    this.kafle = new Map();      // "z/x/y" -> Image | 'pusty' | 'laduje'
    this.obrys = [];             // [{e, n}] — punkty wskazane przez człowieka
    this.dzialka = null;         // [{e, n}] — obrys z ewidencji, jeśli pobrany
    this.pozycja = null;         // {e, n, dokladnosc} — gdzie stoi telefon
    this.przyKliknieciu = null;  // wywoływane przy dodaniu punktu

    this._skalujDoEkranu();
    window.addEventListener('resize', () => { this._skalujDoEkranu(); this.rysuj(); });
    this._podepnijGesty();
    // Pierwsze rysowanie musi paść tutaj. Bez tego canvas zostaje przezroczysty aż do pierwszego
    // dotknięcia — a to, co widać wtedy na ekranie, to białe tło strony wyglądające jak zawieszony
    // program. Samo pobieranie kafli też rusza dopiero z rysowania, więc mapa nawet nie zaczynała
    // się ładować, dopóki człowiek czegoś nie dotknął.
    this.rysuj();
  }

  _skalujDoEkranu() {
    // Bez uwzględnienia devicePixelRatio mapa na telefonie jest rozmyta — canvas ma wtedy
    // wymiar w punktach CSS, a ekran trzy razy więcej pikseli.
    const dpr = window.devicePixelRatio || 1;
    this.szerokosc = this.canvas.clientWidth;
    this.wysokosc = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.szerokosc * dpr);
    this.canvas.height = Math.round(this.wysokosc * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ————— przeliczenia ekran ↔ metry —————

  naEkran(e, n) {
    return {
      x: this.szerokosc / 2 + (e - this.srodekE) / this.mNaPx,
      // Oś północy rośnie w górę, oś Y ekranu w dół — stąd minus. Pomylenie tego daje mapę
      // odbitą w pionie, co wygląda wiarygodnie do chwili porównania z terenem.
      y: this.wysokosc / 2 - (n - this.srodekN) / this.mNaPx,
    };
  }

  naMetry(x, y) {
    return {
      e: this.srodekE + (x - this.szerokosc / 2) * this.mNaPx,
      n: this.srodekN - (y - this.wysokosc / 2) * this.mNaPx,
    };
  }

  zakresWidoku() {
    const a = this.naMetry(0, this.wysokosc);
    const b = this.naMetry(this.szerokosc, 0);
    return { minE: a.e, minN: a.n, maxE: b.e, maxN: b.n };
  }

  ustawSrodek(e, n, mNaPx) {
    this.srodekE = e;
    this.srodekN = n;
    if (mNaPx) this.mNaPx = mNaPx;
    this.rysuj();
  }

  /** Kadruje widok tak, żeby zmieścił się podany obrys, z zapasem na marginesy. */
  pokazObszar(punkty) {
    if (!punkty.length) return;
    let minE = Infinity, minN = Infinity, maxE = -Infinity, maxN = -Infinity;
    for (const p of punkty) {
      minE = Math.min(minE, p.e); maxE = Math.max(maxE, p.e);
      minN = Math.min(minN, p.n); maxN = Math.max(maxN, p.n);
    }
    // Minimum 60 m boku: bez tego pojedynczy punkt (albo działka wielkości garażu) kadruje się
    // na metr kwadratowy gruntu i widać jeden piksel zdjęcia rozciągnięty na cały ekran.
    const szer = Math.max(maxE - minE, 60);
    const wys = Math.max(maxN - minN, 60);
    this.srodekE = (minE + maxE) / 2;
    this.srodekN = (minN + maxN) / 2;
    this.mNaPx = Math.max(szer / this.szerokosc, wys / this.wysokosc) * 1.25;
    this.rysuj();
  }

  // ————— kafle —————

  _adres(usluga, z, x, y) {
    const b = Geo.zasiegKafla(z, x, y);   // [minE, minN, maxE, maxN]
    const bbox = `${b[0].toFixed(2)},${b[1].toFixed(2)},${b[2].toFixed(2)},${b[3].toFixed(2)}`;
    // WMS 1.1.1, nie 1.3.0 — świadomie. W 1.3.0 kolejność osi wynika z definicji układu, a dla
    // EPSG:2180 jest odwrotna niż intuicyjna; zdjęcie wraca wtedy z zupełnie innego miejsca Polski.
    // W 1.1.1 BBOX to zawsze (minX, minY, maxX, maxY) i nie ma czego mylić.
    return `${usluga}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=Raster&STYLES=` +
           `&SRS=EPSG:2180&BBOX=${bbox}&WIDTH=${PX_KAFLA}&HEIGHT=${PX_KAFLA}&FORMAT=image/jpeg`;
  }

  _pobierzKafel(z, x, y) {
    const klucz = `${z}/${x}/${y}`;
    if (this.kafle.has(klucz)) return;
    this.kafle.set(klucz, 'laduje');

    const kolejnosc = uslugaPreferowana
      ? [uslugaPreferowana, ...USLUGI.filter(u => u !== uslugaPreferowana)]
      : USLUGI;

    // Rozróżnienie, które okazało się konieczne: **„tu nie ma zdjęcia" to co innego niż
    // „usługa akurat nie odpowiedziała"**. StandardResolution potrafi w odstępie minuty zwrócić
    // raz 404, raz porządny obraz z tego samego miejsca. Zapamiętanie takiej chwili jako trwałego
    // braku zostawia szary ekran do końca sesji, mimo że sieć już wróciła.
    let bylBlad = false;

    const sprobuj = (i) => {
      if (i >= kolejnosc.length) {
        // Same białe płachty = w tym miejscu naprawdę nie ma zdjęcia; zapamiętujemy, żeby nie
        // pytać w kółko. Choć jeden błąd = kasujemy wpis i przy następnym przesunięciu mapy
        // kafel spróbuje jeszcze raz.
        if (bylBlad) this.kafle.delete(klucz);
        else this.kafle.set(klucz, 'pusty');
        return;
      }
      const img = new Image();
      // Potrzebne, żeby dało się odczytać piksele i rozpoznać białą płachtę. GUGiK odsyła
      // nagłówki CORS, więc to przechodzi; bez tego canvas robi się „skażony" i odczyt rzuca błąd.
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this._pustyKafel(img)) { sprobuj(i + 1); return; }   // biała płachta = brak pokrycia
        uslugaPreferowana = kolejnosc[i];
        this.kafle.set(klucz, { img, z, x, y, b: Geo.zasiegKafla(z, x, y) });
        this._przytnijPamiec();
        if (this.przyKafluDobrym) this.przyKafluDobrym();
        this.rysuj();
      };
      img.onerror = () => { bylBlad = true; sprobuj(i + 1); };
      img.src = this._adres(kolejnosc[i], z, x, y);
    };
    sprobuj(0);
  }

  /**
   * Ogranicznik pamięci.
   *
   * Podkład opłaca się tylko dopóki trzymanie starych kafli jest tanie. Każdy to megabajt z hakiem
   * po rozpakowaniu, a telefon w polu nie ma ich do oddania — przy kilkuset kaflach przeglądarka
   * zaczyna kasować zakładkę w tle i człowiek wraca do pustego ekranu. Wyrzucamy najstarsze,
   * bo Map zachowuje kolejność wstawiania.
   */
  _przytnijPamiec() {
    const LIMIT = 220;
    if (this.kafle.size <= LIMIT) return;
    const doUsuniecia = this.kafle.size - LIMIT;
    let i = 0;
    for (const klucz of this.kafle.keys()) {
      if (i++ >= doUsuniecia) break;
      this.kafle.delete(klucz);
    }
  }

  /**
   * Czy kafel to pusta biała płachta.
   *
   * Usługa **nie zgłasza braku pokrycia błędem** — odpowiada poprawnym obrazkiem, tyle że białym.
   * Bez tego sprawdzenia druga usługa nigdy by nie dostała szansy i pół Polski byłoby puste.
   * Próbkowana siatka, nie każdy piksel: to biegnie przy każdym kaflu.
   */
  _pustyKafel(img) {
    const c = Mapa._probka || (Mapa._probka = document.createElement('canvas'));
    c.width = c.height = 8;
    const k = c.getContext('2d', { willReadFrequently: true });
    k.drawImage(img, 0, 0, 8, 8);
    let dane;
    try { dane = k.getImageData(0, 0, 8, 8).data; } catch { return false; }
    for (let i = 0; i < dane.length; i += 4) {
      if (dane[i] < 245 || dane[i + 1] < 245 || dane[i + 2] < 245) return false;
    }
    return true;
  }

  // ————— rysowanie —————

  rysuj() {
    if (this._czeka) return;
    // Jedno przerysowanie na klatkę. Bez tego szczypanie wywołuje rysowanie po kilka razy między
    // klatkami i ruch zaczyna szarpać dokładnie wtedy, gdy ma być płynny.
    this._czeka = true;
    requestAnimationFrame(() => { this._czeka = false; this._rysujTeraz(); });
  }

  _rysujTeraz() {
    const ctx = this.ctx;
    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(0, 0, this.szerokosc, this.wysokosc);

    const w = this.zakresWidoku();
    const z = Geo.poziomKafli(w.minE, w.minN, w.maxE, w.maxN, this.mNaPx);

    // ————— podkład z tego, co już mamy —————
    //
    // Rysujemy **wszystkie** wczytane kafle przecinające widok, od najbardziej ogólnych do
    // najbardziej szczegółowych, więc szczegółowe zakrywają ogólne. To jest ta sztuczka, dzięki
    // której mapy w przeglądarce wyglądają na płynne: po szczypnięciu zmienia się poziom kafli
    // i te właściwe trzeba dopiero ściągnąć, a GUGiK potrafi się z tym guzdrać kilkanaście sekund.
    // Bez podkładu ekran robi się w tym czasie pusty i wygląda, jakby program się zawiesił —
    // rozciągnięty kafel z poprzedniego poziomu jest rozmyty, ale widać na nim, gdzie się jest.
    const doNarysowania = [];
    for (const wpis of this.kafle.values()) {
      if (!wpis || !wpis.img) continue;
      const b = wpis.b;
      if (b[2] < w.minE || b[0] > w.maxE || b[3] < w.minN || b[1] > w.maxN) continue;
      doNarysowania.push(wpis);
    }
    doNarysowania.sort((a, b) => a.z - b.z);
    for (const wpis of doNarysowania) {
      const lg = this.naEkran(wpis.b[0], wpis.b[3]);   // lewy górny róg
      const pd = this.naEkran(wpis.b[2], wpis.b[1]);   // prawy dolny
      // +1 px: sąsiednie kafle po zaokrągleniu zostawiają między sobą włosowe szpary, które
      // na ciemnym tle wyglądają jak siatka narysowana na zdjęciu.
      ctx.drawImage(wpis.img, lg.x, lg.y, pd.x - lg.x + 1, pd.y - lg.y + 1);
    }

    // ————— dociąganie brakujących —————
    //
    // Widok powiększony o margines, żeby kafle tuż za krawędzią były już w drodze, zanim człowiek
    // tam przesunie. Bez tego każde przesunięcie odsłania szary pas i dopiero wtedy zaczyna się
    // pobieranie.
    const zapas = this.mNaPx * Math.max(this.szerokosc, this.wysokosc) * 0.35;
    const lista = Geo.kafleDlaWidoku(
      w.minE - zapas, w.minN - zapas, w.maxE + zapas, w.maxN + zapas, z,
    );
    for (let i = 0; i < lista.length; i += 3) {
      this._pobierzKafel(lista[i], lista[i + 1], lista[i + 2]);
    }

    if (this.dzialka) this._rysujWielokat(this.dzialka, 'rgba(41,182,246,.18)', '#29b6f6', 3, false);
    if (this.obrys.length) this._rysujWielokat(this.obrys, 'rgba(255,214,0,.22)', '#ffd600', 3, true);
    if (this.pozycja) this._rysujPozycje();
  }

  _rysujWielokat(punkty, wypelnienie, kolor, grubosc, zPunktami) {
    const ctx = this.ctx;
    ctx.beginPath();
    punkty.forEach((p, i) => {
      const t = this.naEkran(p.e, p.n);
      i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y);
    });
    if (punkty.length > 2) {
      ctx.closePath();
      ctx.fillStyle = wypelnienie;
      ctx.fill();
    }
    ctx.strokeStyle = kolor;
    ctx.lineWidth = grubosc;
    ctx.lineJoin = 'round';
    ctx.stroke();

    if (!zPunktami) return;
    punkty.forEach((p, i) => {
      const t = this.naEkran(p.e, p.n);
      ctx.beginPath();
      // Ostatni punkt większy — na telefonie to jedyny sposób, żeby po dołożeniu punktu od razu
      // widzieć, który to był, bez porównywania z pamięcią sprzed sekundy.
      ctx.arc(t.x, t.y, i === punkty.length - 1 ? 9 : 6, 0, Math.PI * 2);
      ctx.fillStyle = i === punkty.length - 1 ? '#fff' : kolor;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  _rysujPozycje() {
    const ctx = this.ctx;
    const t = this.naEkran(this.pozycja.e, this.pozycja.n);
    // Krąg dokładności rysowany tylko wtedy, gdy naprawdę coś znaczy: przy dokładności 3 m
    // i skali 2 m/px to półtora piksela i wygląda jak brud na ekranie.
    const r = this.pozycja.dokladnosc / this.mNaPx;
    if (r > 8) {
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(33,150,243,.15)';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#2196f3';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // ————— gesty —————

  _podepnijGesty() {
    const c = this.canvas;
    const palce = new Map();
    let startD = 0, startSkala = 0, startSrodek = null;
    let ruch = 0, czasStartu = 0;

    c.addEventListener('pointerdown', (ev) => {
      c.setPointerCapture(ev.pointerId);
      palce.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (palce.size === 1) { ruch = 0; czasStartu = Date.now(); }
      if (palce.size === 2) {
        const [a, b] = [...palce.values()];
        startD = Math.hypot(a.x - b.x, a.y - b.y);
        startSkala = this.mNaPx;
        startSrodek = this.naMetry((a.x + b.x) / 2, (a.y + b.y) / 2);
      }
    });

    c.addEventListener('pointermove', (ev) => {
      const p = palce.get(ev.pointerId);
      if (!p) return;
      const dx = ev.clientX - p.x, dy = ev.clientY - p.y;
      p.x = ev.clientX; p.y = ev.clientY;

      if (palce.size === 1) {
        ruch += Math.hypot(dx, dy);
        this.srodekE -= dx * this.mNaPx;
        this.srodekN += dy * this.mNaPx;
        this.rysuj();
      } else if (palce.size === 2) {
        const [a, b] = [...palce.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (startD > 0 && d > 0) {
          this.mNaPx = Math.min(MAX_M_NA_PX, Math.max(0.15, startSkala * (startD / d)));
          // Punkt między palcami ma zostać pod palcami — inaczej mapa ucieka w bok przy każdym
          // szczypnięciu i trzeba ją potem szukać.
          const sx = (a.x + b.x) / 2, sy = (a.y + b.y) / 2;
          this.srodekE = startSrodek.e - (sx - this.szerokosc / 2) * this.mNaPx;
          this.srodekN = startSrodek.n + (sy - this.wysokosc / 2) * this.mNaPx;
        }
        ruch = 999;    // szczypanie to nigdy nie jest dotknięcie
        this.rysuj();
      }
    });

    const koniec = (ev) => {
      if (!palce.has(ev.pointerId)) return;
      const ostatni = palce.size === 1;
      palce.delete(ev.pointerId);
      // Dotknięcie, a nie przeciągnięcie: krótkie i bez przesunięcia. Progi dobrane pod palec —
      // przy 10 px i 350 ms zwykłe tapnięcie mieści się z zapasem, a przesuwanie mapy nigdy
      // nie dokłada punktu przez przypadek.
      if (ostatni && ruch < 10 && Date.now() - czasStartu < 350 && this.przyKliknieciu) {
        const r = c.getBoundingClientRect();
        this.przyKliknieciu(this.naMetry(ev.clientX - r.left, ev.clientY - r.top));
      }
    };
    c.addEventListener('pointerup', koniec);
    c.addEventListener('pointercancel', (ev) => palce.delete(ev.pointerId));
  }
}
