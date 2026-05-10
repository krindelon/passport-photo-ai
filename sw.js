// ── Bump this string on every deploy ─────────────────────────────────────────
// This is the ONLY thing you need to change to push an update to installed PWAs.
const CACHE_NAME = 'passport-ai-v2';

// Static shell assets to pre-cache (never includes index.html — see fetch handler)
const ASSETS_TO_CACHE = [
  './manifest.json',
  './icon.svg',
];

// ── Install ───────────────────────────────────────────────────────────────────
// Pre-cache static assets, then immediately take over — don't wait for old tabs to close.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()) // inside waitUntil so caching finishes first
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
// Delete every cache that isn't the current version, then claim all open clients
// so the new SW takes effect immediately without a page reload.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Ignore non-GET and cross-origin requests (CDNs, AI model fetches, etc.)
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // ── Navigation requests (index.html) → Network-first ──────────────────────
  // CRITICAL: always try the network so the PWA picks up new deployments.
  // Falls back to cache only when genuinely offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Update the cache with the fresh page for offline fallback
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() =>
          // Offline — serve whatever we last cached
          caches.match(event.request).then((cached) =>
            cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // ── Everything else (manifest, icon, etc.) → Cache-first ──────────────────
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

