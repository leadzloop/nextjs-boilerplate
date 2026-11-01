/* NMK Living – 3D-woning: buiten, binnen en op locatie (ware schaal: lengte = m² ÷ 4, breedte 4,00 m) */
import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';
import { RoomEnvironment } from './RoomEnvironment.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { GTAOPass } from './GTAOPass.js';
import { OutputPass } from './OutputPass.js';
import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js';

const W = 4.0, H = 2.6, FY = 0.45, T = 0.14, PANO_ROT = 126 * Math.PI / 180;           // breedte, binnenhoogte, vloerhoogte, wanddikte
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
    <div class="v3-stage"><canvas></canvas><div class="v3-labels"></div><div class="v3-pins"></div><div class="v3-hint"></div><div class="v3-load">3D-model laden…</div></div>
    <div class="v3-bar">
      <div class="v3-grp v3-g-buiten"><button data-act="day" class="on">Dag</button><button data-act="night">Avond</button><button data-act="dims" class="on">Maten</button><button data-act="pins" class="on">Labels</button><button data-act="tour">▶ Rondleiding</button></div>
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
    if (a === 'pins') { st.showPins = st.showPins === false; b.classList.toggle('on', st.showPins); st.dirty = 2; }
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
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  st.mobile = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || window.innerWidth < 820;
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, st.mobile ? 1.5 : 2));
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  st.renderer = r;
  try { RectAreaLightUniformsLib.init(); st.rectOK = true; } catch (e) { st.rectOK = false; }
  st.scene = new THREE.Scene();
  st.camera = new THREE.PerspectiveCamera(50, 1, 0.05, 2000);
  // fotorealistische nabewerking (ambient occlusion) zodra het beeld stilstaat
  if (/[?&]v3debug/.test(location.search)) window.__v3 = st;
  try {
    if (/[?&]noao/.test(location.search)) throw 0;
    const comp = new EffectComposer(r); comp.addPass(new RenderPass(st.scene, st.camera));
    const ao = new GTAOPass(st.scene, st.camera, 512, 512); ao.output = GTAOPass.OUTPUT.Default; ao.blendIntensity = 1;
    ao.updateGtaoMaterial({ radius: .45, distanceExponent: 1.4, thickness: 1.2, scale: 1.6, samples: st.mobile ? 8 : 16 });
    ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: st.mobile ? 8 : 16 });
    comp.addPass(ao); comp.addPass(new OutputPass()); st.composer = comp; st.ao = ao;
  } catch (e) { st.composer = null; }
  st.lastChange = 0; st.hqDone = false;
  st.controls = new OrbitControls(st.camera, canvas);
  st.controls.enableDamping = true; st.controls.dampingFactor = 0.08;
  st.dirty = 3; st.controls.addEventListener('change', () => { st.dirty = 2; st.lastChange = performance.now(); st.hqDone = false; });
  st.loader = new THREE.TextureLoader(); st.texCache = {};
  st.onResize = () => { st && (st.dirty = 3); const s = st.root.querySelector('.v3-stage'); const w = s.clientWidth, h = s.clientHeight; r.setSize(w, h, false); if (st.composer) { st.composer.setPixelRatio(r.getPixelRatio()); st.composer.setSize(w, h); } st.camera.aspect = w / h; st.camera.updateProjectionMatrix(); st.hqDone = false; };
  window.addEventListener('resize', st.onResize); st.onResize();
  let pending = 0; st.mgrPending = () => pending;
  THREE.DefaultLoadingManager.onStart = () => { pending++; };
  THREE.DefaultLoadingManager.onLoad = () => { pending = 0; const l = st && st.root.querySelector('.v3-load'); if (l) l.style.display = 'none'; };
  setTimeout(() => { const l = st && st.root.querySelector('.v3-load'); if (l) l.style.display = 'none'; }, 6000);
}
function tex(key, rx, ry, rot) {
  const url = (st.cfg.img || {})[key]; if (!url) return null;
  let base = st.texCache[url];
  if (!base) { base = st.loader.load(url); base.colorSpace = /^(hw_|lam_)/.test(key) ? THREE.NoColorSpace : THREE.SRGBColorSpace; st.texCache[url] = base; }
  const t = base.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); if (rot) { t.rotation = rot; t.center.set(.5, .5); }
  t.anisotropy = 8; t.needsUpdate = true;
  // kloon deelt de afbeelding; update wanneer geladen
  if (!base.image) { const iv = setInterval(() => { if (base.image) { t.image = base.image; t.needsUpdate = true; clearInterval(iv); } }, 120); }
  return t;
}
const mat = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: .8, metalness: 0 }, o));
function worldUV(geo, w, h, d, t) { const uv = geo.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); } uv.needsUpdate = true; }
function box(w, h, d, m, x, y, z, parent, cast = true) { const geo = new THREE.BoxGeometry(w, h, d), wm = (Array.isArray(m) ? m : [m]).find(q => q && q.userData && q.userData.world); if (wm) worldUV(geo, w, h, d, wm.userData.world); const g = new THREE.Mesh(geo, m); g.position.set(x, y, z); g.castShadow = cast; g.receiveShadow = true; (parent || st.house).add(g); return g; }

/* ---------------------------------------------------------------- scene */
const GEVELS = [ // type, kleur
  { t: 'panel', c: 0x3a3d3f, m: .55, r: .45 }, { t: 'panel', c: 0x161718, m: .5, r: .4 }, { t: 'wood', c: 0xb07a4a },
  { t: 'panel', c: 0x4c5a3b, m: .35, r: .55 }, { t: 'wood', c: 0xd2a874 }, { t: 'panel', c: 0xa9adb0, m: .9, r: .3 }];

function rbox(w, h, d, r, m, x, y, z, parent, cast = true) {
  const g = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)), m);
  g.position.set(x, y, z); g.castShadow = cast; g.receiveShadow = true; (parent || st.house).add(g); return g;
}
function grassTex() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d');
  g.fillStyle = '#5d6e42'; g.fillRect(0, 0, 512, 512); const r = mulberry(3);
  for (let i = 0; i < 26000; i++) { const v = 70 + r() * 70 | 0; g.fillStyle = `rgba(${v * .75 | 0},${v | 0},${v * .5 | 0},.35)`; g.fillRect(r() * 512, r() * 512, 1.5, 3 + r() * 4); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(60, 60); t.anisotropy = 8; return t;
}

function buildScene() {
  const c = st.cfg, m = c.model, L = m.m2 / W; st.L = L;
  const sc = st.scene;
  st.house = new THREE.Group(); sc.add(st.house);
  st.env = new THREE.Group(); sc.add(st.env); st.deco = new THREE.Group(); st.env.add(st.deco);
  st.nightLights = []; st.emissives = []; st.rooms = []; st.anchors = {};

  // realistische reflecties
  const pmrem = new THREE.PMREMGenerator(st.renderer);
  sc.environment = pmrem.fromScene(new RoomEnvironment(st.renderer), .04).texture;
  // echte 360°-foto als uitzicht en als lichtbron (reflecties)
  const pu = (c.img || {})[c.pano || 'pano_day'];
  if (pu) {
    const geo = new THREE.SphereGeometry(300, 96, 48); geo.scale(-1, 1, 1);
    st.pano = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, depthWrite: false, toneMapped: false }));
    st.pano.rotation.y = PANO_ROT; st.pano.visible = false; st.pano.userData.noAO = true; st.pano.renderOrder = -1; sc.add(st.pano);
    new THREE.TextureLoader().load(pu, t => { if (!st) return; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; st.pano.material.map = t; st.pano.material.needsUpdate = true;
      const t2 = t.clone(); t2.mapping = THREE.EquirectangularReflectionMapping; t2.needsUpdate = true;
      const envRT = pmrem.fromEquirectangular(t2); st.panoEnv = envRT.texture; applyEnv(); st.dirty = 3; st.hqDone = false; });
  }

  st.hemi = new THREE.HemisphereLight(0xdfeaf5, 0x5b5040, 0.55); sc.add(st.hemi);
  st.sun = new THREE.DirectionalLight(0xfff0d8, 3.0); st.sun.position.set(-L * .3 - 3, 9, 14); st.sun.castShadow = true;
  const s = Math.max(L, 10) * .9; Object.assign(st.sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 });
  st.sun.shadow.mapSize.set(st.mobile ? 1024 : 2048, st.mobile ? 1024 : 2048); st.sun.shadow.bias = -0.0003; st.sun.shadow.normalBias = .02; st.sun.shadow.radius = 3;
  sc.add(st.sun); sc.add(st.sun.target);

  // omgeving: gras, grindpad, rotsen, dennen, bergen
  const ground = new THREE.Mesh(new THREE.CircleGeometry(170, 64), mat({ map: tex('grass_real', 150, 150) || grassTex(), roughness: 1, envMapIntensity: .5 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; st.env.add(ground);
  const gravel = new THREE.Mesh(new THREE.PlaneGeometry(L + 3, 7.5), mat({ map: tex('fl3', (L + 3) / 2.5, 3), color: 0xa8a49b, roughness: 1 }));
  gravel.rotation.x = -Math.PI / 2; gravel.position.set(0, .012, 1.0); gravel.receiveShadow = true; st.env.add(gravel);
  const rnd = mulberry(11), rockM = mat({ map: tex('gv6', 1, 1), color: 0x8a8781, roughness: .95 });
  for (let i = 0; i < 14; i++) { const r = .25 + rnd() * .7, a = rnd() * Math.PI * 2, d = Math.max(L, 6) * .55 + 2.5 + rnd() * 6;
    const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), rockM); rk.scale.set(1.3, .6 + rnd() * .3, 1); rk.position.set(Math.cos(a) * d, r * .25, Math.sin(a) * d * .8 + 1.5); rk.rotation.y = rnd() * 6; rk.castShadow = rk.receiveShadow = true; st.deco.add(rk); }
  const trunk = mat({ color: 0x4a3a2a, roughness: 1 }), leafs = [mat({ color: 0x23392a, roughness: 1 }), mat({ color: 0x2c4631, roughness: 1 }), mat({ color: 0x1c3024, roughness: 1 })];
  for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI * 2, d = Math.max(L, 8) * .75 + 9 + rnd() * 55, x = Math.cos(a) * d, z = Math.sin(a) * d - 8; if (z > 5 && Math.abs(x) < L + 6) continue; const h = 8 + rnd() * 12;
    const tr = new THREE.Group(); box(.4, 2, .4, trunk, 0, 1, 0, tr); const lm = leafs[i % 3];
    for (let k = 0; k < 6; k++) { const rr = h * .26 * (1 - k * .14), cn = new THREE.Mesh(new THREE.ConeGeometry(rr, h * .26, 9), lm); cn.position.y = 1.6 + k * h * .13; cn.rotation.y = rnd(); cn.castShadow = true; tr.add(cn); }
    tr.position.set(x, 0, z); st.deco.add(tr); }
  const bgT = tex(c.backdrop || 'bg_mtn', 1, 1);
  if (bgT) { bgT.wrapS = THREE.RepeatWrapping; bgT.repeat.set(2, 1);
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(150, 150, 34, 64, 1, true), new THREE.MeshBasicMaterial({ map: bgT, side: THREE.BackSide, fog: false, transparent: true, depthWrite: false }));
    cyl.position.y = 14; st.deco.add(cyl); st.backdrop = cyl; }
  st.skyDay = gradTex(['#8fb4d8', '#d4e3ee', '#f1eadf']); st.skyNight = gradTex(['#0b1224', '#2b2342', '#b8683a']);
  sc.background = st.skyDay; sc.fog = new THREE.Fog(0xd4e3ee, 70, 260);

  buildHouse(L);
  st.house.traverse(o => { if (o.material && !Array.isArray(o.material) && o.material.transparent) o.userData.noAO = true; });
  buildDims(L);
  buildPicks();
  refreshLabels();
  setNight(false);
}
function gradTex(cols) { const cv = document.createElement('canvas'); cv.width = 2; cv.height = 256; const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, 2, 256); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* gevelbekleding: echte latten (hout) of staande naden (metaal/paneel) */
function clad(len, hgt, cx, cy, cz, rotY) {
  const g = GEVELS[st.cfg.gevelIdx || 0], grp = new THREE.Group(); grp.position.set(cx, cy, cz); grp.rotation.y = rotY; st.house.add(grp);
  if (g.t === 'wood') {
    const back = mat({ color: 0x1a1612, roughness: 1 }); box(len, hgt, .02, back, 0, 0, -.01, grp, false);
    const wm = mat({ map: tex(st.cfg.gevelIdx === 4 ? 'gv4' : 'gv2', .25, 1.4), color: g.c, roughness: .7 });
    const w = .055, gap = .022, n = Math.floor(len / (w + gap));
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(w, hgt, .035), wm, n); const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) { o.position.set(-len / 2 + (i + .5) * (len / n), 0, .02); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
    im.castShadow = true; im.receiveShadow = true; grp.add(im);
  } else {
    const pm = mat({ color: g.c, metalness: g.m, roughness: g.r, envMapIntensity: 1 });
    box(len, hgt, .03, pm, 0, 0, 0, grp);
    const n = Math.floor(len / .5); const seam = new THREE.InstancedMesh(new THREE.BoxGeometry(.018, hgt, .025), pm, n); const o = new THREE.Object3D();
    for (let i = 1; i < n; i++) { o.position.set(-len / 2 + i * len / n, 0, .025); o.updateMatrix(); seam.setMatrixAt(i, o.matrix); }
    seam.castShadow = true; grp.add(seam);
  }
  return grp;
}

function buildHouse(L) {
  st.glassEnd = false;
  const c = st.cfg, k = c.keys, o = c.opts || {}, x0 = -L / 2, x1 = L / 2, z0 = -W / 2, z1 = W / 2, top = FY + H;
  const wandM = mat({ map: tex(k.wand, 1, 1), roughness: .85 }); wandM.userData.world = 1.2;
  if (k.wand === 'gv4') { wandM.bumpMap = tex('lam_bump', 1, 1); wandM.bumpScale = 3; }
  const inner = mat({ color: 0x2a2725, roughness: .9 });
  const frame = mat({ color: 0x111213, roughness: .35, metalness: .7, envMapIntensity: 1 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xc9dbe6, transparent: true, opacity: .14, roughness: .02, metalness: .9, envMapIntensity: 1.6, depthWrite: false, side: THREE.DoubleSide });
  st.glassM = glass;
  const stone = mat({ map: tex('gv6', L / 1.5, .4), color: 0x6c6a66, roughness: .95 });

  // sokkel, vloer, plafond, dak met houten onderzijde en spots
  box(L - .25, FY, W - .25, stone, 0, FY / 2, 0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L - T, W - T), mat({ map: tex(k.vloer, L / 1.4, W / 1.4), roughnessMap: tex('hw_rough', L / 2.2, W / 1.1), bumpMap: tex('hw_bump', L / 2.2, W / 1.1), bumpScale: .35, roughness: .9, envMapIntensity: .75 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FY + .002; floor.receiveShadow = true; st.house.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(L - T, W - T), mat({ map: tex(k.plafond, L / 1.6, W / 1.6), roughness: .85, side: THREE.DoubleSide }));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = top - .002; st.house.add(ceil);
  const soffit = mat({ map: tex(k.plafond === 't_wit' ? 'fl0' : k.plafond, (L + 1) / 1.6, (W + 1) / 1.6), roughness: .8 });
  const roofTop = mat({ color: 0x1c1d1e, roughness: .9 });
  box(L + 1.0, .34, W + 1.0, [frame, frame, roofTop, soffit, frame, frame], 0, top + .17, 0);
  // inbouwspots in de overstek (zoals op de foto's)
  for (let i = 0; i < Math.round(L / 1.6); i++) { const x = x0 + .8 + i * (L - 1.6) / Math.max(1, Math.round(L / 1.6) - 1); const sm = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd39a, emissiveIntensity: 0 }); st.emissives.push([sm, 4]);
    const d = new THREE.Mesh(new THREE.CircleGeometry(.05, 16), sm); d.rotation.x = Math.PI / 2; d.position.set(x, top - .001, z1 + .3); st.house.add(d);
    const sl = new THREE.SpotLight(0xffc98a, 0, 5, .7, .6, 1.5); sl.position.set(x, top - .02, z1 + .3); sl.target.position.set(x, 0, z1 + .9); st.house.add(sl); st.house.add(sl.target); st.nightLights.push([sl, 6]); }

  // gevels
  box(L, H, T, [inner, inner, inner, inner, wandM, inner], 0, FY + H / 2, z0 + T / 2);
  clad(L + .02, H, 0, FY + H / 2, z0 - .02, Math.PI);
  box(T, H, W, [wandM, inner, inner, inner, inner, inner], x0 + T / 2, FY + H / 2, 0);
  clad(W + .02, H, x0 - .02, FY + H / 2, 0, -Math.PI / 2);

  // indeling: slaapkamer 2,0 | badkamer 1,0 | wc 0,8 | [slaapkamers 2,4] | woonkamer + keuken
  const LAY = c.model.layout || null;
  const zero = !LAY && (c.model.beds || 0) === 0, beds = zero ? 0 : c.model.beds, xs = [x0]; const add = w => xs.push(xs[xs.length - 1] + w);
  if (LAY) { const sw = LAY.reduce((a, r) => a + r.w, 0), f = L / sw; LAY.forEach(r => add(r.w * f)); } else if (zero) { add(1.5); add(1.5); } else { add(2.0); add(1.0); add(0.8); for (let i = 1; i < beds; i++) add(2.4); }
  st.zero = zero; st.layout = LAY; st.xLiveEnd = undefined;
  let xLive = xs[xs.length - 1];
  if (LAY) { const li = LAY.findIndex(r => r.t === 'live'); xLive = xs[li]; st.xLiveEnd = xs[li + 1]; st.layX = xs; }
  st.xLive = xLive; st.xs = xs;
  const zc = .6;
  const tile = mat({ map: tex(c.bad === 0 ? 'fl3' : 'gv6', 1.4, 1.8), color: c.bad === 2 ? 0x5a524a : c.bad === 1 ? 0x3a3a3c : 0xb9b6b0, roughness: .35, envMapIntensity: .8 });
  st.tileM = tile;
  const part = (x, za, zb, m1, m2) => box(.1, H, zb - za, [m2 || m1, m1, m1, m1, m1, m1], x, FY + H / 2, (za + zb) / 2);
  const partZ = (z, xa, xb, m1, m2) => box(xb - xa, H, .1, [m1, m1, m1, m1, m2 || m1, m1], (xa + xb) / 2, FY + H / 2, z);
  if (LAY) {
    // vaste indeling per model (bijv. Aurora 42); 0,90 m looppad langs de glazen voorgevel
    const dW = LAY.find(r => r.d), gz = dW ? z0 + dW.d : z1 - .9; st.gz = gz;
    for (let i = 1; i < LAY.length; i++) { const a = LAY[i - 1].t, b = LAY[i].t, wet = t => t === 'douche' || t === 'toilet';
      if ((a === 'live' || b === 'live') && !(dW && (wet(a) || wet(b)))) part(xs[i], z0 + T, z1 - 1.5, wet(a) ? tile : wandM, wet(b) ? tile : wandM);
      else part(xs[i], z0 + T, gz, wet(a) ? tile : wandM, wet(b) ? tile : wandM); }
    LAY.forEach((r, i) => { if (r.t === 'douche' || r.t === 'toilet') { box(xs[i + 1] - xs[i] - .1, H - .01, .01, tile, (xs[i] + xs[i + 1]) / 2, FY + H / 2, z0 + T + .006, null, false); partZ(gz, xs[i] + .05, xs[i] + .2, wandM, tile); partZ(gz, xs[i + 1] - .2, xs[i + 1] - .05, wandM, tile); } });
  } else if (zero) {
    // Aurora 24: douche 1,50 x 3,00 en toilet 1,50 x 3,00 achter de glazen voorgevel, gang 1,00 m aan de achterzijde
    const zh = z0 + 1.0; st.zh = zh;
    part(xs[1], zh, z1 - .05, tile); part(xs[2], zh, z1 - .05, tile, wandM);
    partZ(zh, x0 + T, x0 + .3, wandM, tile); partZ(zh, x0 + 1.1, xs[1] + .2, wandM, tile); partZ(zh, xs[1] + .9, xs[2] + .05, wandM, tile);
    box(.01, H - .01, z1 - zh - .1, tile, x0 + T + .006, FY + H / 2, (zh + z1) / 2, null, false);
  } else {
  part(xs[1], z0 + T, .7, tile, wandM); part(xs[1], 1.55, z1 - T, wandM);
  part(xs[2], z0 + T, zc, tile); part(xs[3], z0 + T, zc, wandM, tile);
  partZ(zc, xs[1], xs[1] + .15, wandM, tile); partZ(zc, xs[1] + .85, xs[2] + .05, wandM, tile); partZ(zc, xs[2], xs[2] + .1, wandM, tile); partZ(zc, xs[2] + .7, xs[3] + .05, wandM, tile);
  box(xs[2] - xs[1] - .1, H - .01, .01, tile, (xs[1] + xs[2]) / 2, FY + H / 2, z0 + T + .006, null, false);
  box(xs[3] - xs[2] - .1, H - .01, .01, tile, (xs[2] + xs[3]) / 2, FY + H / 2, z0 + T + .006, null, false);
  for (let i = 1; i < beds; i++) { const xa = xs[3 + i]; part(xa, z0 + T, .8, wandM); part(xa, 1.6, z1 - T, wandM); }
  }
  const door = mat({ color: 0x141516, roughness: .3, metalness: .6, envMapIntensity: 1 });
  if (!zero && !LAY) {
  // entreegevel met deur
  const fa = xs[1], fb = xs[3];
  box(fb - fa, H, T, [inner, inner, inner, inner, inner, wandM], (fa + fb) / 2, FY + H / 2, z1 - T / 2);
  clad(fb - fa, H, (fa + fb) / 2, FY + H / 2, z1 + .02, 0);
  box(1.0, 2.2, .06, door, (fa + fb) / 2, FY + 1.1, z1 + .07);
  box(.03, .9, .04, mat({ color: c.kraan === 1 ? 0xc8a463 : 0x2b2b2b, metalness: 1, roughness: .25 }), (fa + fb) / 2 + .38, FY + 1.05, z1 + .12);
  st.anchors.slot = new THREE.Vector3((fa + fb) / 2 + .38, FY + 1.1, z1 + .15);
  }
  // glasgevels met slanke zwarte kozijnen
  const glassRun = (xa, xb, z) => { const len = xb - xa, n = Math.max(1, Math.round(len / 1.4)); const g = new THREE.Mesh(new THREE.PlaneGeometry(len, H), glass); g.position.set((xa + xb) / 2, FY + H / 2, z); st.house.add(g);
    for (let i = 0; i <= n; i++) box(.06, H, .1, frame, xa + len * i / n, FY + H / 2, z);
    box(len, .07, .12, frame, (xa + xb) / 2, FY + .035, z); box(len, .07, .12, frame, (xa + xb) / 2, top - .035, z); };
  if (LAY) { for (let i = 0; i < LAY.length; i++) glassRun(xs[i], xs[i + 1], z1 - .05);
    box(.04, .9, .03, mat({ color: c.kraan === 1 ? 0xc8a463 : 0x2b2b2b, metalness: 1, roughness: .25 }), xLive + .25, FY + 1.05, z1 + .02); st.anchors.slot = new THREE.Vector3(xLive + .25, FY + 1.1, z1 + .05); }
  else if (zero) { glassRun(x0, xs[1], z1 - .05); glassRun(xs[1], xs[2], z1 - .05); glassRun(xLive, x1, z1 - .05);
    box(.04, .9, .03, mat({ color: c.kraan === 1 ? 0xc8a463 : 0x2b2b2b, metalness: 1, roughness: .25 }), xLive + .25, FY + 1.05, z1 + .02); st.anchors.slot = new THREE.Vector3(xLive + .25, FY + 1.1, z1 + .05); }
  else { glassRun(x0, xs[1], z1 - .05);
  if (beds > 1) glassRun(xs[3], xLive, z1 - .05);
  glassRun(xLive, x1, z1 - .05); }
  if (LAY && LAY[LAY.length - 1].t !== 'live') { // dichte kopgevel bij een slaapkamer aan het eind
    box(T, H, W, [inner, inner, inner, inner, inner, inner], x1 - T / 2, FY + H / 2, 0);
    box(.01, H - .01, W - T - .1, wandM, x1 - T - .006, FY + H / 2, -.05, null, false);
    clad(W + .02, H, x1 + .02, FY + H / 2, 0, Math.PI / 2);
  } else {
  st.glassEnd = true;
  const gEnd = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glass); gEnd.rotation.y = Math.PI / 2; gEnd.position.set(x1 - .05, FY + H / 2, 0); st.house.add(gEnd);
  for (let i = 0; i <= 2; i++) box(.1, H, .06, frame, x1 - .05, FY + H / 2, z0 + W * i / 2); }
  st.anchors.triple = new THREE.Vector3((xLive + x1) / 2, FY + H * .7, z1);

  // daglicht door de glazen gevels (zacht vlakke lichtbron, zoals echt raamlicht)
  st.winLights = [];
  if (st.rectOK) {
    const wl = (w, h, x, y, z, tx, tz) => { const l = new THREE.RectAreaLight(0xf3f6ff, 0, w, h); l.position.set(x, y, z); l.lookAt(tx, y, tz); st.house.add(l); st.winLights.push(l); };
    wl(L - .3, H - .15, 0, FY + H / 2, z1 - .08, 0, z0);
    if (st.glassEnd) wl(W - .3, H - .15, x1 - .08, FY + H / 2, 0, x0, 0);
  }
  // LED-strips rondom het plafond (zoals op de foto's)
  const led = new THREE.MeshStandardMaterial({ color: 0x333333, emissive: c.stijl === 1 ? 0xffe0b8 : 0xffc37a, emissiveIntensity: 0 }); st.emissives.push([led, 3]);
  box(L - .3, .02, .02, led, 0, top - .05, z0 + T + .04, null, false); box(.02, .02, W - .3, led, x1 - .2, top - .05, 0, null, false);
  box(L - .3, .02, .02, led, 0, top - .05, z1 - .2, null, false);
  st.anchors.dim = new THREE.Vector3((xLive + x1) / 2, top - .1, z0 + .3);

  const fill = new THREE.PointLight(0xfff1e0, 0, 14, 1.2); fill.position.set((xLive + x1) / 2, FY + H - .3, .3); st.house.add(fill); st.fill = fill;
  const fill2 = new THREE.PointLight(0xfff1e0, 0, 9, 1.2); fill2.position.set(x0 + 1, FY + H - .3, .3); st.house.add(fill2); st.fill2 = fill2;

  furnish(L, xs, xLive, zc, o);
  exterior(L, o);

  const xe = st.xLiveEnd !== undefined ? st.xLiveEnd : x1;
  st.rooms = [
    ['Woonkamer', [xLive + .3, FY + 1.5, z1 - .3], [xe - .3, FY + 1.0, z0 + .4]],
    ['Keuken', [xe - .45, FY + 1.6, z1 - .45], [xLive + .9, FY + 1.1, z0 + .3]],
  ];
  if (LAY) { LAY.forEach((r, i) => { const xa = xs[i], xb = xs[i + 1], cx = (xa + xb) / 2;
    if (r.t === 'bed') st.rooms.push([r.label, [i ? xb - .35 : xa + Math.min(2.6, xb - xa - .3), FY + 1.6, z1 - .35], [cx, FY + .6, z0 + .7]]);
    if (r.t === 'douche' || r.t === 'toilet') st.rooms.push([r.label, [cx, FY + 1.6, z1 - .3], [cx, FY + 1.1, z0]]); }); }
  else
  if (zero) { st.rooms.push(['Douche', [x0 + .75, FY + 1.6, st.zh + .25], [x0 + .75, FY + 1.1, z1]], ['Toilet', [xs[1] + .75, FY + 1.6, st.zh + .25], [xs[1] + .75, FY + .9, z1]]); }
  else st.rooms.push(['Slaapkamer', [x0 + 1.75, FY + 1.6, z1 - .35], [x0 + .7, FY + .6, z0 + .7]], ['Badkamer', [xs[1] + .5, FY + 1.6, zc + .55], [xs[1] + .45, FY + 1.0, z0 + .15]]);
  if (!LAY) for (let i = 1; i < beds; i++) { const bx = xs[2 + i]; st.rooms.push(['Slaapkamer ' + (i + 1), [bx + 2.1, FY + 1.6, z1 - .35], [bx + .9, FY + .6, z0 + .7]]); }
  if (o.terras) st.rooms.push(['Terras', [x1 + .2, FY + 1.6, z1 + 2.6], [xLive - 1, FY + 1.0, 0]]);
  const g = st.root.querySelector('.v3-g-binnen');
  g.innerHTML = st.rooms.map((r, i) => `<button data-act="room" data-room="${i}">${r[0]}</button>`).join('') + '<button data-act="night">Avond</button><button data-act="day" class="on">Dag</button>';
}

function furnish(L, xs, xLive, zc, o) {
  const c = st.cfg, x0 = -L / 2, x1 = L / 2, z0 = -W / 2, z1 = W / 2, f = FY, top = FY + H;
  const s3 = c.stijl; // 0 warm natuurlijk, 1 modern donker, 2 luxe hotel
  const linen = mat({ color: s3 === 1 ? 0x6a665f : 0xe9e2d6, roughness: 1 });
  const linen2 = mat({ color: s3 === 1 ? 0x3d3b38 : 0xcdbfa9, roughness: 1 });
  const throwM = mat({ color: s3 === 2 ? 0x6b4a32 : 0x8b8378, roughness: 1 });
  const woodM = mat({ map: tex(s3 === 1 ? 'fl1' : 'fl0', 1, 1), roughness: .55, envMapIntensity: .6 });
  const darkM = mat({ color: 0x1f2021, roughness: .4, metalness: .5, envMapIntensity: .8 });
  const gold = mat({ color: 0xcaa566, metalness: 1, roughness: .28, envMapIntensity: 1.2 });
  const accent = s3 === 2 ? gold : darkM;
  const white = mat({ color: 0xf4f3f0, roughness: .25, envMapIntensity: .7 });
  const pillow = mat({ color: 0xfaf8f4, roughness: 1 });
  [linen, linen2, throwM, pillow].forEach(m => { m.bumpMap = fabricBump(); m.bumpScale = 1.2; m.sheen = 1; });

  // slaapkamers
  const bedRooms = st.zero ? [] : [x0], bedW = [];
  if (st.layout) { bedRooms.length = 0; st.layout.forEach((r, i) => { if (r.t === 'bed') { bedRooms.push(xs[i]); bedW.push(r.w); } }); }
  else if (!st.zero) for (let i = 3; i < xs.length - 1; i++) bedRooms.push(xs[i]);
  bedRooms.forEach((bx, i) => {
    const w = bedW.length ? bedW[i] : (i === 0 ? 2.0 : 2.4), cx = bx + w / 2, bz = z0 + T + 1.05;
    rbox(1.66, .3, 2.06, .04, linen2, cx, f + .15, bz);
    rbox(1.58, .24, 1.98, .08, pillow, cx, f + .42, bz + .01);
    rbox(1.64, .1, 1.3, .05, linen, cx, f + .58, bz + .34);
    rbox(1.66, .05, .45, .02, throwM, cx, f + .64, bz + .62);
    rbox(.62, .16, .36, .07, pillow, cx - .38, f + .62, bz - .78); rbox(.62, .16, .36, .07, pillow, cx + .38, f + .62, bz - .78);
    rbox(.4, .28, .14, .06, linen2, cx, f + .62, bz - .62);
    rbox(1.95, 1.15, .08, .03, s3 === 2 ? mat({ color: 0x5e4b3a, roughness: 1 }) : linen2, cx, f + .82, z0 + T + .05);
    [-1, 1].forEach(sd => { const nx = cx + sd * 1.08; if (Math.abs(nx - bx - w / 2) > w / 2 - .05) return; rbox(.38, .45, .36, .03, woodM, nx, f + .225, z0 + T + .3); lampShade(nx, f + .45, z0 + T + .3); });
    if (o.gord) curtains(bx + .08, bx + w - .08, z1 - .16);
    if (o.bedpak) { rbox(1.4, .02, .8, .01, mat({ color: 0x9a8b78, roughness: 1 }), cx, f + .012, bz + 1.35, null, false); plant(bx + .3, z1 - .5, .7); }
    if (i === 0) st.anchors.bedpak = new THREE.Vector3(cx, f + .9, bz);
    if (i === 0) st.anchors.gord = new THREE.Vector3(bx + .2, f + 1.6, z1 - .2);
  });

  const tapM = c.kraan === 1 ? gold : darkM;
  if (st.layout) {
    st.layout.forEach((r, i) => { const xa = xs[i], xb = xs[i + 1], cx = (xa + xb) / 2, gz = st.gz;
      if (r.t === 'douche') {
        const dz = (z0 + T + gz) / 2;
        box(xb - xa - .2, .03, gz - z0 - .3, mat({ color: 0x2b2b2b, roughness: .4 }), cx, f + .015, dz);
        const rs3 = new THREE.Mesh(new THREE.CylinderGeometry(c.kraan === 2 ? .22 : .15, c.kraan === 2 ? .22 : .15, .02, 28), tapM); rs3.position.set(cx, f + 2.3, dz); st.house.add(rs3);
        box(.02, .25, .02, tapM, cx, f + 2.42, dz);
        const wm3 = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe0ff, emissiveIntensity: 0, transparent: true, opacity: .14, depthWrite: false }); st.emissives.push([wm3, 1.2]);
        const wat = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, 2.2, 16, 1, true), wm3); wat.position.set(cx, f + 1.2, dz); st.house.add(wat);
        const sg2 = new THREE.Mesh(new THREE.PlaneGeometry(xb - xa - .15, 2.0), st.glassM); sg2.position.set(cx, f + 1.0, gz - .05); st.house.add(sg2);
        st.anchors.bad = new THREE.Vector3(cx, f + 1.6, dz); st.anchors.kraan = new THREE.Vector3(cx, f + 2.3, dz);
      }
      if (r.t === 'toilet') {
        rbox(.38, .36, .55, .08, white, cx, f + .45, z0 + T + .35);
        box(.5, .7, .12, mat({ color: 0x3a3836, roughness: .6 }), cx, f + 1.05, z0 + T + .06);
        box(1.2, .04, .25, woodM, cx, f + 1.55, z0 + T + .13); const lt = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([lt, 3]); box(1.1, .015, .02, lt, cx, f + 1.52, z0 + T + .24, null, false);
        plant(cx - .35, z0 + T + .13, .35, f + 1.57);
        const vM = c.bad === 0 ? mat({ color: 0x3a3b3c, roughness: .5 }) : c.bad === 1 ? darkM : woodM;
        rbox(.6, .35, .4, .02, vM, cx, f + .7, gz - .35); rbox(.45, .1, .32, .04, white, cx, f + .92, gz - .35);
      }
    });
  } else if (st.zero) {
    // douche (voor, achter glas) met regendouche en nissen
    const dx = x0 + .75, dz = (st.zh + z1) / 2;
    box(1.3, .03, 2.6, mat({ color: 0x2b2b2b, roughness: .4 }), dx, f + .015, dz);
    const rs2 = new THREE.Mesh(new THREE.CylinderGeometry(c.kraan === 2 ? .22 : .15, c.kraan === 2 ? .22 : .15, .02, 28), tapM); rs2.position.set(dx, f + 2.3, dz); st.house.add(rs2);
    box(.02, .25, .02, tapM, dx, f + 2.42, dz); box(.02, 1.1, .02, tapM, x0 + T + .05, f + 1.2, dz - .2);
    const wm2 = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe0ff, emissiveIntensity: 0, transparent: true, opacity: .14, depthWrite: false }); st.emissives.push([wm2, 1.2]);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, 2.2, 16, 1, true), wm2); water.position.set(dx, f + 1.2, dz); st.house.add(water);
    const ledN = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([ledN, 3]);
    box(.02, .3, .5, ledN, x0 + T + .02, f + 1.35, dz - .4, null, false);
    st.anchors.bad = new THREE.Vector3(dx, f + 1.6, dz); st.anchors.kraan = new THREE.Vector3(dx, f + 2.3, dz);
    // toilet (hangend) met wastafel, plank met LED en plant
    const tx2 = xs[1] + .75, tz2 = z1 - 1.0;
    rbox(.38, .36, .55, .08, white, tx2, f + .45, (st.zh + .35));
    box(.5, .7, .12, mat({ color: 0x3a3836, roughness: .6 }), tx2, f + 1.05, st.zh + .11);
    box(.16, .1, .02, white, tx2, f + 1.15, st.zh + .18);
    box(1.2, .04, .25, woodM, tx2, f + 1.55, st.zh + .18); const ledT = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([ledT, 3]); box(1.1, .015, .02, ledT, tx2, f + 1.52, st.zh + .28, null, false);
    plant(tx2 - .3, st.zh + .18, .35, f + 1.57);
    const vanM = c.bad === 0 ? mat({ color: 0x3a3b3c, roughness: .5 }) : c.bad === 1 ? darkM : woodM;
    rbox(.6, .35, .4, .02, vanM, tx2, f + .7, z1 - .45); rbox(.45, .1, .32, .04, white, tx2, f + .92, z1 - .45);
  } else {
  // badkamer: inloopdouche, regendouche, wastafel, toilet
  const bx = xs[1];
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(.9, 2.0), st.glassM); sg.position.set(bx + .5, f + 1.0, z0 + T + .95); st.house.add(sg);
  box(.02, 2.0, .02, tapM, bx + .05, f + 1.0, z0 + T + .95);
  box(.9, .03, .85, mat({ color: 0x2b2b2b, roughness: .4 }), bx + .5, f + .015, z0 + T + .48);
  const rs = new THREE.Mesh(new THREE.CylinderGeometry(c.kraan === 2 ? .2 : .13, c.kraan === 2 ? .2 : .13, .02, 28), tapM); rs.position.set(bx + .5, f + 2.25, z0 + T + .4); st.house.add(rs);
  box(.02, .3, .02, tapM, bx + .5, f + 2.4, z0 + T + .4);
  if (c.bad === 2) { const lm = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffd7a0, emissiveIntensity: 0 }); st.emissives.push([lm, 3]); box(.02, 1.8, .02, lm, bx + .9, f + 1.1, z0 + T + .02, null, false); }
  rbox(.38, .4, .52, .08, white, bx + .7, f + .2, zc - .35);
  const vanM = c.bad === 0 ? mat({ color: 0x3a3b3c, roughness: .5 }) : c.bad === 1 ? darkM : woodM;
  rbox(.45, .4, .7, .02, vanM, bx + .25, f + .65, zc - 1.05);
  rbox(.38, .1, .5, .04, white, bx + .27, f + .9, zc - 1.05);
  box(.02, .2, .02, tapM, bx + .1, f + 1.0, zc - 1.05);
  const mirror = new THREE.Mesh(new THREE.CircleGeometry(.3, 32), mat({ color: 0xffffff, metalness: 1, roughness: .02, envMapIntensity: 1.5 })); mirror.rotation.y = Math.PI / 2; mirror.position.set(bx + .056, f + 1.55, zc - 1.05); st.house.add(mirror);
  st.anchors.bad = new THREE.Vector3(bx + .5, f + 1.6, z0 + T + .4); st.anchors.kraan = new THREE.Vector3(bx + .5, f + 2.25, z0 + T + .4);
  // wc
  rbox(.38, .4, .52, .08, white, xs[2] + .4, f + .2, z0 + T + .32);
  rbox(.3, .1, .22, .03, white, xs[2] + .55, f + .85, zc - .2);
  }

  { const x1 = st.xLiveEnd !== undefined ? st.xLiveEnd : L / 2;
  // keuken langs de achterwand
  const kLen = Math.min(3.4, (x1 - xLive) - 1.1), ka = xLive + .08, kb = ka + kLen, kz = z0 + T + .31;
  const front = c.keuken === 2 ? mat({ map: tex('fl5', .8, 1), roughness: .45, envMapIntensity: .6 }) : c.keuken === 1 ? mat({ color: 0x0f1011, roughness: .3, envMapIntensity: .6 }) : mat({ color: 0x3a3d40, roughness: .5 });
  const blad = c.keuken === 0 ? mat({ color: 0x55585b, roughness: .55 }) : mat({ map: tex('fl3', 1.2, .4), color: c.keuken === 2 ? 0xe2dccf : 0x8d8b88, roughness: .15, envMapIntensity: 1 });
  rbox(.64, 2.35, .62, .01, front, ka + .32, f + 1.175, kz);
  rbox(kLen - .64, .86, .62, .01, front, ka + .64 + (kLen - .64) / 2, f + .43, kz);
  box(kLen - .62, .04, .66, blad, ka + .64 + (kLen - .64) / 2, f + .88, kz + .02);
  box(kLen - .64, .62, .02, c.keuken === 0 ? mat({ color: 0x4a4b4c, roughness: .4 }) : mat({ map: tex('gv6', 2, .6), color: c.keuken === 2 ? 0xd8cfbf : 0x77736d, roughness: .25, envMapIntensity: 1 }), ka + .64 + (kLen - .64) / 2, f + 1.21, z0 + T + .012, null, false);
  if (c.keuken >= 1) box(kLen - .64, .03, .25, woodM, ka + .64 + (kLen - .64) / 2, f + 1.62, z0 + T + .13); else rbox(kLen - .64, .6, .36, .01, front, ka + .64 + (kLen - .64) / 2, f + 1.95, z0 + T + .18);
  const n = Math.max(2, Math.floor((kLen - .64) / .6)); for (let i = 0; i < n; i++) box(.3, .015, .02, c.keuken === 2 ? gold : darkM, ka + .64 + (kLen - .64) * (i + .5) / n, f + .78, kz + .32);
  const ledK = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([ledK, 3.5]);
  box(kLen - .7, .015, .02, ledK, ka + .64 + (kLen - .64) / 2, c.keuken >= 1 ? f + 1.6 : f + 1.64, z0 + T + .3, null, false);
  box(.5, .4, .02, mat({ color: 0x0a0a0a, roughness: .1, metalness: .4 }), ka + .32, f + 1.05, kz + .32, null, false); // oven (altijd)
  if (c.app >= 1) box(.5, .36, .02, mat({ color: 0x0a0a0a, roughness: .1, metalness: .4 }), ka + .32, f + 1.55, kz + .32, null, false);
  if (c.app >= 2) { const wm = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x6a8cff, emissiveIntensity: 0 }); st.emissives.push([wm, .8]); box(.5, .6, .02, wm, ka + .32, f + .45, kz + .32, null, false); }
  box(.56, .01, .48, mat({ color: 0x050505, roughness: .05, metalness: .2 }), kb - .5, f + .905, kz);  // kookplaat
  box(.45, .02, .38, darkM, ka + 1.35, f + .9, kz); box(.02, .3, .02, tapM, ka + 1.35, f + 1.05, kz - .2);  // spoelbak + kraan
  if (c.keuken === 2 && x1 - xLive > 4.2) { rbox(1.6, .88, .8, .01, front, ka + 1.7, f + .44, -.2); box(1.7, .05, .9, blad, ka + 1.7, f + .905, -.2); }
  st.anchors.keuken = new THREE.Vector3(ka + kLen / 2, f + 1.3, kz); st.anchors.app = new THREE.Vector3(ka + .32, f + 1.3, kz + .3);
  plant(ka + .9, kz - .05, .45, f + .9);

  const small = (x1 - xLive) < 6;
  if (small) {
    // compacte woonkamer (Aurora 24): ronde eettafel, rechte bank langs de kopgevel
    const rx = xLive + 1.0, rz = .55;
    const tt = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .04, 36), woodM); tt.position.set(rx, f + .75, rz); tt.castShadow = true; st.house.add(tt);
    const tl = new THREE.Mesh(new THREE.CylinderGeometry(.08, .22, .73, 20), darkM); tl.position.set(rx, f + .365, rz); tl.castShadow = true; st.house.add(tl);
    [0, 2.1, 4.2].forEach(a => { const ch = new THREE.Group(); ch.position.set(rx + Math.sin(a) * .62, f, rz + Math.cos(a) * .62); ch.rotation.y = a + Math.PI; st.house.add(ch);
      rbox(.44, .07, .44, .03, linen, 0, .46, 0, ch); rbox(.44, .4, .06, .03, linen, 0, .7, -.2, ch); [[-.18, -.18], [.18, -.18], [-.18, .18], [.18, .18]].forEach(q => box(.025, .44, .025, darkM, q[0], .22, q[1], ch)); });
    const ringM = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([ringM, 3]);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.42, .02, 8, 48), ringM); ring.rotation.x = Math.PI / 2; ring.position.set(rx, top - .6, rz); st.house.add(ring);
    const rp = new THREE.PointLight(0xffb469, 0, 6, 1.6); rp.position.set(rx, top - .7, rz); st.house.add(rp); st.nightLights.push([rp, 3]);
    const sx2 = x1 - .55;
    rbox(.9, .42, 2.4, .08, linen, sx2, f + .21, .15); rbox(.25, .45, 2.4, .08, linen, sx2 + .33, f + .62, .15);
    [[-.7], [.1], [.9]].forEach((p, i) => rbox(.14, .4, .5, .06, i % 2 ? linen2 : pillow, sx2 + .15, f + .62, .15 + p[0]));
    const ct = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .32, 32), woodM); ct.position.set(sx2 - .9, f + .16, .25); ct.castShadow = true; st.house.add(ct);
    rbox(1.6, .012, 1.8, .005, mat({ color: s3 === 1 ? 0x4b4844 : 0xd8ccb8, roughness: 1 }), sx2 - .5, f + .007, .2, null, false);
    plant(x1 - .3, z0 + T + .3, 1.1);
    if (o.gord) curtains(xLive + .15, x1 - .15, z1 - .16);
    if (o.screens) { const sm = new THREE.MeshStandardMaterial({ color: 0x232323, transparent: true, opacity: .62, roughness: 1, side: THREE.DoubleSide }); const scr = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, H * .5), sm); scr.position.set(0, FY + H - H * .25, z1 + .08); st.house.add(scr); }
    st.anchors.mpak = new THREE.Vector3(sx2, f + .9, .15); st.anchors.screens = new THREE.Vector3(0, FY + H * .8, z1 + .1); st.anchors.gord = new THREE.Vector3(x1 - .3, f + 1.6, z1 - .2);
    st.anchors.vloer = new THREE.Vector3(rx + .5, f + .05, 1.2); st.anchors.wand = new THREE.Vector3(x1 - 1.2, f + 1.7, z0 + T); st.anchors.plafond = new THREE.Vector3(rx + .5, top, .4); st.anchors.stijl = new THREE.Vector3(sx2 - .6, f + .7, .6);
    return;
  }
  // eettafel
  const tx = Math.min(kb + .15, x1 - 2.6) - .1, tz = .55;
  box(1.5, .05, .85, woodM, tx, f + .75, tz);
  [[-.65, -.35], [.65, -.35], [-.65, .35], [.65, .35]].forEach(p => box(.04, .73, .04, darkM, tx + p[0], f + .365, tz + p[1]));
  [[-.42, -.66, 0], [.42, -.66, 0], [-.42, .66, Math.PI], [.42, .66, Math.PI]].forEach(p => { const ch = new THREE.Group(); ch.position.set(tx + p[0], f, tz + p[1]); ch.rotation.y = p[2]; st.house.add(ch);
    rbox(.46, .07, .46, .03, linen2, 0, .46, 0, ch); rbox(.46, .42, .06, .03, linen2, 0, .7, -.21, ch); [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]].forEach(q => box(.025, .44, .025, darkM, q[0], .22, q[1], ch)); });
  pendant(tx - .35, top, tz); pendant(tx + .35, top, tz);

  // lounge: L-bank met kussens, salontafel, vloerkleed, staande lamp, plant
  const sx = x1 - .55;
  rbox(.95, .42, 2.5, .08, linen, sx, f + .21, -.35); rbox(.25, .45, 2.5, .08, linen, sx + .35, f + .62, -.35);
  rbox(2.2, .42, .95, .08, linen, sx - 1.5, f + .21, -1.12); rbox(2.2, .45, .25, .08, linen, sx - 1.5, f + .62, -1.48);
  [[sx, -.9], [sx, .2], [sx - 1.2, -1.15], [sx - 2.1, -1.15]].forEach((p, i) => rbox(.5, .4, .14, .06, i % 2 ? linen2 : pillow, p[0] + (i < 2 ? .22 : 0), f + .62, p[1] + (i < 2 ? 0 : -.18)));
  rbox(1.0, .04, .75, .015, s3 === 2 ? mat({ map: tex('gv6', 1, 1), roughness: .15, envMapIntensity: 1 }) : woodM, sx - 1.25, f + .38, -.2);
  box(.9, .34, .65, darkM, sx - 1.25, f + .17, -.2);
  rbox(2.6, .012, 2.0, .005, mat({ color: s3 === 1 ? 0x4b4844 : 0xbdb19c, roughness: 1 }), sx - 1.1, f + .007, -.45, null, false);
  lampShade(sx - 2.55, f + 1.45, -1.5, true);
  plant(x1 - .35, z1 - .45, 1.1);
  if (o.mpak) { rbox(1.5, .45, .4, .02, woodM, (xLive + x1) / 2, f + .225, z0 + T + .22); plant(xLive + .35, z1 - .45, .9); st.anchors.mpak = new THREE.Vector3(sx - 1.2, f + .9, -.6); }
  else st.anchors.mpak = new THREE.Vector3(sx - 1.2, f + .9, -.6);
  if (o.gord) curtains(xLive + .15, x1 - .15, z1 - .16);
  if (o.screens) { const sm = new THREE.MeshStandardMaterial({ color: 0x232323, transparent: true, opacity: .62, roughness: 1, side: THREE.DoubleSide }); const scr = new THREE.Mesh(new THREE.PlaneGeometry(x1 - xLive, H * .5), sm); scr.position.set((xLive + x1) / 2, FY + H - H * .25, z1 + .08); st.house.add(scr); box(x1 - xLive, .1, .12, mat({ color: 0x1b1b1b, metalness: .6, roughness: .4 }), (xLive + x1) / 2, top - .05, z1 + .1); }
  st.anchors.screens = new THREE.Vector3((xLive + x1) / 2, FY + H * .8, z1 + .1);
  st.anchors.vloer = new THREE.Vector3(sx - 1.4, f + .05, .4); st.anchors.wand = new THREE.Vector3(x1 - 1.5, f + 1.6, z0 + T); st.anchors.plafond = new THREE.Vector3(sx - 1.4, top, .2); st.anchors.stijl = new THREE.Vector3(sx - 1.2, f + .7, -.5);
  }
}
function lampShade(x, y, z, floor) {
  const m = new THREE.MeshStandardMaterial({ color: 0xf2e8d8, emissive: 0xffc27a, emissiveIntensity: 0, roughness: 1, side: THREE.DoubleSide }); st.emissives.push([m, 1.6]);
  if (floor) box(.025, y - FY, .025, mat({ color: 0x1a1a1a, metalness: .6, roughness: .4 }), x, FY + (y - FY) / 2, z, null, false);
  else { const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, .22, 16), mat({ color: 0x2a2a2a, roughness: .5 })); b.position.set(x, y + .11, z); st.house.add(b); }
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(.13, .18, .22, 24, 1, true), m); sh.position.set(x, y + (floor ? 0 : .32), z); st.house.add(sh);
  const p = new THREE.PointLight(0xffb469, 0, 6, 1.6); p.position.set(x, y + (floor ? -.05 : .3), z); st.house.add(p); st.nightLights.push([p, 3]);
}
function pendant(x, y, z) {
  const m = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffc27a, emissiveIntensity: 0, roughness: .4, metalness: .5 }); st.emissives.push([m, 1.2]);
  box(.01, .55, .01, mat({ color: 0x111111 }), x, y - .275, z, null, false);
  const s = new THREE.Mesh(new THREE.SphereGeometry(.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), m); s.position.set(x, y - .55, z); s.rotation.x = Math.PI; st.house.add(s);
  const bulb = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd8a0, emissiveIntensity: 0 }); st.emissives.push([bulb, 6]);
  const b = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 10), bulb); b.position.set(x, y - .6, z); st.house.add(b);
  const p = new THREE.PointLight(0xffb469, 0, 6, 1.6); p.position.set(x, y - .7, z); st.house.add(p); st.nightLights.push([p, 3]);
}
function plant(x, z, h, y0) {
  const y = y0 || FY, pot = mat({ color: 0x2b2a28, roughness: .7 }), lf = mat({ color: 0x3f6b3a, roughness: .9 }), lf2 = mat({ color: 0x5a8a4a, roughness: .9 });
  const p = new THREE.Mesh(new THREE.CylinderGeometry(h * .16, h * .12, h * .3, 18), pot); p.position.set(x, y + h * .15, z); p.castShadow = true; st.house.add(p);
  const r = mulberry(Math.round(x * 100 + z * 10) || 7);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(h * .15, 18), mat({ color: 0x2a2018, roughness: 1 })); soil.rotation.x = -Math.PI / 2; soil.position.set(x, y + h * .28, z); st.house.add(soil);
  if (!st.leafGeo) { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(.5, .25, .45, .8, 0, 1); sh.bezierCurveTo(-.45, .8, -.5, .25, 0, 0); st.leafGeo = new THREE.ShapeGeometry(sh, 8); }
  const stemM = mat({ color: 0x4d5a33, roughness: .9 }), shades = [0x2f5229, 0x3c6a31, 0x4b7b3a, 0x2a4524].map(c => mat({ color: c, roughness: .55, side: THREE.DoubleSide, envMapIntensity: .5 }));
  const n = Math.round(14 + h * 18);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, tilt = .15 + r() * .75, len = h * (.35 + r() * .45), base = new THREE.Vector3(x + (r() - .5) * h * .1, y + h * .28, z + (r() - .5) * h * .1);
    const dir = new THREE.Vector3(Math.sin(tilt) * Math.cos(a), Math.cos(tilt), Math.sin(tilt) * Math.sin(a)), tip = base.clone().addScaledVector(dir, len);
    const st2 = new THREE.Mesh(new THREE.CylinderGeometry(.004, .006, len, 5), stemM); st2.position.copy(base).lerp(tip, .5); st2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); st.house.add(st2);
    const lw = h * (.09 + r() * .07), lh = h * (.2 + r() * .14), leaf = new THREE.Mesh(st.leafGeo, shades[i % 4]);
    leaf.scale.set(lw, lh, 1); leaf.position.copy(tip); leaf.lookAt(tip.clone().add(new THREE.Vector3(Math.cos(a), .4 + r(), Math.sin(a))));
    leaf.rotateX(-Math.PI / 2 + .5 + r() * .5); leaf.rotateZ((r() - .5) * .6); leaf.castShadow = true; st.house.add(leaf);
  }
}
function fabricBump() {
  if (st.fabric) return st.fabric;
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), r = mulberry(5);
  g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) for (let x = 0; x < 256; x += 2) { const v = 110 + ((x + y) % 4 ? 30 : -10) + r() * 40 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 2, 2); }
  for (let i = 0; i < 900; i++) { const v = r() > .5 ? 170 : 70; g.fillStyle = `rgba(${v},${v},${v},.25)`; g.fillRect(r() * 256, r() * 256, 1 + r() * 6, 1); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); t.anisotropy = 8; st.fabric = t; return t;
}
function curtains(xa, xb, z) { const m = mat({ color: 0xe0d8c9, roughness: 1, side: THREE.DoubleSide }); [xa + .2, xb - .2].forEach(x => { for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, H - .1, 10), m); c.position.set(x - .12 + i * .08, FY + H / 2, z + (i % 2) * .03); c.castShadow = true; st.house.add(c); } }); }

function exterior(L, o) {
  const c = st.cfg, x0 = -L / 2, x1 = L / 2, z1 = W / 2, z0 = -W / 2, top = FY + H;
  const deckM = mat({ map: tex('gv4', 1, (L + 1) / 1.2), color: 0xb98b5f, roughness: .8 });
  const darkM = mat({ color: 0x1b1c1d, roughness: .45, metalness: .5, envMapIntensity: .8 });
  const stepM = mat({ map: tex('gv6', 1.5, .3), color: 0x76746f, roughness: .9 });
  const entX = st.zero ? st.xLive - .15 : (st.xs[1] + st.xs[3]) / 2;
  if (o.terras) {
    const dk = new THREE.Group(); st.house.add(dk); const n = Math.floor(3.0 / .145);
    for (let i = 0; i < n; i++) box(L + 1, .04, .13, deckM, 0, FY - .02, z1 + .08 + i * .145, dk);
    box(L + 1, FY - .04, .06, darkM, 0, (FY - .04) / 2, z1 + 3.0);
    box(1.8, .15, .4, stepM, entX, .3, z1 + 3.25); box(1.8, .15, .4, stepM, entX, .15, z1 + 3.6);
    st.anchors.terras = new THREE.Vector3(x1 - 1.2, FY, z1 + 1.6);
  } else { box(1.8, .15, .45, stepM, entX, .3, z1 + .28); box(1.8, .15, .45, stepM, entX, .15, z1 + .7); }
  const stepLed = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc883, emissiveIntensity: 0 }); st.emissives.push([stepLed, 3]);
  box(1.7, .015, .02, stepLed, entX, .36, z1 + (o.terras ? 3.47 : .52), null, false);
  if (o.overk) {
    const d = 3.0, oz = z1 + .5 + d / 2;
    box(L + 1, .22, d, [darkM, darkM, darkM, mat({ map: tex('fl0', L / 1.6, 1.6), roughness: .8 }), darkM, darkM], 0, top + .11, oz);
    [x0 - .4, x1 + .4].forEach(x => box(.12, top, .12, darkM, x, top / 2, z1 + .5 + d - .1));
    st.anchors.overk = new THREE.Vector3(0, top + .2, oz);
  }
  if (o.zp) { const pm = mat({ color: 0x0f1a33, roughness: .15, metalness: .7, envMapIntensity: 1.4 }), fr = mat({ color: 0xb0b4b8, metalness: .8, roughness: .3 }); const n = Math.max(2, Math.floor((L - .6) / 1.12));
    for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const g = new THREE.Group(); g.position.set(x0 + .5 + i * 1.12 + .52, top + .45, z0 + .25 + j * 1.85 + .85); g.rotation.x = -.18; st.house.add(g); box(1.04, .035, 1.72, fr, 0, 0, 0, g); box(.98, .01, 1.66, pm, 0, .02, 0, g); }
    st.anchors.zp = new THREE.Vector3(0, top + .6, 0); }
  if (o.omv) { box(.4, .5, .18, mat({ color: 0xdedede, roughness: .5 }), x0 - .17, FY + 1.3, z0 + 2.0); st.anchors.omv = new THREE.Vector3(x0 - .2, FY + 1.3, z0 + 2.0); }
  if (o.bat) { rbox(.6, 1.0, .22, .04, mat({ color: 0xeeeeec, roughness: .35 }), x0 - .16, FY + .5, z0 + 1.0); st.anchors.bat = new THREE.Vector3(x0 - .2, FY + .6, z0 + 1.0); }
  if (o.wp) { const u = rbox(1.05, .85, .42, .03, mat({ color: 0xc9ccce, roughness: .45 }), x0 + 1.6, .425, z0 - .4); const fan = new THREE.Mesh(new THREE.CircleGeometry(.3, 28), darkM); fan.position.set(x0 + 1.5, .44, z0 - .615); fan.rotation.y = Math.PI; st.house.add(fan); st.anchors.wp = new THREE.Vector3(x0 + 1.6, .6, z0 - .4); }
  rbox(.82, .3, .24, .03, mat({ color: 0xf2f2f0, roughness: .4 }), x0 + 3.3, FY + 2.05, z0 - .16); st.anchors.airco = new THREE.Vector3(x0 + 3.3, FY + 2.05, z0 - .2);
  if (o.vv) st.anchors.vv = new THREE.Vector3(st.xLive + 1.2, FY + .05, .5);
  if (o.laad) { box(.22, 1.35, .16, mat({ color: 0x2b2d2f, roughness: .4, metalness: .4 }), x0 - 1.6, .675, z1 + 2.4); const lm = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x43d17a, emissiveIntensity: 1 }); box(.1, .02, .02, lm, x0 - 1.6, 1.1, z1 + 2.49, null, false); st.anchors.laad = new THREE.Vector3(x0 - 1.6, 1.2, z1 + 2.4); }
  if (o.cam || o.alarm) { [[x0 - .1, top - .25, z1 + .1], [x1 + .1, top - .25, z1 + .1]].forEach(p => rbox(.12, .1, .2, .03, mat({ color: 0xf0f0f0, roughness: .4 }), p[0], p[1], p[2])); st.anchors.cam = st.anchors.alarm = new THREE.Vector3(x1 + .1, top - .25, z1 + .1); }
  if (o.smart) st.anchors.smart = new THREE.Vector3(st.xLive + .3, FY + 1.3, z1 - .2);
  if (o.kraan) { box(.06, .12, .1, mat({ color: 0x8a8a8a, metalness: .9, roughness: .3 }), x1 - .6, FY + .5, z0 - .1); st.anchors.buitenkraan = new THREE.Vector3(x1 - .6, FY + .5, z0 - .1); }
  if (o.bv) { const n = Math.max(3, Math.round(L / 2)); for (let i = 0; i < n; i++) { const x = x0 + .4 + (L - .8) * i / (n - 1), zz = z1 + (o.terras ? 3.3 : 1.3); box(.1, .6, .1, darkM, x, .3, zz); const m = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc06b, emissiveIntensity: 0 }); st.emissives.push([m, 3]); box(.08, .1, .08, m, x, .56, zz + .012, null, false); const p = new THREE.PointLight(0xffb15e, 0, 4, 1.8); p.position.set(x, .6, zz + .2); st.house.add(p); st.nightLights.push([p, 2]); } st.anchors.bv = new THREE.Vector3(0, .6, z1 + (o.terras ? 3.3 : 1.3)); }
  const yT = o.terras ? FY : 0, fireX = x1 - .6, fireZ = z1 + (o.terras ? 2.0 : 2.4);
  if (o.vuur) { const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.5, .28, .32, 28), mat({ color: 0x2a2826, roughness: .8, metalness: .3 })); bowl.position.set(fireX, yT + .3, fireZ); bowl.castShadow = true; st.house.add(bowl);
    box(.1, .14, .1, darkM, fireX, yT + .07, fireZ);
    const fm = new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff6a00, emissiveIntensity: 3, transparent: true, opacity: .92 }); const fl = new THREE.Mesh(new THREE.ConeGeometry(.22, .55, 14), fm); fl.position.set(fireX, yT + .7, fireZ); st.house.add(fl);
    const p = new THREE.PointLight(0xff8a3a, 2, 8, 1.5); p.position.set(fireX, yT + 1, fireZ); st.house.add(p); st.fire = [fl, p]; st.anchors.vuur = new THREE.Vector3(fireX, yT + .9, fireZ); }
  if (o.loung) { const lm = mat({ color: 0xe6dfd2, roughness: 1 }); rbox(1.9, .4, .85, .08, lm, fireX - 1.7, yT + .2, fireZ + .25); rbox(1.9, .42, .2, .08, lm, fireX - 1.7, yT + .55, fireZ + .62); rbox(.7, .4, .7, .06, lm, fireX + .1, yT + .2, fireZ + 1.2); st.anchors.loung = new THREE.Vector3(fireX - 1.7, yT + .6, fireZ + .3); }
  st.anchors.gevel = new THREE.Vector3(x0, FY + H * .6, z0 + .6);
}

/* ------------------------------------------------------- jouw keuzes */
const VIEWS = { // [modus, camera-functie]
  outside: ['buiten', (L) => [[L * .55 + 3, 3.6, W / 2 + L * .55 + 5], [0, FY + 1, 0]]],
  back: ['buiten', (L) => [[-L * .5 - 3, 3.2, -W / 2 - 6], [-L * .2, FY + .8, -W / 2]]],
  roof: ['buiten', (L) => [[L * .3, FY + H + 7, W / 2 + 6], [0, FY + H, 0]]],
  front: ['buiten', (L) => [[L * .25, 2.4, W / 2 + 7], [L * .15, FY + .8, W / 2 + 1]]],
};
const PICKVIEW = { gevel: 'outside', airco: 'back', wp: 'back', bat: 'back', omv: 'back', zp: 'roof', buitenkraan: 'back', terras: 'front', overk: 'front', vuur: 'front', loung: 'front', bv: 'front', laad: 'front', cam: 'front', alarm: 'front', screens: 'front', triple: 'front', slot: 'front',
  vloer: 'room:0', wand: 'room:0', plafond: 'room:0', stijl: 'room:0', mpak: 'room:0', dim: 'room:0', smart: 'room:0', vv: 'room:0', keuken: 'room:1', app: 'room:1', bad: 'room:3', kraan: 'room:3', bedpak: 'room:2', gord: 'room:2' };
function buildPicks() {
  st.picks = (st.cfg.picks || []).map(p => ({ ...p, a: st.anchors[p.key] || null }));
  const panel = el(`<div class="v3-picks"><button class="v3-pk-t">Jouw keuzes <b>${st.picks.length}</b></button><div class="v3-pk-l">${st.picks.map((p, i) => `<button data-pick="${i}"><span>${esc(p.label)}</span><em>${esc(p.price)}</em></button>`).join('')}</div></div>`);
  st.root.querySelector('.v3-stage').appendChild(panel);
  panel.querySelector('.v3-pk-t').onclick = () => panel.classList.toggle('open');
  if (window.innerWidth > 900) panel.classList.add('open');
  panel.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) focusPick(+b.dataset.pick); });
  const lay = st.root.querySelector('.v3-pins');
  st.pickEls = st.picks.map((p, i) => { if (!p.a) return null; const d = document.createElement('button'); d.className = 'v3-pin'; d.dataset.pick = i; d.innerHTML = `<i></i><span>${esc(p.short || p.label)}</span>`; d.onclick = () => focusPick(i); lay.appendChild(d); return d; });
}
function focusPick(i) {
  const p = st.picks[i]; if (!p) return;
  st.root.querySelectorAll('.v3-pk-l [data-pick]').forEach(b => b.classList.toggle('on', +b.dataset.pick === i));
  st.pickEls.forEach((e, j) => e && e.classList.toggle('on', j === i)); st.activePick = i;
  let v = PICKVIEW[p.key] || 'outside'; if (st.zero && (p.key === 'bad' || p.key === 'kraan')) v = 'room:2';
  if (v.startsWith('room:')) { if (st.mode !== 'binnen') setMode('binnen'); goRoom(+v.slice(5)); }
  else { if (st.mode !== 'buiten') setMode('buiten'); const [pos, tgt] = VIEWS[v][1](st.L); fly(pos, tgt, 1000); }
  hint(p.label + (p.price ? ' · ' + p.price : ''));
}
function placePins() {
  if (!st.pickEls) return;
  const s = st.root.querySelector('.v3-stage'), w = s.clientWidth, h = s.clientHeight, show = st.mode !== 'locatie' && st.showPins !== false;
  st.house.updateMatrixWorld();
  st.picks.forEach((p, i) => { const e = st.pickEls[i]; if (!e) return; const wp = p.a.clone().applyMatrix4(st.house.matrixWorld); const pr = wp.clone().project(st.camera);
    const dist = st.camera.position.distanceTo(wp); const inRoom = st.mode !== 'binnen' || dist < 4.5;
    let vis = show && pr.z < 1 && Math.abs(pr.x) < 1.05 && Math.abs(pr.y) < 1.05 && inRoom && (st.mode === 'binnen' ? (PICKVIEW[p.key] || '').startsWith('room') : !(PICKVIEW[p.key] || 'outside').startsWith('room'));
    if (vis) { if (!st.occ) { st.occ = []; st.house.traverse(o => { if (o.isMesh && o.material && !(o.material.transparent)) st.occ.push(o); }); st.ray = new THREE.Raycaster(); }
      const dir = wp.clone().sub(st.camera.position).normalize(); st.ray.set(st.camera.position, dir); st.ray.far = dist - .3; if (st.ray.intersectObjects(st.occ, false).length) vis = false; }
    e.style.display = vis ? '' : 'none'; if (vis) e.style.transform = `translate(${(pr.x * .5 + .5) * w}px,${(-pr.y * .5 + .5) * h}px)`; });
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
function applyEnv() { if (!st) return; if (st.panoEnv) st.scene.environment = st.panoEnv; inside(st.mode === 'binnen'); }
function lightScale() {
  const inn = st.mode === 'binnen' && st.pano && st.pano.visible, n = st.night, k = (n ? .08 : 1) * (inn ? .42 : 1);
  st.scene.traverse(o => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(m => { if (m.envMapIntensity === undefined) return; if (m.userData.env0 === undefined) m.userData.env0 = m.envMapIntensity; m.envMapIntensity = m.userData.env0 * k; }); });
  (st.winLights || []).forEach(l => l.intensity = n ? 0 : (inn ? 1.5 : .8));
  if (st.hemi) st.hemi.intensity = n ? .12 : (inn ? .35 : .9);
  if (st.fill) { st.fill.intensity = n ? 0 : (inn ? .5 : 1.6); st.fill2.intensity = n ? 0 : (inn ? .4 : 1.2); }
  st.renderer.toneMappingExposure = n ? 1.25 : (inn ? 1.0 : 1.05);
  st.hqDone = false;
}
function inside(on) { const ok = st.pano && st.pano.material.map, out = ok && !on && st.mode === 'buiten'; if (!ok) on = false;
  st.env.visible = !on && !st.aerial; st.deco.visible = !ok; if (st.pano) st.pano.visible = on || out;
  st.scene.background = (on || out) ? null : (st.night ? st.skyNight : st.skyDay);
  st.scene.fog.far = on ? 2000 : (st.aerial ? st.scene.fog.far : (out ? 120 : 260)); st.scene.fog.near = out ? 25 : 70; if (out && !st.night) st.scene.fog.color.set(0xa9b49a);
  st.hqDone = false; lightScale(); }
function setMode(m, first) {
  st.mode = m; st.tourOn = false;
  st.root.querySelectorAll('.v3-tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  st.root.classList.toggle('is-loc', m === 'locatie'); st.dirty = 3;
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
  st.dimGroup.visible = st.dims; refreshLabels(); inside(m === 'binnen');
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
  st.scene.background = (st.pano && st.pano.visible) ? null : (n ? st.skyNight : st.skyDay); st.scene.fog.color.set(n ? 0x1d1b2e : (st.pano && st.pano.visible && st.mode === 'buiten' ? 0xa9b49a : 0xcfe1ef));
  if (st.pano) st.pano.material.color.set(n ? 0x1c2440 : 0xffffff); st.hqDone = false;
  st.sun.intensity = n ? .15 : 2.4; st.sun.color.set(n ? 0x8aa0ff : 0xfff1dc);
  st.emissives.forEach(([m, i]) => m.emissiveIntensity = n ? i : (i > 2.4 ? .6 : .25));
  st.nightLights.forEach(([p, i]) => p.intensity = n ? i : 0);
  st.glassM.opacity = n ? .1 : .14;
  lightScale();
  if (st.backdrop) st.backdrop.material.color.set(n ? 0x3a3550 : 0xffffff);
  st.dirty = 3;
}
function playTour() {
  const d = Math.max(st.L, 8) * 1.25 + 4, seq = [[[d * .55, 4.2, d * .85], [0, FY + 1.1, 0]], [[-d * .7, 3, d * .5], [0, FY + 1, 0]], [[0, 2.2, W / 2 + 6], [0, FY + 1.2, 0]]];
  let i = 0; st.tourOn = true; st.controls.enabled = false;
  const next = () => { if (!st || !st.tourOn) return; if (i < seq.length) { fly(seq[i][0], seq[i][1], 2200); i++; setTimeout(next, 2600); }
    else if (i - seq.length < st.rooms.length) { if (st.mode !== 'binnen') { st.mode = 'binnen'; st.root.querySelectorAll('.v3-tabs button').forEach(b => b.classList.toggle('on', b.dataset.m === 'binnen')); st.root.querySelectorAll('.v3-grp').forEach(g => g.style.display = g.classList.contains('v3-g-binnen') ? '' : 'none'); inside(true); }
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
  if (st.pano && st.pano.visible) st.pano.position.copy(st.camera.position);
  const moving = st.flying || st.dirty > 0 || (st.mgrPending && st.mgrPending() > 0) || now - (st.t0 || (st.t0 = now)) < 4000;
  if (moving || (st.fire && st.mode !== 'binnen')) { st.lastChange = now; st.hqDone = false;
    st.renderer.render(st.scene, st.camera); placeLabels(); placePins(); if (st.dirty > 0) st.dirty--;
  } else if (!st.hqDone && st.composer && st.mode !== 'locatie' && now - st.lastChange > 160) {
    st.composer.render(); st.hqDone = true; placeLabels(); placePins();
  }
}
