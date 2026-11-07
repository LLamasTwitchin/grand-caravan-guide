/* Offline cache for the guide. Relative paths keep GitHub Pages and a local server in the same scope. */
const CACHE='gc-guide-v23';
const FILES=[
  './',
  './index.html',
  './diagnostic-walkthrough.html',
  './manifest.webmanifest',
  './assets/guide-additions.css',
  './assets/system-diagrams.js',
  './assets/reported-issues.js',
  './assets/mfr-comms.js',
  './assets/training-lab.js',
  './assets/vehicle-webgl.js',
  './assets/three-r145.min.js',
  './assets/OrbitControls-r145.js',
  './assets/icon-192.png',
  './assets/docs/2012-dodge-grand-caravan-tipm-reference.pdf'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(
    caches.match(request).then(hit=>{
      if(hit)return hit;
      return fetch(request).then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
