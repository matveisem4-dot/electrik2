// Этот код позволяет приложению работать в фоне
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Просто проксируем запросы, чтобы PWA считалось активным
  e.respondWith(fetch(e.request));
});
