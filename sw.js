// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      // These are the same recipe URLs declared in main.js (RECIPE_URLS).
      // The service worker cannot import that array, so we list them here so
      // the recipes are cached up front when the worker installs.
      return cache.addAll([
        'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
      ]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // respondWith() lets us provide our own response for the request. We open
  // the named cache so we can look up and store responses in it.
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      // B8. TODO - If the request is in the cache, return with the cached version.
      //            Otherwise fetch the resource, add it to the cache, and return
      //            network response.
      // Look for a matching cached response for this request first.
      return cache.match(event.request).then(function (cachedResponse) {
        // If we found it in the cache, serve the cached version (offline-ready).
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise go to the network for the resource.
        return fetch(event.request).then(function (networkResponse) {
          // Store a copy of the network response in the cache so future
          // requests for the same resource can be served from the cache.
          cache.put(event.request, networkResponse.clone());
          // Return the original network response to the page.
          return networkResponse;
        });
      });
    })
  );
});