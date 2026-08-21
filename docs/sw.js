// Service worker: sprawia, że po pierwszym otwarciu strona rusza bez sieci.
//
// Kafli mapy **celowo nie zapisujemy tutaj na stałe** — zdjęcie lotnicze całego powiatu to setki
// megabajtów, a przeglądarka i tak wyrzuciłaby to bez ostrzeżenia. Kafle mają własny, krótki cache
// (patrz niżej), który ratuje ponowne obejrzenie tego samego pola, a nie udaje mapy offline.
const WERSJA = 'dzialkomierz-v1';
const SZKIELET = [
  '.', 'index.html', 'mapa.js', 'dzialkomierz.js',
  'AgroErpMobile-geo-shared.js', 'kotlin-kotlin-stdlib.js',
  'kotlin_org_jetbrains_kotlin_kotlin_dom_api_compat.js',
  'manifest.webmanifest',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(WERSJA).then(c => c.addAll(SZKIELET)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== WERSJA).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const adres = new URL(ev.request.url);

  // Zapytań do ewidencji nie zapisujemy nigdy. Granice działek się zmieniają, a pokazanie
  // wczorajszej odpowiedzi jako dzisiejszej jest gorsze niż powiedzenie „brak połączenia".
  if (adres.hostname.endsWith('uldk.gugik.gov.pl')) return;

  // Kafle: najpierw z sieci, a gdy jej nie ma — to, co zostało z poprzedniego razu.
  if (adres.hostname.endsWith('geoportal.gov.pl')) {
    ev.respondWith(
      fetch(ev.request)
        .then(odp => {
          const kopia = odp.clone();
          caches.open(WERSJA + '-kafle').then(c => c.put(ev.request, kopia));
          return odp;
        })
        .catch(() => caches.match(ev.request))
    );
    return;
  }

  // Sam program: **najpierw z sieci**, a z pamięci dopiero gdy sieci nie ma.
  //
  // Odwrotna kolejność (najpierw pamięć) jest szybsza, ale kosztowała mnie godzinę szukania błędu,
  // którego nie było: poprawki w kodzie nie docierały do telefonu, bo worker uparcie podawał
  // zapisaną wersję sprzed zmian. Na telefonie kolegi wyglądałoby to tak, że poprawiony błąd
  // dalej występuje i nie ma jak tego wytłumaczyć.
  //
  // Różnica w szybkości startu jest tu bez znaczenia — to kilka plików po kilkadziesiąt kilobajtów,
  // a i tak czeka się na kafle mapy.
  ev.respondWith(
    fetch(ev.request)
      .then(odp => {
        const kopia = odp.clone();
        caches.open(WERSJA).then(c => c.put(ev.request, kopia));
        return odp;
      })
      .catch(() => caches.match(ev.request))
  );
});
