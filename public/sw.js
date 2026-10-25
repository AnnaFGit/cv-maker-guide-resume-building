const CACHE_NAME = "cv-maker-guide-cache-v2";
const OFFLINE_STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-1024.png",
  "/og-image.png"
];

// Install Event — pre-cache only static assets, never pre-cache dynamic HTML pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event — purge all older caches immediately (especially v1 with stale HTML)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event — Network-First for HTML/navigation so updates are instant
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude third-party scripts (Google AdSense, CMP, Analytics, etc.)
  if (
    requestUrl.hostname.includes("google") ||
    requestUrl.hostname.includes("doubleclick") ||
    requestUrl.hostname.includes("googlesyndication") ||
    requestUrl.hostname.includes("fundingchoices") ||
    requestUrl.hostname.includes("ads") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Windows Desktop App check: bypass service worker cache completely
  if (requestUrl.searchParams.get("platform") === "windows") {
    return;
  }

  // 1. Navigation / HTML pages: ALWAYS NETWORK FIRST
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Only if offline, fall back to cached page
          return caches.match(event.request).then((cached) => cached || caches.match("/"));
        })
    );
    return;
  }

  // 2. Static Assets (images, fonts, manifest): Cache-First with Network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });
    })
  );
});
