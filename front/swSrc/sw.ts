// const isDebug = false;

(self => {
  self.addEventListener('install', function(_e) {
    console.log('[ServiceWorker] Install');
  });
  self.addEventListener('activate', function(_e) {
    console.log('[ServiceWorker] Activate');
  });

  self.addEventListener('fetch', _e => {});
})((self as unknown) as ServiceWorkerGlobalScope);
