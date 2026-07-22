const CACHE = 'jan-adhikar-v3';
const ASSETS = [
  './', './index.html', './privacy.html', './styles.css', './app.js', './manifest.webmanifest',
  './assets/icon.svg', './assets/social-card.svg',
  './downloads/evidence-preservation-checklist.txt',
  './downloads/incident-statement-template.txt',
  './downloads/chain-of-custody.csv',
  './downloads/detention-tracker.csv',
  './downloads/complaint-follow-up-tracker.csv',
  './downloads/mailing-addresses.txt'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isCurrentLegalData = event.request.mode === 'navigate' || /\/(index|privacy)\.html$/.test(url.pathname) || /\/(app\.js|styles\.css)$/.test(url.pathname);
  if (isCurrentLegalData) {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  })));
});
