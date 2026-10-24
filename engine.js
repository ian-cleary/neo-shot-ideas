"use strict";
/* Neo Shot Ideas — recommendation engine (pure logic, no DOM).
   Safe to require() in node for testing; also exposes window.NeoEngine. */

/* kinds: "shot" | "setting" | "composition"
   subjects: church, village, castle, ruins, monument, museum, attraction,
             lighthouse, pier, beach, coast, harbour, park, nature, river,
             viewpoint, garden, sky, generic, any("any" = always eligible) */
const IDEAS = [
/* ---------------- SHOTS (DJI Neo QuickShots: Dronie, Circle, Rocket, Spotlight, Helix) ---------------- */
{id:"dronie-church",kind:"shot",title:"The Dronie Reveal",subjects:["church","village","attraction"],
 steps:["Stand about 25 metres in front of {place}, Neo hovering at eye level facing you.",
 "In DJI Fly tap QuickShots, then Dronie, and choose a short distance.",
 "Press start, strike a pose, and don't touch the sticks — the Neo backs away and climbs, revealing {place} behind you.",
 "Keep the drone in sight throughout; tap Stop if anyone wanders into frame."],
 note:"Calm days only — Dronie drifts in gusty wind."},
{id:"helix-spire",kind:"shot",title:"Helix Around the Spire",subjects:["church","monument"],
 steps:["Stand well back from {place} — at least 30 metres — with clear sky all around the Neo.",
 "Tap QuickShots, then Helix, and pick a modest radius and height.",
 "Start it and watch the spiral climb; keep your eyes on the drone, not the screen.",
 "Stop it early if the wind picks up — Helix and gusts don't mix."],
 note:"The spiral looks best with the spire dead centre."},
{id:"circle-castle",kind:"shot",title:"The Castle Orbit",subjects:["castle","ruins"],
 steps:["Position the Neo about 40 metres out from {place}, roughly at rooftop height.",
 "Tap QuickShots, then Circle, and set a wide radius.",
 "Let it complete one full slow orbit while you watch the drone itself.",
 "One orbit is plenty — tap Stop, then bring it home."],
 note:"Slow and wide beats fast and tight every time."},
{id:"rocket-pier",kind:"shot",title:"Rocket Over the Pier",subjects:["pier","coast"],
 steps:["Hover the Neo just off the end of {place}, camera pointing down the pier.",
 "Tap QuickShots, then Rocket, and choose a medium height.",
 "Hands off while it climbs straight up — the pier shrinks into a line in the sea.",
 "Watch the altitude and your battery; bring it straight back down after."],
 note:"Check the wind first — straight-up shots wobble in gusts."},
{id:"spotlight-tower",kind:"shot",title:"Spotlight Lock",subjects:["monument","attraction","castle"],
 steps:["Frame {place} on screen and draw a box around it with Spotlight.",
 "Fly the Neo slowly sideways yourself — the camera stays glued to the subject.",
 "Keep your movements gentle; small stick inputs make silky footage.",
 "Stay well clear of the structure itself — Spotlight is not obstacle avoidance."],
 note:"The Neo has no side sensors, so keep the flight path empty.",
 note2:"The Neo 2's obstacle sensing helps here, but never trust it near stonework — keep the flight path empty."},
{id:"dronie-beach",kind:"shot",title:"Beach Dronie",subjects:["beach","coast"],
 steps:["Stand on the sand with the sea behind you, Neo at eye level.",
 "QuickShots, then Dronie, short distance — sand and wind are a tricky pair.",
 "Pose, press start, and let it pull back over the shoreline.",
 "Land on a dry bag or jacket, never straight onto sand."],
 note:"Sand and motors are enemies — wipe the Neo down after."},
{id:"circle-lighthouse",kind:"shot",title:"Lighthouse Loop",subjects:["lighthouse","coast"],
 steps:["Set the Neo orbiting {place} at a respectful distance — 40 metres or more.",
 "QuickShots, then Circle, wide radius, and let it run one full loop.",
 "Time it so the lamp faces you mid-orbit if you can.",
 "Keep the drone between you and the land — easier to see against the fields."],
 note:"Lighthouses sit in windy spots; fly only in light airs."},
{id:"helix-canopy",kind:"shot",title:"Helix Over the Treetops",subjects:["park","nature"],
 steps:["Launch from a clear patch in {place} and climb well above the tallest trees first.",
 "QuickShots, then Helix with a wide radius — the canopy spirals below you.",
 "Never start a Helix anywhere near branches; altitude is your friend.",
 "One spiral, then bring it home."],
 note:"Autumn colour from above is worth the wait."},
{id:"rocket-harbour",kind:"shot",title:"Harbour Rocket",subjects:["harbour","coast","pier"],
 steps:["Hover over the harbour wall at {place}, camera looking straight down.",
 "QuickShots, then Rocket — the boats shrink into a toy-town map.",
 "Keep it brief and come straight back down.",
 "Never hover over masts or rigging."],
 note:"Top-down harbour shots are pure postcard."},
{id:"spotlight-river",kind:"shot",title:"River Spotlight",subjects:["river"],
 steps:["Frame a bridge or bend in {place} and lock Spotlight on it.",
 "Walk the Neo slowly along the riverbank yourself, camera locked on.",
 "Tiny stick movements — let the river do the talking.",
 "Stay over the bank; don't push far out over deep water."],
 note:"Rivers give you a free leading line."},
{id:"circle-green",kind:"shot",title:"Village Green Orbit",subjects:["village","park","attraction"],
 steps:["Launch from the middle of {place} when it's empty — early morning is perfect.",
 "QuickShots, then Circle, medium radius, one slow loop.",
 "If anyone arrives with a dog, land and wait — people beat footage.",
 "Land back where you started."],
 note:"Empty greens at 8am are a drone pilot's secret."},
{id:"dronie-garden",kind:"shot",title:"Garden Dronie Practice",subjects:["garden","generic"],
 steps:["Your own garden, no audience: Neo at eye level, 3 metres in front of you.",
 "QuickShots, then Dronie, shortest distance.",
 "Press start and hold still — watch how it climbs as it backs away.",
 "Land, watch it back, and try once more a touch further out."],
 note:"The safest place to learn every QuickShot."},
{id:"rocket-sunset",kind:"shot",title:"Rocket Into the Sunset",subjects:["sky","generic","viewpoint"],
 steps:["Face the setting sun with the Neo low in front of you.",
 "QuickShots, then Rocket — it climbs straight into the coloured sky.",
 "Watch the drone rather than staring at the sun through the screen.",
 "Bring it down before the light goes — landing in the dark is no fun."],
 note:"Two minutes of golden light beats twenty of grey."},
{id:"circle-pond",kind:"shot",title:"Pond Circle",subjects:["park","nature","garden"],
 steps:["Hover the Neo over the middle of the pond at {place}, about 10 metres up.",
 "QuickShots, then Circle, on a fairly tight radius.",
 "The reflections spin below you — keep the circle slow.",
 "Mind overhanging branches on the far side."],
 note:"Still mornings double everything."},
{id:"helix-ruins",kind:"shot",title:"Rising Over the Ruins",subjects:["ruins","castle"],
 steps:["Stand well clear of {place} — old walls and drones don't mix.",
 "QuickShots, then Helix, wide and tall.",
 "Watch the ruins shrink as the spiral climbs — pure time-travel.",
 "One climb, then land."],
 note:"Ruins photograph best in low sideways light."},
{id:"spotlight-museum",kind:"shot",title:"Museum Spotlight",subjects:["museum","attraction"],
 steps:["From the grounds at {place}, frame the building and lock Spotlight on it.",
 "Sidestep slowly with the Neo — the camera never leaves the facade.",
 "Keep to the grounds and well away from the roofline.",
 "Check the museum's own drone policy first — some say no."],
 note:"Grand architecture loves a slow sideways glide."},
/* ---------------- CAMERA SETTINGS ---------------- */
{id:"res-4k-1080",kind:"setting",title:"4K or 1080p? Pick Your Weapon",subjects:["any"],
 steps:["In DJI Fly, open the camera settings before you launch.",
 "Choose 4K when the light is good and you want the crispest detail.",
 "Choose 1080p when you want smooth slow motion, or when the light is poor.",
 "Pick one per flight — swapping mid-air wastes battery."],
 note:"1080p at a higher frame rate slows down beautifully."},
{id:"eis-on",kind:"setting",title:"Keep Stabilisation On",subjects:["any"],
 steps:["Check the stabilisation (EIS) toggle is ON in the camera settings.",
 "It smooths out the small wobbles your thumbs can't.",
 "Leave it on for every normal flight — off is only for experts.",
 "If footage still shakes, the answer is slower flying, not more settings."],
 note:"Smooth footage is 90% gentle thumbs."},
{id:"photo-12mp",kind:"setting",title:"Still Photos, Done Right",subjects:["any"],
 steps:["Tap the camera icon in DJI Fly to switch from video to photo.",
 "The Neo shoots 12-megapixel stills — plenty for prints and the mantelpiece.",
 "Hover steady, tap the shutter, and hold position for a second after.",
 "Take three of everything — one will always be sharper."],
 note:"A still from a steady hover beats a frame grabbed from video."},
{id:"gridlines",kind:"setting",title:"Switch the Gridlines On",subjects:["any"],
 steps:["In the camera settings, turn on the 3-by-3 grid overlay.",
 "Put horizons on the lines and subjects on the crossing points.",
 "Leave them on forever — they cost nothing and fix wonky horizons.",
 "Check the horizon is level before every shot."],
 note:"The rule of thirds, served on a plate."},
{id:"exposure-tap",kind:"setting",title:"Tap to Set the Exposure",subjects:["any"],
 steps:["Before filming, tap the brightest important thing on screen — usually the sky.",
 "Watch the image settle; tap your subject instead if it goes too dark.",
 "Lock the exposure if the app offers it, so it won't pulse as you fly.",
 "Bright sky and dark ground? Expose for the sky; the ground can be lifted later."],
 note:"One tap beats ten minutes of fixing later."},
{id:"flat-colour",kind:"setting",title:"Flat Colour: Only If You'll Grade It",subjects:["any"],
 steps:["If your DJI Fly app offers a flat, D-Cinelike-style colour profile, know what it's for.",
 "Flat looks grey and dull straight out of the camera — on purpose.",
 "Only use it if you'll add contrast and colour back afterwards on a computer.",
 "Otherwise choose Normal colour every time — it looks right immediately."],
 note:"Flat footage you never grade is just grey footage."},
{id:"battery-discipline",kind:"setting",title:"Battery Discipline",subjects:["any"],
 steps:["Start every QuickShot with a full battery — they drink power.",
 "Flight time is under twenty minutes, so plan one idea per battery.",
 "When the app warns of low battery, land — don't squeeze in 'one more shot'.",
 "Let batteries cool down before recharging them."],
 note:"Land with charge to spare and you'll never go wading for a drone."},
{id:"storage-check",kind:"setting",title:"Check Your Storage First",subjects:["any"],
 steps:["Before leaving the house, check the Neo has space — in the app's storage menu.",
 "Offload old flights to your phone or computer regularly.",
 "Format the card in the DJI Fly app now and then to keep it healthy.",
 "Nothing is sadder than 'storage full' at the perfect moment."],
 note:"A two-minute check saves a ruined outing."},
{id:"lens-clean",kind:"setting",title:"Wipe the Lens",subjects:["any"],
 steps:["The Neo's lens is tiny and picks up pocket fluff.",
 "Give it a quick wipe with a microfibre cloth before every flight.",
 "Check for the tell-tale hazy glow in a short test hover.",
 "Keep the cloth in the drone case so it's always there."],
 note:"The cheapest image-quality upgrade there is."},
{id:"wb-sky",kind:"setting",title:"Match White Balance to the Sky",subjects:["any"],
 steps:["In the camera settings, set white balance to match the day: sunny, cloudy, or auto.",
 "Sunny on a blue-sky day keeps the colours honest.",
 "Cloudy warms up a grey day nicely.",
 "Auto is perfectly fine if you'd rather just fly."],
 note:"Right white balance means no editing needed."},
/* ---------------- COMPOSITION ---------------- */
{id:"golden-hour",kind:"composition",title:"Chase the Golden Hour",subjects:["sky","generic","viewpoint","beach"],
 steps:["Fly in the hour before sunset — the light does half the work for you.",
 "Put the sun to one side rather than dead centre, and let the long shadows stretch.",
 "Churches, castles and piers all glow in low sun — point the Neo at the nearest one.",
 "Pack up as the light dies — the Neo is not a night flyer."],
 note:"Golden hour turns an average shot into a keeper."},
{id:"leading-lines-pier",kind:"composition",title:"Leading Lines Down the Pier",subjects:["pier","coast"],
 steps:["Position the Neo so {place} runs from a bottom corner of the frame into the distance.",
 "The pier's line pulls the viewer's eye straight to the horizon.",
 "A tiny person strolling the pier gives it scale — filmed from afar, with care.",
 "Try it both ways: down the pier, and back toward the shore."],
 note:"Lines are the composition cheat code."},
{id:"thirds-lighthouse",kind:"composition",title:"Rule of Thirds: Lighthouse",subjects:["lighthouse","coast"],
 steps:["With gridlines on, place {place} on a crossing point — not the centre.",
 "Give the sea two-thirds of the frame, or the sky; pick whichever is prettier.",
 "Leave space in front of the lighthouse, not behind it.",
 "Take one centred as well, then compare — you'll see why the thirds win."],
 note:"Off-centre is almost always more interesting."},
{id:"foreground-interest",kind:"composition",title:"Something in the Foreground",subjects:["park","garden","nature","generic"],
 steps:["Find flowers, a fence or low branches at {place} to sit along the frame's bottom edge.",
 "Fly the Neo low and close to the foreground, with your subject beyond it.",
 "The near-thing gives depth; without it, landscapes look flat.",
 "Keep the foreground a soft hint, not a hedge."],
 note:"Depth is what separates snaps from photographs."},
{id:"topdown-harbour",kind:"composition",title:"Straight-Down Symmetry",subjects:["harbour","coast","pier"],
 steps:["Climb over {place} and tilt the camera fully down.",
 "Boats, moorings and ripples make natural patterns from above.",
 "Wait for a gap in the clouds — even light, no harsh shadows.",
 "Keep the horizon out entirely; it's all pattern now."],
 note:"The world looks designed from directly above."},
{id:"reflections",kind:"composition",title:"Mirror Water",subjects:["river","park","nature"],
 steps:["Find still water at {place} — early morning, before the breeze gets up.",
 "Frame the reflection as the subject and the real thing as secondary.",
 "Flip the photo upside down afterwards for a giggle.",
 "Any ripple kills it — calm days only."],
 note:"Two pictures for the price of one."},
{id:"frame-trees",kind:"composition",title:"A Natural Frame",subjects:["park","nature","garden"],
 steps:["Fly the Neo so overhanging branches edge the shot at {place}.",
 "The dark frame focuses all attention on the bright middle.",
 "Keep the drone well clear of the actual branches.",
 "Autumn leaves make the prettiest frames of all."],
 note:"A frame says 'look here'."},
{id:"negative-space",kind:"composition",title:"Big Sky, Small Subject",subjects:["sky","beach","generic"],
 steps:["Put your subject tiny in the frame against a huge sky at {place}.",
 "The clouds become the picture; the subject is just the full stop.",
 "Works brilliantly on beaches and open fields.",
 "Resist the urge to move closer — smallness is the point."],
 note:"Emptiness, used on purpose, is powerful."},
{id:"s-curve-river",kind:"composition",title:"Follow the S-Bend",subjects:["river"],
 steps:["Climb above {place} until the river's S-bend shows itself.",
 "Compose so the river snakes from one corner of the frame to the opposite.",
 "Morning mist in the valley is the jackpot — worth an early start.",
 "Take one still and one slow drift along the bend."],
 note:"Curves beat straights in every landscape."},
{id:"layers-hills",kind:"composition",title:"Layers to the Horizon",subjects:["viewpoint","nature","park"],
 steps:["From a high spot near {place}, frame foreground, middle hills and distant haze.",
 "Three layers minimum — that is what gives the depth.",
 "A slight haze is your friend; it separates the layers.",
 "Keep the horizon on the upper third line."],
 note:"Haze is nature's depth cue."},
];

/* ---------------- RONNIE'S FLYING-SKILLS LADDER ----------------
   strand: "fly" (Ronnie on the sticks, Grandad spotting)
           "eye" (Grandad flies, Ronnie observes / directs)
           "law" (bite-size UK drone law, a game not a lesson)
   level: 1 gentle → 3 tricky. suits: idea kinds / subject tags / "any". */
const RONNIE_TASKS = [
{id:"r-hover-box",strand:"fly",level:1,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"The Hover Box",
 text:"Your turn on the sticks, Ronnie! Keep the Neo hovering inside an imaginary box for 30 seconds — Grandad counts out loud and you keep it steady.",
 suits:["shot","any"]},
{id:"r-rocket-hands",strand:"fly",level:1,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"You Press the Button",
 text:"Ronnie's job: tap Rocket, hands off the sticks, eyes on the drone, and call out the height as it climbs.",
 suits:["shot"]},
{id:"r-dronie-you",strand:"fly",level:1,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"Dronie, Your Call",
 text:"You fly the Dronie, Ronnie — start close, tap the button, then don't touch a thing while it backs away. Grandad strikes the pose.",
 suits:["shot"]},
{id:"r-landing-pad",strand:"fly",level:2,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"Landing Pad Challenge",
 text:"Take off and land back on the same paving slab three times in a row. Three in a row and you officially beat Grandad.",
 suits:["any"]},
{id:"r-slow-circle",strand:"fly",level:2,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"One Smooth Circle",
 text:"Your mission: fly one slow, smooth circle around the bench. No jerky thumbs — smooth as treacle wins.",
 suits:["shot","park","garden"]},
{id:"r-shadow",strand:"fly",level:3,badge:"RONNIE FLIES · GRANDAD SPOTS",title:"Shadow the Walker",
 text:"Grandad walks slowly across the field and you keep the Neo hovering beside him at exactly his speed. Tricky — go!",
 suits:["shot"]},
{id:"r-spotter",strand:"eye",level:1,badge:"RONNIE'S EAGLE EYES",title:"Official Spotter",
 text:"Ronnie is the official spotter: eyes on the drone at all times, and shout 'PAUSE!' if anyone walks into the field.",
 suits:["any"]},
{id:"r-leading-lines",strand:"eye",level:1,badge:"RONNIE'S EAGLE EYES",title:"Leading-Line Hunt",
 text:"Find three leading lines in the scene before Grandad takes off — roads, fences, rivers. First to spot all three wins.",
 suits:["composition"]},
{id:"r-count-boats",strand:"eye",level:1,badge:"RONNIE'S EAGLE EYES",title:"Count the Boats",
 text:"Count every boat in the top-down photo before Grandad hits the shutter. Closest guess wins — no pressure.",
 suits:["composition","harbour","coast","pier"]},
{id:"r-director",strand:"eye",level:2,badge:"RONNIE'S EAGLE EYES",title:"You're the Director",
 text:"Grandad only moves on your word, Ronnie: 'left a bit… up a touch… hold it there!' Beret optional.",
 suits:["shot"]},
{id:"r-photo-judge",strand:"eye",level:1,badge:"RONNIE'S EAGLE EYES",title:"Photo Judge",
 text:"Grandad takes three stills — you pick the winner and explain why in one sentence. No pressure, judge.",
 suits:["any"]},
{id:"r-light-caller",strand:"eye",level:2,badge:"RONNIE'S EAGLE EYES",title:"Light Caller",
 text:"Watch the sun and shout 'NOW!' the moment the light turns golden. Grandad's shutter finger is waiting on you.",
 suits:["composition","sky"]},
{id:"r-how-high",strand:"law",level:1,badge:"RONNIE'S LAW CORNER",title:"How High, Quiz Whiz?",
 text:"Quiz: how high are we allowed to fly? 120 metres — that's about 40 houses stacked on top of each other!",
 suits:["any"]},
{id:"r-operator-id",strand:"law",level:1,badge:"RONNIE'S LAW CORNER",title:"Find the Label",
 text:"Whose job is the Operator ID label stuck on the drone? Point to it and read it out loud like a newsreader.",
 suits:["any"]},
{id:"r-vlos-game",strand:"law",level:1,badge:"RONNIE'S LAW CORNER",title:"The Eyeball Test",
 text:"Close one eye, Ronnie: can you still see the Neo properly? If not, it's too far away — call it back in!",
 suits:["shot","any"]},
{id:"r-airfield-why",strand:"law",level:2,badge:"RONNIE'S LAW CORNER",title:"Why Check the App?",
 text:"There's an airfield not far from here — can you explain to Grandad why we check the Drone Assist app before flying?",
 suits:["any"],"airfield":true},
{id:"r-crowd-quiz",strand:"law",level:2,badge:"RONNIE'S LAW CORNER",title:"People Puzzle",
 text:"See those people over there? Quiz: why do we keep the drone well away from them? First right answer gets the next flight.",
 suits:["any"]},
];

/* ---------------- the two drones (verified capabilities only) ---------------- */
const DRONES={
 neo2:{name:"Alan's Neo 2",short:"Neo 2",
   chip:"For Alan's Neo 2 · obstacle sensing · 2-axis gimbal",
   note:"Alan flies the Neo 2 — it has omnidirectional obstacle sensing and a 2-axis gimbal, so it forgives more than the original Neo. Still keep it in sight."},
 neo:{name:"Ronnie's original Neo",short:"Neo",
   chip:"For Ronnie's original Neo · no obstacle sensing — eyes on it",
   note:"Ronnie flies the original Neo — it has no obstacle sensing, so Alan keeps watch and flights stay simple."}
};

/* ---------------- pure logic ---------------- */
function xmur3(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return function(){h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return (h^=h>>>16)>>>0;};}
function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function seededRandom(seedStr){const s=xmur3(seedStr)();return mulberry32(s);}
function shuffleSeeded(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function seedFor(lat,lon,d){const loc=(lat!=null&&lon!=null)?(Number(lat).toFixed(1)+","+Number(lon).toFixed(1)):"noloc";return dayKey(d)+"|"+loc;}

/* POI: {name (may be null), distKm, subjects: []} */
function fmtDist(km){return km<1?Math.round(km*1000)+" m":(Math.round(km*10)/10)+" km";}
function placeLabel(poi){
  if(!poi) return "Wherever you are";
  const kindWord=poi.kindWord||"spot";
  const nm=poi.name?poi.name:("a "+kindWord);
  return nm+" · "+fmtDist(poi.distKm)+" away";
}
/* Build an ordered deck of {idea, poi|null}. Matched ideas first (nearest POI),
   then always-eligible ideas, all seeded-shuffled. */
function buildDeck(pois,seedStr){
  const rng=seededRandom(seedStr);
  const anyIdeas=IDEAS.filter(i=>i.subjects.length===1&&i.subjects[0]==="any");
  const specIdeas=IDEAS.filter(i=>!(i.subjects.length===1&&i.subjects[0]==="any"));
  const genericIdeas=specIdeas.filter(i=>i.subjects.indexOf("generic")>=0);
  let deck=[];
  if(pois&&pois.length){
    const matched=[];
    specIdeas.forEach(idea=>{
      let best=null;
      pois.forEach(p=>{
        if(p.subjects.some(s=>idea.subjects.indexOf(s)>=0)){
          if(!best||p.distKm<best.distKm)best=p;
        }
      });
      if(best)matched.push({idea:idea,poi:best});
    });
    matched.sort((a,b)=>{
      const an=a.poi.name?0:1,bn=b.poi.name?0:1;
      if(an!==bn)return an-bn;
      if(a.poi.distKm!==b.poi.distKm)return a.poi.distKm-b.poi.distKm;
      return 0;
    });
    // stable seeded interleave: shuffle within score bands is overkill; shuffle then stable-sort
    const sh=shuffleSeeded(matched,rng);
    sh.sort((a,b)=>{
      const an=a.poi.name?0:1,bn=b.poi.name?0:1;
      if(an!==bn)return an-bn;
      return a.poi.distKm-b.poi.distKm;
    });
    deck=sh;
    const used=new Set(deck.map(e=>e.idea.id));
    shuffleSeeded(anyIdeas,rng).forEach(i=>{if(!used.has(i.id)){used.add(i.id);deck.push({idea:i,poi:null});}});
  }else{
    const pool=specIdeas.filter(i=>i.subjects.indexOf("generic")>=0).concat(anyIdeas);
    const used=new Set();
    shuffleSeeded(pool,rng).forEach(i=>{if(!used.has(i.id)){used.add(i.id);deck.push({idea:i,poi:null});}});
  }
  return deck;
}
/* Ordered ladder deck for Ronnie mode: seeded shuffle, stable-sorted so the
   least-recently-shown strand comes first (rotates fly / eye / law). */
function buildLadderDeck(seedStr,strandHistory){
  var rng=seededRandom(seedStr+"|ladder");
  var hist=strandHistory||[];
  var scored=RONNIE_TASKS.map(function(t){
    var ri=hist.lastIndexOf(t.strand);
    return {t:t,rec:ri<0?-1:ri};
  });
  var sh=shuffleSeeded(scored,rng);
  sh.sort(function(a,b){return a.rec-b.rec;});
  return sh.map(function(s){return s.t;});
}
/* Pick a Ronnie task for an idea. Prefers kind+subject matches, boosts the
   airfield law task when an airfield is near, and rotates strands away from
   recently shown ones. Returns null only if the library is empty. */
function pickRonnie(idea,ctx,seedStr){
  const rng=seededRandom(seedStr+"|ronnie");
  const kinds=new Set([idea.kind].concat(idea.subjects,["any"]));
  const shown=ctx&&ctx.shownRonnieIds?ctx.shownRonnieIds:[];
  const strandHist=ctx&&ctx.strandHistory?ctx.strandHistory:[];
  const airNear=!!(ctx&&ctx.airfieldNear);
  function score(t){
    if(!t.suits.some(s=>kinds.has(s)))return -1;
    let sc=0;
    if(t.suits.indexOf(idea.kind)>=0)sc+=2;
    if(t.suits.some(s=>idea.subjects.indexOf(s)>=0))sc+=2;
    if(t.airfield&&airNear)sc+=4;
    if(t.airfield&&!airNear)sc-=4;
    const ri=strandHist.lastIndexOf(t.strand);
    if(ri>=0)sc-=(strandHist.length-ri)*0.6; // rotate strands
    return sc;
  }
  let cands=RONNIE_TASKS.map(t=>({t:t,sc:score(t)})).filter(c=>c.sc>=0&&shown.indexOf(c.t.id)<0);
  if(!cands.length)cands=RONNIE_TASKS.map(t=>({t:t,sc:score(t)})).filter(c=>c.sc>=0);
  if(!cands.length)return null;
  const top=Math.max.apply(null,cands.map(c=>c.sc));
  const best=cands.filter(c=>c.sc>=top-1.5);
  return shuffleSeeded(best,rng)[0].t;
}
function fillPlace(text,poi){
  const nm=poi&&poi.name?poi.name:(poi?"this spot":"your patch");
  return String(text).split("{place}").join(nm);
}

/* ---------------- restricted-airspace geometry (pure, no DOM) ----------------
   Coordinates are [lat, lon] as in restricted.json. alt_ft is deliberately
   ignored: with no floor field, every area is treated as covering drone
   altitudes (maximum flyer safety). */
function num(v){return typeof v==="number"&&isFinite(v);}
function haversineKm(lat1,lon1,lat2,lon2){
  const R=6371,t=Math.PI/180;
  const dLat=(lat2-lat1)*t,dLon=(lon2-lon1)*t;
  const h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*t)*Math.cos(lat2*t)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.sqrt(h));
}
/* Ray casting, x = lon, y = lat. poly entries are [lat, lon]. */
function pointInPolygon(lat,lon,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i][1],yi=poly[i][0],xj=poly[j][1],yj=poly[j][0];
    if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi))inside=!inside;
  }
  return inside;
}
/* Distance (metres) from a point to a segment, via a local equirectangular
   projection centred on the point — plenty accurate inside the 500 m band. */
function pointToSegmentM(lat,lon,lat1,lon1,lat2,lon2){
  const t=Math.PI/180,kx=111320*Math.cos(lat*t),ky=110540;
  const x1=(lon1-lon)*kx,y1=(lat1-lat)*ky,x2=(lon2-lon)*kx,y2=(lat2-lat)*ky;
  const dx=x2-x1,dy=y2-y1,len2=dx*dx+dy*dy;
  const u=len2===0?0:Math.max(0,Math.min(1,(-x1*dx-y1*dy)/len2));
  const px=x1+u*dx,py=y1+u*dy;
  return Math.sqrt(px*px+py*py);
}
const AIRSPACE_NEAR_M=500;
/* Verdict for one point against restricted areas. Returns {state, area}:
   "restricted" inside any polygon or within any circle radius;
   "near" outside but within 500 m of any boundary; else "clear".
   Areas with no usable geometry are skipped. Never throws. */
function checkAirspace(lat,lon,areas){
  const none={state:"clear",area:null};
  if(!num(lat)||!num(lon)||!Array.isArray(areas))return none;
  let near=null,nearDist=Infinity;
  for(let ai=0;ai<areas.length;ai++){
    const a=areas[ai];
    if(!a||typeof a!=="object")continue;
    try{
      if(Array.isArray(a.circle)&&a.circle.length>=2&&num(a.circle[0])&&num(a.circle[1])&&num(a.radius_km)&&a.radius_km>0){
        const dKm=haversineKm(lat,lon,a.circle[0],a.circle[1]);
        if(dKm<=a.radius_km)return {state:"restricted",area:a};
        const beyond=(dKm-a.radius_km)*1000;
        if(beyond<=AIRSPACE_NEAR_M&&beyond<nearDist){nearDist=beyond;near=a;}
        continue;
      }
      if(Array.isArray(a.poly)){
        const pts=[];
        for(let pi=0;pi<a.poly.length;pi++){
          const p=a.poly[pi];
          if(Array.isArray(p)&&p.length>=2&&num(p[0])&&num(p[1]))pts.push([p[0],p[1]]);
        }
        if(pts.length<3)continue;
        if(pointInPolygon(lat,lon,pts))return {state:"restricted",area:a};
        let edge=Infinity;
        for(let ei=0;ei<pts.length;ei++){
          const q1=pts[ei],q2=pts[(ei+1)%pts.length];
          const dm=pointToSegmentM(lat,lon,q1[0],q1[1],q2[0],q2[1]);
          if(dm<edge)edge=dm;
        }
        if(edge<=AIRSPACE_NEAR_M&&edge<nearDist){nearDist=edge;near=a;}
      }
    }catch(e){continue;}
  }
  if(near)return {state:"near",area:near};
  return none;
}
/* Validate a restricted.json payload. Returns {areas, updated} or null.
   Only the top level is validated here; individual areas are skipped
   by checkAirspace if malformed. */
function validateAirspace(data){
  if(!data||typeof data!=="object"||!Array.isArray(data.areas)||!data.areas.length)return null;
  return {areas:data.areas,updated:(typeof data.updated==="string"&&data.updated)?data.updated:null};
}

var ENGINE={IDEAS:IDEAS,RONNIE_TASKS:RONNIE_TASKS,DRONES:DRONES,seededRandom:seededRandom,shuffleSeeded:shuffleSeeded,
 dayKey:dayKey,seedFor:seedFor,fmtDist:fmtDist,placeLabel:placeLabel,buildDeck:buildDeck,
 buildLadderDeck:buildLadderDeck,pickRonnie:pickRonnie,fillPlace:fillPlace,
 checkAirspace:checkAirspace,validateAirspace:validateAirspace,haversineKm:haversineKm,
 pointInPolygon:pointInPolygon,pointToSegmentM:pointToSegmentM};
if(typeof module!=="undefined"&&module.exports){module.exports=ENGINE;}
if(typeof window!=="undefined"){window.NeoEngine=ENGINE;}
