// Cache-first service worker for offline use (prepare list at home, use it
// in-store/tournament with no network). Only registers over HTTPS/localhost —
// see the registration guard in index.html for the Electron file:// skip.
const CACHE_NAME = 'roster-dataslate-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './vendor/chart.umd.min.js',
  './assets/icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // '?v=' requests are freshness probes from the page (see the update check in
  // index.html) — let them hit the network directly, never cache them.
  if (event.request.url.includes('?v=')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((resp) => {
        if (resp.ok && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
