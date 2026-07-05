const CACHE_NAME = "cv-maker-guide-cache-v1";
const OFFLINE_ASSETS = [
  "/",
  "/builder/",
  "/ats-checker/",
  "/course/",
  "/checklist/",
  "/quiz/",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-1024.png",
  "/og-image.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
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

// Fetch Event (Stale-while-revalidate / Network-fallback)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude third-party scripts (Ads, CDNs, etc.)
  if (
    requestUrl.hostname.includes("google") ||
    requestUrl.hostname.includes("doubleclick") ||
    requestUrl.hostname.includes("ads") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch a fresh copy in the background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silently ignore offline background fetch failures
          });
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // If offline and request is an HTML page navigation, return cached home
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
