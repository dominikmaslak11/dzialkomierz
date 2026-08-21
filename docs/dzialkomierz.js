'use strict';
//
// Działkomierz — pomiar powierzchni pola na zdjęciu lotniczym.
//
// Objazdu GPS **celowo tu nie ma**. Safari na iPhonie przestaje śledzić pozycję przy wygaszonym
// ekranie i po przełączeniu na inną aplikację, a pomiar, który po cichu przestaje zbierać punkty
// w połowie pola, jest gorszy niż jego brak — bo wynik wygląda wiarygodnie. Objazd zostaje
// wyłączną domeną wersji androidowej, która potrafi zbierać pozycje w tle.

const el = (id) => document.getElementById(id);
const mapa = new Mapa(el('mapa'));

// ————— formatowanie —————

/**
 * Powierzchnia po ludzku.
 *
 * Hektary z dwoma miejscami, bo tak się mówi o polach, ale poniżej hektara przeliczanie na
 * ułamki hektara jest nieczytelne („0,03 ha" nikomu nic nie mówi) — wtedy metry.
 */
function opiszPowierzchnie(m2) {
  if (m2 < 1000) return `${Math.round(m2)} m²`;
  const ha = m2 / 10000;
  return `${ha.toFixed(2).replace('.', ',')} ha`;
}

/** Polska odmiana po liczbie: 1 punkt, 2–4 punkty, 5+ punktów (i 12–14 punktów, nie punkty). */
function odmienPunkty(n) {
  if (n === 1) return 'punkt';
  const dwie = n % 100;
  const jedna = n % 10;
  return (jedna >= 2 && jedna <= 4 && !(dwie >= 12 && dwie <= 14)) ? 'punkty' : 'punktów';
}

function opiszDlugosc(m) {
  return m < 1000
    ? `${Math.round(m)} m`
    : `${(m / 1000).toFixed(2).replace('.', ',')} km`;
}

function komunikat(tekst, sekund = 5) {
  const k = el('komunikat');
  k.textContent = tekst;
  k.classList.add('widoczny');
  clearTimeout(komunikat._t);
  if (sekund) komunikat._t = setTimeout(() => k.classList.remove('widoczny'), sekund * 1000);
}

// ————— pomiar —————

function plaskaTablica(punkty) {
  const t = new Float64Array(punkty.length * 2);
  punkty.forEach((p, i) => { t[i * 2] = p.e; t[i * 2 + 1] = p.n; });
  return t;
}

function przelicz() {
  const p = mapa.obrys;
  el('btn-cofnij').disabled = p.length === 0;
  el('btn-wyczysc').disabled = p.length === 0 && !mapa.dzialka;
  el('btn-udostepnij').disabled = p.length < 3;

  if (p.length < 3) {
    el('powierzchnia').textContent = p.length === 0 ? '—' : `${p.length} ${odmienPunkty(p.length)}`;
    el('szczegoly').textContent = p.length === 0
      ? 'Dotykaj mapy w rogach pola'
      : 'Potrzebne co najmniej trzy punkty';
    return;
  }

  const plaska = plaskaTablica(p);
  const m2 = Geo.areaM2(plaska);
  const obwod = Geo.perimeterM(plaska);

  el('powierzchnia').textContent = opiszPowierzchnie(m2);
  el('szczegoly').textContent = `obwód ${opiszDlugosc(obwod)} · ${p.length} ${odmienPunkty(p.length)} · ${Math.round(m2)} m²`;

  // Obrys, którego boki się przecinają, ma powierzchnię policzoną, ale bez sensu — część pola
  // liczy się wtedy na minus. Lepiej powiedzieć wprost niż pokazać wiarygodnie wyglądającą liczbę.
  if (Geo.selfIntersects(plaska)) {
    komunikat('Linie obrysu przecinają się — powierzchnia będzie błędna. Cofnij ostatni punkt.', 0);
  } else {
    el('komunikat').classList.remove('widoczny');
  }
}

mapa.przyKliknieciu = (punkt) => {
  mapa.obrys.push(punkt);
  przelicz();
  mapa.rysuj();
};

// ————— gdzie jestem + działka z ewidencji —————

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

async function pobierzDzialke(e, n) {
  const adres = 'https://uldk.gugik.gov.pl/?request=GetParcelByXY' +
    `&xy=${e.toFixed(2)},${n.toFixed(2)}&result=id,commune,region,parcel,geom_wkt&srid=2180`;
  const odp = await fetch(adres);
  const tekst = await odp.text();
  const linie = tekst.trim().split('\n');
  // Pierwsza linia to status: "0" znaczy dobrze, "-1 …" znaczy, że nie ma tam działki. Format
  // jest tekstowy, nie JSON — to nie pomyłka, tak ta usługa odpowiada.
  if (linie[0].trim() !== '0') return null;
  const pola = (linie[1] || '').split('|');
  if (pola.length < 5) return null;
  return {
    numer: pola[3],
    gmina: pola[1],
    obreb: pola[2],
    obrys: czytajWkt(pola[4]),
  };
}

el('btn-gdzie').addEventListener('click', () => {
  if (!navigator.geolocation) {
    komunikat('Ta przeglądarka nie udostępnia położenia.');
    return;
  }
  komunikat('Szukam położenia…', 0);
  navigator.geolocation.getCurrentPosition(async (poz) => {
    const [e, n] = Geo.toEastingNorthing(poz.coords.latitude, poz.coords.longitude);
    mapa.pozycja = { e, n, dokladnosc: poz.coords.accuracy || 0 };
    mapa.ustawSrodek(e, n, Math.min(mapa.mNaPx, 1.0));

    komunikat('Sprawdzam działkę w ewidencji…', 0);
    try {
      const d = await pobierzDzialke(e, n);
      if (!d) {
        komunikat('Tu nie ma działki w ewidencji — albo jesteś poza Polską.');
        el('dzialka-opis').textContent = '';
        return;
      }
      mapa.dzialka = d.obrys;
      if (d.obrys) {
        mapa.pokazObszar(d.obrys);
        const powierzchnia = Geo.areaM2(plaskaTablica(d.obrys));
        el('dzialka-opis').textContent =
          `Działka ${d.numer} · obręb ${d.obreb} · gm. ${d.gmina} — ${opiszPowierzchnie(powierzchnia)} wg ewidencji`;
      }
      el('btn-wyczysc').disabled = false;
      komunikat('Niebieski obrys to granice z ewidencji. Żółty rysujesz sam.', 6);
    } catch (blad) {
      komunikat('Nie udało się pobrać działki — brak połączenia albo usługa GUGiK nie odpowiada.');
    }
    mapa.rysuj();
  }, (blad) => {
    komunikat(blad.code === blad.PERMISSION_DENIED
      ? 'Odmówiono dostępu do położenia. Włącz je dla tej strony w ustawieniach przeglądarki.'
      : 'Nie udało się ustalić położenia. Pod dachem GPS często nie łapie.');
  }, { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 });
});

// ————— przyciski —————

el('btn-cofnij').addEventListener('click', () => {
  mapa.obrys.pop();
  przelicz();
  mapa.rysuj();
});

el('btn-wyczysc').addEventListener('click', () => {
  mapa.obrys = [];
  mapa.dzialka = null;
  el('dzialka-opis').textContent = '';
  przelicz();
  mapa.rysuj();
});

el('btn-udostepnij').addEventListener('click', async () => {
  const plaska = plaskaTablica(mapa.obrys);
  const m2 = Geo.areaM2(plaska);
  const srodek = mapa.obrys.reduce((a, p) => ({ e: a.e + p.e / mapa.obrys.length, n: a.n + p.n / mapa.obrys.length }), { e: 0, n: 0 });
  const [lat, lon] = Geo.toLatLon(srodek.e, srodek.n);
  const opis = el('dzialka-opis').textContent;
  const tekst = `Pomiar: ${opiszPowierzchnie(m2)} (${Math.round(m2)} m²)\n` +
    `Obwód: ${opiszDlugosc(Geo.perimeterM(plaska))}\n` +
    (opis ? `${opis}\n` : '') +
    `Środek: ${lat.toFixed(6)}, ${lon.toFixed(6)}\n` +
    `https://www.google.com/maps?q=${lat.toFixed(6)},${lon.toFixed(6)}`;

  if (navigator.share) {
    try { await navigator.share({ title: 'Działkomierz — pomiar', text: tekst }); return; } catch { /* anulowane */ }
  }
  // Zapasowo schowek: na komputerze i w starszym Safari nie ma czym się podzielić inaczej.
  try {
    await navigator.clipboard.writeText(tekst);
    komunikat('Wynik skopiowany do schowka.');
  } catch {
    komunikat(tekst, 15);
  }
});

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

// ————— PWA —————

if ('serviceWorker' in navigator) {
  // Rejestracja po załadowaniu strony, nie w trakcie: instalacja workera konkuruje wtedy
  // o łącze z pierwszymi kaflami mapy, a te są tym, na co człowiek czeka.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline i tak zadziała bez tego */ });
  });
}

przelicz();
