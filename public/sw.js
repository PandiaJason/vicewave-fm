const CACHE_NAME = 'vicewave-fm-shell-v1';

const APP_SHELL_ASSETS = [
  '/',
  '/tracks',
  '/favorites',
  '/settings',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg',
  '/icon-maskable.svg',
  '/apple-touch-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strictly NEVER cache YouTube media streams, embeds, or external video resources
  if (
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('googlevideo.com') ||
    url.hostname.includes('ytimg.com')
  ) {
    return;
  }

  // Same-origin App Shell & static assets: Network-first with Cache fallback for navigation,
  // Stale-while-revalidate for static assets
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(async () => {
            const cached = await caches.match(request);
            return cached || caches.match('/');
          })
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
