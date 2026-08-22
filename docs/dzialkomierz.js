'use strict';
//
// Działkomierz — rozpoznawanie działek i pomiar powierzchni pola na zdjęciu lotniczym.
//
// Objazdu GPS **celowo tu nie ma**. Safari na iPhonie przestaje śledzić pozycję przy wygaszonym
// ekranie i po przełączeniu na inną aplikację, a pomiar, który po cichu przestaje zbierać punkty
// w połowie pola, jest gorszy niż jego brak — bo wynik wygląda wiarygodnie. Objazd zostaje
// wyłączną domeną wersji androidowej, która potrafi zbierać pozycje w tle.

const el = (id) => document.getElementById(id);
const mapa = new Mapa(el('mapa'));

/** 'dzialki' — dotknięcie mapy dokłada działkę z ewidencji; 'rysowanie' — dotknięcie stawia punkt. */
let tryb = 'dzialki';

// ————— formatowanie —————

/**
 * Powierzchnia po ludzku.
 *
 * Hektary z dwoma miejscami, bo tak się mówi o polach, ale poniżej hektara przeliczanie na
 * ułamki hektara jest nieczytelne („0,03 ha" nikomu nic nie mówi) — wtedy metry.
 */
function opiszPowierzchnie(m2) {
  if (m2 < 1000) return `${Math.round(m2)} m²`;
  return `${(m2 / 10000).toFixed(2).replace('.', ',')} ha`;
}

/** Polska odmiana po liczbie: 1 punkt, 2–4 punkty, 5+ punktów (i 12–14 punktów, nie punkty). */
function odmien(n, poj, kilka, wiele) {
  if (n === 1) return poj;
  const dwie = n % 100, jedna = n % 10;
  return (jedna >= 2 && jedna <= 4 && !(dwie >= 12 && dwie <= 14)) ? kilka : wiele;
}

function opiszDlugosc(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2).replace('.', ',')} km`;
}

function komunikat(tekst, sekund = 5) {
  const k = el('komunikat');
  k.textContent = tekst;
  k.classList.add('widoczny');
  clearTimeout(komunikat._t);
  if (sekund) komunikat._t = setTimeout(() => k.classList.remove('widoczny'), sekund * 1000);
}

function schowajKomunikat() { el('komunikat').classList.remove('widoczny'); }

function plaskaTablica(punkty) {
  const t = new Float64Array(punkty.length * 2);
  punkty.forEach((p, i) => { t[i * 2] = p.e; t[i * 2 + 1] = p.n; });
  return t;
}

// ————— rozmowa z rejestrami GUGiK —————

/** `SRID=2180;POLYGON((e n,e n,...))` → lista punktów. Pierścień wewnętrzny pomijamy — do obrysu
 *  działki potrzebny jest tylko zewnętrzny. */
function czytajWkt(wkt) {
  const m = /POLYGON\s*\(\((.+?)\)/i.exec(wkt || '');
  if (!m) return null;
  const punkty = m[1].split(',').map(para => {
    const [e, n] = para.trim().split(/\s+/).map(Number);
    return { e, n };
  });
  return punkty.some(p => !isFinite(p.e) || !isFinite(p.n)) ? null : punkty;
}

/** Wspólny kształt odpowiedzi ULDK: `id|gmina|obręb|numer|geom_wkt`, poprzedzony linią stanu. */
function czytajDzialke(tekst) {
  const linie = (tekst || '').trim().split('\n');
  // Pierwsza linia to stan: „0" znaczy dobrze, „-1 …" że nie znaleziono. Odpowiedź jest tekstowa,
  // nie JSON — to nie pomyłka, tak ta usługa mówi.
  if (linie[0].trim() !== '0') return null;
  const pola = (linie[1] || '').split('|');
  if (pola.length < 5) return null;
  const obrys = czytajWkt(pola[4]);
  return {
    id: pola[0],
    gmina: pola[1],
    obreb: pola[2],
    numer: pola[3],
    obrys,
    m2: obrys ? Geo.areaM2(plaskaTablica(obrys)) : null,
  };
}

const POLA_ULDK = 'id,commune,region,parcel,geom_wkt';

async function dzialkaWPunkcie(e, n) {
  const odp = await fetch('https://uldk.gugik.gov.pl/?request=GetParcelByXY' +
    `&xy=${e.toFixed(2)},${n.toFixed(2)}&result=${POLA_ULDK}&srid=2180`);
  return czytajDzialke(await odp.text());
}

async function dzialkaPoNumerze(id) {
  const odp = await fetch('https://uldk.gugik.gov.pl/?request=GetParcelById' +
    `&id=${encodeURIComponent(id)}&result=${POLA_ULDK}&srid=2180`);
  return czytajDzialke(await odp.text());
}

/**
 * Adresy z Państwowego Rejestru Granic.
 *
 * Usługa wymaga przecinka między miejscowością a ulicą i **bez niego zwraca zero wyników** —
 * co czyta się jak „nie ma takiego adresu", a nie „zły separator". Dlatego zgadujemy za człowieka:
 * najpierw to, co wpisał, potem przecinek po pierwszym słowie (Kalisz, Dobrzecka 193), a na końcu
 * przed ulicą z numerem (Nowe Miasto, Dobrzecka 193).
 */
function wariantyZapytania(q) {
  const t = q.trim();
  if (!t || t.includes(',')) return t ? [t] : [];
  const slowa = t.split(/\s+/);
  if (slowa.length < 3) return [t];
  return [...new Set([
    t,
    `${slowa[0]}, ${slowa.slice(1).join(' ')}`,
    `${slowa.slice(0, -2).join(' ')}, ${slowa.slice(-2).join(' ')}`,
  ])];
}

async function szukajAdresu(q) {
  for (const wariant of wariantyZapytania(q)) {
    const odp = await fetch('https://services.gugik.gov.pl/uug/?request=GetAddress&address=' +
      encodeURIComponent(wariant));
    let dane;
    try { dane = await odp.json(); } catch { continue; }   // pudło bywa zwykłym tekstem, nie JSON-em
    const wyniki = dane && dane.results;
    if (!wyniki) continue;
    const lista = Object.values(wyniki).map(w => ({
      miasto: w.city || '',
      ulica: (w.street && w.street !== 'null') ? w.street : '',
      numer: (w.number && w.number !== 'null') ? w.number : '',
      kod: (w.code && w.code !== 'null') ? w.code : '',
      e: Number(w.x),
      n: Number(w.y),
    })).filter(w => isFinite(w.e) && isFinite(w.n));
    if (lista.length) return lista.slice(0, 8);
  }
  return [];
}

// ————— zestaw działek —————

function sumaDzialek() {
  return mapa.dzialki.reduce((s, d) => s + (d.m2 || 0), 0);
}

function odswiezListeDzialek() {
  const lista = el('lista-dzialek');
  lista.innerHTML = '';
  lista.classList.toggle('widoczna', mapa.dzialki.length > 0 && tryb === 'dzialki');
  mapa.dzialki.forEach((d, i) => {
    const w = document.createElement('div');
    w.className = 'wiersz-dzialki';
    const nazwa = document.createElement('div');
    nazwa.className = 'nazwa';
    nazwa.textContent = `${d.numer} · ${d.obreb}`;
    const pole = document.createElement('div');
    pole.className = 'pole';
    pole.textContent = d.m2 ? opiszPowierzchnie(d.m2) : '—';
    const sasiedzi = document.createElement('button');
    sasiedzi.className = 'usun';
    sasiedzi.textContent = '＋';
    sasiedzi.title = 'Dołóż działki dookoła';
    sasiedzi.setAttribute('aria-label', `Dołóż działki sąsiadujące z ${d.numer}`);
    sasiedzi.addEventListener('click', () => dolozSasiadow(d));

    const usun = document.createElement('button');
    usun.className = 'usun';
    usun.textContent = '✕';
    usun.setAttribute('aria-label', `Usuń działkę ${d.numer}`);
    usun.addEventListener('click', () => {
      mapa.dzialki.splice(i, 1);
      przelicz();
      mapa.rysuj();
    });
    w.append(nazwa, pole, sasiedzi, usun);
    lista.append(w);
  });
}

/** Dokłada działkę do zestawu albo — jeśli już w nim jest — wyjmuje ją. */
function przelaczDzialke(d) {
  const i = mapa.dzialki.findIndex(x => x.id === d.id);
  if (i >= 0) {
    mapa.dzialki.splice(i, 1);
    komunikat(`Wyjęto działkę ${d.numer}.`, 3);
  } else {
    mapa.dzialki.push(d);
    sprawdzLasWTle(d);
    // Bez tej informacji dokładanie działek jest ruchem w ciemno — człowiek widzi tylko, że coś
    // się podświetliło, a interesuje go, ile tego już ma razem.
    komunikat(mapa.dzialki.length === 1
      ? `Działka ${d.numer}: ${opiszPowierzchnie(d.m2 || 0)}. Dotykaj kolejnych — zsumują się.`
      : `Dołożono ${d.numer}. Razem ${opiszPowierzchnie(sumaDzialek())} z ${mapa.dzialki.length} działek.`, 4);
  }
  przelicz();
  mapa.rysuj();
}

// ————— sąsiednie działki —————

/**
 * Punkty do zapytania o sąsiadów: kawałek **na zewnątrz** od środka każdego boku.
 *
 * ULDK nie ma zapytania „wszystko w tym prostokącie", więc sąsiadów szuka się pytając, co leży
 * tuż za każdą krawędzią. Odsunięcie liczone po normalnej do boku, w stronę przeciwną niż środek
 * działki — bez tego połowa sond wskazuje z powrotem w tę samą działkę i wraca ona sama jako
 * własny sąsiad.
 */
function punktySondujace(obrys, odsuniecieM = 6) {
  let cx = 0, cy = 0;
  for (const p of obrys) { cx += p.e / obrys.length; cy += p.n / obrys.length; }
  const punkty = [];
  for (let i = 0; i < obrys.length; i++) {
    const a = obrys[i], b = obrys[(i + 1) % obrys.length];
    const sx = (a.e + b.e) / 2, sy = (a.n + b.n) / 2;
    let nx = -(b.n - a.n), ny = (b.e - a.e);
    const dl = Math.hypot(nx, ny);
    if (dl < 0.5) continue;                       // bok krótszy niż pół metra: sonda i tak trafi w ten sam punkt
    nx /= dl; ny /= dl;
    if ((sx - cx) * nx + (sy - cy) * ny < 0) { nx = -nx; ny = -ny; }   // odwróć, jeśli celuje do środka
    punkty.push({ e: sx + nx * odsuniecieM, n: sy + ny * odsuniecieM });
  }
  return punkty;
}

async function dolozSasiadow(d) {
  if (!d.obrys) { komunikat('Ta działka nie ma obrysu, więc nie wiem, co ją otacza.'); return; }
  const sondy = punktySondujace(d.obrys);
  komunikat(`Szukam sąsiadów działki ${d.numer}…`, 0);
  let dodane = 0;
  // Jedna po drugiej, nie wszystkie naraz: to darmowa usługa publiczna, a kilkanaście
  // równoczesnych żądań na jedno dotknięcie nie jest sposobem, w jaki się z niej korzysta.
  for (const s of sondy) {
    try {
      const sasiad = await dzialkaWPunkcie(s.e, s.n);
      if (!sasiad || mapa.dzialki.some(x => x.id === sasiad.id)) continue;
      mapa.dzialki.push(sasiad);
      dodane++;
      przelicz();
      mapa.rysuj();
    } catch { /* pojedyncza nieudana sonda to nie powód, żeby przerwać całe szukanie */ }
  }
  komunikat(dodane
    ? `Dołożono ${dodane} ${odmien(dodane, 'sąsiada', 'sąsiadów', 'sąsiadów')}. Razem ${opiszPowierzchnie(sumaDzialek())}.`
    : 'Nie znalazłem nowych sąsiadów — albo już wszystkie są w zestawie.', 6);
}

// ————— las —————

const BDL = 'https://mapserver.bdl.lasy.gov.pl/arcgis/services/WMS_BDL_mapa_drzewostanow/MapServer/WMSServer';

/**
 * Pierwszy wiersz tabeli to nazwy pól, drugi to wartości.
 *
 * Sklejane po pozycji, ale tylko gdy liczby się zgadzają — przy niezgodności wolimy nie powiedzieć
 * nic, niż przypisać wiek gatunkowi. Zdanie z przesuniętych kolumn brzmiałoby równie wiarygodnie
 * i byłoby nieprawdą.
 */
function polaZTabeli(html) {
  const wiersze = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(w =>
    [...w[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(k => k[1].replace(/<[^>]*>/g, '').trim()));
  const pelne = wiersze.filter(w => w.length);
  if (pelne.length < 2 || pelne[0].length !== pelne[1].length) return null;
  const mapka = {};
  pelne[0].forEach((nazwa, i) => {
    const v = pelne[1][i];
    mapka[nazwa] = (v && v.toLowerCase() === 'null') ? '' : v;
  });
  return mapka;
}

/** Zdanie o drzewostanie w tym punkcie albo null, gdy to nie las. */
async function opiszLas(e, n) {
  const p = 64;
  const bbox = `${(e - p).toFixed(2)},${(n - p).toFixed(2)},${(e + p).toFixed(2)},${(n + p).toFixed(2)}`;
  const warstwy = '0,1,2,3,4,5,6,7';
  const odp = await fetch(`${BDL}?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=1.1.1` +
    `&LAYERS=${warstwy}&QUERY_LAYERS=${warstwy}&STYLES=&SRS=EPSG:2180&BBOX=${bbox}` +
    '&WIDTH=512&HEIGHT=512&X=256&Y=256&FEATURE_COUNT=5&INFO_FORMAT=text/html');
  const pola = polaZTabeli(await odp.text());
  if (!pola) return null;
  // Całe zdanie składa rdzeń, ten sam co na Androidzie. Sklejanie tego tutaj z osobnych kawałków
  // dawało pustkę wszędzie tam, gdzie opis taksacyjny jest dziurawy — a jest, zwłaszcza poza
  // lasami państwowymi. Zmierzone w Puszczy Kampinoskiej: przyszedł wiek i adres leśny, bez
  // gatunku i bez siedliska, więc „nic do powiedzenia" było nieprawdą.
  return Geo.opisLasu(
    `${pola['species_cd_d'] || ''}${pola['species_age'] || ''}` || null,
    pola['site_type_cd'] || null,
    pola['adress_forest'] || null,
  );
}

/** Dopytuje o las w tle — działka pokazuje się od razu, opis dochodzi, gdy przyjdzie. */
function sprawdzLasWTle(d) {
  if (!d.obrys) return;
  let cx = 0, cy = 0;
  for (const p of d.obrys) { cx += p.e / d.obrys.length; cy += p.n / d.obrys.length; }
  opiszLas(cx, cy).then(opis => {
    if (!opis) return;
    d.las = opis;
    // Dopisujemy tylko wtedy, gdy ta działka wciąż jest tą oglądaną — przy szybkim dotykaniu
    // kolejnych odpowiedź potrafi przyjść po tym, jak człowiek patrzy już na inną.
    if (mapa.dzialki.length === 1 && mapa.dzialki[0].id === d.id) {
      el('dzialka-opis').textContent += ` · 🌲 ${opis}`;
    }
  }).catch(() => { /* las to dodatek, nie powód do komunikatu o błędzie */ });
}

// ————— wynik na górze —————

function przelicz() {
  const p = mapa.obrys;
  const d = mapa.dzialki;
  el('btn-cofnij').disabled = tryb === 'rysowanie' ? p.length === 0 : d.length === 0;
  el('btn-wyczysc').disabled = p.length === 0 && d.length === 0;
  el('btn-udostepnij').disabled = p.length < 3 && d.length === 0;
  odswiezListeDzialek();

  // Obrys ręczny ma pierwszeństwo w nagłówku: jeśli ktoś go rysuje, to jego właśnie liczy.
  if (p.length >= 3) {
    const plaska = plaskaTablica(p);
    const m2 = Geo.areaM2(plaska);
    el('powierzchnia').textContent = opiszPowierzchnie(m2);
    el('szczegoly').textContent =
      `obwód ${opiszDlugosc(Geo.perimeterM(plaska))} · ${p.length} ${odmien(p.length, 'punkt', 'punkty', 'punktów')} · ${Math.round(m2)} m²`;
    // Obrys, którego boki się przecinają, ma powierzchnię policzoną, ale bez sensu — część pola
    // liczy się wtedy na minus. Lepiej powiedzieć wprost niż pokazać wiarygodnie wyglądającą liczbę.
    if (Geo.selfIntersects(plaska)) {
      komunikat('Linie obrysu przecinają się — powierzchnia będzie błędna. Cofnij ostatni punkt.', 0);
    }
    el('dzialka-opis').textContent = d.length
      ? `oraz ${d.length} ${odmien(d.length, 'działka', 'działki', 'działek')} z ewidencji: ${opiszPowierzchnie(sumaDzialek())}`
      : '';
    return;
  }

  if (p.length > 0) {
    el('powierzchnia').textContent = `${p.length} ${odmien(p.length, 'punkt', 'punkty', 'punktów')}`;
    el('szczegoly').textContent = 'Potrzebne co najmniej trzy punkty';
    return;
  }

  if (d.length > 0) {
    el('powierzchnia').textContent = opiszPowierzchnie(sumaDzialek());
    el('szczegoly').textContent =
      `${d.length} ${odmien(d.length, 'działka', 'działki', 'działek')} z ewidencji · ${Math.round(sumaDzialek())} m²`;
    el('dzialka-opis').textContent = d.length === 1
      ? `${d[0].numer} · obręb ${d[0].obreb} · gm. ${d[0].gmina}`
      : '';
    return;
  }

  el('powierzchnia').textContent = '—';
  el('szczegoly').textContent = tryb === 'dzialki'
    ? 'Dotykaj działek na mapie — zsumują się'
    : 'Dotykaj mapy w rogach pola';
  el('dzialka-opis').textContent = '';
}

// ————— dotknięcie mapy —————

mapa.przyKliknieciu = async (punkt) => {
  if (tryb === 'rysowanie') {
    schowajKomunikat();
    mapa.obrys.push(punkt);
    przelicz();
    mapa.rysuj();
    return;
  }
  komunikat('Sprawdzam działkę…', 0);
  try {
    const d = await dzialkaWPunkcie(punkt.e, punkt.n);
    if (!d) { komunikat('W tym miejscu ewidencja nie ma działki.'); return; }
    przelaczDzialke(d);
  } catch {
    komunikat('Rejestr działek nie odpowiada. Spróbuj za chwilę.');
  }
};

// ————— tryby —————

function ustawTryb(nowy) {
  tryb = nowy;
  el('tryb-dzialki').classList.toggle('wybrany', nowy === 'dzialki');
  el('tryb-rysowanie').classList.toggle('wybrany', nowy === 'rysowanie');
  przelicz();
  mapa.rysuj();
}
el('tryb-dzialki').addEventListener('click', () => ustawTryb('dzialki'));
el('tryb-rysowanie').addEventListener('click', () => {
  ustawTryb('rysowanie');
  komunikat('Dotykaj rogów pola po kolei. Granice z ewidencji zostają widoczne jako podkład.', 6);
});

// ————— gdzie jestem —————

el('btn-gdzie').addEventListener('click', () => {
  if (!navigator.geolocation) { komunikat('Ta przeglądarka nie udostępnia położenia.'); return; }
  komunikat('Szukam położenia…', 0);
  navigator.geolocation.getCurrentPosition(async (poz) => {
    const [e, n] = Geo.toEastingNorthing(poz.coords.latitude, poz.coords.longitude);
    mapa.pozycja = { e, n, dokladnosc: poz.coords.accuracy || 0 };
    mapa.ustawSrodek(e, n, Math.min(mapa.mNaPx, 1.0));
    komunikat('Sprawdzam działkę w ewidencji…', 0);
    try {
      const d = await dzialkaWPunkcie(e, n);
      if (!d) { komunikat('Tu nie ma działki w ewidencji — albo jesteś poza Polską.'); return; }
      if (d.obrys) mapa.pokazObszar(d.obrys);
      if (!mapa.dzialki.some(x => x.id === d.id)) { mapa.dzialki.push(d); sprawdzLasWTle(d); }
      przelicz();
      mapa.rysuj();
      komunikat(`Stoisz na działce ${d.numer} — ${opiszPowierzchnie(d.m2 || 0)} wg ewidencji.`, 6);
    } catch {
      komunikat('Nie udało się pobrać działki — brak połączenia albo usługa GUGiK nie odpowiada.');
    }
  }, (blad) => {
    komunikat(blad.code === blad.PERMISSION_DENIED
      ? 'Odmówiono dostępu do położenia. Włącz je dla tej strony w ustawieniach przeglądarki.'
      : 'Nie udało się ustalić położenia. Pod dachem GPS często nie łapie.');
  }, { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 });
});

// ————— szukanie —————

/**
 * Czy to wygląda na numer działki z ewidencji, a nie na adres.
 *
 * Pełny identyfikator ma postać `100705_2.0018.235` — kod gminy, obręb i numer rozdzielone
 * kropkami. Rozpoznajemy go po tym wzorcu zamiast pytać człowieka, co wpisał, bo pytanie
 * „adres czy numer działki?" przed każdym szukaniem byłoby dokładnie tą jedną decyzją za dużo.
 */
function wygladaNaNumerDzialki(q) {
  return /^[0-9]{4,8}_[0-9A-Za-z]+\.[0-9A-Za-z]+(\.[0-9A-Za-z/]+)?$/.test(q.trim());
}

function pokazSzukajke(pokaz) {
  el('szukajka').classList.toggle('widoczna', pokaz);
  if (pokaz) el('pole-szukaj').focus();
  else el('podpowiedzi').innerHTML = '';
}

el('btn-szukaj').addEventListener('click', () => pokazSzukajke(true));
el('btn-szukaj-zamknij').addEventListener('click', () => pokazSzukajke(false));

/** Wspólne dla wszystkich dróg dojścia do działki: pokaż ją, dołóż do zestawu, przelicz. */
function przyjmijDzialke(d, opisPrefiks) {
  if (d.obrys) mapa.pokazObszar(d.obrys);
  if (!mapa.dzialki.some(x => x.id === d.id)) { mapa.dzialki.push(d); sprawdzLasWTle(d); }
  przelicz();
  mapa.rysuj();
  komunikat(`${opisPrefiks}${d.numer} · obręb ${d.obreb} · gm. ${d.gmina} — ${opiszPowierzchnie(d.m2 || 0)}`, 7);
}

async function wykonajSzukanie() {
  const q = el('pole-szukaj').value.trim();
  if (!q) return;
  const podp = el('podpowiedzi');
  podp.innerHTML = '<div class="podpowiedz">Szukam…</div>';

  if (wygladaNaNumerDzialki(q)) {
    try {
      const d = await dzialkaPoNumerze(q);
      if (!d) { podp.innerHTML = '<div class="podpowiedz">Nie ma takiej działki w ewidencji.</div>'; return; }
      pokazSzukajke(false);
      przyjmijDzialke(d, 'Działka ');
    } catch {
      podp.innerHTML = '<div class="podpowiedz">Rejestr działek nie odpowiada.</div>';
    }
    return;
  }

  let trafienia;
  try { trafienia = await szukajAdresu(q); }
  catch { podp.innerHTML = '<div class="podpowiedz">Wyszukiwarka adresów nie odpowiada.</div>'; return; }

  if (!trafienia.length) {
    podp.innerHTML = '<div class="podpowiedz">Nic nie znalazłem.' +
      '<div class="drobne">Spróbuj „miejscowość, ulica numer" albo wpisz numer działki, ' +
      'na przykład 100705_2.0018.235.</div></div>';
    return;
  }

  podp.innerHTML = '';
  for (const t of trafienia) {
    const w = document.createElement('div');
    w.className = 'podpowiedz';
    const glowny = document.createElement('div');
    glowny.textContent = [t.ulica, t.numer].filter(Boolean).join(' ') || t.miasto;
    const drugi = document.createElement('div');
    drugi.className = 'drobne';
    drugi.textContent = [t.kod, t.miasto].filter(Boolean).join(' ');
    w.append(glowny, drugi);
    w.addEventListener('click', async () => {
      pokazSzukajke(false);
      mapa.ustawSrodek(t.e, t.n, 0.5);
      // Sam adres to tylko punkt — a szuka się go zwykle po to, żeby zobaczyć działkę pod nim.
      try {
        const d = await dzialkaWPunkcie(t.e, t.n);
        if (d) przyjmijDzialke(d, 'Pod tym adresem: działka ');
      } catch { /* sam adres i tak został pokazany */ }
    });
    podp.append(w);
  }
}

el('btn-szukaj-idz').addEventListener('click', wykonajSzukanie);
el('pole-szukaj').addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter') { ev.preventDefault(); wykonajSzukanie(); }
});

// ————— pozostałe przyciski —————

el('btn-cofnij').addEventListener('click', () => {
  if (tryb === 'rysowanie') mapa.obrys.pop();
  else mapa.dzialki.pop();
  schowajKomunikat();
  przelicz();
  mapa.rysuj();
});

el('btn-wyczysc').addEventListener('click', () => {
  mapa.obrys = [];
  mapa.dzialki = [];
  schowajKomunikat();
  przelicz();
  mapa.rysuj();
});

el('btn-udostepnij').addEventListener('click', async () => {
  const linie = [];
  let srodek = null;

  if (mapa.obrys.length >= 3) {
    const plaska = plaskaTablica(mapa.obrys);
    const m2 = Geo.areaM2(plaska);
    linie.push(`Zmierzone pole: ${opiszPowierzchnie(m2)} (${Math.round(m2)} m²)`);
    linie.push(`Obwód: ${opiszDlugosc(Geo.perimeterM(plaska))}`);
    srodek = mapa.obrys.reduce((a, p) => ({
      e: a.e + p.e / mapa.obrys.length, n: a.n + p.n / mapa.obrys.length,
    }), { e: 0, n: 0 });
  }

  if (mapa.dzialki.length) {
    linie.push(`Działki (${mapa.dzialki.length}), razem ${opiszPowierzchnie(sumaDzialek())}:`);
    for (const d of mapa.dzialki) {
      linie.push(`  ${d.numer}, obręb ${d.obreb}, gm. ${d.gmina} — ${opiszPowierzchnie(d.m2 || 0)}`);
    }
    if (!srodek && mapa.dzialki[0].obrys) {
      const o = mapa.dzialki[0].obrys;
      srodek = o.reduce((a, p) => ({ e: a.e + p.e / o.length, n: a.n + p.n / o.length }), { e: 0, n: 0 });
    }
  }

  if (srodek) {
    const [lat, lon] = Geo.toLatLon(srodek.e, srodek.n);
    linie.push(`Środek: ${lat.toFixed(6)}, ${lon.toFixed(6)}`);
    linie.push(`https://www.google.com/maps?q=${lat.toFixed(6)},${lon.toFixed(6)}`);
  }

  const tekst = linie.join('\n');
  if (navigator.share) {
    try { await navigator.share({ title: 'Działkomierz', text: tekst }); return; } catch { /* anulowane */ }
  }
  // Zapasowo schowek: na komputerze i w starszym Safari nie ma czym się podzielić inaczej.
  try {
    await navigator.clipboard.writeText(tekst);
    komunikat('Wynik skopiowany do schowka.');
  } catch {
    komunikat(tekst, 15);
  }
});

// ————— start —————

let bylKafel = false;
mapa.przyKafluDobrym = () => { bylKafel = true; };

el('btn-start').addEventListener('click', () => {
  el('powitanie').style.display = 'none';
  przelicz();
  // Szary ekran bez słowa wyjaśnienia wygląda jak zepsuty program, a najczęstsza przyczyna jest
  // prozaiczna: usługa GUGiK bywa chwilowo niedostępna albo w tym miejscu nie ma jeszcze zdjęcia.
  // Mierzyć można dalej — obrys i powierzchnia nie zależą od zdjęcia.
  setTimeout(() => {
    if (!bylKafel) {
      komunikat('Nie udało się pobrać zdjęcia lotniczego — usługa GUGiK bywa przeciążona. ' +
                'Przesuń mapę albo spróbuj za chwilę. Mierzyć możesz mimo to.', 9);
    }
  }, 11000);
});

if ('serviceWorker' in navigator) {
  // Rejestracja po załadowaniu strony, nie w trakcie: instalacja workera konkuruje wtedy
  // o łącze z pierwszymi kaflami mapy, a te są tym, na co człowiek czeka.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* bez tego też zadziała */ });
  });
}

przelicz();
