/* eslint-disable no-restricted-globals */

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});
