// /public/service-worker.js
const PRECACHE = "servix-precache-v5";   // bump this
const RUNTIME  = "servix-runtime-v1";

// Add every route path you care about here:
const ROUTES = [
  "/",                // landing
  "/admin-login",     // admin login
  "/admin",           // dashboard shell
  "/admin/vehicles",
  "/admin/maintenance",
  "/admin/drivers",
  "/driver",          // driver home
  "/driver/inspection",
  "/driver/report"
];

const PRECACHE_URLS = [
  "/index.html",
  "/pwa/manifest.webmanifest",
  "/pwa/icons/icon-192.png",
  "/pwa/icons/icon-512.png",
  "/pwa/icons/icon-maskable.png",
  ...ROUTES,          // ⬅️ pre-cache route URLs
];

//install step 
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await cache.addAll(PRECACHE_URLS);

    // Also cache built Vite assets referenced by index.html (for styled offline)
    try {
      const res = await fetch("/index.html", { cache: "no-cache" });
      const html = await res.text();
      const assetUrls = Array.from(
        html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)
      ).map(m => m[1]);
      const unique = [...new Set(assetUrls)];
      await Promise.all(unique.map(async (u) => {
        try {
          const r = await fetch(u, { cache: "no-cache" });
          if (r.ok) await cache.put(u, r.clone());
        } catch {}
      }));
    } catch {}
  })());
  self.skipWaiting();
});

//clear the old cache 
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => ![PRECACHE, RUNTIME].includes(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// it catch all the requests(get/put/delete) in case kanet post ma by3mla store bl cache
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET") return;

  // 1) SPA navigations: network-first, fallback to cached app shell
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(PRECACHE);
        return (await cache.match("/index.html")) || new Response("Offline", { status: 503 });
      }
    })());
    return;
  }

  // 2) Same-origin assets: cache-first (fast + offline safe)
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(PRECACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      } catch {
        return new Response("Offline asset", { status: 503 });
      }
    })());
    return;
  }

  // 3) Cross-origin: network-first, cache fallback
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const cache = await caches.open(RUNTIME);
      cache.put(req, res.clone());
      return res;
    } catch {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(req);
      return cached || new Response("Offline", { status: 503 });
    }
  })());
});
