"use strict";
/* Neo Shot Ideas — app wiring. engine.js must load first (window.NeoEngine). */
(function(){
var E=(typeof window!=="undefined"&&window.NeoEngine)||(typeof global!=="undefined"&&global.NeoEngine)||null;
if(!E)throw new Error("engine.js must load before app.js");

function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function haversine(a,b,c,d){
  var R=6371,t=Math.PI/180;
  var h=Math.sin((c-a)*t/2)*Math.sin((c-a)*t/2)+Math.cos(a*t)*Math.cos(c*t)*Math.sin((d-b)*t/2)*Math.sin((d-b)*t/2);
  return 2*R*Math.asin(Math.sqrt(h));
}
var KIND_WORDS={church:"church",castle:"castle",ruins:"ruins",monument:"monument",museum:"museum",
 attraction:"attraction",viewpoint:"viewpoint",lighthouse:"lighthouse",pier:"pier",beach:"beach",
 coast:"beach",park:"park",nature:"nature reserve",river:"river",village:"village green",garden:"garden",sky:"sky"};

var WHO_KEY="nsi_who";
/* Restricted airspace (FlySafe's restricted.json): fetched network-first at
   boot and on relocate, cached in localStorage for up to 14 days. A failed
   load with no fresh cache means "unavailable" — never "clear". */
var AIRSPACE_URL="https://ian-cleary.github.io/can-i-fly-here/restricted.json";
var AIRSPACE_KEY="nsi_airspace";
var AIRSPACE_MAX_AGE=14*24*3600*1000;
var WHOS=["alan","ronnie","both"];
var WHO_META={
  alan:{sub:"Neo 2 projects for Alan",btn:"Give me another idea"},
  ronnie:{sub:"Ronnie's flying-skills ladder · original Neo · Alan spotting",btn:"Give me another mission"},
  both:{sub:"Alan's Neo 2 project + Ronnie's mission on the original Neo",btn:"Give me another idea"}
};
function loadWho(){
  try{var w=localStorage.getItem(WHO_KEY);if(WHOS.indexOf(w)>=0)return w;}catch(e){}
  return "alan";
}
function saveWho(w){try{localStorage.setItem(WHO_KEY,w);}catch(e){}}

/* Classify one Overpass element into {airfield:bool, subjects:[], kindWord, name, distKm} */
function tagElement(e,lat,lon){
  var t=e.tags||{};
  var la=e.type==="node"?e.lat:(e.center&&e.center.lat);
  var lo=e.type==="node"?e.lon:(e.center&&e.center.lon);
  var d=(la==null||lo==null)?null:haversine(lat,lon,la,lo);
  if(t.aeroway)return {airfield:true,name:t.name||null,distKm:d,subjects:[],kindWord:"airfield",lat:la,lon:lo};
  var s=[];
  if(t.tourism==="attraction")s.push("attraction");
  else if(t.tourism==="viewpoint")s.push("viewpoint");
  else if(t.tourism==="museum")s.push("museum");
  if(t.historic==="castle")s.push("castle");
  else if(t.historic==="ruins"||t.historic==="archaeological_site")s.push("ruins");
  else if(t.historic==="monument"||t.historic==="memorial")s.push("monument");
  if(t.man_made==="lighthouse")s.push("lighthouse");
  else if(t.man_made==="pier")s.push("pier");
  if(t.natural==="beach"){s.push("beach","coast");}
  if(t.leisure==="park")s.push("park");
  else if(t.leisure==="nature_reserve")s.push("nature");
  if(t.amenity==="place_of_worship"||t.building==="church"||t.building==="chapel")s.push("church");
  if(t.waterway==="river")s.push("river");
  var kw=s.length?(KIND_WORDS[s[0]]||"spot"):"spot";
  return {airfield:false,name:t.name||null,distKm:d,subjects:s,kindWord:kw,lat:la,lon:lo};
}
function buildOverpassQuery(lat,lon){
  var a="around:12000,"+lat+","+lon, b="around:5000,"+lat+","+lon;
  return "[out:json][timeout:25];("+
    'node["tourism"~"^(attraction|viewpoint|museum)$"]('+a+');'+
    'node["historic"~"^(castle|ruins|archaeological_site|monument|memorial)$"]('+a+');'+
    'node["man_made"~"^(lighthouse|pier)$"]('+a+');'+
    'node["natural"="beach"]('+a+');'+
    'node["leisure"~"^(park|nature_reserve)$"]('+a+');'+
    'node["amenity"="place_of_worship"]('+a+');'+
    'way["waterway"="river"]('+a+');'+
    'node["aeroway"~"^(aerodrome|heliport|helipad)$"]('+b+');'+
    'way["aeroway"~"^(aerodrome|heliport|helipad)$"]('+b+');'+
    ");out center tags;";
}
function fmtDist(km){return E.fmtDist(km);}
var AIRSPACE_MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
/* "2026-10-17" -> "17 Oct". Anything else passes through unchanged. */
function fmtDatasetDate(s){
  if(!s)return null;
  var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(m){var mo=parseInt(m[2],10);if(mo>=1&&mo<=12)return parseInt(m[3],10)+" "+AIRSPACE_MONTHS[mo-1];}
  return String(s);
}
/* Pure: verdict for one card. vloc is {lat,lon} or null; air is the loaded
   dataset record {areas,updated} or null. Never returns "clear" without data. */
function airspaceVerdict(vloc,air){
  if(!vloc||vloc.lat==null||vloc.lon==null)return {state:"noloc",areaName:null,updated:null};
  if(!air||!air.areas)return {state:"unavailable",areaName:null,updated:null};
  var v=E.checkAirspace(vloc.lat,vloc.lon,air.areas);
  return {state:v.state,
    areaName:v.area?(v.area.name||v.area.label||"this area"):null,
    updated:air.updated||null};
}

/* Pure: turn a deck entry + context into everything the main card needs (Alan's Neo 2). */
function cardData(entry,ctx,who){
  var idea=entry.idea, poi=entry.poi||null;
  var steps=idea.steps.map(function(s){return E.fillPlace(s,poi);});
  var includeRonnie=(who||"both")==="both";
  var ronnie=includeRonnie?E.pickRonnie(idea,ctx||{},ctx?ctx.seed:""):null;
  var air=null;
  if(ctx&&ctx.airfield&&ctx.airfield.distKm!=null&&ctx.airfield.distKm<5){
    air={name:ctx.airfield.name||"an unnamed airfield",dist:fmtDist(ctx.airfield.distKm)};
  }
  /* Airspace verdict: the POI's spot when the idea has one, else where you are. */
  var vloc=null;
  if(poi&&poi.lat!=null&&poi.lon!=null)vloc={lat:poi.lat,lon:poi.lon};
  else if(ctx&&ctx.lat!=null&&ctx.lon!=null)vloc={lat:ctx.lat,lon:ctx.lon};
  var airspace=airspaceVerdict(vloc,ctx?ctx.airspace:null);
  airspace.updatedLabel=fmtDatasetDate(airspace.updated);
  return {
    kind:idea.kind, kindLabel:idea.kind==="shot"?"Flying shot":(idea.kind==="setting"?"Camera setting":"Composition"),
    title:E.fillPlace(idea.title,poi),
    place:E.placeLabel(poi),
    steps:steps,
    note:(idea.note2||idea.note),
    droneChip:E.DRONES.neo2.chip,
    ronnie:ronnie?{badge:ronnie.badge,title:ronnie.title,text:ronnie.text,id:ronnie.id,strand:ronnie.strand,level:ronnie.level,
      droneChip:E.DRONES.neo.chip}:null,
    air:air, airspace:airspace, ideaId:idea.id
  };
}
/* Pure: turn a ladder task + context into the Ronnie hero card payload (original Neo). */
function ladderData(task,ctx){
  var p=(ctx&&ctx.pois&&ctx.pois.length)?ctx.pois[0]:null;
  /* Ladder verdict: always where you are, never the POI. */
  var vloc=(ctx&&ctx.lat!=null&&ctx.lon!=null)?{lat:ctx.lat,lon:ctx.lon}:null;
  var airspace=airspaceVerdict(vloc,ctx?ctx.airspace:null);
  airspace.updatedLabel=fmtDatasetDate(airspace.updated);
  return {
    id:task.id,badge:task.badge,strand:task.strand,level:task.level,
    title:task.title,text:task.text,
    place:p?("Near "+E.placeLabel(p)):"",
    droneChip:E.DRONES.neo.chip,
    airspace:airspace,
    levelLine:"Level "+task.level+" · "+(task.strand==="fly"?"Ronnie flies, Alan spots":task.strand==="eye"?"Alan flies, Ronnie observes":"Drone law, bite-size")
  };
}
/* Pure: choose next index, skipping ids shown today; wraps around. */
function pickNext(deck,shownIds,startIdx,idOf){
  if(!deck.length)return -1;
  var f=idOf||function(e){return e.idea.id;};
  for(var k=0;k<deck.length;k++){
    var i=(startIdx+k)%deck.length;
    if(shownIds.indexOf(f(deck[i]))<0)return i;
  }
  return startIdx%deck.length; // all shown: allow repeats
}

/* ---------- state + storage ---------- */
var S={lat:null,lon:null,locality:null,deck:[],idx:-1,ladder:[],lidx:-1,pois:[],
       airfield:null,airspace:null,noGeo:false,seed:"",storeKey:"",store:{ideaIds:[],ronnieIds:[],strands:[]},who:"alan"};
function storeKey(){return "nsi_"+E.dayKey();}
function loadStore(){
  S.storeKey=storeKey();
  try{
    var raw=localStorage.getItem(S.storeKey);
    if(raw){var p=JSON.parse(raw);S.store={ideaIds:p.ideaIds||[],ronnieIds:p.ronnieIds||[],strands:p.strands||[]};}
  }catch(e){S.store={ideaIds:[],ronnieIds:[],strands:[]};}
}
function saveStore(){try{localStorage.setItem(S.storeKey,JSON.stringify(S.store));}catch(e){}}
function ctx(){
  return {seed:S.seed,shownRonnieIds:S.store.ronnieIds,strandHistory:S.store.strands,airfieldNear:!!(S.airfield&&S.airfield.distKm<5),airfield:S.airfield,pois:S.pois,
    lat:S.lat,lon:S.lon,airspace:S.airspace};
}
function recordRonnie(r){
  if(S.store.ronnieIds.indexOf(r.id)<0){S.store.ronnieIds.push(r.id);S.store.strands.push(r.strand);saveStore();}
}

/* ---------- rendering (DOM) ---------- */
function renderWho(){
  var meta=WHO_META[S.who]||WHO_META.alan;
  var btns=document.querySelectorAll(".who-btn");
  for(var i=0;i<btns.length;i++){
    btns[i].setAttribute("aria-pressed",btns[i].getAttribute("data-who")===S.who?"true":"false");
  }
  $("who-sub").textContent=meta.sub;
  var b=$("btn-another");if(b)b.textContent=meta.btn;
}
function setWho(w,skipAdvance){
  if(WHOS.indexOf(w)<0)return;
  S.who=w;saveWho(w);renderWho();
  if(!S.deck.length&&!S.ladder.length)return; // still loading
  if(w==="ronnie"){
    if(S.lidx<0||skipAdvance===false)showNextLadder();else renderLadder(S.ladder[S.lidx]);
  }else{
    if(S.idx<0)showNext();else render(S.deck[S.idx]);
  }
}
function locLine(){
  var locBits=[];
  if(S.locality)locBits.push(S.locality);
  if(S.lat!=null)locBits.push(S.lat.toFixed(3)+", "+S.lon.toFixed(3));
  return locBits.join(" · ")||"Ideas for wherever you are";
}
function renderAir(c){
  var ab=$("air-banner");
  if(c.air){ab.classList.remove("hidden");ab.innerHTML="<b>Near an airfield</b> — "+esc(c.air.name)+" is "+esc(c.air.dist)+" away. Check the <b>Drone Assist</b> app before flying.";}
  else ab.classList.add("hidden");
}
/* Airspace banner: one of five states on every card render. The element
   starts hidden in markup and is only ever shown with a fresh verdict. */
function renderAirspace(c){
  var ab=$("airspace-banner");
  if(!c||!c.airspace){ab.classList.add("hidden");return;}
  var a=c.airspace;
  if(a.state==="restricted"){
    ab.classList.remove("hidden");
    ab.innerHTML="<b>Don't fly here</b> — "+esc(a.areaName)+" is restricted airspace. Tap 'Give me another idea' for a spot that's clear.";
  }else if(a.state==="near"){
    ab.classList.remove("hidden");
    ab.innerHTML="<b>Heads up</b> — restricted airspace very close by ("+esc(a.areaName)+"). Keep well clear.";
  }else if(a.state==="clear"){
    ab.classList.remove("hidden");
    ab.innerHTML="<small>Airspace clear"+(a.updatedLabel?" · data "+esc(a.updatedLabel):"")+"</small>";
  }else if(a.state==="unavailable"){
    ab.classList.remove("hidden");
    ab.innerHTML="<b>Airspace check unavailable</b> — check Drone Assist before you fly.";
  }else if(a.state==="noloc"){
    ab.classList.remove("hidden");
    ab.innerHTML="<b>No location set</b> — check Drone Assist before you fly.";
  }else ab.classList.add("hidden");
}
function render(entry){
  var c=cardData(entry,ctx(),S.who);
  $("ladder-hero").classList.add("hidden");
  $("idea-card").classList.remove("hidden");
  $("idea-kind").textContent=c.kindLabel;
  $("idea-title").textContent=c.title;
  $("idea-place").textContent=c.place;
  $("idea-drone").textContent=c.droneChip;
  $("idea-steps").innerHTML=c.steps.map(function(s){return "<li>"+esc(s)+"</li>";}).join("");
  $("idea-note").innerHTML="<b>Why it works:</b> "+esc(c.note);
  var eyebrow={shot:'TODAY\u2019S <span class="amber">SHOT</span>',setting:'TODAY\u2019S <span class="amber">SETTING</span>',composition:'TODAY\u2019S <span class="amber">COMPOSITION</span>'}[c.kind]||'TODAY\u2019S <span class="amber">IDEA</span>';
  $("idea-eyebrow").innerHTML=eyebrow;
  $("idea-kicker").textContent=S.who==="both"?"Today's flying project · Alan's Neo 2":"Today's flying project";
  $("idea-loc").textContent=locLine();
  renderAir(c);
  renderAirspace(c);
  var rc=$("ronnie-card");
  if(c.ronnie){
    rc.classList.remove("hidden");
    $("ronnie-badge").textContent=c.ronnie.badge;
    $("ronnie-title").textContent=c.ronnie.title;
    $("ronnie-text").textContent=c.ronnie.text;
    $("ronnie-drone").textContent=c.ronnie.droneChip;
    recordRonnie(c.ronnie);
  }else rc.classList.add("hidden");
  var remaining=S.deck.length-S.store.ideaIds.filter(function(id){return S.deck.some(function(e){return e.idea.id===id;});}).length;
  $("count-line").textContent=remaining>0?(remaining+" more fresh ideas today"):"That's every idea for today — come back tomorrow for a fresh batch";
  if(S.store.ideaIds.indexOf(c.ideaId)<0){S.store.ideaIds.push(c.ideaId);saveStore();}
  show("screen-idea");
}
function renderLadder(task){
  var c=ladderData(task,ctx());
  $("idea-card").classList.add("hidden");
  $("ronnie-card").classList.add("hidden");
  $("ladder-hero").classList.remove("hidden");
  $("ladder-badge").textContent=c.badge;
  $("ladder-title").textContent=c.title;
  $("ladder-text").textContent=c.text;
  $("ladder-drone").textContent=c.droneChip;
  $("ladder-place").textContent=c.place;
  $("ladder-level").textContent=c.levelLine;
  $("idea-eyebrow").innerHTML='RONNIE\u2019S <span class="amber">MISSION</span>';
  $("idea-kicker").textContent="Ronnie's flying-skills ladder";
  $("idea-loc").textContent=locLine();
  renderAir({air:(ctx().airfield&&ctx().airfield.distKm<5)?{name:ctx().airfield.name||"an unnamed airfield",dist:fmtDist(ctx().airfield.distKm)}:null});
  renderAirspace(c);
  recordRonnie({id:c.id,strand:c.strand});
  var remaining=S.ladder.length-S.store.ronnieIds.filter(function(id){return S.ladder.some(function(t){return t.id===id;});}).length;
  $("count-line").textContent=remaining>0?(remaining+" more missions in the ladder"):"That's the whole ladder — well flown, Ronnie";
  show("screen-idea");
}
function show(id){
  ["screen-loading","screen-idea"].forEach(function(s){$(s).classList.toggle("hidden",s!==id);});
  if(typeof window!=="undefined"&&window.scrollTo)window.scrollTo(0,0);
}
function showNext(){
  if(!S.deck.length)return;
  var n=pickNext(S.deck,S.store.ideaIds,S.idx+1);
  S.idx=n;render(S.deck[n]);
}
function showNextLadder(){
  if(!S.ladder.length)return;
  var n=pickNext(S.ladder,S.store.ronnieIds,S.lidx+1,function(t){return t.id;});
  S.lidx=n;renderLadder(S.ladder[n]);
}
function showNextAny(){
  if(S.who==="ronnie")showNextLadder();else showNext();
}

/* ---------- location + data ---------- */
function setLoading(big,sub){
  $("loading-big").textContent=big;$("loading-sub").textContent=sub;show("screen-loading");
}
function buildDecks(pois,seed){
  S.pois=pois;
  S.deck=E.buildDeck(pois,seed);
  if(!S.deck.length)S.deck=E.buildDeck([],seed);
  var full=E.buildLadderDeck(seed,S.store.strands);
  S.ladder=full.filter(function(t){return S.store.ronnieIds.indexOf(t.id)<0;});
  if(!S.ladder.length)S.ladder=full; // all shown: allow repeats
}
async function reverseGeocode(){
  try{
    var u="https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+S.lat+"&longitude="+S.lon+"&localityLanguage=en";
    var r=await fetch(u);if(!r.ok)throw new Error("HTTP "+r.status);
    var j=await r.json();
    S.locality=j.city||j.locality||j.principalSubdivision||null;
  }catch(e){S.locality=null;}
}
async function fetchPois(){
  var q=buildOverpassQuery(S.lat,S.lon);
  var ctl=new AbortController();var to=setTimeout(function(){ctl.abort();},30000);
  try{
    var r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:"data="+encodeURIComponent(q),signal:ctl.signal});
    clearTimeout(to);if(!r.ok)throw new Error("HTTP "+r.status);
    var j=await r.json();
    var pois=[],air=null;
    (j.elements||[]).forEach(function(e){
      var c=tagElement(e,S.lat,S.lon);
      if(c.distKm==null)return;
      if(c.airfield){if(!air||c.distKm<air.distKm)air=c;}
      else if(c.subjects.length)pois.push(c);
    });
    pois.sort(function(a,b){return a.distKm-b.distKm;});
    return {pois:pois.slice(0,40),airfield:air};
  }catch(e){clearTimeout(to);return {pois:[],airfield:null};}
}
async function bootWithLocation(lat,lon){
  S.lat=lat;S.lon=lon;S.noGeo=false;
  S.seed=E.seedFor(lat,lon);
  setLoading("Looking around for somewhere worth filming…","Checking what's near you.");
  await reverseGeocode();
  setLoading("Finding nearby places…","Churches, castles, coastline — what's in range?");
  var res=await fetchPois();
  S.airfield=res.airfield;
  buildDecks(res.pois,S.seed);
  showNextAny();
}
function bootWithoutLocation(){
  S.lat=null;S.lon=null;S.noGeo=true;S.airfield=null;
  S.seed=E.seedFor(null,null);
  buildDecks([],S.seed);
  showNextAny();
  $("idea-loc").textContent="Location off — these are general ideas. Tap below to use your location.";
}
/* ---------- restricted airspace: load + cache ---------- */
function readAirspaceCache(){
  try{
    var raw=localStorage.getItem(AIRSPACE_KEY);
    if(!raw)return null;
    var p=JSON.parse(raw);
    var v=E.validateAirspace(p);
    if(!v)return null;
    var age=Date.now()-new Date(p.fetchedAt||0).getTime();
    if(!(age>=0&&age<=AIRSPACE_MAX_AGE))return null;
    return {areas:v.areas,updated:v.updated,fetchedAt:p.fetchedAt};
  }catch(e){return null;}
}
function saveAirspaceCache(rec){try{localStorage.setItem(AIRSPACE_KEY,JSON.stringify(rec));}catch(e){}}
/* Network-first. Invalid live data counts as a failed load and falls back
   to a fresh cache; with neither, S.airspace stays null (unavailable). */
async function loadAirspace(){
  var rec=null;
  try{
    var r=await fetch(AIRSPACE_URL);
    if(!r.ok)throw new Error("HTTP "+r.status);
    var j=await r.json();
    var v=E.validateAirspace(j);
    if(!v)throw new Error("invalid airspace data");
    rec={areas:v.areas,updated:v.updated,fetchedAt:new Date().toISOString()};
    saveAirspaceCache(rec);
  }catch(e){
    rec=readAirspaceCache();
  }
  S.airspace=rec;
  refreshAirspaceBanner();
}
/* A late airspace load corrects the current card's banner without
   advancing to the next idea, scrolling, or touching the store: only the
   banner element is re-rendered. No-op while still on the loading screen. */
function refreshAirspaceBanner(){
  if(S.who==="ronnie"){
    if(S.lidx>=0&&S.ladder.length)renderAirspace(ladderData(S.ladder[S.lidx],ctx()));
  }else{
    if(S.idx>=0&&S.deck.length)renderAirspace(cardData(S.deck[S.idx],ctx(),S.who));
  }
}
function locate(){
  loadAirspace();
  setLoading("Looking around for somewhere worth filming…","Asking your iPhone where you are.");
  if(!navigator.geolocation){bootWithoutLocation();return;}
  var done=false;
  var timer=setTimeout(function(){if(!done){done=true;bootWithoutLocation();}},18000);
  navigator.geolocation.getCurrentPosition(function(p){
    if(done)return;done=true;clearTimeout(timer);
    bootWithLocation(p.coords.latitude,p.coords.longitude);
  },function(){
    if(done)return;done=true;clearTimeout(timer);bootWithoutLocation();
  },{enableHighAccuracy:true,timeout:15000,maximumAge:600000});
}

/* ---------- wiring ---------- */
function wire(){
  loadStore();
  S.who=loadWho();
  var btns=document.querySelectorAll(".who-btn");
  for(var i=0;i<btns.length;i++){
    (function(b){b.addEventListener("click",function(){setWho(b.getAttribute("data-who"),false);});})(btns[i]);
  }
  renderWho();
  var b=$("btn-another");if(b)b.addEventListener("click",showNextAny);
  var r=$("btn-relocate");if(r)r.addEventListener("click",function(){loadStore();locate();});
  locate();
}
if(typeof document!=="undefined"&&document.getElementById){wire();}

/* node test hooks */
if(typeof module!=="undefined"&&module.exports){
  module.exports={haversine:haversine,tagElement:tagElement,buildOverpassQuery:buildOverpassQuery,
    cardData:cardData,ladderData:ladderData,pickNext:pickNext,KIND_WORDS:KIND_WORDS,
    WHO_META:WHO_META,WHOS:WHOS,airspaceVerdict:airspaceVerdict,fmtDatasetDate:fmtDatasetDate};
}
})();
