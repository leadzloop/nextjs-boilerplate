/* NMK Living – 3D-woning: buiten, binnen en op locatie (ware schaal: lengte = m² ÷ 4, breedte 4,00 m) */
import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

const W = 4.0, H = 2.6, FY = 0.45, T = 0.14;           // breedte, binnenhoogte, vloerhoogte, wanddikte
const PDOK_SUGGEST = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest';
const PDOK_LOOKUP = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup';
const PDOK_TILE = (z, x, y) => `https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:3857/${z}/${x}/${y}.jpeg`;

let st = null; // actieve viewer-state

export function open(cfg) {
  if (st) close();
  st = { cfg, mode: cfg.mode || 'buiten', night: false, dims: true, loc: cfg.loc || null, raf: 0, anim: [] };
  buildUI();
  try { initThree(); } catch (e) { st.root.querySelector('.v3-stage').innerHTML = '<div class="v3-msg">3D wordt niet ondersteund in deze browser.</div>'; return; }
  buildScene();
  setMode(st.mode, true);
  if (st.mode === 'locatie' && st.loc && st.loc.lat) loadAerial(st.loc.lat, st.loc.lon, st.loc.adres, st.loc);
  loop();
}
export function close() {
  if (!st) return;
  cancelAnimationFrame(st.raf);
  window.removeEventListener('resize', st.onResize);
  document.removeEventListener('keydown', st.onKey);
  try { st.renderer.dispose(); st.renderer.forceContextLoss(); } catch (e) {}
  st.root.remove(); document.body.classList.remove('v3-open');
  st = null;
}

/* ------------------------------------------------------------------ UI */
function el(h) { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const nl = n => n.toFixed(2).replace('.', ',');

function buildUI() {
  const m = st.cfg.model, L = m.m2 / W;
  const root = el(`<div class="v3" role="dialog" aria-label="3D-weergave">
    <div class="v3-top"><div class="v3-title"><b>${esc(m.name)}</b><span>${nl(L)} × ${nl(W)} m · ${m.m2} m² · ware schaal</span></div>
      <div class="v3-tabs"><button data-m="buiten">Buiten</button><button data-m="binnen">Binnen</button><button data-m="locatie">Op locatie</button></div>
      <button class="v3-x" aria-label="Sluiten">×</button></div>
    <div class="v3-stage"><canvas></canvas><div class="v3-labels"></div><div class="v3-hint"></div><div class="v3-load">3D-model laden…</div></div>
    <div class="v3-bar">
      <div class="v3-grp v3-g-buiten"><button data-act="day" class="on">Dag</button><button data-act="night">Avond</button><button data-act="dims" class="on">Maten</button><button data-act="tour">▶ Rondleiding</button></div>
      <div class="v3-grp v3-g-binnen"></div>
      <div class="v3-grp v3-g-locatie"><form class="v3-search"><input type="search" placeholder="Adres of postcode van je kavel" autocomplete="off" aria-label="Adres"><button type="submit">Zoek</button><div class="v3-sug"></div></form>
        <span class="v3-locctl"><button data-act="rotL" title="Draai linksom">⟲ 15°</button><button data-act="rotR" title="Draai rechtsom">⟳ 15°</button><button data-act="top" class="on">Bovenaanzicht</button><button data-act="persp">3D</button><button data-act="saveloc" class="gold">Gebruik in offerte</button></span></div>
      <a class="v3-cta" href="#contact">Offerte aanvragen →</a>
    </div></div>`);
  document.body.appendChild(root); document.body.classList.add('v3-open');
  st.root = root;
  root.querySelector('.v3-x').onclick = close;
  root.querySelectorAll('.v3-tabs button').forEach(b => b.onclick = () => setMode(b.dataset.m));
  root.querySelector('.v3-cta').onclick = () => { if (st.cfg.onCta) st.cfg.onCta(); close(); };
  root.querySelector('.v3-bar').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act;
    if (a === 'day' || a === 'night') { setNight(a === 'night'); }
    if (a === 'dims') { st.dims = !st.dims; b.classList.toggle('on', st.dims); st.dimGroup.visible = st.dims; refreshLabels(); }
    if (a === 'tour') playTour();
    if (a === 'rotL' || a === 'rotR') { st.house.rotation.y += (a === 'rotL' ? 1 : -1) * Math.PI / 12; locChanged(); }
    if (a === 'top' || a === 'persp') { setLocView(a); }
    if (a === 'saveloc') saveLoc();
    if (b.dataset.room) goRoom(+b.dataset.room);
  });
  // adres zoeken (PDOK Locatieserver)
  const form = root.querySelector('.v3-search'), inp = form.querySelector('input'), sug = form.querySelector('.v3-sug');
  let t = 0;
  inp.addEventListener('input', () => { clearTimeout(t); const q = inp.value.trim(); if (q.length < 3) { sug.innerHTML = ''; return; }
    t = setTimeout(() => fetch(PDOK_SUGGEST + '?rows=6&fq=type:(adres OR postcode OR woonplaats OR weg)&q=' + encodeURIComponent(q)).then(r => r.json()).then(j => {
      sug.innerHTML = (j.response.docs || []).map(d => `<button type="button" data-id="${esc(d.id)}">${esc(d.weergavenaam)}</button>`).join('');
    }).catch(() => { sug.innerHTML = ''; }), 220); });
  sug.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sug.innerHTML = ''; inp.value = b.textContent; lookup(b.dataset.id, b.textContent); });
  form.addEventListener('submit', e => { e.preventDefault(); const q = inp.value.trim(); if (!q) return; sug.innerHTML = '';
    fetch(PDOK_SUGGEST + '?rows=1&q=' + encodeURIComponent(q)).then(r => r.json()).then(j => { const d = (j.response.docs || [])[0]; if (!d) throw 0; inp.value = d.weergavenaam; lookup(d.id, d.weergavenaam); })
      .catch(() => hint('Adres niet gevonden. Probeer straat + huisnummer + plaats, of een postcode.', true)); });
  if (st.loc && st.loc.adres) inp.value = st.loc.adres;
  st.onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', st.onKey);
}
function hint(t, warn) { const h = st.root.querySelector('.v3-hint'); h.textContent = t || ''; h.classList.toggle('show', !!t); h.classList.toggle('warn', !!warn); }

/* --------------------------------------------------------------- three */
function initThree() {
  const canvas = st.root.querySelector('canvas');
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: false });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  st.renderer = r;
  st.scene = new THREE.Scene();
  st.camera = new THREE.PerspectiveCamera(50, 1, 0.05, 2000);
  st.controls = new OrbitControls(st.camera, canvas);
  st.controls.enableDamping = true; st.controls.dampingFactor = 0.08;
  st.loader = new THREE.TextureLoader(); st.texCache = {};
  st.onResize = () => { const s = st.root.querySelector('.v3-stage'); const w = s.clientWidth, h = s.clientHeight; r.setSize(w, h, false); st.camera.aspect = w / h; st.camera.updateProjectionMatrix(); };
  window.addEventListener('resize', st.onResize); st.onResize();
  let pending = 0; st.mgrPending = () => pending;
  THREE.DefaultLoadingManager.onStart = () => { pending++; };
  THREE.DefaultLoadingManager.onLoad = () => { pending = 0; const l = st && st.root.querySelector('.v3-load'); if (l) l.style.display = 'none'; };
  setTimeout(() => { const l = st && st.root.querySelector('.v3-load'); if (l) l.style.display = 'none'; }, 6000);
}
function tex(key, rx, ry, rot) {
  const url = (st.cfg.img || {})[key]; if (!url) return null;
  let base = st.texCache[url];
  if (!base) { base = st.loader.load(url); base.colorSpace = THREE.SRGBColorSpace; st.texCache[url] = base; }
  const t = base.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); if (rot) { t.rotation = rot; t.center.set(.5, .5); }
  t.anisotropy = 8; t.needsUpdate = true;
  // kloon deelt de afbeelding; update wanneer geladen
  if (!base.image) { const iv = setInterval(() => { if (base.image) { t.image = base.image; t.needsUpdate = true; clearInterval(iv); } }, 120); }
  return t;
}
const mat = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: .8, metalness: 0 }, o));
function box(w, h, d, m, x, y, z, parent, cast = true) { const g = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); g.position.set(x, y, z); g.castShadow = cast; g.receiveShadow = true; (parent || st.house).add(g); return g; }

/* ---------------------------------------------------------------- scene */
function buildScene() {
  const c = st.cfg, m = c.model, L = m.m2 / W; st.L = L;
  const sc = st.scene;
  st.house = new THREE.Group(); sc.add(st.house);
  st.env = new THREE.Group(); sc.add(st.env);
  st.nightLights = []; st.emissives = []; st.rooms = [];

  // licht
  st.hemi = new THREE.HemisphereLight(0xdfeaf5, 0x6b5e4a, 0.9); sc.add(st.hemi);
  st.sun = new THREE.DirectionalLight(0xfff1dc, 2.4); st.sun.position.set(-L * .8 - 6, 14, 12); st.sun.castShadow = true;
  const s = Math.max(L, 10) * .9; Object.assign(st.sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 }); st.sun.shadow.mapSize.set(2048, 2048); st.sun.shadow.bias = -0.0004;
  sc.add(st.sun); sc.add(st.sun.target);

  // omgeving
  const ground = new THREE.Mesh(new THREE.CircleGeometry(160, 64), mat({ color: 0x6f7f52, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; st.env.add(ground); st.ground = ground;
  const gravel = new THREE.Mesh(new THREE.PlaneGeometry(L + 3, 7.5), mat({ map: tex('fl3', (L + 3) / 3, 2.5), color: 0x9d9a92, roughness: 1 }));
  gravel.rotation.x = -Math.PI / 2; gravel.position.set(0, .01, .9); gravel.receiveShadow = true; st.env.add(gravel);
  const rnd = mulberry(7); const trunk = mat({ color: 0x4a3a2a }), leaf = mat({ color: 0x2f4a32, roughness: .95 });
  for (let i = 0; i < 46; i++) { const a = rnd() * Math.PI * 2, d = Math.max(L, 8) * .7 + 8 + rnd() * 45, x = Math.cos(a) * d, z = Math.sin(a) * d - 6; if (z > 6 && Math.abs(x) < L) continue; const h = 7 + rnd() * 9;
    const tr = new THREE.Group(); box(.35, 1.4, .35, trunk, 0, .7, 0, tr); for (let k = 0; k < 3; k++) { const cn = new THREE.Mesh(new THREE.ConeGeometry(h * .23 * (1 - k * .22), h * .45, 8), leaf); cn.position.y = 1.4 + h * (.2 + k * .22); cn.castShadow = true; tr.add(cn); }
    tr.position.set(x, 0, z); st.env.add(tr); }
  st.skyDay = gradTex(['#8db4dc', '#cfe1ef', '#eef2f0']); st.skyNight = gradTex(['#0d1426', '#2a2440', '#a5603a']);
  sc.background = st.skyDay; sc.fog = new THREE.Fog(0xcfe1ef, 60, 220);

  buildHouse(L);
  buildDims(L);
  refreshLabels();
  setNight(false);
}
function gradTex(cols) { const cv = document.createElement('canvas'); cv.width = 2; cv.height = 256; const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, 2, 256); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function buildHouse(L) {
  const c = st.cfg, k = c.keys, o = c.opts || {}, x0 = -L / 2, x1 = L / 2, z0 = -W / 2, z1 = W / 2, top = FY + H;
  const gevelM = mat({ map: tex(k.gevel, L / 2.2, 1.6), roughness: .85 });
  const gevelEnd = mat({ map: tex(k.gevel, W / 2.2, 1.6), roughness: .85 });
  const wandM = mat({ map: tex(k.wand, 2.4, 1.4), roughness: .9 });
  const black = mat({ color: 0x151617, roughness: .55, metalness: .3 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xa8c0cc, transparent: true, opacity: .16, roughness: .05, metalness: .2, depthWrite: false });
  st.glassM = glass;
  const stone = mat({ color: 0x3b3c3d, roughness: .95 });

  // sokkel + vloer + plafond + dak
  box(L - .2, FY, W - .2, stone, 0, FY / 2, 0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L - T, W - T), mat({ map: tex(k.vloer, L / 1.6, W / 1.6), roughness: .7 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FY + .002; floor.receiveShadow = true; st.house.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(L - T, W - T), mat({ map: tex(k.plafond, L / 1.8, W / 1.8), roughness: .9, side: THREE.DoubleSide }));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = top - .002; st.house.add(ceil);
  const soffit = mat({ map: tex(k.plafond === 't_wit' ? 'fl0' : k.plafond, (L + .8) / 1.8, (W + .8) / 1.8), roughness: .9 });
  box(L + .8, .32, W + .8, [black, black, black, soffit, black, black], 0, top + .16, 0);

  // achterwand + zijwand (massief) met gevel buiten, wand binnen
  box(L, H, T, [gevelM, gevelM, gevelM, gevelM, wandM, gevelM], 0, FY + H / 2, z0 + T / 2);
  box(T, H, W, [wandM, gevelEnd, gevelEnd, gevelEnd, gevelEnd, gevelEnd], x0 + T / 2, FY + H / 2, 0);

  // indeling (A28-basis, schaalt mee): slaapkamer 2,0 | badkamer 1,0 | wc 0,8 | [slaapkamers 2,4] | woonkamer + keuken
  const beds = Math.max(1, c.model.beds || 1), xs = [x0];
  const add = w => xs.push(xs[xs.length - 1] + w);
  add(2.0); add(1.0); add(0.8); for (let i = 1; i < beds; i++) add(2.4);
  const xLive = xs[xs.length - 1]; st.xLive = xLive;
  const zc = .6; // diepte badkamer/wc tot gang
  const part = (x, za, zb, m) => box(.1, H, zb - za, m || wandM, x, FY + H / 2, (za + zb) / 2);
  const partZ = (z, xa, xb, m) => box(xb - xa, H, .1, m || wandM, (xa + xb) / 2, FY + H / 2, z);
  const tile = mat({ map: tex(c.bad >= 1 ? 'gv6' : 'fl3', 1.2, 1.4), roughness: .6, color: c.bad === 2 ? 0x6b625a : 0xffffff });
  // slaapkamer 1 / badkamer
  part(xs[1], z0 + T, .7, wandM); part(xs[1], 1.55, z1 - T, wandM);
  part(xs[2], z0 + T, zc, tile); part(xs[3], z0 + T, zc, wandM);
  partZ(zc, xs[1], xs[1] + .15, tile); partZ(zc, xs[1] + .85, xs[2] + .1, tile); partZ(zc, xs[2], xs[2] + .1); partZ(zc, xs[2] + .7, xs[3] + .05);
  // badkamer tegels binnenkant
  box(.01, H - .02, zc - z0 - T, tile, xs[1] + .06, FY + H / 2, (z0 + T + zc) / 2, null, false);
  // extra slaapkamers
  for (let i = 1; i < beds; i++) { const xa = xs[3 + i]; part(xa, z0 + T, .8); part(xa, 1.6, z1 - T); }
  // gevel voor entree/gang
  const frontSolidA = xs[1], frontSolidB = xs[3];
  box(frontSolidB - frontSolidA, H, T, [gevelM, gevelM, gevelM, gevelM, gevelM, wandM], (frontSolidA + frontSolidB) / 2, FY + H / 2, z1 - T / 2);
  box(.95, 2.15, .04, mat({ color: 0x1d1e1f, roughness: .4, metalness: .4 }), (frontSolidA + frontSolidB) / 2, FY + 1.075, z1 + .01);
  // glasgevels (voor slaapkamers, woonkamer, rechter kopgevel) met zwarte kozijnen
  const glassRun = (xa, xb, z) => { const len = xb - xa, n = Math.max(1, Math.round(len / 1.5)); const g = new THREE.Mesh(new THREE.PlaneGeometry(len, H), glass); g.position.set((xa + xb) / 2, FY + H / 2, z); st.house.add(g);
    for (let i = 0; i <= n; i++) box(.07, H, .09, black, xa + len * i / n, FY + H / 2, z); box(len, .08, .1, black, (xa + xb) / 2, FY + .04, z); box(len, .08, .1, black, (xa + xb) / 2, top - .04, z); };
  glassRun(x0, xs[1], z1 - .05);
  if (beds > 1) glassRun(xs[3], xLive, z1 - .05);
  glassRun(xLive, x1, z1 - .05);
  const gEnd = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glass); gEnd.rotation.y = Math.PI / 2; gEnd.position.set(x1 - .05, FY + H / 2, 0); st.house.add(gEnd);
  for (let i = 0; i <= 3; i++) box(.09, H, .07, black, x1 - .05, FY + H / 2, z0 + W * i / 3);
  // LED-strip rondom plafond
  const ledCol = c.stijl === 1 ? 0xffd9a8 : 0xffc37a;
  const led = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: ledCol, emissiveIntensity: 0 }); st.emissives.push([led, 2.2]);
  box(L - .3, .03, .03, led, 0, top - .06, z0 + T + .05, null, false); box(.03, .03, W - .3, led, x1 - .2, top - .06, 0, null, false);

  const fill = new THREE.PointLight(0xfff2e0, 0, 12, 1.2); fill.position.set((xLive + x1) / 2, FY + H - .3, 0); st.house.add(fill); st.fill = fill;
  const fill2 = new THREE.PointLight(0xfff2e0, 0, 8, 1.2); fill2.position.set(x0 + 1, FY + H - .3, 0); st.house.add(fill2); st.fill2 = fill2;
  furnish(L, xs, xLive, zc, o);
  exterior(L, o);

  // kamers voor binnenweergave
  st.rooms = [
    ['Woonkamer', [xLive + .3, FY + 1.5, z1 - .3], [x1 - .3, FY + 1.0, z0 + .4]],
    ['Keuken', [x1 - .45, FY + 1.6, z1 - .45], [xLive + .9, FY + 1.1, z0 + .3]],
    ['Slaapkamer', [x0 + 1.75, FY + 1.6, z1 - .35], [x0 + .7, FY + .6, z0 + .7]],
    ['Badkamer', [xs[1] + .5, FY + 1.6, zc + .55], [xs[1] + .45, FY + 1.0, z0 + .15]],
  ];
  for (let i = 1; i < beds; i++) { const bx = xs[2 + i]; st.rooms.push(['Slaapkamer ' + (i + 1), [bx + 2.1, FY + 1.6, z1 - .35], [bx + .9, FY + .6, z0 + .7]]); }
  if (o.terras) st.rooms.push(['Terras', [x1 + .2, FY + 1.6, z1 + 2.6], [xLive - 1, FY + 1.0, 0]]);
  const g = st.root.querySelector('.v3-g-binnen');
  g.innerHTML = st.rooms.map((r, i) => `<button data-act="room" data-room="${i}">${r[0]}</button>`).join('') + '<button data-act="night">Avond</button><button data-act="day" class="on">Dag</button>';
}

function furnish(L, xs, xLive, zc, o) {
  const c = st.cfg, x0 = -L / 2, x1 = L / 2, z0 = -W / 2, z1 = W / 2, f = FY;
  const st3 = c.stijl; // 0 warm, 1 donker, 2 luxe
  const fabric = mat({ color: st3 === 1 ? 0x5d5a55 : 0xe8e1d4, roughness: .95 });
  const fabric2 = mat({ color: st3 === 1 ? 0x3a3936 : 0xcfc5b4, roughness: .95 });
  const woodM = mat({ map: tex(st3 === 1 ? 'fl1' : 'fl0', 1, 1), roughness: .6 });
  const darkM = mat({ color: 0x232425, roughness: .5, metalness: .2 });
  const gold = mat({ color: 0xc8a463, metalness: .9, roughness: .3 });
  const white = mat({ color: 0xf2f2ef, roughness: .3 });
  const bedRooms = [x0];
  for (let i = 3; i < xs.length - 1; i++) bedRooms.push(xs[i]);
  bedRooms.forEach((bx, i) => {
    const w = i === 0 ? 2.0 : 2.4, cx = bx + w / 2;
    box(1.6, .32, 2.0, woodM, cx, f + .16, z0 + T + 1.0);
    box(1.5, .2, 1.9, white, cx, f + .42, z0 + T + 1.02);
    box(1.56, .07, 1.25, fabric2, cx, f + .55, z0 + T + 1.38);
    box(.6, .14, .38, white, cx - .38, f + .58, z0 + T + .3); box(.6, .14, .38, white, cx + .38, f + .58, z0 + T + .3);
    box(1.9, 1.1, .06, st3 === 2 ? mat({ color: 0x6b5a48, roughness: .9 }) : fabric, cx, f + .8, z0 + T + .03);
    [-1.05, 1.05].forEach(d => { if (Math.abs(d) * 1 + .25 > w / 2 + .5) return; box(.4, .45, .4, woodM, cx + d, f + .225, z0 + T + .25); lamp(cx + d, f + .62, z0 + T + .25, .9); });
    if (o.gord) curtains(bx + .1, bx + w - .1, z1 - .14);
    if (o.bedpak) { box(1.2, .03, .7, mat({ color: 0x8a7a66, roughness: 1 }), cx, f + .015, z0 + T + 2.4, null, false); }
  });
  // badkamer
  const bx = xs[1];
  const showerGlass = new THREE.Mesh(new THREE.PlaneGeometry(.95, 2.0), st.glassM); showerGlass.position.set(bx + .5, f + 1.0, z0 + T + .95); st.house.add(showerGlass);
  box(.95, .04, .9, mat({ color: 0x2a2a2a, roughness: .5 }), bx + .5, f + .02, z0 + T + .48);
  const tapM = c.kraan === 1 ? gold : darkM;
  box(.3, .02, .3, tapM, bx + .5, f + 2.3, z0 + T + .45, null, false);
  const rain = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x9ec9ff, emissiveIntensity: 0 }); if (c.bad === 2) { st.emissives.push([rain, 1.4]); box(.04, 1.9, .04, rain, bx + .06, f + 1.0, z0 + T + .9, null, false); }
  box(.42, .4, .55, white, bx + .5, f + .2, zc - .4); // toilet
  const van = c.bad === 0 ? darkM : woodM;
  box(.5, .15, .9, van, bx + .26, f + .9, z0 + T + 1.9 > zc ? zc - .9 : z0 + T + 1.9);
  // wc
  box(.4, .4, .55, white, xs[2] + .4, f + .2, z0 + T + .35);
  box(.3, .12, .25, white, xs[2] + .55, f + .9, zc - .3);
  // keuken langs achterwand van de woonkamer
  const kLen = Math.min(3.2, (x1 - xLive) - 1.2), ka = xLive + .1, kb = ka + kLen;
  const front = c.keuken === 2 ? mat({ map: tex('fl5', 1.2, 1), roughness: .5 }) : c.keuken === 1 ? mat({ color: 0x121314, roughness: .35 }) : mat({ color: 0x34373a, roughness: .55 });
  const top = c.keuken === 0 ? mat({ color: 0x5b5d5f, roughness: .6 }) : mat({ map: tex('fl3', 1.5, .5), roughness: .25, color: c.keuken === 2 ? 0xd9d2c6 : 0x9a9894 });
  box(.65, 2.3, .62, front, ka + .33, f + 1.15, z0 + T + .31);
  box(kLen - .65, .88, .62, front, ka + .65 + (kLen - .65) / 2, f + .44, z0 + T + .31);
  box(kLen - .65, .04, .65, top, ka + .65 + (kLen - .65) / 2, f + .9, z0 + T + .33);
  box(kLen - .65, .6, .02, c.keuken === 0 ? mat({ color: 0x4a4b4c }) : mat({ map: tex('gv6', 2, .5), roughness: .4 }), ka + .65 + (kLen - .65) / 2, f + 1.25, z0 + T + .01, null, false);
  box(kLen - .65, .55, .36, front, ka + .65 + (kLen - .65) / 2, f + 1.95, z0 + T + .18);
  const ledK = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([ledK, 2.5]);
  box(kLen - .7, .02, .03, ledK, ka + .65 + (kLen - .65) / 2, f + 1.66, z0 + T + .34, null, false);
  if (c.app >= 1) { box(.5, .5, .02, mat({ color: 0x0b0b0b, roughness: .2, metalness: .5 }), ka + .33, f + 1.1, z0 + T + .63, null, false); }
  if (c.app >= 2) { box(.5, .38, .02, mat({ color: 0x0b0b0b, roughness: .2, metalness: .5 }), ka + .33, f + 1.65, z0 + T + .63, null, false); }
  if (c.keuken === 2 && x1 - xLive > 4.5) { box(1.6, .9, .8, front, ka + 1.6, f + .45, -.15); box(1.7, .05, .9, top, ka + 1.6, f + .92, -.15); }
  box(.5, .02, .4, darkM, ka + 1.6, f + .93, z0 + T + .3); // spoelbak
  // eettafel + stoelen
  const tx = Math.min(kb + .2, x1 - 2.4) - .2, tz = .55;
  box(1.4, .05, .85, woodM, tx, f + .75, tz); [[-.6, -.35], [.6, -.35], [-.6, .35], [.6, .35]].forEach(p => box(.05, .73, .05, darkM, tx + p[0], f + .365, tz + p[1]));
  [[-.4, -.65], [.4, -.65], [-.4, .65], [.4, .65]].forEach(p => { box(.44, .05, .44, fabric2, tx + p[0], f + .46, tz + p[1]); box(.44, .45, .05, fabric2, tx + p[0], f + .7, tz + p[1] + (p[1] < 0 ? -.2 : .2)); });
  pendant(tx, top3(), tz);
  // lounge
  const sx = x1 - 1.0;
  box(.9, .42, 2.6, fabric, sx, f + .21, -.25); box(.25, .4, 2.6, fabric, sx + .35, f + .62, -.25);
  box(2.0, .42, .9, fabric, sx - 1.0, f + .21, -1.25); box(2.0, .4, .25, fabric, sx - 1.0, f + .62, -1.6);
  box(1.0, .32, .7, st3 === 2 ? mat({ map: tex('gv6', 1, 1), roughness: .3 }) : woodM, sx - 1.25, f + .16, -.1);
  box(2.4, .015, 1.9, mat({ color: st3 === 1 ? 0x4b4844 : 0xb9ad99, roughness: 1 }), sx - 1.0, f + .008, -.4, null, false);
  lamp(sx - 2.2, f + 1.5, -1.5, 1.2, true);
  if (o.mpak) { box(1.6, .5, .4, woodM, x1 - .6, f + .25, z1 - .6); }
  if (o.gord) curtains(xLive + .2, x1 - .2, z1 - .14);
  if (o.screens) { const sm = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, transparent: true, opacity: .55, roughness: 1, side: THREE.DoubleSide }); const s = new THREE.Mesh(new THREE.PlaneGeometry(x1 - xLive - .1, H * .55), sm); s.position.set((xLive + x1) / 2, FY + H - H * .275, z1 + .02); st.house.add(s); }
  function top3() { return f + H - .02; }
}
function lamp(x, y, z, int, floorLamp) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffbf73, emissiveIntensity: 0 }); st.emissives.push([m, 3]);
  const s = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), m); s.position.set(x, y, z); st.house.add(s);
  if (floorLamp) box(.03, y - FY, .03, mat({ color: 0x1a1a1a }), x, FY + (y - FY) / 2, z, null, false);
  const p = new THREE.PointLight(0xffb469, 0, 6 * int, 1.6); p.position.set(x, y + .1, z); st.house.add(p); st.nightLights.push([p, 3.5 * int]);
}
function pendant(x, y, z) {
  const m = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffc27a, emissiveIntensity: 0 }); st.emissives.push([m, 3]);
  box(.02, .5, .02, mat({ color: 0x111111 }), x, y - .25, z, null, false);
  const s = new THREE.Mesh(new THREE.CylinderGeometry(.12, .17, .16, 20), m); s.position.set(x, y - .58, z); st.house.add(s);
  const p = new THREE.PointLight(0xffb469, 0, 7, 1.6); p.position.set(x, y - .7, z); st.house.add(p); st.nightLights.push([p, 5]);
}
function curtains(xa, xb, z) { const m = mat({ color: 0xd9d2c4, roughness: 1, side: THREE.DoubleSide }); box(.35, H - .1, .08, m, xa + .18, FY + H / 2, z, null, true); box(.35, H - .1, .08, m, xb - .18, FY + H / 2, z, null, true); }

function exterior(L, o) {
  const x0 = -L / 2, x1 = L / 2, z1 = W / 2, z0 = -W / 2, top = FY + H;
  const deckM = mat({ map: tex('gv4', (L + 1) / 1.4, 1.8, Math.PI / 2), roughness: .8 });
  const darkM = mat({ color: 0x1b1c1d, roughness: .5, metalness: .3 });
  const stepM = mat({ color: 0x55575a, roughness: .9 });
  const entX = -L / 2 + 2.0 + .9;
  if (o.terras) {
    box(L + 1, .12, 3.0, deckM, 0, FY - .06, z1 + 1.5);
    box(1.6, .15, .4, stepM, entX, .3, z1 + 3.2); box(1.6, .15, .4, stepM, entX, .15, z1 + 3.55);
  } else {
    box(1.6, .15, .45, stepM, entX, .3, z1 + .25); box(1.6, .15, .45, stepM, entX, .15, z1 + .65);
  }
  if (o.overk) {
    const d = 3.0; box(L + .8, .2, d, [darkM, darkM, darkM, mat({ map: tex('fl0', L / 1.8, 1.5), roughness: .9 }), darkM, darkM], 0, top + .1, z1 + .4 + d / 2);
    [x0 + .1, x1 - .1].forEach(x => box(.12, top, .12, darkM, x, top / 2, z1 + .4 + d - .1));
  }
  if (o.zp) { const pm = mat({ color: 0x14203a, roughness: .25, metalness: .6 }); const n = Math.max(2, Math.floor((L - 1) / 1.15)); for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const p = box(1.05, .04, 1.7, pm, x0 + .7 + i * 1.15 + .5, top + .4, z0 + .3 + j * 1.8 + .85); p.rotation.x = -.12; } }
  if (o.bat) box(.6, 1.0, .25, mat({ color: 0xe9e9e7, roughness: .4 }), x0 - .3, FY + .5, z0 + 1.0);
  if (o.wp) { const u = box(1.0, .8, .45, mat({ color: 0x9a9ea2, roughness: .5 }), x0 + 1.5, .4, z0 - .45); const fan = new THREE.Mesh(new THREE.CircleGeometry(.28, 24), darkM); fan.position.set(x0 + 1.45, .42, z0 - .22 + .01); st.house.add(fan); }
  box(.8, .28, .22, mat({ color: 0xf3f3f1, roughness: .4 }), x0 + 3.2, FY + 2.0, z0 - .12); // airco buitenunit (inbegrepen)
  if (o.laad) box(.22, 1.3, .18, mat({ color: 0x2b2d2f, roughness: .5 }), x0 - 1.4, .65, z1 + 2.2);
  if (o.cam || o.alarm) { [[x0 - .05, top - .2, z1 + .05], [x1 + .05, top - .2, z1 + .05]].forEach(p => box(.12, .1, .18, mat({ color: 0xf0f0f0 }), p[0], p[1], p[2])); }
  if (o.bv) { const n = Math.max(3, Math.round(L / 2)); for (let i = 0; i < n; i++) { const x = x0 + .5 + (L - 1) * i / (n - 1), zz = z1 + (o.terras ? 3.3 : 1.2); box(.12, .7, .12, darkM, x, .35, zz); const m = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc06b, emissiveIntensity: 0 }); st.emissives.push([m, 3]); box(.1, .12, .1, m, x, .65, zz + .02, null, false); const p = new THREE.PointLight(0xffb15e, 0, 4, 1.8); p.position.set(x, .7, zz + .2); st.house.add(p); st.nightLights.push([p, 2]); } }
  const fireX = x1 + .3, fireZ = z1 + (o.terras ? 2.2 : 2.4);
  if (o.vuur) { const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.55, .3, .35, 24), darkM); bowl.position.set(fireX, (o.terras ? FY : 0) + .2, fireZ); bowl.castShadow = true; st.house.add(bowl);
    const fm = new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff6a00, emissiveIntensity: 2.5, transparent: true, opacity: .9 }); const fl = new THREE.Mesh(new THREE.ConeGeometry(.25, .6, 12), fm); fl.position.set(fireX, (o.terras ? FY : 0) + .65, fireZ); st.house.add(fl);
    const p = new THREE.PointLight(0xff8a3a, 2, 7, 1.6); p.position.set(fireX, (o.terras ? FY : 0) + 1, fireZ); st.house.add(p); st.fire = [fl, p]; }
  if (o.loung) { const lm = mat({ color: 0xe1dacd, roughness: 1 }); const y = o.terras ? FY : 0; box(1.8, .4, .8, lm, fireX - 1.6, y + .2, fireZ + .2); box(1.8, .35, .2, lm, fireX - 1.6, y + .55, fireZ + .55); }
}

/* --------------------------------------------------------------- maten */
function buildDims(L) {
  const g = new THREE.Group(); st.dimGroup = g; st.house.add(g);
  const lm = new THREE.LineBasicMaterial({ color: 0xb8925a });
  const line = (a, b) => { const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]); g.add(new THREE.Line(geo, lm)); };
  const y = .05, zF = W / 2 + 1.0, xR = L / 2 + 1.0;
  line([-L / 2, y, zF], [L / 2, y, zF]); line([-L / 2, y, zF - .25], [-L / 2, y, zF + .25]); line([L / 2, y, zF - .25], [L / 2, y, zF + .25]);
  line([xR, y, -W / 2], [xR, y, W / 2]); line([xR - .25, y, -W / 2], [xR + .25, y, -W / 2]); line([xR - .25, y, W / 2], [xR + .25, y, W / 2]);
  st.labels = [[new THREE.Vector3(0, y, zF), nl(L) + ' m'], [new THREE.Vector3(xR, y, 0), nl(W) + ' m'], [new THREE.Vector3(0, FY + H + 1.0, 0), st.cfg.model.m2 + ' m²']];
}
function refreshLabels() {
  const box = st.root.querySelector('.v3-labels');
  box.innerHTML = st.dims ? st.labels.map(l => `<span>${l[1]}</span>`).join('') : '';
  st.labelEls = [...box.children];
}
function placeLabels() {
  if (!st.dims || !st.labelEls) return;
  const s = st.root.querySelector('.v3-stage'), w = s.clientWidth, h = s.clientHeight;
  st.house.updateMatrixWorld();
  st.labels.forEach((l, i) => { const p = l[0].clone().applyMatrix4(st.house.matrixWorld).project(st.camera); const e = st.labelEls[i]; if (!e) return;
    const vis = p.z < 1 && st.mode !== 'binnen'; e.style.display = vis ? '' : 'none'; e.style.transform = `translate(${(p.x * .5 + .5) * w}px,${(-p.y * .5 + .5) * h}px) translate(-50%,-50%)`; });
}

/* --------------------------------------------------------- modi / camera */
function setMode(m, first) {
  st.mode = m; st.tourOn = false;
  st.root.querySelectorAll('.v3-tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  st.root.querySelectorAll('.v3-grp').forEach(g => g.style.display = g.classList.contains('v3-g-' + m) ? '' : 'none');
  const C = st.controls; C.enabled = true; C.enablePan = false;
  if (m !== 'binnen') { st.camera.fov = 50; st.camera.updateProjectionMatrix(); }
  if (m === 'buiten') {
    if (st.aerial) restoreEnv();
    C.enableZoom = true; C.minDistance = 4; C.maxDistance = 60; C.maxPolarAngle = 1.48; C.minPolarAngle = .15; C.rotateSpeed = .8;
    const d = Math.max(st.L, 8) * 1.25 + 4;
    fly([d * .55, 4.2, d * .85], [0, FY + 1.1, 0], first ? 0 : 900);
    hint('Sleep om rond de woning te draaien, knijp of scroll om te zoomen.');
  } else if (m === 'binnen') {
    if (st.aerial) restoreEnv();
    goRoom(0, first);
    hint('Sleep om rond te kijken. Kies een ruimte hieronder.');
  } else {
    C.enableZoom = true; C.minDistance = 6; C.maxDistance = 400;
    if (!st.aerial) hint('Zoek het adres van je kavel. Je woning verschijnt op ware schaal op de luchtfoto.');
    setLocView('top');
  }
  st.dimGroup.visible = st.dims; refreshLabels();
}
function goRoom(i, instant) {
  const r = st.rooms[i]; if (!r) return;
  st.camera.fov = 72; st.camera.updateProjectionMatrix();
  const C = st.controls; C.enableZoom = false; C.minDistance = .01; C.maxDistance = .2; C.minPolarAngle = .4; C.maxPolarAngle = 2.5; C.rotateSpeed = -.35;
  const p = new THREE.Vector3(...r[1]), t = new THREE.Vector3(...r[2]), dir = t.clone().sub(p).normalize();
  st.house.updateMatrixWorld(); p.applyMatrix4(st.house.matrixWorld); const tt = p.clone().add(dir.applyQuaternion(st.house.quaternion).multiplyScalar(.1));
  fly(p.toArray(), tt.toArray(), instant ? 0 : 900);
  st.root.querySelectorAll('.v3-g-binnen [data-room]').forEach(b => b.classList.toggle('on', +b.dataset.room === i));
}
function fly(pos, target, ms) {
  const C = st.controls, p0 = st.camera.position.clone(), t0 = C.target.clone(), p1 = new THREE.Vector3(...pos), t1 = new THREE.Vector3(...target);
  if (!ms) { st.camera.position.copy(p1); C.target.copy(t1); C.update(); return; }
  const s = performance.now(); st.flying = now => { const k = Math.min(1, (now - s) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    st.camera.position.lerpVectors(p0, p1, e); C.target.lerpVectors(t0, t1, e); if (k >= 1) st.flying = null; };
}
function setNight(n) {
  st.night = n;
  st.root.querySelectorAll('[data-act=day]').forEach(b => b.classList.toggle('on', !n)); st.root.querySelectorAll('[data-act=night]').forEach(b => b.classList.toggle('on', n));
  st.scene.background = n ? st.skyNight : st.skyDay; st.scene.fog.color.set(n ? 0x1d1b2e : 0xcfe1ef);
  st.hemi.intensity = n ? .12 : .9; st.sun.intensity = n ? .15 : 2.4; st.sun.color.set(n ? 0x8aa0ff : 0xfff1dc);
  st.renderer.toneMappingExposure = n ? 1.25 : 1.05;
  st.emissives.forEach(([m, i]) => m.emissiveIntensity = n ? i : (i > 2.4 ? .6 : .25));
  st.nightLights.forEach(([p, i]) => p.intensity = n ? i : 0);
  st.glassM.opacity = n ? .1 : .16;
  if (st.fill) { st.fill.intensity = n ? 0 : 1.6; st.fill2.intensity = n ? 0 : 1.2; }
}
function playTour() {
  const d = Math.max(st.L, 8) * 1.25 + 4, seq = [[[d * .55, 4.2, d * .85], [0, FY + 1.1, 0]], [[-d * .7, 3, d * .5], [0, FY + 1, 0]], [[0, 2.2, W / 2 + 6], [0, FY + 1.2, 0]]];
  let i = 0; st.tourOn = true; st.controls.enabled = false;
  const next = () => { if (!st || !st.tourOn) return; if (i < seq.length) { fly(seq[i][0], seq[i][1], 2200); i++; setTimeout(next, 2600); }
    else if (i - seq.length < st.rooms.length) { if (st.mode !== 'binnen') { st.mode = 'binnen'; st.root.querySelectorAll('.v3-tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === 'binnen')); st.root.querySelectorAll('.v3-grp').forEach(g => g.style.display = g.classList.contains('v3-g-binnen') ? '' : 'none'); }
      goRoom(i - seq.length); const C = st.controls; i++; setTimeout(next, 3200); }
    else { st.tourOn = false; st.controls.enabled = true; } };
  next();
  hint('Rondleiding: buiten rond, daarna door alle ruimtes. Tik ergens om te stoppen.');
  const stop = () => { if (st) { st.tourOn = false; st.controls.enabled = true; } st && st.root.querySelector('canvas').removeEventListener('pointerdown', stop); };
  setTimeout(() => st && st.root.querySelector('canvas').addEventListener('pointerdown', stop), 50);
}

/* ------------------------------------------------------------- locatie */
function lookup(id, naam) {
  hint('Luchtfoto laden…');
  fetch(PDOK_LOOKUP + '?fl=centroide_ll,weergavenaam&id=' + encodeURIComponent(id)).then(r => r.json()).then(j => {
    const d = j.response.docs[0], mm = /POINT\(([-\d.]+) ([-\d.]+)\)/.exec(d.centroide_ll); if (!mm) throw 0;
    loadAerial(+mm[2], +mm[1], d.weergavenaam || naam);
  }).catch(() => hint('Locatie kon niet worden opgehaald. Controleer je verbinding of probeer later opnieuw.', true));
}
function loadAerial(lat, lon, naam, saved) {
  const z = 20, N = 7, n = Math.pow(2, z);
  const xf = (lon + 180) / 360 * n, yr = lat * Math.PI / 180, yf = (1 - Math.log(Math.tan(yr) + 1 / Math.cos(yr)) / Math.PI) / 2 * n;
  const cx = Math.floor(xf), cy = Math.floor(yf), x0 = cx - (N >> 1), y0 = cy - (N >> 1);
  const mpp = 156543.03392 * Math.cos(yr) / n;  // meter per pixel (ware grootte)
  const cv = document.createElement('canvas'); cv.width = cv.height = N * 256; const g = cv.getContext('2d'); g.fillStyle = '#6f7f52'; g.fillRect(0, 0, cv.width, cv.height);
  let done = 0, ok = 0;
  const finish = () => {
    if (!st) return;
    if (!ok) { hint('Luchtfoto niet beschikbaar (alleen voor adressen in Nederland, en alleen op nmkliving.com). Je kunt de woning wel op een neutrale ondergrond plaatsen.', true); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const size = N * 256 * mpp;
    // middelpunt van de luchtfoto t.o.v. het adres (adres = oorsprong)
    const offX = ((x0 + N / 2) - xf) * 256 * mpp, offZ = ((y0 + N / 2) - yf) * 256 * mpp;
    if (st.aerial) st.scene.remove(st.aerial);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: t, roughness: 1 }));
    pl.rotation.x = -Math.PI / 2; pl.position.set(offX, .005, offZ); pl.receiveShadow = true; st.scene.add(pl); st.aerial = pl;
    st.env.visible = false; st.scene.fog.far = 2000; setNight(false);
    st.locBase = { lat, lon, adres: naam, mpp };
    st.house.position.set(saved && saved.dx || 0, 0, saved && saved.dz || 0); st.house.rotation.y = saved && saved.rot ? -saved.rot * Math.PI / 180 : 0;
    if (!st.foot) { const L2 = st.L, pts = [[-L2 / 2, -W / 2], [L2 / 2, -W / 2], [L2 / 2, W / 2], [-L2 / 2, W / 2], [-L2 / 2, -W / 2]].map(q => new THREE.Vector3(q[0], .06, q[1])); st.foot = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xe9c88c })); st.house.add(st.foot); }
    enableDrag(); setLocView('top'); locChanged();
    if (ok) hint('Sleep de woning naar de gewenste plek en draai haar met ⟲ ⟳. Afmetingen zijn op ware schaal.');
  };
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { g.drawImage(im, i * 256, j * 256); ok++; if (++done === N * N) finish(); };
    im.onerror = () => { if (++done === N * N) finish(); };
    im.src = PDOK_TILE(z, x0 + i, y0 + j);
  }
}
function restoreEnv() { if (st.aerial) { st.scene.remove(st.aerial); st.aerial = null; } st.env.visible = true; st.house.position.set(0, 0, 0); st.house.rotation.y = 0; st.scene.fog.far = 220; disableDrag(); }
function setLocView(v) {
  if (st.mode !== 'locatie') return;
  st.root.querySelectorAll('[data-act=top],[data-act=persp]').forEach(b => b.classList.toggle('on', b.dataset.act === v));
  const C = st.controls, hp = st.house.position;
  if (v === 'top') { C.minPolarAngle = 0; C.maxPolarAngle = .01; C.rotateSpeed = .5; fly([hp.x, Math.max(st.L, 8) * 3.2 + 10, hp.z + .01], [hp.x, 0, hp.z], 700); }
  else { C.minPolarAngle = .2; C.maxPolarAngle = 1.45; C.rotateSpeed = .8; fly([hp.x + st.L * .9 + 6, 9, hp.z + st.L + 10], [hp.x, FY + 1, hp.z], 900); }
}
function enableDrag() {
  if (st.dragOn) return; st.dragOn = true;
  const cv = st.root.querySelector('canvas'), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), v = new THREE.Vector2(), hit = new THREE.Vector3();
  let drag = null;
  const pos = e => { const r = cv.getBoundingClientRect(); v.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(v, st.camera); };
  st.dragDown = e => { if (st.mode !== 'locatie') return; pos(e); const hits = ray.intersectObject(st.house, true); if (!hits.length) return; ray.ray.intersectPlane(plane, hit); drag = hit.clone().sub(st.house.position); st.controls.enabled = false; cv.setPointerCapture(e.pointerId); };
  st.dragMove = e => { if (!drag) return; pos(e); if (ray.ray.intersectPlane(plane, hit)) { st.house.position.set(hit.x - drag.x, 0, hit.z - drag.z); } };
  st.dragUp = () => { if (!drag) return; drag = null; st.controls.enabled = true; locChanged(); };
  cv.addEventListener('pointerdown', st.dragDown, true); cv.addEventListener('pointermove', st.dragMove); cv.addEventListener('pointerup', st.dragUp); cv.addEventListener('pointercancel', st.dragUp);
}
function disableDrag() { if (!st.dragOn) return; const cv = st.root.querySelector('canvas'); cv.removeEventListener('pointerdown', st.dragDown, true); cv.removeEventListener('pointermove', st.dragMove); cv.removeEventListener('pointerup', st.dragUp); st.dragOn = false; }
function locData() {
  const b = st.locBase; if (!b) return null; const p = st.house.position;
  const lat = b.lat - p.z / 111320, lon = b.lon + p.x / (111320 * Math.cos(b.lat * Math.PI / 180));
  let rot = Math.round(-st.house.rotation.y * 180 / Math.PI) % 360; if (rot < 0) rot += 360;
  return { adres: b.adres, lat: +lat.toFixed(6), lon: +lon.toFixed(6), rot, dx: +p.x.toFixed(2), dz: +p.z.toFixed(2), afmeting: nl(st.L) + ' × ' + nl(W) + ' m', m2: st.cfg.model.m2 };
}
function locChanged() { const d = locData(); if (d) { const t = st.root.querySelector('.v3-title span'); t.textContent = `${d.afmeting} · ${d.m2} m² · ${d.adres} · ${d.rot}°`; } }
function saveLoc() { const d = locData(); if (!d) { hint('Zoek eerst een adres.', true); return; } if (st.cfg.onLocation) st.cfg.onLocation(d); hint('Locatie opgeslagen. Hij wordt meegestuurd met je offerteaanvraag.'); }

/* ---------------------------------------------------------------- loop */
function loop() {
  if (!st) return;
  st.raf = requestAnimationFrame(loop);
  const now = performance.now();
  if (st.flying) st.flying(now);
  if (st.fire) { const f = 1 + Math.sin(now * .013) * .12 + Math.sin(now * .031) * .08; st.fire[0].scale.set(1, f, 1); st.fire[1].intensity = (st.night ? 4 : 1.2) * f; }
  st.controls.update();
  st.renderer.render(st.scene, st.camera);
  placeLabels();
}
