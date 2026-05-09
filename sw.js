const CACHE_NAME = 'passport-ai-v1';
const ASSETS_TO_CACHE =[
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Serve from cache if available, else network
self.addEventListener('fetch', (event) => {
  // We only intercept requests for our own origin.
  // CDN requests (esm.sh, jsdelivr, huggingface) are handled by the browser's native HTTP cache.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});