/* Neo Shot Ideas — offline shell. Cache-first for same-origin assets,
   network-first for API calls with graceful offline fallback. */
var CACHE="nsi-v2";
var SHELL=["./","./index.html","./engine.js","./app.js","./manifest.webmanifest",
  "./icon-192.png","./icon-512.png","./icon-180.png","./icon-152.png","./icon-120.png",
  "./icon-512-maskable.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);})
    .then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
function isApi(url){
  return /overpass-api\.de|bigdatacloud\.net/.test(url);
}
self.addEventListener("fetch",function(e){
  var req=e.request;
  if(req.method!=="GET")return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin){
    // API calls: try network, fall back to nothing (app handles empty gracefully)
    if(isApi(url.href)){
      e.respondWith(fetch(req).catch(function(){return new Response(JSON.stringify({elements:[]}),{headers:{"Content-Type":"application/json"}});}));
    }
    return;
  }
  e.respondWith(
    caches.match(req,{ignoreSearch:false}).then(function(hit){
      if(hit)return hit;
      return fetch(req).then(function(res){
        var copy=res.clone();
        caches.open(CACHE).then(function(c){c.put(req,copy);});
        return res;
      }).catch(function(){return caches.match("./index.html");});
    })
  );
});
