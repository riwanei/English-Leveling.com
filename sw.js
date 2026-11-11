// =====================================================================
// Service worker : rend le jeu installable et jouable hors ligne.
// - Pages : réseau d'abord (pour avoir la dernière version), cache si hors ligne.
// - Fichiers du site et polices : réponse immédiate depuis le cache, mise à jour
//   en arrière-plan (la nouvelle version s'affiche à l'ouverture suivante).
// - Supabase (comptes, guildes, chat) : jamais mis en cache.
// Change VERSION pour forcer tous les joueurs à re-télécharger le site.
// =====================================================================
const VERSION = "el-v1";
const SHELL = ["./", "index.html", "css/style.css", "js/app.js", "manifest.webmanifest", "img/icon.svg", "img/icon-192.png", "img/icon-512.png"];
const FONTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  const local = url.origin === location.origin;
  if (!local && !FONTS.includes(url.hostname)) return;

  if (req.mode === "navigate") {
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }

  e.respondWith(caches.open(VERSION).then(async c => {
    const cached = await c.match(req);
    const fresh = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => cached);
    if (cached) { e.waitUntil(fresh); return cached; }
    return fresh;
  }));
});
