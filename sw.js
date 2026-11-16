// Service Worker — cachea el shell + imágenes de productos para carga instantánea en 2ª visita.
// Los datos vienen SIEMPRE de Firestore (persistencia IndexedDB propia habilitada en el HTML).

const CACHE_NAME = 'cpn-shell-v3';
const IMG_CACHE = 'cpn-images-v1';
const SHELL = ['/', '/entrar', '/config.js', '/logo.jpg', '/manifest.json', '/agencias-sedes.json'];

// Hosts de imágenes que vale la pena cachear (larga vida, contenido inmutable por URL)
const IMG_HOSTS = [
  'i.imgur.com',
  'm.media-amazon.com',
  'http2.mlstatic.com',
  'rimage.ripley.com.pe',
  'i5.walmartimages.com',
  's.alicdn.com',
  'sc04.alicdn.com',
  'img.kwcdn.com',
  'ae-pic-a1.aliexpress-media.com',
  'ctppxztfz8.execute-api.us-west-2.amazonaws.com',
  'cdnx.jumpseller.com',
  'static.wixstatic.com',
  'image.made-in-china.com',
  'dojiw2m9tvv09.cloudfront.net',
];
const MAX_IMG_CACHE_ENTRIES = 500;   // limite razonable para no llenar el disco

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME && n !== IMG_CACHE).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Limita el tamaño del cache de imágenes: si supera N entradas, borra las más viejas
async function trimImgCache() {
  const c = await caches.open(IMG_CACHE);
  const keys = await c.keys();
  if (keys.length <= MAX_IMG_CACHE_ENTRIES) return;
  const excess = keys.length - MAX_IMG_CACHE_ENTRIES;
  for (let i = 0; i < excess; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // ── Imágenes de producto ── cache-first, red en 2º plano ──
  if (e.request.destination === 'image' && IMG_HOSTS.some(h => url.hostname.endsWith(h))) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) {
          // Stale-while-revalidate: sirve del cache y actualiza en segundo plano
          fetch(e.request).then(r => {
            if (r.ok) caches.open(IMG_CACHE).then(c => { c.put(e.request, r.clone()); trimImgCache(); });
          }).catch(() => {});
          return cached;
        }
        return fetch(e.request).then(r => {
          if (r.ok) caches.open(IMG_CACHE).then(c => { c.put(e.request, r.clone()); trimImgCache(); });
          return r;
        });
      })
    );
    return;
  }

  // ── No cachear Firebase, Firestore, CDN de scripts, ni cross-origin no whitelisted ──
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebasestorage.googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) return;

  // ── HTML shell: network-first (así los updates llegan en cuanto haya red) ──
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).then((r) => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(() => {});
        return r;
      }).catch(() => caches.match(e.request).then((r) => r || caches.match('/entrar')))
    );
    return;
  }

  // ── Assets propios: cache-first ──
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((r) => {
      if (r.ok && e.request.url.startsWith(self.location.origin)) {
        const clone = r.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(() => {});
      }
      return r;
    }).catch(() => cached))
  );
});
