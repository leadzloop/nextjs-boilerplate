var IMG = {"a28_day": "site/img/a28_day.webp", "a28_night": "site/img/a28_night.webp", "a28_purple": "site/img/a28_purple.webp", "a28_r0": "site/img/a28_r0.webp", "a28_r1": "site/img/a28_r1.webp", "a28_r2": "site/img/a28_r2.webp", "a28_r3": "site/img/a28_r3.webp", "a28_r4": "site/img/a28_r4.webp", "a28_stone": "site/img/a28_stone.webp", "bath_lux": "site/img/bath_lux.webp", "big_forest50": "site/img/big_forest50.webp", "big_nordic32": "site/img/big_nordic32.webp", "config_render": "site/img/config_render.webp", "feat_big": "site/img/feat_big.webp", "fl0": "site/img/fl0.webp", "fl1": "site/img/fl1.webp", "fl2": "site/img/fl2.webp", "fl3": "site/img/fl3.webp", "fl4": "site/img/fl4.webp", "fl5": "site/img/fl5.webp", "gv0": "site/img/gv0.webp", "gv1": "site/img/gv1.webp", "gv2": "site/img/gv2.webp", "gv3": "site/img/gv3.webp", "gv4": "site/img/gv4.webp", "gv5": "site/img/gv5.webp", "gv6": "site/img/gv6.webp", "hero_home": "site/img/hero_home.webp", "hero_models": "site/img/hero_models.webp", "i_airco": "site/img/i_airco.webp", "i_bat": "site/img/i_bat.webp", "i_vv": "site/img/i_vv.webp", "i_wp": "site/img/i_wp.webp", "i_zp": "site/img/i_zp.webp", "insp_fire": "site/img/insp_fire.webp", "int_bed_big": "site/img/int_bed_big.webp", "int_th0": "site/img/int_th0.webp", "int_th1": "site/img/int_th1.webp", "int_th2": "site/img/int_th2.webp", "kit0": "site/img/kit0.webp", "kit_big": "site/img/kit_big.webp", "logo": "site/img/logo.webp", "m_aurora28": "site/img/m_aurora28.webp", "m_aurora36": "site/img/m_aurora36.webp", "m_aurora48": "site/img/m_aurora48.webp", "m_forest50": "site/img/m_forest50.webp", "m_nordic32": "site/img/m_nordic32.webp", "m_villa": "site/img/m_villa.webp", "offerte": "site/img/offerte.webp", "plan_big": "site/img/plan_big.webp", "room0": "site/img/room0.webp", "room1": "site/img/room1.webp", "room3": "site/img/room3.webp", "room4": "site/img/room4.webp", "t_stuc": "site/img/t_stuc.webp", "t_wit": "site/img/t_wit.webp", "x_fire": "site/img/x_fire.webp", "x_light": "site/img/x_light.webp", "x_lounge": "site/img/x_lounge.webp", "x_overk": "site/img/x_overk.webp", "x_terras": "site/img/x_terras.webp"};
(function(){
'use strict';
var app=document.getElementById('app');
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function eur(n){return '€ '+n.toLocaleString('nl-NL')}
function plus(n){return '+ '+eur(n)}
function op(n){return n?plus(n):'Standaard'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function bg(k){return 'background-image:url('+IMG[k]+')'}

/* ---------- iconen (dunne lijn) ---------- */
var P={
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.6 1 2.6 2 3 0-3-.5-5.5.5-8z"/><path d="M5 21h14"/>',
 plug:'<path d="M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16.5V21"/>',
 cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 wind:'<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>',
 bolt:'<path d="M13 2 5 13.5h6L10 22l8-11.5h-6z"/>',
 drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 wifi:'<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.7 15.8a5 5 0 0 1 6.6 0"/><circle cx="12" cy="19" r="1"/>',
 ac:'<rect x="3" y="5" width="18" height="8" rx="1.5"/><path d="M6 10h12M8 16v3M12 16v4M16 16v3"/>',
 left:'<path d="M15 5l-7 7 7 7"/>', right:'<path d="M9 5l7 7-7 7"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 chev:'<path d="M6 9l6 6 6-6"/>',
 play:'<circle cx="12" cy="12" r="9.5"/><path d="M10 8.5v7l5.5-3.5z"/>',
 leaf:'<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
 gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16 3-16M7.5 9 12 4l4.5 5"/>',
 house:'<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
 truck:'<path d="M2.5 6h11v10h-11z"/><path d="M13.5 9.5h4l3 3.5v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 heart:'<path d="M12 20s-7.5-4.6-8.6-9.6C2.6 6.7 5.2 4 8 4c1.8 0 3.2 1 4 2.3C12.8 5 14.2 4 16 4c2.8 0 5.4 2.7 4.6 6.4C19.5 15.4 12 20 12 20z"/><path d="M8.5 11.5l2.5 2.5 4.5-4.5"/>',
 pin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="2.6"/><path d="M12 12.6V18"/>',
 doc:'<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 8h6M9 11.5h6M9 15h4"/>',
 shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 area:'<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/>',
 frame:'<rect x="7" y="3" width="10" height="18" rx="4"/><path d="M7 7h10M7 17h10"/>',
 height:'<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4M4 21h16"/>',
 bed:'<path d="M3 18V7M3 14h18v4M21 14v-2.5a2.5 2.5 0 0 0-2.5-2.5H10v5"/><circle cx="6.5" cy="11" r="1.6"/>',
 bath:'<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V6a2 2 0 0 1 3.5-1.3"/><path d="M7 19l-1 2M17 19l1 2"/>',
 toilet:'<path d="M7 3h10v6H7z"/><path d="M5 9h14c0 4-2.5 6-5 6.5V21h-4v-5.5C7.5 15 5 13 5 9z"/>',
 sofa:'<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2.5 12a1.5 1.5 0 0 1 3 0v2h13v-2a1.5 1.5 0 0 1 3 0v5h-19z"/><path d="M5 17v2M19 17v2"/>',
 window:'<rect x="4" y="3" width="16" height="18"/><path d="M12 3v18M4 12h8"/>',
 search:'<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
 palm:'<path d="M12 21V9"/><path d="M12 9c-2-3-5.5-3.5-8-2 2.5.2 4.6 1 6 2.5M12 9c2-3 5.5-3.5 8-2-2.5.2-4.6 1-6 2.5M12 9c-1-2.5-1-4.5 0-6 1 1.5 1 3.5 0 6"/>',
 care:'<path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z"/><path d="M12 9.5v4M10 11.5h4"/>',
 office:'<rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V5h6v2M3 12.5h18"/>',
 snow:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
 sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
 tree:'<path d="M12 3l5 6h-3l4 5h-3.5l3.5 4H6l3.5-4H6l4-5H7z"/><path d="M12 18v3"/>',
 chip:'<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 sofa2:'<path d="M3 10h18v7H3z"/><path d="M5 10V7h14v3M5 17v2M19 17v2"/>',
 glass:'<rect x="4" y="3" width="16" height="18"/><path d="M8 7l3-3M8 11l7-7M8 15l11-11"/>',
 dots:'<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
 phone:'<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.7a2 2 0 0 1-.5 2.1L8.4 10.8a16 16 0 0 0 4.8 4.8l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 wa:'<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>'
};
function I(n,w){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.5)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>'}
var ARR=I('arrow',2);

/* ---------- data ---------- */
var MODELS=[
 {id:'aurora28',name:'Aurora 28',m2:28,bed:'1 slaapkamer',beds:1,price:39900,dim:'7,00 × 4,00 m',cat:['tiny','recreatie','mantelzorg','tuinkantoor']},
 {id:'aurora36',name:'Aurora 36',m2:36,bed:'2 slaapkamers',beds:2,price:49900,dim:'9,00 × 4,00 m',cat:['recreatie','permanent','mantelzorg']},
 {id:'aurora48',name:'Aurora 48',m2:48,bed:'2 slaapkamers',beds:2,price:64900,dim:'12,00 × 4,00 m',cat:['recreatie','permanent','zakelijk']},
 {id:'villa',name:'Aurora Villa',m2:72,bed:'2-3 slaapkamers',beds:3,price:89900,dim:'18,00 × 4,00 m',cat:['permanent','zakelijk']},
 {id:'nordic32',name:'Nordic 32',m2:32,bed:'1 slaapkamer',beds:1,price:44900,dim:'8,00 × 4,00 m',cat:['tiny','recreatie','tuinkantoor']},
 {id:'forest50',name:'Forest 50',m2:50,bed:'2 slaapkamers',beds:2,price:69900,dim:'12,50 × 4,00 m',cat:['recreatie','permanent','zakelijk']}
];
function M(id){return MODELS.filter(function(m){return m.id===id})[0]}
var GEVEL=[['Antraciet',0],['Zwart',0],['Houtlook',1600],['Olijfgroen',1200],['Natuurhout',1900],['Aluminium',2400]];
var INT={
 vloer:{label:'Vloer',opts:[['Naturel eiken',0,'fl0'],['Donker eiken',800,'fl1'],['Visgraat',2400,'fl2'],['Betonlook',1100,'fl3'],['Zandsteen',1400,'fl4'],['Notenhout',1600,'fl5']]},
 wand:{label:'Wand',opts:[['Lamellen eiken',0,'gv4'],['Lamellen noten',900,'fl5'],['Betonlook',1200,'gv5'],['Stucwerk naturel',600,'t_stuc'],['Olijfgroen accent',700,'gv3'],['Antraciet',0,'gv0']]},
 plafond:{label:'Plafond',opts:[['Houten plafond',0,'fl0'],['Donker hout',900,'fl1'],['Lamellen eiken',1400,'gv4'],['Strak wit',0,'t_wit'],['Betonlook',800,'fl3'],['Notenhout',1200,'fl5']]},
 stijl:{label:'Stijl',opts:[['Warm natuurlijk',0,'int_th0'],['Modern donker',0,'a28_r0'],['Luxe hotel',1500,'a28_r4']]}
};
var KEUKEN=[['Standaard',0,'kit0'],['Premium',3300,'a28_r3'],['Luxe',5900,'room3']];
var APP=[['Basis (inbegrepen)',0],['Uitgebreid',1200],['Premium',2400]];
var BAD=[['Standaard',0,'room1'],['Premium',2600,'a28_r1'],['Luxe',4900,'bath_lux']];
var KRAAN=[['Zwart mat (inbegrepen)',0],['Geborsteld goud',450],['Regendouche + thermostaat',850]];
var INST=[
 {id:'klimaat',t:'Klimaatregeling',ic:'snow',o:[['airco','Airconditioning',0,'i_airco',1],['wp','Warmtepomp',4300,'i_wp'],['vv','Vloerverwarming',2800,'i_vv']]},
 {id:'zon',t:'Zonne-energie',ic:'sun',o:[['zp','Zonnepanelen',4900,'i_zp'],['bat','Thuisbatterij',3500,'i_bat'],['omv','Omvormer',900,null,0,'sun']]},
 {id:'buiten',t:'Buitenruimte',ic:'tree',o:[['terras','Houten terras',3200,'x_terras'],['overk','Overkapping',4800,'x_overk'],['bv','Buitenverlichting',900,'x_light']]},
 {id:'smart',t:'Slimme technologie',ic:'chip',o:[['smart','Smart home pakket',1900,null,0,'chip'],['slot','Slim deurslot',450,null,0,'chip']]},
 {id:'licht',t:'Verlichting',ic:'bulb',o:[['dim','Dimbare sfeerverlichting',650,null,0,'bulb']]},
 {id:'beveil',t:'Beveiliging',ic:'lock',o:[['alarm','Alarmsysteem',1100,null,0,'lock'],['cam','Camerabeveiliging',850,null,0,'lock']]}
];
var EXTRA=[
 {id:'meubel',t:'Meubilair',ic:'sofa2',o:[['mpak','Compleet meubelpakket',6500,'int_th0'],['bedpak','Slaapkamerpakket',1400,'room0'],['loung','Loungeset terras',1250,'x_lounge']]},
 {id:'glas',t:'Ramen & glas',ic:'glass',o:[['screens','Elektrische screens',1800,'room4'],['gord','Gordijnen op maat',950,'a28_r0'],['triple','Triple glas upgrade',2200,null,0,'glass']]},
 {id:'overig',t:'Overig',ic:'dots',o:[['vuur','Vuurschaal terras',650,'x_fire'],['kraan','Extra buitenkraan',250,null,0,'drop'],['laad','Laadpaal auto',1450,null,0,'plug']]}
];
var TRANSPORT=2500, PLAATSING=2000;

/* ---------- configurator state ---------- */
var S={step:1,model:'aurora28',gevel:0,vloer:0,wand:0,plafond:0,stijl:0,keuken:0,app:0,bad:0,kraan:0,opts:{airco:1},view:'plan',sub:'plan',room:-1,itab:'vloer',ithumb:0,kthumb:0,bthumb:0};
var DEF=JSON.stringify(S);
var DEF0=null;try{var saved=JSON.parse(localStorage.getItem('nmk_cfg')||'null');if(saved)for(var k in saved)S[k]=saved[k];}catch(e){}
function resetCfg(model){var d=JSON.parse(DEF);for(var k in d)S[k]=d[k];S.model=model||'aurora28';S.step=1;lastTotal=null;persist();}
function persist(){try{localStorage.setItem('nmk_cfg',JSON.stringify(S))}catch(e){}}
function allOpts(){var a=[];INST.concat(EXTRA).forEach(function(s){s.o.forEach(function(o){a.push(o)})});return a}
function optSum(){
  var s=GEVEL[S.gevel][1];
  ['vloer','wand','plafond','stijl'].forEach(function(k){s+=INT[k].opts[S[k]][1]});
  s+=KEUKEN[S.keuken][1]+APP[S.app][1]+BAD[S.bad][1]+KRAAN[S.kraan][1];
  allOpts().forEach(function(o){if(S.opts[o[0]])s+=o[2]});
  return s;
}
function total(){return M(S.model).price+optSum()}

/* ---------- gedeelde blokken ---------- */
function planHTML(cls,note){
  return '<div class="planbox '+(cls||'')+'" style="'+bg('plan_big')+'">'+
   '<span class="pl dim" style="left:50%;top:3.6%">700 cm</span><span class="pl dim side" style="left:calc(100% + 1.2rem);top:50%">400 cm</span>'+
   '<span class="pl" style="left:14.5%;top:68%"><b>Slaapkamer</b></span><span class="pl" style="left:35%;top:68%"><b>Badkamer</b></span><span class="pl" style="left:49.6%;top:68%"><b>WC</b></span><span class="pl" style="left:77.5%;top:68%"><b>Woonkamer + Keuken</b></span>'+
   (note?'<span class="hint">'+note+'</span>':'')+'</div>';
}
function card(m,opts){
  opts=opts||{};
  var tag=opts.btn?'button':'a';
  return '<'+tag+' class="mcard'+(opts.sel?' sel':'')+'" '+(opts.btn?'type="button" data-model="'+m.id+'"':(m.id==='aurora28'?'href="#aurora-28"':'href="#configurator" data-start="'+m.id+'"'))+'>'+
   '<div class="ph"><i style="'+bg('m_'+m.id)+'"></i></div><div class="bd"><h3>'+m.name+'</h3><div class="meta">'+m.m2+' m² | '+m.bed+'</div><div class="pr">Vanaf '+eur(m.price)+' <small class="vat">excl. btw</small></div>'+
   '<span class="circ">'+(opts.sel?I('check',2):ARR)+'</span></div></'+tag+'>';
}
function priceCard(){
  var m=M(S.model);
  return '<div class="pricecard"><div class="lbl">Huidige prijs · excl. btw</div><div class="amt">'+eur(total())+'</div><div class="diff">'+plus(optSum())+' t.o.v. basisprijs</div>'+
   '<div class="pc-sum"><div><span>Model</span><b>'+m.name+'</b></div><div><span>Basisprijs</span><b>'+eur(m.price)+'</b></div><div><span>Meerwerk</span><b>'+eur(optSum())+'</b></div></div>'+
   '<div class="pc-prog"><i style="width:'+(S.step/8*100)+'%"></i></div><div class="pc-step">Stap '+S.step+' van 8 · '+STEPS[S.step-1]+'</div>'+
   '<button class="btn btn-gold" data-next>'+(S.step===7?'Naar overzicht':'Volgende stap')+' '+ARR+'</button></div>';
}
function mobileBar(){return S.step<8?'<div class="mbar"><div><span>'+M(S.model).name+' · stap '+S.step+'/8 · excl. btw</span><b class="amt">'+eur(total())+'</b></div><button class="btn btn-gold" data-next>Verder '+ARR+'</button></div>':''}
document.getElementById('footUsp').innerHTML=
 [['heart','Persoonlijk advies','Onze specialisten denken met je mee'],['pin','Vergunning & plaatsing','Wij begeleiden het hele traject'],['doc','Transparante prijzen','Geen verrassingen achteraf'],['shield','Landelijk & internationaal','Overal te leveren']]
 .map(function(f){return '<div class="fu">'+I(f[0])+'<div><b>'+f[1]+'</b><span>'+f[2]+'</span></div></div>'}).join('')+
 '<a class="btn btn-gold" href="#contact">Plan een adviesgesprek '+ARR+'</a>';

/* ---------- pagina's ---------- */
function pageHome(){
  var th=['feat_big','a28_r0','a28_r4','a28_r3','a28_r1'];
  return '<section class="hero hero-home"><div class="hero-bg" style="'+bg('hero_home')+'"></div><div class="wrap">'+
   '<div class="eyebrow">Luxe modulair wonen</div><h1>Natuur. Comfort.<br>Vrijheid.</h1>'+
   '<p class="lead">Stijlvolle modulaire woningen, ontworpen voor nu en de toekomst. Volledig aanpasbaar, duurzaam en klaar voor elke plek.</p>'+
   '<div class="cta"><a class="btn btn-gold" href="#modellen">Ontdek onze modellen '+ARR+'</a><button class="btn btn-ghost" data-video>'+I('play',1.6)+' Bekijk video</button></div>'+
   '</div><div class="script"><span>More</span><span>Than a House</span><span>A Lifestyle</span></div></section>'+
   '<section class="usp"><div class="wrap">'+[['leaf','Duurzaam & energiezuinig'],['gem','Premium afwerking'],['house','Volledig naar wens samen te stellen'],['truck','Turnkey opgeleverd'],['globe','Overal te plaatsen']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'</div></section>'+
   '<section class="feature"><div class="wrap"><div class="grid"><div style="padding-top:.4rem">'+
   '<div class="eyebrow" style="font-size:1rem">Aurora 28</div><h2 class="h2">Compact.<br>Compleet. Tijdloos.</h2>'+
   '<p class="txt">De Aurora 28 biedt alles wat je nodig hebt in één stijlvol en slim ontworpen woning. Grote glaspartijen zorgen voor een unieke woonbeleving, waarbij binnen en buiten naadloos in elkaar overlopen.</p>'+
   '<div class="price-line">Vanaf <b>€ 39.900</b> <small>excl. btw en transport</small></div>'+
   '<div class="btn-row"><a class="btn btn-gold" href="#configurator" data-start="aurora28">Stel jouw Aurora 28 samen '+ARR+'</a><a class="btn btn-dark" href="#aurora-28">Bekijk alle details</a></div></div>'+
   '<div class="gallery"><div class="main" id="gMain" style="'+bg(th[0])+'"><button class="badge360" data-tour><i>360°</i>Virtuele rondleiding</button></div>'+
   '<div class="thumbs"><button class="arrow-btn" data-g="-1" aria-label="Vorige">'+I('left',2)+'</button>'+th.map(function(t,i){return '<button class="t'+(i?'':' on')+'" data-gi="'+i+'" style="'+bg(t)+'" aria-label="Foto '+(i+1)+'"></button>'}).join('')+
   '<button class="arrow-btn" data-g="1" aria-label="Volgende">'+I('right',2)+'</button></div></div></div>'+
   '<div class="specs-row">'+planHTML('plan-box')+'<div class="spec-card"><div class="eyebrow" style="font-size:1rem">Specificaties</div><div class="spec-grid">'+
   [['area','28 m²','Woonoppervlakte'],['frame','7,00 × 4,00 m','Afmetingen'],['height','2,50 m','Plafondhoogte'],['bed','1','Slaapkamer'],['bath','1','Badkamer'],['toilet','1','Apart toilet'],['sofa','Woonkamer + Keuken','Open indeling'],['window','Grote glaspartijen','Panoramisch uitzicht'],['house','Volledig geïsoleerd','Vloer, wanden en dak']]
   .map(function(s){return '<div class="spec">'+I(s[0])+'<div><b>'+s[1]+'</b><span>'+s[2]+'</span></div></div>'}).join('')+
   '</div><a class="btn btn-dark" href="#aurora-28" style="min-height:3.4rem;font-size:1.15rem;padding:0 1.7rem">Bekijk alle specificaties '+ARR+'</a></div></div></div></section>'+
   '<section class="compose"><div class="wrap"><div class="grid"><div><div class="eyebrow" style="font-size:1rem">Jouw woning, jouw stijl</div><h2 class="h2" style="margin-bottom:1.3rem">Stel zelf samen</h2>'+
   '<p>Kies uit verschillende afwerkingen, materialen, keukens, badkamers en extra opties. Zie direct het resultaat in 3D en ontvang een real-time prijs.</p>'+
   '<a class="btn btn-gold" href="#configurator">Start configurator '+ARR+'</a></div><div class="render" style="'+bg('config_render')+'"></div>'+
   '<div class="check-card"><ul>'+['Buitenkant','Ramen & glas','Interieur','Keuken','Badkamer','Installaties','Buitenruimte','Slimme technologie','Levering & plaatsing'].map(function(c){return '<li>'+I('check',2)+c+'</li>'}).join('')+'</ul></div></div></div></section>'+
   '<section class="models-home"><div class="wrap"><div class="head"><div><div class="eyebrow" style="font-size:1rem">Ontdek onze modellen</div><h2 class="h2">Voor elke levensfase een passende woning</h2></div><a class="more" href="#modellen">Bekijk alle modellen →</a></div>'+
   '<div class="cards4">'+MODELS.slice(0,4).map(function(m){return card(m)}).join('')+'</div></div></section>';
}
var F={cat:'alle',opp:'',slp:'',bud:'',sort:'',q:''};
function pageModellen(){
  var cats=[['alle','Alle modellen','house'],['tiny','Tiny house','area'],['recreatie','Recreatie','palm'],['permanent','Permanente bewoning','house'],['mantelzorg','Mantelzorg','care'],['tuinkantoor','Tuinkantoor','office'],['zakelijk','Zakelijk','brief']];
  function sel(id,label,opts){return '<div class="sel-wrap"><select id="'+id+'" aria-label="'+label+'"><option value="">'+label+'</option>'+opts.map(function(o){return '<option value="'+o[0]+'"'+(F[id]===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>'+I('chev',1.8)+'</div>'}
  return '<section class="hero hero-models"><div class="hero-bg" style="'+bg('hero_models')+'"></div><div class="wrap"><div class="eyebrow">Onze modulaire woningen</div><h1>Onze modulaire woningen</h1><p>Voor elke levensfase een passende woning.</p></div></section>'+
   '<section class="models-page"><div class="wrap"><div class="cats">'+cats.map(function(c){return '<button class="cat'+(F.cat===c[0]?' on':'')+'" data-cat="'+c[0]+'">'+I(c[2])+c[1]+'</button>'}).join('')+'</div>'+
   '<div class="filters">'+sel('opp','Oppervlakte',[['0-35','Tot 35 m²'],['35-50','35 – 50 m²'],['50-999','Meer dan 50 m²']])+sel('slp','Slaapkamers',[['1','1 slaapkamer'],['2','2 slaapkamers'],['3','3 slaapkamers']])+
   sel('bud','Budget',[['0-50000','Tot € 50.000'],['50000-70000','€ 50.000 – € 70.000'],['70000-999999','Vanaf € 70.000']])+sel('sort','Sorteren op',[['pa','Prijs oplopend'],['pd','Prijs aflopend'],['ma','Oppervlakte oplopend'],['md','Oppervlakte aflopend']])+'</div>'+
   '<div class="grid3" id="mgrid"></div></div></section>';
}
function renderModelGrid(){
  var list=MODELS.filter(function(m){
    if(F.cat!=='alle'&&m.cat.indexOf(F.cat)<0)return false;
    if(F.opp){var r=F.opp.split('-');if(m.m2<+r[0]||m.m2>+r[1])return false}
    if(F.slp){if(F.slp==='3'?m.beds<3:(m.beds!==+F.slp&&!(F.slp==='2'&&m.id==='villa')))return false}
    if(F.bud){var b=F.bud.split('-');if(m.price<+b[0]||m.price>+b[1])return false}
    if(F.q&&m.name.toLowerCase().indexOf(F.q)<0)return false;
    return true;
  });
  var s={pa:function(a,b){return a.price-b.price},pd:function(a,b){return b.price-a.price},ma:function(a,b){return a.m2-b.m2},md:function(a,b){return b.m2-a.m2}}[F.sort];
  if(s)list=list.slice().sort(s);
  $('#mgrid').innerHTML=list.length?list.map(function(m){return card(m)}).join(''):'<div class="empty">Geen modellen gevonden met deze filters.</div>';
  if(typeof reveal==='function')requestAnimationFrame(reveal);
}

/* configurator */
var STEPS=['Model','Exterieur','Interieur','Keuken','Badkamer','Installaties',"Extra's",'Overzicht'];
function stepper(){
  return '<div class="stepper"><i class="prog" style="width:'+((S.step-1)/7*100)+'%"></i><div class="wrap">'+STEPS.map(function(s,i){var n=i+1,c=n===S.step?'cur':(n<S.step?'done':'');
    return '<button class="stp '+c+'" data-step="'+n+'"><span class="n">'+(c==='done'?I('check',2):n)+'</span>'+s+'</button>'}).join('')+'</div></div>';
}
function pageConfig(){
  var m=M(S.model),h='';
  if(S.step===1){
    h='<div class="step-label">Stap 1</div><h1 class="t">Kies je model</h1><p class="sub">Alle modellen zijn volledig naar wens samen te stellen.'+(optSum()>0?' <button class="linkbtn" data-reset>Opnieuw beginnen</button>':'')+'</p>'+
      '<div class="grid3">'+MODELS.map(function(x){return card(x,{btn:1,sel:x.id===S.model})}).join('')+'</div><div class="pc-right">'+priceCard()+'</div>';
  }else if(S.step===2){
    var stageStyle,stageCls='stage',extra='';
    if(S.room>=0){stageStyle=bg('a28_r'+S.room);}
    else if(S.view==='buiten'){var big={aurora28:S.dn==='nacht'?'a28_night':'a28_day',nordic32:'big_nordic32',forest50:'big_forest50'}[S.model];stageStyle=bg(big||'m_'+S.model);if(!big)stageCls+=' framed';if(S.model==='aurora28'&&S.dn==='nacht')stageCls+=' wide';if(S.model==='aurora28')extra='<div class="dn"><button data-dn="dag" class="'+(S.dn!=='nacht'?'on':'')+'">'+I('sun')+'Dag</button><button data-dn="nacht" class="'+(S.dn==='nacht'?'on':'')+'">'+I('moon')+'Nacht</button></div>';}
    else if(S.view==='binnen'){stageStyle=bg('int_bed_big');}
    else if(S.sub==='tour'){stageStyle=bg('feat_big');stageCls+=' pan';extra='<span class="hint">Sleep om rond te kijken</span>';}
    else if(S.sub==='afm'){var a28=S.model==='aurora28';stageStyle=bg('plan_big');stageCls+=' plan faded';extra='<div class="dims"><b>'+m.name+'</b><br>Buitenmaat: '+m.dim+'<br>Lengte: '+(m.m2/4).toFixed(2).replace('.',',')+' m · breedte: 4,00 m<br>Woonoppervlakte: '+m.m2+' m²<br>Plafondhoogte: 2,50 m<br><em>Alle modellen zijn 4,00 m breed;<br>de lengte groeit mee met het aantal m².</em></div>'+(a28?'':'<span class="hint">Voorbeeldindeling Aurora 28</span>');}
    else{stageStyle='';stageCls+=' bare';extra=planHTML('fill',S.model==='aurora28'?'':'Voorbeeldindeling Aurora 28 · plattegrond '+m.name+' ('+m.dim+') volgt in de offerte');}
    var rooms=['Slaapkamer','Badkamer','WC','Keuken','Woonkamer'];
    h='<div class="panel viewer"><div class="seg">'+[['buiten','Buiten'],['binnen','Binnen'],['plan','Plattegrond']].map(function(v){return '<button data-view="'+v[0]+'" class="'+(S.view===v[0]&&S.room<0?'on':'')+'">'+v[1]+'</button>'}).join('')+'</div>'+
      (S.view==='plan'?'<div class="subtabs">'+[['tour','360° Tour'],['plan','Plattegrond'],['afm','Afmetingen']].map(function(v){return '<button data-sub="'+v[0]+'" class="'+(S.sub===v[0]&&S.room<0?'on':'')+'">'+v[1]+'</button>'}).join('')+'</div>':'')+
      '<div class="'+stageCls+'" id="stage" style="'+stageStyle+'">'+extra+'</div>'+
      '<div class="rooms">'+rooms.map(function(r,i){return '<button class="room'+(S.room===i?' on':'')+'" data-room="'+i+'"><div style="'+bg('a28_r'+i)+'"></div><span>'+r+'</span></button>'}).join('')+'</div>'+
      '<div class="tour-wrap"><button class="btn btn-dark" data-tour>'+I('play',1.5)+' Start virtuele rondleiding</button></div></div>'+
      '<div class="ext-bottom"><div class="panel gevel"><h3>Gevelafwerking</h3><div class="sw-row"><button class="arrow-btn" data-sw="-1" aria-label="Vorige">'+I('left',2)+'</button><div class="sw-track" id="swTrack">'+
      GEVEL.map(function(g,i){return '<button class="sw'+(S.gevel===i?' on':'')+'" data-gevel="'+i+'"><div style="'+bg('gv'+i)+'"></div><b>'+g[0]+'</b><span>'+op(g[1])+'</span></button>'}).join('')+
      '<button class="sw" data-more><div style="'+bg('gv6')+'"></div><b>Meer kleuren</b><span>RAL op aanvraag</span></button></div><button class="arrow-btn" data-sw="1" aria-label="Volgende">'+I('right',2)+'</button></div></div>'+priceCard()+'</div>';
  }else if(S.step===3){
    var th=[['int_th0','Woonkamer'],['int_th1','Slaapkamer'],['int_th2','Badkamer']],big=S.ithumb===0&&S.itab!=='stijl'?'int_bed_big':th[S.ithumb][0];
    if(S.itab==='stijl')big='int_bed_big';
    var t=INT[S.itab];
    h='<div class="two"><div><div class="bigimg" style="'+bg(big)+'"></div><div class="ithumbs">'+th.map(function(x,i){return '<button class="ithumb'+(S.ithumb===i?' on':'')+'" data-ith="'+i+'"><div style="'+bg(x[0])+'"></div><span>'+x[1]+'</span></button>'}).join('')+'</div></div>'+
      '<div><div class="panel optpanel"><div class="tabs">'+Object.keys(INT).map(function(k){return '<button data-itab="'+k+'" class="'+(S.itab===k?'on':'')+'">'+INT[k].label+'</button>'}).join('')+'</div>'+
      '<div class="matgrid">'+t.opts.map(function(o,i){return '<button class="mat'+(S[S.itab]===i?' on':'')+'" data-mat="'+i+'"><div style="'+bg(o[2])+'"></div><b>'+o[0]+'</b><span>'+op(o[1])+'</span></button>'}).join('')+'</div></div>'+priceCard()+'</div></div>';
  }else if(S.step===4||S.step===5){
    var kit=S.step===4,list=kit?KEUKEN:BAD,cur=kit?S.keuken:S.bad,sub=kit?APP:KRAAN,subcur=kit?S.app:S.kraan;
    var left;
    if(kit){var ti=S.kthumb,thumbs=[['kit_big','Keukens'],['a28_r1','Badkamer']];
      left='<div class="bigimg tall" style="'+bg(ti===0?'kit_big':'a28_r1')+'"></div><div class="ithumbs k2">'+thumbs.map(function(x,i){return '<button class="ithumb'+(ti===i?' on':'')+'" data-kth="'+i+'"><div style="'+bg(x[0])+'"></div><span>'+x[1]+'</span></button>'}).join('')+'</div>';}
    else{left='<div class="bathpair"><figure><div style="'+bg('a28_r1')+'"></div><figcaption>Badkamer</figcaption></figure><figure><div style="'+bg('a28_r2')+'"></div><figcaption>Apart toilet</figcaption></figure></div><p class="imgnote">Sfeerbeelden. Je gekozen uitvoering zie je terug in de offerte.</p>';}
    h='<div class="two"><div>'+left+'</div>'+
      '<div><div class="panel kpanel"><div class="opt-h">'+(kit?'Keuken':'Badkamer')+'</div><div class="kopts">'+list.map(function(o,i){return '<button class="kopt'+(cur===i?' on':'')+'" data-k="'+i+'"><div style="'+bg(o[2])+'"></div><b>'+o[0]+'</b><span>'+op(o[1])+'</span></button>'}).join('')+'</div>'+
      '<div class="opt-h">'+(kit?'Apparatuurpakket':'Kraanwerk & douche')+'</div>'+sub.map(function(o,i){return '<button class="radio'+(subcur===i?' on':'')+'" data-r2="'+i+'"><i></i>'+o[0]+(o[1]?'<em>'+plus(o[1])+'</em>':'')+'</button>'}).join('')+'</div>'+priceCard()+'</div></div>';
  }else if(S.step===6||S.step===7){
    var secs=S.step===6?INST:EXTRA;
    h='<div class="inst"><div class="panel side">'+secs.map(function(s,i){return '<button data-jump="'+s.id+'" class="'+(i?'':'on')+'">'+I(s.ic)+s.t+'</button>'}).join('')+'</div><div>'+
      secs.map(function(s){return '<div class="isec" id="sec-'+s.id+'"><h2>'+s.t+'</h2><div class="igrid">'+s.o.map(function(o){var on=!!S.opts[o[0]];
        return '<button class="iopt'+(on?' on':'')+(o[4]?' locked':'')+'" data-opt="'+o[0]+'"><div class="th" style="'+(o[3]?bg(o[3]):'')+'">'+(o[3]?'':I(o[5]||'dots'))+'</div><div><b>'+o[1]+'</b><span>'+(o[4]?'Inbegrepen':plus(o[2]))+'</span></div><span class="cb">'+I('check',2.4)+'</span></button>'}).join('')+'</div></div>'}).join('')+
      '<div class="pc-right" style="margin-top:2rem">'+priceCard()+'</div></div></div>';
  }else{
    var lines=[['Gevelafwerking – '+GEVEL[S.gevel][0],GEVEL[S.gevel][1]],['Vloer – '+INT.vloer.opts[S.vloer][0],INT.vloer.opts[S.vloer][1]],['Wand – '+INT.wand.opts[S.wand][0],INT.wand.opts[S.wand][1]],
      ['Plafond – '+INT.plafond.opts[S.plafond][0],INT.plafond.opts[S.plafond][1]],['Interieurstijl – '+INT.stijl.opts[S.stijl][0],INT.stijl.opts[S.stijl][1]],['Keuken – '+KEUKEN[S.keuken][0],KEUKEN[S.keuken][1]],
      ['Apparatuur – '+APP[S.app][0],APP[S.app][1]],['Badkamer – '+BAD[S.bad][0],BAD[S.bad][1]]];
    if(S.kraan)lines.push(['Kraanwerk – '+KRAAN[S.kraan][0],KRAAN[S.kraan][1]]);
    var ol=lines.map(function(l){return '<div class="ln"><span>'+l[0]+'</span><span'+(l[1]?'':' class="std"')+'>'+op(l[1])+'</span></div>'}).join('');
    allOpts().forEach(function(o){if(S.opts[o[0]])ol+='<div class="ln"><span>'+o[1]+'</span><span>'+(o[4]?'Inbegrepen':plus(o[2]))+'</span></div>'});
    h='<div class="ov"><div class="panel"><h2>Jouw samenstelling</h2><div class="ov-model"><div class="ph" style="'+bg('m_'+m.id)+'"></div><div><b>'+m.name+'</b><span>'+m.dim+' · '+m.m2+' m²</span><a data-step="1">Bewerk samenstelling</a></div></div>'+ol+'</div>'+
      '<div class="panel"><h2>Prijsopbouw</h2><div class="ln"><span>Basisprijs '+m.name+'</span><span>'+eur(m.price)+'</span></div><div class="ln"><span>Gekozen opties</span><span>'+eur(optSum())+'</span></div>'+
      '<div class="ln"><span>Transport (indicatief)</span><span>'+eur(TRANSPORT)+'</span></div><div class="ln" style="border:0"><span>Plaatsing (indicatief)</span><span>'+eur(PLAATSING)+'</span></div>'+
      '<div class="tot"><b>Totaalprijs (indicatief)<small class="vat2">exclusief 21% btw</small></b><strong>'+eur(total()+TRANSPORT+PLAATSING)+'</strong></div>'+
      '<a class="btn btn-red" href="#contact" data-fromcfg>Offerte aanvragen '+ARR+'</a><button class="btn btn-gold" data-reserve>Reservering aanvragen · aanbetaling € 2.500</button>'+
      '<p class="paynote">Online betalen met iDEAL, creditcard of Klarna komt binnenkort. Tot die tijd regelen we je reservering persoonlijk.</p>'+priceTerms()+'</div></div>';
  }
  return '<div class="cfg">'+stepper()+'<div class="wrap cfg-body">'+h+'</div>'+mobileBar()+'</div>';
}

var fromCfg=false,wantReserve=false;
function pageContact(){
  var m=M(S.model),D={};try{D=JSON.parse(localStorage.getItem('nmk_lead_pref')||'{}')}catch(e){}
  var model=D.model||(fromCfg?S.model:'');
  function chips(name,opts,val){return '<div class="chips" data-chips="'+name+'">'+opts.map(function(o){return '<button type="button" class="chip'+(val===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>'}
  function f(id,l,o){o=o||{};return '<div class="fld'+(o.full?' full':'')+'"><label for="'+id+'">'+l+(o.req?'':' <i>(optioneel)</i>')+'</label><input id="'+id+'" name="'+id+'" type="'+(o.type||'text')+'"'+(o.ac?' autocomplete="'+o.ac+'"':'')+(o.im?' inputmode="'+o.im+'"':'')+(o.ph?' placeholder="'+o.ph+'"':'')+(o.req?' data-req="'+o.req+'" required':'')+'><div class="em">'+(o.err||'Dit veld is verplicht')+'</div>'+(o.help?'<div class="help">'+o.help+'</div>':'')+'</div>'}
  var summary=fromCfg?'<div class="cfg-sum"><div class="ph" style="'+bg('m_'+m.id)+'"></div><div><span>Jouw configuratie</span><b>'+m.name+' · '+m.dim+'</b><em>Totaalprijs (indicatief) '+eur(total()+TRANSPORT+PLAATSING)+' excl. btw</em></div><a href="#configurator-8">Wijzig</a></div>':'';
  return '<section class="off"><div class="photo" style="'+bg('offerte')+'"></div><div class="form" id="offForm">'+
   '<h1>Vrijblijvende offerte aanvragen</h1><p class="intro">Binnen 2 werkdagen een complete PDF-offerte in je mailbox. Invullen duurt minder dan een minuut.</p>'+
   '<div class="trust"><span>'+I('check',2.2)+'Vrijblijvend</span><span>'+I('check',2.2)+'Binnen 2 werkdagen</span><span>'+I('check',2.2)+'Persoonlijk advies</span></div>'+summary+
   '<form class="frm2" novalidate>'+
   '<fieldset><legend><b>1</b>Jouw wensen</legend>'+
   (fromCfg?'':'<div class="q"><span>Welk model?</span>'+chips('model',MODELS.map(function(x){return [x.id,x.name]}).concat([['onbekend','Weet ik nog niet']]),model)+'</div>')+
   '<div class="q"><span>Waarvoor? <i>(optioneel)</i></span>'+chips('doel',[['recreatie','Recreatie'],['wonen','Permanent wonen'],['mantelzorg','Mantelzorg'],['verhuur','Verhuur'],['zakelijk','Kantoor / zakelijk']],D.doel)+'</div>'+
   '<div class="q"><span>Wanneer wil je plaatsen? <i>(optioneel)</i></span>'+chips('wanneer',[['asap','Zo snel mogelijk'],['6m','Binnen 6 maanden'],['12m','Binnen 12 maanden'],['orient','Ik oriënteer me']],D.wanneer)+'</div></fieldset>'+
   '<fieldset><legend><b>2</b>Waar sturen we je offerte naartoe?</legend><div class="grid2">'+
   f('naam','Naam',{req:'1',ac:'name',ph:'Voor- en achternaam',err:'Vul je naam in'})+
   f('em','E-mailadres',{req:'email',type:'email',ac:'email',im:'email',ph:'naam@voorbeeld.nl',err:'Vul een geldig e-mailadres in'})+
   f('tel','Telefoonnummer',{type:'tel',ac:'tel',im:'tel',ph:'06 12345678',help:'Handig voor snelle afstemming',err:'Vul een geldig telefoonnummer in'})+
   f('pc','Postcode plaatsingslocatie',{req:'pc',ac:'postal-code',ph:'1234 AB',help:'Voor een nauwkeurige transportprijs',err:'Vul een geldige postcode in (1234 AB)'})+
   '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div></div><button type="button" class="addnote" id="addNote"'+(wantReserve?' hidden':'')+'>+ Opmerking of vraag toevoegen</button>'+
   '<div class="fld full" id="noteFld"'+(wantReserve?'':' hidden')+'><label for="opm">Opmerking of vraag <i>(optioneel)</i></label><textarea id="opm" name="opm" maxlength="2000" placeholder="Bijvoorbeeld: grond is al aanwezig, wens voor extra slaapkamer…">'+(wantReserve?'Ik wil graag een productieplek reserveren (aanbetaling € 2.500).':'')+'</textarea></div>'+
   '<label class="callme"><input type="checkbox" id="callme"'+(D.callme||wantReserve?' checked':'')+'> Bel me ook voor een gratis adviesgesprek</label></fieldset>'+
   '<button class="btn btn-red submit" type="submit">Ontvang mijn offerte '+ARR+'</button>'+
   '<div class="form-msg" id="formMsg" hidden></div><p class="legal">'+I('lock')+'<span>Je gegevens gebruiken we alleen voor je offerte en bewaren we niet in je browser. Door te versturen ga je akkoord met de <a href="#contact" data-privacy>privacyverklaring</a>.</span></p>'+
   '</form></div>'+
   '<aside><h3>Wat je ontvangt:</h3><ul>'+['Complete specificatie','Prijsopbouw','Leveringsinformatie','Transport en plaatsing','Technische tekeningen','Geldigheidsduur','Persoonlijk advies'].map(function(x){return '<li>'+I('check',2)+x+'</li>'}).join('')+'</ul>'+
   '<h3>Liever direct contact?</h3><a class="contact-l" href="tel:+31000000000"><i>'+I('phone')+'</i>Bel ons</a><a class="contact-l" href="#contact" data-plan><i>'+I('cal')+'</i>Plan adviesgesprek</a><a class="contact-l" href="https://wa.me/" target="_blank" rel="noopener"><i>'+I('wa')+'</i>Stuur een WhatsApp</a></aside></section>';
}
function priceTerms(){
  return '<div class="terms"><h4>Wat zit er in de prijs?</h4><p class="vatline">Alle genoemde prijzen zijn exclusief 21% btw.</p><div class="terms-g"><div><b>Inbegrepen</b><ul>'+['Materialen en complete installatie','Keuken met apparatuur','Badkamer en sanitair','Airconditioning en ventilatie','Elektra, water en riolering in de woning','LED-verlichting binnen en buiten','Binnen- en buitenafwerking, klaar voor gebruik'].map(function(x){return '<li>'+I('check',2.2)+x+'</li>'}).join('')+
   '</ul></div><div><b>Apart in je offerte</b><ul>'+['Transport (indicatief € 2.500)','Plaatsing (indicatief € 2.000)','Fundering en aansluiting op het net, afhankelijk van je locatie'].map(function(x){return '<li class="x">'+I('dots',2.2)+x+'</li>'}).join('')+'</ul></div></div></div>';
}
function pageA28(){
  var specs=[['frame','Afmetingen','7,00 × 4,00 m (28 m²)'],['height','Plafondhoogte','2,50 m'],['bed','1 Slaapkamer'],['bath','Badkamer (douche + toilet)'],['toilet','Aparte WC'],['house','Woonkamer + Keuken'],['window','Grote schuifpui & glaspartijen'],['area','Volledig geïsoleerd (vloer, wanden, dak)'],['ac','Airconditioning'],['wind','Ventilatie'],['bolt','Elektriciteit (compleet)'],['drop','Waterleiding & riolering (compleet)'],['wifi','Internet (Starlink-ready)'],['bulb','LED-verlichting (binnen & buiten)'],['house','Turnkey opgeleverd']];
  var inc=['Materialen','Complete installatie','Keuken met apparatuur','Badkamer en sanitair','Airconditioning','Elektra, water en riolering','LED-verlichting','Internet (Starlink-ready)','Binnen- en buitenafwerking','Klaar voor gebruik'];
  var rooms=['Slaapkamer','Badkamer','WC','Keuken','Woonkamer'];
  return '<section class="a28-hero"><div class="hero-bg" style="'+bg('a28_night')+'"></div><div class="wrap"><div class="a28-brand"><h1>AURORA</h1><p>MODERN LIVING, ANYWHERE</p></div>'+
   '<div class="a28-claim"><b>Luxe modulair wonen</b><span>Compact. Stijlvol. Compleet.</span></div></div><div class="script"><span>More</span><span>Than a House</span><span>A Lifestyle</span></div></section>'+
   '<section class="a28-usp"><div class="wrap">'+[['gem','Premium afwerking'],['leaf','Volledig geïsoleerd'],['cog','Complete installatie'],['house','Turnkey opgeleverd'],['globe','Overal te plaatsen']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'</div></section>'+
   '<section style="background:#fff"><div class="wrap a28-main"><div><div class="eyebrow" style="margin-bottom:1.4rem">Plattegrond Aurora 28</div>'+planHTML('a28-plan')+'</div>'+
   '<div class="a28-specs"><h2>SPECIFICATIES</h2><ul>'+specs.map(function(s){return '<li>'+I(s[0],1.3)+'<div>'+s[1]+(s[2]?'<small>'+s[2]+'</small>':'')+'</div></li>'}).join('')+'</ul></div>'+
   '<div class="a28-price"><h3>TURNKEY PRIJS</h3><div class="big">€ 39.900</div><div class="inc">INCLUSIEF ALLES</div><ul>'+inc.map(function(x){return '<li>'+I('check',2.2)+x+'</li>'}).join('')+'</ul>'+
   '<div class="note">Exclusief btw en transport</div><div class="note">Upgrade naar Premium Plus mogelijk</div>'+
   '<a class="btn btn-gold" href="#configurator" data-start="aurora28">Stel jouw Aurora 28 samen '+ARR+'</a><a class="btn btn-line" href="#contact">Offerte aanvragen</a></div></div></section>'+
   '<section style="background:#fff"><div class="a28-rooms">'+rooms.map(function(r,i){return '<button class="a28-room" data-a28room="'+i+'" style="'+bg('a28_r'+i)+'"><i></i><span>'+r.toUpperCase()+'</span></button>'}).join('')+'</div></section>'+
   '<section class="a28-seasons"><div class="wrap"><div class="eyebrow">Aurora 28 in elk seizoen</div><h2 class="h2" style="font-size:3.2rem;margin:.6rem 0 2rem">Dag, nacht, zomer en winter</h2><div class="sgrid">'+[['a28_day','Zomer · dag'],['a28_purple','Winteravond · sfeerverlichting'],['a28_stone','Natuursteen gevel'],['insp_fire','Uitzicht vanuit de woonkamer']].map(function(s,i){return '<button class="sg" data-season="'+i+'" style="'+bg(s[0])+'"><span>'+s[1]+'</span></button>'}).join('')+'</div></div></section>'+
   '<section class="a28-tag"><div class="wrap">'+[['leaf','Duurzaam'],['gem','Tijdloos design'],['house','Waar jij wilt'],['heart','Een slimme investering']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'<em>YOUR SPACE. YOUR FREEDOM.</em></div></section>';
}
function simpleHero(label,title,sub){return '<section class="hero hero-models"><div class="hero-bg" style="'+bg('hero_models')+'"></div><div class="wrap"><div class="eyebrow">'+label+'</div><h1>'+title+'</h1><p>'+sub+'</p></div></section>'}
function pageInspiratie(){
  var imgs=['a28_night','insp_fire','a28_day','big_forest50','big_nordic32','a28_purple','kit_big','a28_stone','int_bed_big','m_aurora36'];
  return simpleHero('Inspiratie','Inspiratie','Laat je inspireren door onze woningen en interieurs.')+'<section class="simple"><div class="wrap"><p class="intro">Warm hout, grote glaspartijen en sfeervolle verlichting. Bekijk hoe onze klanten hun modulaire woning hebben samengesteld en vind ideeën voor jouw eigen plek.</p><div class="insp">'+
   imgs.map(function(k,i){return '<div'+(i===0||i===7?' class="w2"':'')+' style="'+bg(k)+'"></div>'}).join('')+'</div></div></section>';
}
function pageZakelijk(){
  return simpleHero('Zakelijk','Zakelijke oplossingen','Modulaire units voor recreatieparken, hospitality en bedrijven.')+'<section class="simple" style="background:var(--cream)"><div class="wrap"><div class="feat3">'+
   [['palm','Recreatieparken','Luxe verhuurunits die snel geplaatst zijn en direct rendement opleveren.'],['office','Kantoor & werkplek','Een representatieve werkplek of tuinkantoor, volledig turnkey opgeleverd.'],['care','Zorg & mantelzorg','Comfortabele, levensloopbestendige woonunits voor zorg dichtbij huis.']]
   .map(function(f){return '<div class="panel">'+I(f[0])+'<h3>'+f[1]+'</h3><p>'+f[2]+'</p></div>'}).join('')+'</div><div class="grid3">'+MODELS.filter(function(m){return m.cat.indexOf('zakelijk')>=0}).map(function(m){return card(m)}).join('')+'</div></div></section>';
}
function pageOver(){
  return simpleHero('Over ons','Over NMK Living','Modular homes for a better tomorrow.')+'<section class="simple"><div class="wrap"><p class="intro">NMK Living ontwerpt en bouwt luxe modulaire woningen die overal te plaatsen zijn. Met premium materialen, grote glaspartijen en een volledig turnkey oplevering maken we wonen in de natuur bereikbaar, comfortabel en duurzaam.</p><div class="feat3">'+
   [['leaf','Duurzaam & energiezuinig','Volledig geïsoleerd en klaar voor zonne-energie en warmtepomp.'],['gem','Premium afwerking','Hout, metaal en natuursteen, afgewerkt tot in detail.'],['truck','Turnkey opgeleverd','Van vergunning tot plaatsing: wij regelen het hele traject.']]
   .map(function(f){return '<div class="panel">'+I(f[0])+'<h3>'+f[1]+'</h3><p>'+f[2]+'</p></div>'}).join('')+'</div></div></section>';
}
function pageLogin(t){
  var klant=t==='Mijn NMK';
  return '<section class="cfg login-sec" style="padding:4rem 0"><div class="wrap"><div class="panel login soon"><span class="badge-soon">Binnenkort beschikbaar</span><h2>'+t+'</h2><p>'+(klant?'In je persoonlijke omgeving volg je straks je configuraties, offertes, bestellingen en de bouwstatus van je woning, van productie tot oplevering.':'De beheeromgeving voor medewerkers van NMK Living wordt op dit moment gebouwd.')+'</p>'+
   (klant?'<ul>'+['Mijn configuraties','Offertes en bestellingen','Projectstatus en planning','Berichten en afspraken'].map(function(x){return '<li>'+I('check',2.2)+x+'</li>'}).join('')+'</ul><a class="btn btn-gold" href="#contact">Vraag eerst een offerte aan '+ARR+'</a>':'<a class="btn btn-dark" href="#home">Terug naar home</a>')+'</div></div></section>';
}

/* ---------- modal / toast ---------- */
function modal(html){var d=document.createElement('div');d.className='modal';d.innerHTML=html;document.body.appendChild(d);d.addEventListener('click',function(e){if(e.target===d||e.target.closest('.x'))d.remove()});return d}
function tour(start,custom){
  var list=custom||[['a28_r0','Slaapkamer'],['a28_r1','Badkamer'],['a28_r2','WC'],['a28_r3','Keuken'],['a28_r4','Woonkamer'],['a28_night','Buitenkant'],['int_bed_big','Uitzicht slaapkamer']],i=typeof start==='number'?start:0;
  var d=modal('<div class="box"><button class="x" aria-label="Sluiten">×</button><div class="img"></div><div class="cap"></div><button class="nav-l">'+I('left',2)+'</button><button class="nav-r">'+I('right',2)+'</button></div>');
  function show(){d.querySelector('.img').style.backgroundImage='url('+IMG[list[i][0]]+')';d.querySelector('.cap').textContent=list[i][1]+'  ·  '+(i+1)+' / '+list.length}
  d.querySelector('.nav-l').onclick=function(){i=(i+list.length-1)%list.length;show()};d.querySelector('.nav-r').onclick=function(){i=(i+1)%list.length;show()};show();
}
function toast(t){var d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove()},2600)}


/* ---------- premium: header, reveal, prijsanimatie ---------- */
var hdr=document.getElementById('hdr');
function onScroll(){hdr.classList.toggle('scrolled',window.scrollY>30)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
function reveal(){
  if(!io)return;
  clearTimeout(reveal.t);reveal.t=setTimeout(function(){$$('.rv').forEach(function(e){e.classList.add('in')})},4000);
  $$('.feature .grid>*,.specs-row>*,.compose .grid>*,.models-home .head,.cards4>.mcard,.feat3>*,.insp>div,.simple .intro,.models-page .grid3>.mcard').forEach(function(el,i){
    if(el.getBoundingClientRect().top<window.innerHeight*.92)return;
    el.classList.add('rv');el.style.transitionDelay=((i%4)*90)+'ms';io.observe(el)});
}
var lastTotal=null;
function animPrice(){
  var to=total(),from=lastTotal===null?to:lastTotal;lastTotal=to;
  var els=$$('.pricecard .amt');if(from===to||!els.length)return;
  var t0=performance.now(),d=650;
  (function f(now){var k=Math.min(1,(now-t0)/d),e=1-Math.pow(1-k,3),v=Math.round((from+(to-from)*e)/10)*10;els.forEach(function(el){el.textContent=eur(k<1?v:to)});if(k<1)requestAnimationFrame(f)})(t0);
}

/* ---------- router ---------- */
var route='home';
function render(){
  var raw=(location.hash||'#home').slice(1),mm=raw.match(/^configurator-([1-8])$/),h=mm?['configurator',mm[1]]:[raw];route=h[0]||'home';
  if(route==='configurator'){S.step=(h[1]&&+h[1]>=1&&+h[1]<=8)?+h[1]:1;}
  var pages={home:pageHome,modellen:pageModellen,configurator:pageConfig,inspiratie:pageInspiratie,zakelijk:pageZakelijk,'over-ons':pageOver,contact:pageContact,'aurora-28':pageA28,'mijn-nmk':function(){return pageLogin('Mijn NMK')},beheer:function(){return pageLogin('Beheer')}};
  if(!pages[route])route='home';
  if(route!=='contact')wantReserve=false;
  var META={home:['NMK Living | Luxe modulaire woningen – turnkey en overal te plaatsen','Stijlvolle modulaire woningen, volledig naar wens samen te stellen en turnkey opgeleverd. Aurora 28 vanaf € 39.900.'],
   modellen:['Modellen | Modulaire woningen van 28 tot 72 m² – NMK Living','Bekijk alle modulaire woningen van NMK Living: Aurora 28, 36, 48, Villa, Nordic 32 en Forest 50. Alle modellen 4 meter breed.'],
   'aurora-28':['Aurora 28 | 28 m² modulaire woning vanaf € 39.900 – NMK Living','Aurora 28: 7,00 × 4,00 m, 1 slaapkamer, badkamer, apart toilet en open keuken. Turnkey opgeleverd vanaf € 39.900 excl. btw en transport.'],
   configurator:['Configurator | Stel je modulaire woning samen – NMK Living','Kies model, gevel, interieur, keuken, badkamer en installaties en zie direct je prijs.'],
   contact:['Vrijblijvende offerte aanvragen – NMK Living','Binnen 2 werkdagen een complete PDF-offerte voor jouw modulaire woning. Invullen duurt minder dan een minuut.'],
   inspiratie:['Inspiratie | Modulaire woningen in elk seizoen – NMK Living','Laat je inspireren door de woningen en interieurs van NMK Living.'],
   zakelijk:['Zakelijk | Modulaire units voor recreatie, kantoor en zorg – NMK Living','Modulaire verhuurunits, kantoorruimte en mantelzorgwoningen, turnkey opgeleverd.'],
   'over-ons':['Over NMK Living | Modular homes for a better tomorrow','NMK Living ontwerpt en bouwt luxe modulaire woningen die overal te plaatsen zijn.']}[route]||['NMK Living','Luxe modulaire woningen.'];
  document.title=META[0];var md=document.querySelector('meta[name=description]');if(md)md.setAttribute('content',META[1]);
  app.innerHTML=pages[route]();
  document.body.classList.toggle('over-hero',route==='home'||route==='modellen'||route==='aurora-28'||route==='inspiratie'||route==='zakelijk'||route==='over-ons');
  $$('.nav a').forEach(function(a){a.classList.toggle('on',a.dataset.r===route)});
  $('#mnav').classList.remove('open');
  if(route==='modellen')bindModels();
  if(route==='configurator')bindCfg();
  if(route==='contact')bindForm();
  if(route==='home')bindHome();
  if(route==='configurator')animPrice();
  requestAnimationFrame(reveal);onScroll();
}
function go(){render();window.scrollTo(0,0)}
window.addEventListener('hashchange',go);

/* ---------- binders ---------- */
function bindHome(){
  var th=['feat_big','a28_r0','a28_r4','a28_r3','a28_r1'],gi=0;
  function set(i){gi=(i+th.length)%th.length;$('#gMain').style.backgroundImage='url('+IMG[th[gi]]+')';$$('.thumbs .t').forEach(function(t,j){t.classList.toggle('on',j===gi)})}
  $$('[data-gi]').forEach(function(b){b.onclick=function(){set(+b.dataset.gi)}});
  $$('[data-g]').forEach(function(b){b.onclick=function(){set(gi+(+b.dataset.g))}});
}
function bindModels(){
  renderModelGrid();
  $$('[data-cat]').forEach(function(b){b.onclick=function(){F.cat=b.dataset.cat;F.q='';$$('[data-cat]').forEach(function(x){x.classList.toggle('on',x===b)});renderModelGrid()}});
  ['opp','slp','bud','sort'].forEach(function(id){$('#'+id).onchange=function(){F[id]=this.value;renderModelGrid()}});
}
function rerender(){var y=window.scrollY;persist();app.innerHTML=pageConfig();bindCfg();window.scrollTo(0,y);animPrice()}
function setStep(n){S.step=Math.max(1,Math.min(8,n));persist();if(location.hash!=='#configurator-'+S.step)location.hash='configurator-'+S.step;else go()}
function bindCfg(){
  persist();
  var cs=$('.stp.cur'),sw=$('.stepper .wrap');if(cs&&sw&&sw.scrollWidth>sw.clientWidth)sw.scrollLeft=cs.offsetLeft-sw.clientWidth/2+cs.offsetWidth/2;
  $$('[data-step]').forEach(function(b){b.onclick=function(){setStep(+b.dataset.step)}});
  $$('[data-next]').forEach(function(b){b.onclick=function(){setStep(S.step+1)}});
  $$('[data-reset]').forEach(function(b){b.onclick=function(){resetCfg(S.model);rerender()}});
  $$('[data-model]').forEach(function(b){b.onclick=function(){S.model=b.dataset.model;rerender()}});
  $$('[data-view]').forEach(function(b){b.onclick=function(){S.view=b.dataset.view;S.room=-1;rerender()}});
  $$('[data-sub]').forEach(function(b){b.onclick=function(){S.sub=b.dataset.sub;S.room=-1;rerender()}});
  $$('[data-room]').forEach(function(b){b.onclick=function(){S.room=S.room===+b.dataset.room?-1:+b.dataset.room;rerender()}});
  $$('[data-dn]').forEach(function(b){b.onclick=function(){S.dn=b.dataset.dn;rerender()}});
  $$('[data-gevel]').forEach(function(b){b.onclick=function(){S.gevel=+b.dataset.gevel;rerender()}});
  $$('[data-more]').forEach(function(b){b.onclick=function(){toast('Meer kleuren (RAL op aanvraag) bespreken we graag in je offerte.')}});
  $$('[data-sw]').forEach(function(b){b.onclick=function(){$('#swTrack').scrollLeft+=(+b.dataset.sw)*240}});
  $$('[data-tour]').forEach(function(b){b.onclick=function(){tour(0)}});
  $$('[data-itab]').forEach(function(b){b.onclick=function(){S.itab=b.dataset.itab;rerender()}});
  $$('[data-mat]').forEach(function(b){b.onclick=function(){S[S.itab]=+b.dataset.mat;rerender()}});
  $$('[data-ith]').forEach(function(b){b.onclick=function(){S.ithumb=+b.dataset.ith;rerender()}});
  $$('[data-kth]').forEach(function(b){b.onclick=function(){if(S.step===4)S.kthumb=+b.dataset.kth;else S.bthumb=+b.dataset.kth;rerender()}});
  $$('[data-k]').forEach(function(b){b.onclick=function(){if(S.step===4){S.keuken=+b.dataset.k;S.kthumb=0}else{S.bad=+b.dataset.k;S.bthumb=0}rerender()}});
  $$('[data-r2]').forEach(function(b){b.onclick=function(){if(S.step===4)S.app=+b.dataset.r2;else S.kraan=+b.dataset.r2;rerender()}});
  $$('[data-opt]').forEach(function(b){b.onclick=function(){if(b.classList.contains('locked'))return;var k=b.dataset.opt;if(S.opts[k])delete S.opts[k];else S.opts[k]=1;rerender()}});
  $$('[data-jump]').forEach(function(b){b.onclick=function(){$$('[data-jump]').forEach(function(x){x.classList.toggle('on',x===b)});document.getElementById('sec-'+b.dataset.jump).scrollIntoView({behavior:'smooth'})}});
  $$('[data-fromcfg]').forEach(function(b){b.onclick=function(){fromCfg=true}});
  $$('[data-reserve]').forEach(function(b){b.onclick=function(){var d=modal('<div class="card"><h3>Reservering aanvragen</h3><p>Leg je productieplek voor de '+M(S.model).name+' vast. Online betalen komt binnenkort; nu nemen we binnen 1 werkdag persoonlijk contact met je op om de reservering en aanbetaling van € 2.500 te regelen.</p><button class="btn btn-gold" style="width:100%">Verder naar je gegevens '+ARR+'</button></div>');
    d.querySelector('.btn').onclick=function(){d.remove();fromCfg=true;wantReserve=true;location.hash='contact'}}});
  /* 360 pan */
  var st=$('.stage.pan');
  if(st){var x0=null,pos=0;function down(e){x0=(e.touches?e.touches[0]:e).clientX;st.style.cursor='grabbing'}function mv(e){if(x0===null)return;var x=(e.touches?e.touches[0]:e).clientX;pos+=x-x0;x0=x;st.style.backgroundPosition=pos+'px 0'}function up(){x0=null;st.style.cursor='grab'}
    st.addEventListener('mousedown',down);st.addEventListener('touchstart',down,{passive:true});window.addEventListener('mousemove',mv);st.addEventListener('touchmove',mv,{passive:true});window.addEventListener('mouseup',up);st.addEventListener('touchend',up)}
}
function bindForm(){
  var box=$('#offForm'),form=box.querySelector('form'),msg=$('#formMsg');
  var ENDPOINT=(window.NMK_CONFIG&&window.NMK_CONFIG.endpoint)||'';
  function chipVal(n){var c=form.querySelector('[data-chips="'+n+'"] .on');return c?c.dataset.v:''}
  function chipTxt(n){var c=form.querySelector('[data-chips="'+n+'"] .on');return c?c.textContent:''}
  /* alleen voorkeuren (geen persoonsgegevens) onthouden */
  function save(){try{localStorage.setItem('nmk_lead_pref',JSON.stringify({model:chipVal('model'),doel:chipVal('doel'),wanneer:chipVal('wanneer'),callme:$('#callme').checked}))}catch(e){}}
  try{localStorage.removeItem('nmk_lead')}catch(e){}
  function valid(inp){var v=inp.value.trim(),t=inp.dataset.req;
    if(inp.id==='tel')return !v||v.replace(/[^\d]/g,'').length>=10;
    if(!t)return true;
    return t==='email'?/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v):t==='pc'?/^\d{4}\s?[a-zA-Z]{2}$/.test(v):v.length>1;}
  function check(inp,show){var ok=valid(inp),f=inp.parentNode;if(show||f.classList.contains('err'))f.classList.toggle('err',!ok);f.classList.toggle('ok',ok&&!!inp.value.trim());return ok}
  $$('input[data-req],#tel',form).forEach(function(inp){inp.addEventListener('blur',function(){check(inp,!!inp.value.trim())});inp.addEventListener('input',function(){check(inp,false)})});
  var pc=$('#pc');pc.addEventListener('input',function(){var v=pc.value.toUpperCase().replace(/[^0-9A-Z]/g,'');if(/^\d{4}[A-Z]{1,2}$/.test(v))v=v.slice(0,4)+' '+v.slice(4);if(pc.value!==v)pc.value=v.slice(0,7)});
  $$('[data-chips]',form).forEach(function(c){c.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;var was=b.classList.contains('on');$$('.chip',c).forEach(function(x){x.classList.remove('on')});if(!was)b.classList.add('on');save()})});
  $('#addNote').onclick=function(){this.hidden=true;$('#noteFld').hidden=false;$('#opm').focus()};
  $('#callme').addEventListener('change',save);
  $$('[data-plan]').forEach(function(a){a.onclick=function(e){e.preventDefault();$('#callme').checked=true;save();$('#naam').focus();toast('We bellen je voor een adviesgesprek. Vul je gegevens in.')}});
  function payload(){
    var m=M(S.model),cfg=null;
    if(fromCfg){cfg={model:m.name,afmeting:m.dim,basisprijs:m.price,meerwerk:optSum(),transport:TRANSPORT,plaatsing:PLAATSING,totaal:total()+TRANSPORT+PLAATSING,
      keuzes:[['Gevel',GEVEL[S.gevel][0]],['Vloer',INT.vloer.opts[S.vloer][0]],['Wand',INT.wand.opts[S.wand][0]],['Plafond',INT.plafond.opts[S.plafond][0]],['Stijl',INT.stijl.opts[S.stijl][0]],['Keuken',KEUKEN[S.keuken][0]],['Apparatuur',APP[S.app][0]],['Badkamer',BAD[S.bad][0]],['Kraanwerk',KRAAN[S.kraan][0]]].map(function(x){return x[0]+': '+x[1]}).concat(allOpts().filter(function(o){return S.opts[o[0]]}).map(function(o){return 'Optie: '+o[1]}))};}
    return {naam:$('#naam').value.trim(),email:$('#em').value.trim(),telefoon:$('#tel').value.trim(),postcode:$('#pc').value.trim(),opmerking:$('#opm').value.trim(),
      model:fromCfg?m.name:chipTxt('model'),doel:chipTxt('doel'),wanneer:chipTxt('wanneer'),adviesgesprek:$('#callme').checked,reservering:wantReserve,configuratie:cfg,website:form.website.value};
  }
  function showMsg(html,cls){msg.className='form-msg '+(cls||'');msg.innerHTML=html;msg.hidden=false;msg.scrollIntoView({block:'center',behavior:'smooth'})}
  function thanks(d){
    box.innerHTML='<div class="thanks2"><div class="tick">'+I('check',2.2)+'</div><h2>Bedankt, '+esc(d.naam.split(' ')[0])+'!</h2><p>Je aanvraag is ontvangen. Zo gaat het verder:</p><ol>'+
     (d.mail===false?'<li><b>Vandaag</b>We bekijken je aanvraag. Krijg je geen bevestiging per mail, dan nemen we sowieso contact met je op.</li>':'<li><b>Vandaag</b>Je ontvangt een bevestiging op '+esc(d.email)+'.</li>')+
     '<li><b>Binnen 2 werkdagen</b>Je complete PDF-offerte met specificaties, prijzen en planning.</li>'+
     '<li><b>'+(d.adviesgesprek?'We bellen je':'Daarna')+'</b>'+(d.adviesgesprek?'Voor een gratis adviesgesprek over jouw wensen en locatie.':'Een persoonlijk adviesgesprek, als je dat wilt.')+'</li></ol>'+
     '<div class="btn-row"><a class="btn btn-gold" href="#modellen">Bekijk alle modellen '+ARR+'</a><a class="btn btn-dark" href="#home">Naar home</a></div></div>';
    box.scrollIntoView({behavior:'smooth'});fromCfg=false;wantReserve=false;
  }
  form.onsubmit=function(e){
    e.preventDefault();msg.hidden=true;var first=null;
    $$('input[data-req],#tel',form).forEach(function(inp){if(!check(inp,true)&&!first)first=inp});
    if(first){first.focus();first.parentNode.scrollIntoView({block:'center',behavior:'smooth'});return}
    var d=payload(),btn=form.querySelector('.submit'),label=btn.innerHTML;
    if(!ENDPOINT){
      showMsg('<b>Je aanvraag is nog niet verstuurd.</b> Dit is een voorbeeldversie van de website zonder verbinding met NMK Living. Neem direct contact op via <b>Bel ons</b> of <b>WhatsApp</b>, of probeer het opnieuw op de live website.','warn');return;
    }
    btn.disabled=true;btn.innerHTML='Bezig met versturen…';
    var ctl=('AbortController' in window)?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},15000);
    fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d),signal:ctl?ctl.signal:undefined})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||!j.ok)throw new Error(j.error||('HTTP '+r.status));return j})})
      .then(function(j){clearTimeout(tm);try{localStorage.removeItem('nmk_lead_pref')}catch(e){}d.mail=j.mail;thanks(d)})
      .catch(function(err){clearTimeout(tm);btn.disabled=false;btn.innerHTML=label;
        showMsg('<b>Versturen is niet gelukt.</b> '+esc(err&&err.message&&err.message.indexOf('HTTP')<0?err.message:'Er ging iets mis met de verbinding.')+' Je gegevens staan nog in het formulier: probeer het opnieuw, of neem direct contact met ons op.','err')});
  };
}

/* ---------- globale handlers ---------- */
document.addEventListener('click',function(e){
  var s=e.target.closest('[data-start]');if(s){resetCfg(s.dataset.start);}
  var se=e.target.closest('[data-season]');if(se)tour(+se.dataset.season,[['a28_day','Zomer · dag'],['a28_purple','Winteravond'],['a28_stone','Natuursteen gevel'],['insp_fire','Uitzicht vanuit de woonkamer'],['a28_night','Winternacht']]);
  var ar=e.target.closest('[data-a28room]');if(ar)tour(+ar.dataset.a28room);
  if(e.target.closest('[data-video]')){modal('<div class="box"><button class="x" aria-label="Sluiten">×</button><div class="img" style="background-image:url('+IMG.hero_home+')"></div><div class="cap">Bedrijfsvideo volgt binnenkort</div></div>')}
  if(e.target.closest('[data-privacy]')){e.preventDefault();modal('<div class="card" style="text-align:left"><h3>Privacyverklaring</h3><p>NMK Living gebruikt je gegevens alleen om je offerte op te stellen en contact met je op te nemen over je aanvraag. We delen niets met derden zonder jouw toestemming en bewaren je gegevens niet langer dan nodig. Je kunt altijd vragen om inzage of verwijdering.</p><button class="btn btn-gold x" style="width:100%">Sluiten</button></div>')}
  var lb=$('#langBtn');if(e.target.closest('#langBtn'))lb.classList.toggle('open');else lb.classList.remove('open');
});
$('#searchBtn').onclick=function(){$('#searchBar').classList.toggle('open');if($('#searchBar').classList.contains('open'))$('#searchIn').focus()};
$('#searchIn').addEventListener('keydown',function(e){if(e.key==='Enter'){F={cat:'alle',opp:'',slp:'',bud:'',sort:'',q:this.value.trim().toLowerCase()};$('#searchBar').classList.remove('open');if(route==='modellen')go();else location.hash='modellen'}});
$('#menuBtn').onclick=function(){$('#mnav').classList.toggle('open')};
$$('[data-img]').forEach(function(i){i.src=IMG[i.dataset.img]});
render();
})();
