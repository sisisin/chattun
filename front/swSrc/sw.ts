/* eslint-disable no-restricted-globals */

// const isDebug = false;

(self => {
  self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
  });
  self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  self.addEventListener('fetch', e => {});
})((self as unknown) as ServiceWorkerGlobalScope);
