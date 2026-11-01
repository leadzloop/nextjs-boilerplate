var IMG = {"a24_photo": "site/v4/img/a24_photo.webp?v=98c32553", "a28_r0": "site/v4/img/a28_r0.webp?v=fed06738", "a28_r1": "site/v4/img/a28_r1.webp?v=04e18b2c", "a28_r2": "site/v4/img/a28_r2.webp?v=0ecf4e73", "a28_r3": "site/v4/img/a28_r3.webp?v=8c70ea7f", "a28_r4": "site/v4/img/a28_r4.webp?v=d6645163", "bg_mtn": "site/v4/img/bg_mtn.webp?v=6691e426", "c_bath": "site/v4/img/c_bath.webp?v=1bb0bb5a", "c_bath_day": "site/v4/img/c_bath_day.webp?v=c448c4fb", "c_bath_pur": "site/v4/img/c_bath_pur.webp?v=e42a71f1", "c_kit": "site/v4/img/c_kit.webp?v=f09a23a2", "c_kit_day": "site/v4/img/c_kit_day.webp?v=1f063afa", "c_kit_pur": "site/v4/img/c_kit_pur.webp?v=128b6757", "fl0": "site/v4/img/fl0.webp?v=54fbc65b", "fl1": "site/v4/img/fl1.webp?v=2241343d", "fl2": "site/v4/img/fl2.webp?v=9dc0c905", "fl3": "site/v4/img/fl3.webp?v=e208a9a6", "fl4": "site/v4/img/fl4.webp?v=6406ecf2", "fl5": "site/v4/img/fl5.webp?v=89c20da7", "full_day": "site/v4/img/full_day.webp?v=d8525a83", "full_fire": "site/v4/img/full_fire.webp?v=68946aa9", "full_forest": "site/v4/img/full_forest.webp?v=bf0931e9", "full_night": "site/v4/img/full_night.webp?v=07d58261", "full_nordic": "site/v4/img/full_nordic.webp?v=97ddeecc", "full_purple": "site/v4/img/full_purple.webp?v=7b819a67", "full_stone": "site/v4/img/full_stone.webp?v=6ae8813a", "gv0": "site/v4/img/gv0.webp?v=bb20a64e", "gv1": "site/v4/img/gv1.webp?v=79591249", "gv2": "site/v4/img/gv2.webp?v=f7bea83e", "gv3": "site/v4/img/gv3.webp?v=e1fed59d", "gv4": "site/v4/img/gv4.webp?v=a657d7ea", "gv5": "site/v4/img/gv5.webp?v=c95ea587", "gv6": "site/v4/img/gv6.webp?v=b3459404", "hw_bump": "site/v4/img/hw_bump.webp?v=d46fa7aa", "hw_rough": "site/v4/img/hw_rough.webp?v=45638ea2", "int_th0": "site/v4/img/int_th0.webp?v=44cd27cd", "int_th1": "site/v4/img/int_th1.webp?v=07f2fa2f", "int_th2": "site/v4/img/int_th2.webp?v=76f84464", "lam_bump": "site/v4/img/lam_bump.webp?v=33f6cc1c", "logo": "site/v4/img/logo.webp?v=a5e09472", "m_a24": "site/v4/img/m_a24.webp?v=cfc94344", "m_a42": "site/v4/img/m_a42.webp?v=3ddb646d", "m_a42b": "site/v4/img/m_a42b.webp?v=3ddb646d", "m_aurora36": "site/v4/img/m_aurora36.webp?v=cb00c08d", "m_aurora48": "site/v4/img/m_aurora48.webp?v=cc33bf4f", "m_forest50": "site/v4/img/m_forest50.webp?v=4bcf36d2", "m_nordic32": "site/v4/img/m_nordic32.webp?v=52aa14b3", "m_villa": "site/v4/img/m_villa.webp?v=fb84a239", "pano_day": "site/v4/img/pano_day.webp?v=52922576", "t_stuc": "site/v4/img/t_stuc.webp?v=07fa9f46", "t_wit": "site/v4/img/t_wit.webp?v=946fe7ca"};
(function(){
'use strict';
var app=document.getElementById('app');
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function eur(n){return n==null||isNaN(n)?'Op aanvraag':'€ '+n.toLocaleString('nl-NL')}
function plus(n){return 'Meerprijs'}
function op(n){return n?'Meerprijs':'Standaard'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function mimg(id){return id==='aurora28'?'m_a24':id==='aurora48'?'m_a42b':'m_'+id}
function bg(k){return 'background-image:url('+IMG[k]+')'}

/* ---------- iconen (dunne lijn) ---------- */
var P={
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 heatp:'<rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="10" cy="12" r="4"/><path d="M10 8v8M6 12h8M17 8v8"/>',
 floorh:'<path d="M3 19h18"/><path d="M7 15c-1.5-1.5 1.5-3 0-4.5S8.5 7.5 7 6M12 15c-1.5-1.5 1.5-3 0-4.5S13.5 7.5 12 6M17 15c-1.5-1.5 1.5-3 0-4.5S18.5 7.5 17 6"/>',
 solar:'<path d="M4 14l3-9h10l3 9z"/><path d="M5.5 9.5h13M10 5l-1 9M14 5l1 9M12 14v5M8 19h8"/>',
 battery:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M10 2h4M13 8l-3 5h4l-3 5"/>',
 deck:'<path d="M3 15h18M3 18.5h18M6 15v6M12 15v6M18 15v6"/><path d="M4 12l8-7 8 7"/>',
 roof:'<path d="M2 9l10-5 10 5"/><path d="M5 8v12M19 8v12M3 20h18"/>',
 lamp:'<path d="M9 21h6M12 21v-8"/><path d="M8 13h8l-1.5-6h-5z"/><path d="M5 6l1.5 1.5M19 6l-1.5 1.5M12 3v1.5"/>',
 blind:'<path d="M3 4h18M5 4v12h14V4"/><path d="M5 8h14M5 12h14M12 16v4"/>',
 curtain:'<path d="M3 3h18"/><path d="M5 3c0 6 3 10 5 18M19 3c0 6-3 10-5 18"/><path d="M5 3c2 4 2 9 0 18M19 3c-2 4-2 9 0 18"/>',
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
 {id:'aurora28',name:'Aurora 24',m2:24,bed:'douche + toilet',beds:0,price:39900,dim:'6,00 × 4,00 m',cat:['tiny','recreatie','mantelzorg','tuinkantoor']},
 {id:'aurora36',name:'Aurora 36',m2:36,bed:'2 slaapkamers',beds:2,price:49900,dim:'9,00 × 4,00 m',cat:['recreatie','permanent','mantelzorg']},
 {id:'aurora48',name:'Aurora 42',m2:42,bed:'1 slaapkamer',beds:1,price:59900,dim:'10,50 × 4,00 m',layout:[{t:'bed',w:3,label:'Slaapkamer'},{t:'douche',w:1.5,d:3,label:'Douche'},{t:'toilet',w:1.5,d:3,label:'Toilet'},{t:'live',w:4.5,label:'Woonkamer / keuken'}],cat:['recreatie','permanent','zakelijk']},
 {id:'villa',name:'Aurora Villa',m2:72,bed:'2-3 slaapkamers',beds:3,price:null,dim:'18,00 × 4,00 m',cat:['permanent','zakelijk']},
];
function M(id){return MODELS.filter(function(m){return m.id===id})[0]}
var GEVEL=[['Antraciet',0],['Zwart',0],['Houtlook',1600],['Olijfgroen',1200],['Natuurhout',1900],['Aluminium',2400]];
var INT={
 vloer:{label:'Vloer',opts:[['Naturel eiken',0,'fl0'],['Donker eiken',800,'fl1'],['Visgraat',2400,'fl2'],['Betonlook',1100,'fl3'],['Zandsteen',1400,'fl4'],['Notenhout',1600,'fl5']]},
 wand:{label:'Wand',opts:[['Lamellen eiken',0,'gv4'],['Lamellen noten',900,'fl5'],['Betonlook',1200,'gv5'],['Stucwerk naturel',600,'t_stuc'],['Olijfgroen accent',700,'gv3'],['Antraciet',0,'gv0']]},
 plafond:{label:'Plafond',opts:[['Houten plafond',0,'fl0'],['Donker hout',900,'fl1'],['Lamellen eiken',1400,'gv4'],['Strak wit',0,'t_wit'],['Betonlook',800,'fl3'],['Notenhout',1200,'fl5']]},
 stijl:{label:'Stijl',opts:[['Warm natuurlijk',0,'int_th0'],['Modern donker',0,'a28_r0'],['Luxe hotel',1500,'a28_r4']]}
};
var KEUKEN=[['Standaard',0,'c_kit'],['Premium',3300,'c_kit_day'],['Luxe',5900,'c_kit_pur']];
var APP=[['Basis (inbegrepen)',0],['Uitgebreid',1200],['Premium',2400]];
var BAD=[['Standaard',0,'c_bath'],['Premium',2600,'c_bath_day'],['Luxe',4900,'c_bath_pur']];
var KRAAN=[['Zwart mat (inbegrepen)',0],['Geborsteld goud',450],['Regendouche + thermostaat',850]];
var INST=[
 {id:'klimaat',t:'Klimaatregeling',ic:'snow',o:[['airco','Airconditioning',0,null,1,'ac'],['wp','Warmtepomp',4300,null,0,'heatp'],['vv','Vloerverwarming',2800,null,0,'floorh']]},
 {id:'zon',t:'Zonne-energie',ic:'sun',o:[['zp','Zonnepanelen',4900,null,0,'solar'],['bat','Thuisbatterij',3500,null,0,'battery'],['omv','Omvormer',900,null,0,'sun']]},
 {id:'buiten',t:'Buitenruimte',ic:'tree',o:[['terras','Houten terras',3200,null,0,'deck'],['overk','Overkapping',4800,null,0,'roof'],['bv','Buitenverlichting',900,null,0,'lamp']]},
 {id:'smart',t:'Slimme technologie',ic:'chip',o:[['smart','Smart home pakket',1900,null,0,'chip'],['slot','Slim deurslot',450,null,0,'chip']]},
 {id:'licht',t:'Verlichting',ic:'bulb',o:[['dim','Dimbare sfeerverlichting',650,null,0,'bulb']]},
 {id:'beveil',t:'Beveiliging',ic:'lock',o:[['alarm','Alarmsysteem',1100,null,0,'lock'],['cam','Camerabeveiliging',850,null,0,'lock']]}
];
var EXTRA=[
 {id:'meubel',t:'Meubilair',ic:'sofa2',o:[['mpak','Compleet meubelpakket',6500,null,0,'sofa'],['bedpak','Slaapkamerpakket',1400,null,0,'bed'],['loung','Loungeset terras',1250,null,0,'sofa2']]},
 {id:'glas',t:'Ramen & glas',ic:'glass',o:[['screens','Elektrische screens',1800,null,0,'blind'],['gord','Gordijnen op maat',950,null,0,'curtain'],['triple','Triple glas upgrade',2200,null,0,'glass']]},
 {id:'overig',t:'Overig',ic:'dots',o:[['vuur','Vuurschaal terras',650,null,0,'flame'],['kraan','Extra buitenkraan',250,null,0,'drop'],['laad','Laadpaal auto',1450,null,0,'plug']]}
];
var TRANSPORT=2500, PLAATSING=2000;

/* ---------- configurator state ---------- */
var S={step:1,model:'aurora28',gevel:0,vloer:0,wand:0,plafond:0,stijl:0,keuken:0,app:0,bad:0,kraan:0,opts:{airco:1},view:'plan',sub:'plan',room:-1,itab:'vloer',ithumb:0,kthumb:0,bthumb:0,auto:true,seen:{}};
var DEF=JSON.stringify(S);
var DEF0=null;try{var saved=JSON.parse(localStorage.getItem('nmk_cfg')||'null');if(saved)for(var k in saved)S[k]=saved[k];}catch(e){}
function resetCfg(model){var keep=S.auto,d=JSON.parse(DEF);for(var k in d)S[k]=d[k];S.auto=keep;S.model=model||'aurora28';S.step=1;lastTotal=null;persist();}
function persist(){try{localStorage.setItem('nmk_cfg',JSON.stringify(S))}catch(e){}}
function allOpts(){var a=[];INST.concat(EXTRA).forEach(function(s){s.o.forEach(function(o){a.push(o)})});return a}
function optSum(){
  var s=GEVEL[S.gevel][1];
  ['vloer','wand','plafond','stijl'].forEach(function(k){s+=INT[k].opts[S[k]][1]});
  s+=KEUKEN[S.keuken][1]+APP[S.app][1]+BAD[S.bad][1]+KRAAN[S.kraan][1];
  allOpts().forEach(function(o){if(S.opts[o[0]])s+=o[2]});
  return s;
}
function total(){var p=M(S.model).price;return p==null?null:p+optSum()}
function grand(){var t=total();return t==null?null:t+TRANSPORT+PLAATSING}

/* ---------- gedeelde blokken ---------- */
function planSVG(mid){
  var m=M(mid||'aurora28'),L=m.m2/4,X=L*100,zero=!m.beds,F='#efe4d2',Tl='#e6e4df',W='#262827',Ln='#8f8a82';
  var r=function(x,y,w,h,f,s,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(rx?' rx="'+rx+'"':'')+' fill="'+f+'" stroke="'+(s||'none')+'"/>'};
  var lab=function(t,x,y,sub,area){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="15" font-weight="600" fill="#2a241c">'+t+'</text>'+(sub?'<text x="'+x+'" y="'+(y+18)+'" text-anchor="middle" font-size="12.5" fill="#5e574d">'+sub+'</text>':'')+(area?'<rect x="'+(x-34)+'" y="'+(y+26)+'" width="68" height="20" rx="10" fill="#1f2021"/><text x="'+x+'" y="'+(y+40)+'" text-anchor="middle" font-size="12" font-weight="600" fill="#fff">'+area+'</text>':'')};
  var g='<svg viewBox="0 0 '+(X+160)+' 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plattegrond '+m.dim+'" font-family="Inter,system-ui,sans-serif">'+
   '<defs><pattern id="pw" width="100" height="18" patternUnits="userSpaceOnUse"><rect width="100" height="18" fill="'+F+'"/><path d="M0 17.5H100M37 0V18" stroke="#dccbb0"/></pattern><pattern id="pt" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="'+Tl+'"/><path d="M0 19.5H20M19.5 0V20" stroke="#d3d0ca"/></pattern></defs><g transform="translate(70,70)">';
  var xl,walls='',glass='',inner='';
  if(m.layout){
    var lx=0,cell='',xlw=450,gx=1e9,gxe=0;xl=0;
    m.layout.forEach(function(rm,i){var w=rm.w*100,wet=rm.t==='douche'||rm.t==='toilet',cx=lx+w/2,dd=rm.d||4,a=(rm.w*dd).toFixed(2).replace('.',',');
      g+=r(lx,0,w,400,'url(#pw)');if(wet)g+=r(lx,0,w,dd*100,'url(#pt)');if(wet&&rm.d){walls+='<path d="M'+lx+' '+(dd*100)+'H'+(lx+w*.25)+'M'+(lx+w*.8)+' '+(dd*100)+'H'+(lx+w)+'" stroke="'+W+'" stroke-width="7"/>';if(gx>lx)gx=lx;gxe=lx+w;}
      if(rm.t==='bed')inner+=r(cx-80,14,160,200,'#fff',Ln,4)+r(cx-80,100,160,114,'#d9d2c6',Ln,4)+r(cx-112,16,26,26,'#e6c48a',Ln,3)+r(cx+86,16,26,26,'#e6c48a',Ln,3);
      if(rm.t==='douche')inner+='<circle cx="'+cx+'" cy="60" r="16" fill="none" stroke="'+Ln+'"/><circle cx="'+cx+'" cy="60" r="4" fill="'+Ln+'"/>'+r(lx+10,10,w-20,120,'none',Ln);
      if(rm.t==='toilet')inner+='<rect x="'+(cx-20)+'" y="6" width="40" height="44" rx="10" fill="#fff" stroke="'+Ln+'"/>'+r(cx-30,250,60,36,'#fff',Ln,6);
      if(rm.t==='live'){xl=lx;xlw=w;}
      if(i>0)walls+='<path d="M'+lx+' 0V'+((rm.d&&m.layout[i-1].d)||(m.layout[i-1].d&&rm.t==='live')?m.layout[i-1].d*100:rm.t==='live'||m.layout[i-1].t==='live'?250:310)+'" stroke="'+W+'" stroke-width="7"/>';
      cell+=lab(rm.label,cx,rm.t==='live'?150:(rm.t==='bed'?250:180),rm.w.toFixed(2).replace('.',',')+' × '+dd.toFixed(2).replace('.',',')+' m',a+' m²');
      lx+=w;});
    glass='M0 400H'+X+(m.layout[m.layout.length-1].t==='live'?'M'+X+' 0V400':'');
    if(gxe)cell+='<text x="'+((gx+gxe)/2)+'" y="356" text-anchor="middle" font-size="13" font-weight="600" fill="#5e574d">Gang · '+((gxe-gx)/100).toFixed(2).replace('.',',')+' × 1,00 m</text>';
    g+=inner;
    var xlEnd=xl+xlw,kl=Math.min(330,xlw-70),tx=xl+Math.min(130,xlw*.36);
    g+='<path d="M'+(xl+6)+' 6H'+(xl+kl)+'V66H'+(xl+66)+'V120H'+(xl+6)+'Z" fill="#3a3c3b" stroke="'+W+'"/><circle cx="'+tx+'" cy="310" r="42" fill="#5b4a3a" stroke="'+W+'"/>'+[[0,-62],[54,31],[-54,31]].map(function(c){return '<circle cx="'+(tx+c[0])+'" cy="'+(310+c[1])+'" r="13" fill="#fff" stroke="'+Ln+'"/>'}).join('')+'<path d="M'+(xlEnd-90)+' 90H'+(xlEnd-10)+'V330H'+(xlEnd-90)+'Z" fill="#f4f1eb" stroke="'+Ln+'"/>'+cell;
    g+=walls+'<path d="M0 0H'+X+'V400M0 0V400H'+X+'" fill="none" stroke="'+W+'" stroke-width="12"/><path d="'+glass+'" stroke="#8fb1c6" stroke-width="6" fill="none"/><path d="'+glass+'" stroke="#fff" stroke-width="1.5" fill="none"/></g>';
    g+='<g stroke="#6f6a62" fill="#3b3833" font-size="16" font-weight="600"><path d="M70 30H'+(X+70)+'M70 22V38M'+(X+70)+' 22V38" stroke-width="1.3"/><rect x="'+(X/2+34)+'" y="18" width="72" height="24" fill="#fff" stroke="none"/><text x="'+(X/2+70)+'" y="36" text-anchor="middle" stroke="none">'+Math.round(X)+' cm</text><path d="M'+(X+110)+' 70V470M'+(X+102)+' 70H'+(X+118)+'M'+(X+102)+' 470H'+(X+118)+'" stroke-width="1.3"/><rect x="'+(X+98)+'" y="234" width="24" height="72" fill="#fff" stroke="none"/><text transform="translate('+(X+116)+' 270) rotate(-90)" text-anchor="middle" stroke="none">400 cm</text></g>'+
      '<text x="70" y="505" font-size="13" fill="#8a857c">Totaal '+m.m2+',00 m² · hoogte 2,50 m</text></svg>';
    return g;
  }
  if(zero){
    xl=300;
    g+=r(0,0,300,100,'url(#pw)')+r(0,100,150,300,'url(#pt)')+r(150,100,150,300,'url(#pt)')+r(300,0,X-300,400,'url(#pw)');
    inner+=r(10,300,130,90,'#fff',Ln)+'<circle cx="75" cy="345" r="16" fill="none" stroke="'+Ln+'"/><circle cx="75" cy="345" r="4" fill="'+Ln+'"/>'+
      '<rect x="205" y="106" width="40" height="44" rx="10" fill="#fff" stroke="'+Ln+'"/>'+r(195,340,60,40,'#fff',Ln,6)+r(160,106,130,10,'#c9b08a');
    walls+='<path d="M150 100V400M300 100V400M0 100H30M110 100H170M240 100H300" stroke="'+W+'" stroke-width="7" fill="none"/>';
    walls+='<path d="M30 100A80 80 0 0 0 110 180" fill="none" stroke="'+Ln+'" stroke-dasharray="3 3"/><path d="M170 100A70 70 0 0 0 240 170" fill="none" stroke="'+Ln+'" stroke-dasharray="3 3"/>';
    glass='M0 400H'+X+'M'+X+' 0V400';
    g+=inner+lab('Douche',75,205,'1,50 × 3,00 m','4,50 m²')+lab('Toilet',225,205,'1,50 × 3,00 m','4,50 m²')+lab('Gang',150,48,'3,00 × 1,00 m')+lab('Woonkamer / keuken',xl+105,165,'3,00 × 4,00 m','12,00 m²');
  }else{
    var xs=[0,200,300,380];for(var i=1;i<m.beds;i++)xs.push(xs[xs.length-1]+240);xl=xs[xs.length-1];
    g+=r(0,0,200,400,'url(#pw)')+r(200,0,100,260,'url(#pt)')+r(300,0,80,260,'url(#pt)')+r(200,260,180,140,'url(#pw)')+r(380,0,X-380,400,'url(#pw)');
    inner+=r(60,12,80,200,'#fff',Ln,4)+r(60,92,80,120,'#d9d2c6',Ln,4)+r(206,6,88,88,'#fff',Ln)+'<ellipse cx="223" cy="216" rx="15" ry="20" fill="#fff" stroke="'+Ln+'"/>'+'<ellipse cx="340" cy="42" rx="15" ry="20" fill="#fff" stroke="'+Ln+'"/>';
    for(i=4;i<xs.length;i++){inner+=r(xs[i-1]+40,12,160,200,'#fff',Ln,4)+r(xs[i-1]+40,92,160,120,'#d9d2c6',Ln,4);walls+='<path d="M'+xs[i]+' 0V160M'+xs[i]+' 240V400" stroke="'+W+'" stroke-width="7"/>';}
    walls+='<path d="M200 0V150M200 230V400M300 0V260M380 0V260M380 330V400M200 260H226M290 260H310M370 260H380" stroke="'+W+'" stroke-width="7" fill="none"/>';
    glass='M0 400H200M380 400H'+X+'M'+X+' 0V400';
    g+=inner+lab('Slaapkamer',100,300)+lab('Badkamer',250,120)+lab('WC',340,120)+lab('Entree',290,330)+lab('Woonkamer + keuken',xl+(X-xl)/2,370);
    for(i=4;i<xs.length;i++)g+=lab('Slaapkamer '+(i-2),xs[i-1]+120,300);
  }
  // keuken, tafel, bank
  var kl=Math.min(320,X-xl-110);
  g+='<path d="M'+(xl+6)+' 6H'+(xl+kl)+'V66H'+(xl+66)+'V'+(zero?120:170)+'H'+(xl+6)+'Z" fill="#3a3c3b" stroke="'+W+'"/>';
  if(zero) g+='<circle cx="'+(xl+100)+'" cy="320" r="42" fill="#5b4a3a" stroke="'+W+'"/>'+[[0,-62],[54,31],[-54,31]].map(function(c){return '<circle cx="'+(xl+100+c[0])+'" cy="'+(320+c[1])+'" r="13" fill="#fff" stroke="'+Ln+'"/>'}).join('')+'<path d="M'+(X-90)+' 90H'+(X-10)+'V330H'+(X-90)+'Z" fill="#f4f1eb" stroke="'+Ln+'"/>';
  else g+=r(xl+90,160,90,70,'#5b4a3a',W,6)+'<path d="M'+(X-100)+' 40H'+(X-10)+'V250H'+(X-50)+'V80H'+(X-100)+'Z" fill="#f4f1eb" stroke="'+Ln+'"/>';
  g+=walls+'<path d="M0 0H'+X+'V400M0 0V400H'+X+'" fill="none" stroke="'+W+'" stroke-width="12"/>'+
    '<path d="'+glass+'" stroke="#8fb1c6" stroke-width="6" fill="none"/><path d="'+glass+'" stroke="#fff" stroke-width="1.5" fill="none"/></g>';
  g+='<g stroke="#6f6a62" fill="#3b3833" font-size="16" font-weight="600"><path d="M70 30H'+(X+70)+'M70 22V38M'+(X+70)+' 22V38" stroke-width="1.3"/><rect x="'+(X/2+34)+'" y="18" width="72" height="24" fill="#fff" stroke="none"/><text x="'+(X/2+70)+'" y="36" text-anchor="middle" stroke="none">'+Math.round(X)+' cm</text>'+
    '<path d="M'+(X+110)+' 70V470M'+(X+102)+' 70H'+(X+118)+'M'+(X+102)+' 470H'+(X+118)+'" stroke-width="1.3"/><rect x="'+(X+98)+'" y="234" width="24" height="72" fill="#fff" stroke="none"/><text transform="translate('+(X+116)+' 270) rotate(-90)" text-anchor="middle" stroke="none">400 cm</text></g>'+
    '<text x="70" y="505" font-size="13" fill="#8a857c">'+(zero?'Totaal 24,00 m² · hoogte 2,50 m':'Indicatieve indeling · alle modellen 4,00 m breed')+'</text></svg>';
  return g;
}
function planHTML(cls,note,mid){
  var m=M(mid||'aurora28');
  return '<div class="planbox svgp '+(cls||'')+'" style="aspect-ratio:'+(m.m2/4*100+160)+'/520">'+planSVG(mid)+(note?'<span class="hint">'+note+'</span>':'')+'</div>';
}
function card(m,opts){
  opts=opts||{};
  var tag=opts.btn?'button':'a';
  return '<'+tag+' class="mcard'+(opts.sel?' sel':'')+'" '+(opts.btn?'type="button" data-model="'+m.id+'"':(m.id==='aurora28'?'href="#aurora-24"':'href="#configurator" data-start="'+m.id+'"'))+'>'+
   '<div class="ph"><i style="'+bg(mimg(m.id))+'"></i></div><div class="bd"><h3>'+m.name+'</h3><div class="meta">'+m.m2+' m² | '+m.bed+'</div><div class="pr">'+(m.price==null?'Prijs op aanvraag':'Vanaf '+eur(m.price)+' <small class="vat">excl. btw</small>')+'</div>'+
   '<span class="circ">'+(opts.sel?I('check',2):ARR)+'</span></div></'+tag+'>';
}
function priceCard(){
  var m=M(S.model);
  return '<div class="pricecard"><div class="lbl">'+(m.price==null?'Prijs':'Vanafprijs · excl. btw')+'</div><div class="amt">'+eur(m.price)+'</div><div class="diff">Je gekozen opties berekenen we in je offerte</div>'+
   '<div class="pc-sum"><div><span>Model</span><b>'+m.name+'</b></div><div><span>Gekozen opties</span><b>In offerte</b></div></div>'+
   '<div class="pc-prog"><i style="width:'+(S.step/8*100)+'%"></i></div><div class="pc-step">Stap '+S.step+' van 8 · '+STEPS[S.step-1]+'</div>'+
   '<button class="btn btn-gold" data-next>'+(S.step===7||(S.seen[S.step]&&allSeen())?'Naar overzicht':'Volgende stap')+' '+ARR+'</button>'+(S.step>1?'<button class="btn-back" data-prev>'+I('left',2)+' Vorige stap</button>':'')+'</div>';
}
function mobileBar(){return S.step<8?'<div class="mbar"><div><span>'+M(S.model).name+' · stap '+S.step+'/8'+(M(S.model).price==null?'':' · vanaf, excl. btw')+'</span><b class="amt">'+eur(M(S.model).price)+'</b></div>'+(S.step>1?'<button class="mb-back" data-prev aria-label="Vorige stap">'+I('left',2.2)+'</button>':'')+'<button class="btn btn-gold" data-next>Verder '+ARR+'</button></div>':''}
document.getElementById('footUsp').innerHTML=
 [['heart','Persoonlijk advies','Onze specialisten denken met je mee'],['pin','Vergunning & plaatsing','Wij begeleiden het hele traject'],['doc','Transparante prijzen','Geen verrassingen achteraf'],['shield','Landelijk & internationaal','Overal te leveren']]
 .map(function(f){return '<div class="fu">'+I(f[0])+'<div><b>'+f[1]+'</b><span>'+f[2]+'</span></div></div>'}).join('')+
 '<a class="btn btn-gold" href="#contact">Plan een adviesgesprek '+ARR+'</a>';

/* ---------- pagina's ---------- */
function pageHome(){
  var th=['a24_photo','full_fire','full_day','full_night','full_purple'];
  return '<section class="hero hero-home"><div class="hero-bg" style="'+bg('full_stone')+'"></div><div class="wrap">'+
   '<div class="eyebrow">Luxe modulair wonen</div><h1>Natuur. Comfort.<br>Vrijheid.</h1>'+
   '<p class="lead">Stijlvolle modulaire woningen, ontworpen voor nu en de toekomst. Volledig aanpasbaar, duurzaam en klaar voor elke plek.</p>'+
   '<div class="cta"><a class="btn btn-gold" href="#modellen">Ontdek onze modellen '+ARR+'</a><button class="btn btn-ghost" data-video>'+I('play',1.6)+' Bekijk video</button></div>'+
   '</div><div class="script"><span>More</span><span>Than a House</span><span>A Lifestyle</span></div></section>'+
   '<section class="usp"><div class="wrap">'+[['leaf','Duurzaam & energiezuinig'],['gem','Premium afwerking'],['house','Volledig naar wens samen te stellen'],['truck','Turnkey opgeleverd'],['globe','Overal te plaatsen']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'</div></section>'+
   '<section class="feature"><div class="wrap"><div class="grid"><div style="padding-top:.4rem">'+
   '<div class="eyebrow" style="font-size:1rem">Aurora 24</div><h2 class="h2">Compact.<br>Compleet. Tijdloos.</h2>'+
   '<p class="txt">De Aurora 24 biedt alles wat je nodig hebt in één stijlvol en slim ontworpen woning. Grote glaspartijen zorgen voor een unieke woonbeleving, waarbij binnen en buiten naadloos in elkaar overlopen.</p>'+
   '<div class="price-line">Vanaf <b>€ 39.900</b> <small>excl. btw en transport</small></div>'+
   '<div class="btn-row"><a class="btn btn-gold" href="#configurator" data-start="aurora28">Stel jouw Aurora 24 samen '+ARR+'</a><a class="btn btn-dark" href="#aurora-24">Bekijk alle details</a></div></div>'+
   '<div class="gallery"><div class="main" id="gMain" style="'+bg(th[0])+'"><button class="badge360" data-tour><i>360°</i>Virtuele rondleiding</button></div>'+
   '<div class="thumbs"><button class="arrow-btn" data-g="-1" aria-label="Vorige">'+I('left',2)+'</button>'+th.map(function(t,i){return '<button class="t'+(i?'':' on')+'" data-gi="'+i+'" style="'+bg(t)+'" aria-label="Foto '+(i+1)+'"></button>'}).join('')+
   '<button class="arrow-btn" data-g="1" aria-label="Volgende">'+I('right',2)+'</button></div></div></div>'+
   '<div class="specs-row">'+planHTML('plan-box')+'<div class="spec-card"><div class="eyebrow" style="font-size:1rem">Specificaties</div><div class="spec-grid">'+
   [['area','24 m²','Woonoppervlakte'],['frame','6,00 × 4,00 m','Afmetingen'],['height','2,50 m','Hoogte'],['bath','4,50 m²','Douche 1,50 × 3,00 m'],['toilet','4,50 m²','Toilet 1,50 × 3,00 m'],['sofa','12,00 m²','Woonkamer / keuken 3,00 × 4,00 m'],['window','Grote glaspartijen','Panoramisch uitzicht'],['house','Volledig geïsoleerd','Vloer, wanden en dak']]
   .map(function(s){return '<div class="spec">'+I(s[0])+'<div><b>'+s[1]+'</b><span>'+s[2]+'</span></div></div>'}).join('')+
   '</div><a class="btn btn-dark" href="#aurora-24" style="min-height:3.4rem;font-size:1.15rem;padding:0 1.7rem">Bekijk alle specificaties '+ARR+'</a></div></div></div></section>'+
   '<section class="compose"><div class="wrap"><div class="grid"><div><div class="eyebrow" style="font-size:1rem">Jouw woning, jouw stijl</div><h2 class="h2" style="margin-bottom:1.3rem">Stel zelf samen</h2>'+
   '<p>Kies uit verschillende afwerkingen, materialen, keukens, badkamers en extra opties. Zie direct het resultaat in 3D en ontvang een real-time prijs.</p>'+
   '<a class="btn btn-gold" href="#configurator">Start configurator '+ARR+'</a></div><div class="render" style="'+bg('full_day')+'"><div class="swr">'+['gv4','gv0','gv3','fl5','gv5'].map(function(k){return '<i style="'+bg(k)+'"></i>'}).join('')+'</div></div>'+
   '<div class="check-card"><ul>'+['Buitenkant','Ramen & glas','Interieur','Keuken','Badkamer','Installaties','Buitenruimte','Slimme technologie','Levering & plaatsing'].map(function(c){return '<li>'+I('check',2)+c+'</li>'}).join('')+'</ul></div></div></div></section>'+
   '<section class="models-home"><div class="wrap"><div class="head"><div><div class="eyebrow" style="font-size:1rem">Ontdek onze modellen</div><h2 class="h2">Voor elke levensfase een passende woning</h2></div><a class="more" href="#modellen">Bekijk alle modellen →</a></div>'+
   '<div class="cards4">'+MODELS.slice(0,4).map(function(m){return card(m)}).join('')+'</div></div></section>';
}
var F={cat:'alle',opp:'',slp:'',bud:'',sort:'',q:''};
function pageModellen(){
  var cats=[['alle','Alle modellen','house'],['tiny','Tiny house','area'],['recreatie','Recreatie','palm'],['permanent','Permanente bewoning','house'],['mantelzorg','Mantelzorg','care'],['tuinkantoor','Tuinkantoor','office']];
  function sel(id,label,opts){return '<div class="sel-wrap"><select id="'+id+'" aria-label="'+label+'"><option value="">'+label+'</option>'+opts.map(function(o){return '<option value="'+o[0]+'"'+(F[id]===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>'+I('chev',1.8)+'</div>'}
  return '<section class="hero hero-models"><div class="hero-bg" style="'+bg('full_night')+'"></div><div class="wrap"><div class="eyebrow">Onze modulaire woningen</div><h1>Onze modulaire woningen</h1><p>Voor iedereen: particulieren en bedrijven, voor elke levensfase een passende woning.</p></div></section>'+
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
    if(F.bud){var b=F.bud.split('-');if(m.price==null||m.price<+b[0]||m.price>+b[1])return false}
    if(F.q&&m.name.toLowerCase().indexOf(F.q)<0)return false;
    return true;
  });
  var pv=function(x,d){return x.price==null?d:x.price};var s={pa:function(a,b){return pv(a,1e9)-pv(b,1e9)},pd:function(a,b){return pv(b,-1)-pv(a,-1)},ma:function(a,b){return a.m2-b.m2},md:function(a,b){return b.m2-a.m2}}[F.sort];
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
    else if(S.view==='buiten'){var big={aurora28:S.dn==='nacht'?'full_night':'full_day'}[S.model];stageStyle=bg(big||mimg(S.model));if(!big)stageCls+=' framed';if(S.model==='aurora28'&&S.dn==='nacht')stageCls+=' wide';if(S.model==='aurora28')extra='<div class="dn"><button data-dn="dag" class="'+(S.dn!=='nacht'?'on':'')+'">'+I('sun')+'Dag</button><button data-dn="nacht" class="'+(S.dn==='nacht'?'on':'')+'">'+I('moon')+'Nacht</button></div>';}
    else if(S.view==='binnen'){stageStyle=bg('full_fire');}
    else if(S.sub==='tour'){stageStyle=bg('full_fire');stageCls+=' pan';extra='<span class="hint">Sleep om rond te kijken</span>';}
    else if(S.sub==='afm'){var a28=S.model==='aurora28';stageStyle='';stageCls+=' bare faded';extra=planHTML('fill','',S.model)+'<div class="dims"><b>'+m.name+'</b><br>Buitenmaat: '+m.dim+'<br>Lengte: '+(m.m2/4).toFixed(2).replace('.',',')+' m · breedte: 4,00 m<br>Woonoppervlakte: '+m.m2+' m²<br>Plafondhoogte: 2,50 m'+(m.layout?m.layout.map(function(r){return '<br>'+r.label+': '+r.w.toFixed(2).replace('.',',')+' × '+(r.d||4).toFixed(2).replace('.',',')+' m'}).join('')+(m.layout.some(function(r){return r.d})?'<br>Gang: 3,00 × 1,00 m':''):'')+'<br><em>Alle modellen zijn 4,00 m breed;<br>de lengte groeit mee met het aantal m².</em></div>'+(a28||m.layout?'':'<span class="hint">Voorbeeldindeling Aurora 24</span>');}
    else{stageStyle='';stageCls+=' bare';extra=planHTML('fill','',S.model);}
    var rooms=m.layout?['Slaapkamer','Douche','Toilet','Keuken','Woonkamer']:m.beds?['Slaapkamer','Badkamer','WC','Keuken','Woonkamer']:[null,'Douche','Toilet','Keuken','Woonkamer'];
    h='<div class="panel viewer"><div class="seg">'+[['buiten','Buiten'],['binnen','Binnen'],['plan','Plattegrond']].map(function(v){return '<button data-view="'+v[0]+'" class="'+(S.view===v[0]&&S.room<0?'on':'')+'">'+v[1]+'</button>'}).join('')+'</div>'+
      (S.view==='plan'?'<div class="subtabs">'+[['tour','360° Tour'],['plan','Plattegrond'],['afm','Afmetingen']].map(function(v){return '<button data-sub="'+v[0]+'" class="'+(S.sub===v[0]&&S.room<0?'on':'')+'">'+v[1]+'</button>'}).join('')+'</div>':'')+
      '<div class="'+stageCls+'" id="stage" style="'+stageStyle+'">'+extra+'</div>'+
      '<div class="rooms">'+rooms.map(function(r,i){if(!r)return '';return '<button class="room'+(S.room===i?' on':'')+'" data-room="'+i+'"><div style="'+bg('a28_r'+i)+'"></div><span>'+r+'</span></button>'}).join('')+'</div>'+
      '<div class="tour-wrap"><button class="btn btn-dark" data-tour>'+I('play',1.5)+' Start virtuele rondleiding</button></div></div>'+
      '<div class="ext-bottom"><div class="panel gevel"><h3>Gevelafwerking</h3><div class="sw-row"><button class="arrow-btn" data-sw="-1" aria-label="Vorige">'+I('left',2)+'</button><div class="sw-track" id="swTrack">'+
      GEVEL.map(function(g,i){return '<button class="sw'+(S.gevel===i?' on':'')+'" data-gevel="'+i+'"><div style="'+bg('gv'+i)+'"></div><b>'+g[0]+'</b><span>'+op(g[1])+'</span></button>'}).join('')+
      '<button class="sw" data-more><div style="'+bg('gv6')+'"></div><b>Meer kleuren</b><span>RAL op aanvraag</span></button></div><button class="arrow-btn" data-sw="1" aria-label="Volgende">'+I('right',2)+'</button></div></div>'+priceCard()+'</div>';
  }else if(S.step===3){
    var th=m.beds?[['int_th0','Woonkamer'],['int_th1','Slaapkamer'],['int_th2','Badkamer']]:[['int_th0','Woonkamer'],['c_kit','Keuken'],['int_th2','Douche']],big=S.ithumb===0&&S.itab!=='stijl'?'full_fire':th[S.ithumb][0];
    if(S.itab==='stijl')big='full_fire';
    var t=INT[S.itab];
    h='<div class="two"><div><div class="bigimg" style="'+bg(big)+'"></div><div class="ithumbs">'+th.map(function(x,i){return '<button class="ithumb'+(S.ithumb===i?' on':'')+'" data-ith="'+i+'"><div style="'+bg(x[0])+'"></div><span>'+x[1]+'</span></button>'}).join('')+'</div></div>'+
      '<div><div class="panel optpanel"><div class="tabs">'+Object.keys(INT).map(function(k){return '<button data-itab="'+k+'" class="'+(S.itab===k?'on':'')+'">'+INT[k].label+'</button>'}).join('')+'</div>'+
      '<div class="matgrid">'+t.opts.map(function(o,i){return '<button class="mat'+(S[S.itab]===i?' on':'')+'" data-mat="'+i+'"><div style="'+bg(o[2])+'"></div><b>'+o[0]+'</b><span>'+op(o[1])+'</span></button>'}).join('')+'</div></div>'+priceCard()+'</div></div>';
  }else if(S.step===4||S.step===5){
    var kit=S.step===4,list=kit?KEUKEN:BAD,cur=kit?S.keuken:S.bad,sub=kit?APP:KRAAN,subcur=kit?S.app:S.kraan;
    var left;
    if(kit){left='<div class="bathpair"><figure><div style="'+bg(KEUKEN[S.keuken][2])+'"></div><figcaption>Keuken · '+KEUKEN[S.keuken][0]+'</figcaption></figure><figure><div style="'+bg('int_th0')+'"></div><figcaption>Open woonkeuken</figcaption></figure></div><p class="imgnote">Sfeerbeelden. Je gekozen uitvoering zie je terug in de offerte.</p>';}
    else{left='<div class="bathpair"><figure><div style="'+bg('a28_r1')+'"></div><figcaption>'+(m.layout?'Douche · 1,50 × '+((m.layout[1].d||4).toFixed(2).replace('.',','))+' m':m.beds?'Badkamer':'Douche · 1,50 × 3,00 m')+'</figcaption></figure><figure><div style="'+bg('a28_r2')+'"></div><figcaption>'+(m.layout?'Toilet · 1,50 × '+((m.layout[2].d||4).toFixed(2).replace('.',','))+' m':m.beds?'Apart toilet':'Toilet · 1,50 × 3,00 m')+'</figcaption></figure></div><p class="imgnote">Sfeerbeelden. Je gekozen uitvoering zie je terug in de offerte.</p>';}
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
    var locTxt=S.loc?'<div class="v3loc">'+I('pin')+'<span><b>Jouw locatie</b>'+esc(S.loc.adres)+' · '+S.loc.rot+'° gedraaid · ware schaal '+esc(S.loc.afmeting)+'</span><button class="linkbtn" data-3d="locatie">Wijzig</button></div>':'';
    h='<div class="v3card"><div class="v3c-img" style="'+bg('full_day')+'"></div><div class="v3c-txt"><span class="eyebrow">Jouw woning in 3D</span><h2>Bekijk wat je hebt gekozen</h2><p>Loop door je '+m.name+' heen, van buiten en van binnen, overdag en ’s avonds. Of zet hem op je eigen kavel: op ware schaal, '+m.dim+' ('+m.m2+' m²).</p><div class="btn-row"><button class="btn btn-gold" data-3d="buiten">'+I('play',1.6)+' Start 3D-rondleiding</button><button class="btn btn-dark" data-3d="locatie">'+I('pin',1.6)+' Plaats op jouw locatie</button></div>'+locTxt+'</div></div>'+
      '<div class="ov"><div class="panel"><h2>Jouw samenstelling</h2><div class="ov-model"><div class="ph" style="'+bg(mimg(m.id))+'"></div><div><b>'+m.name+'</b><span>'+m.dim+' · '+m.m2+' m²</span><a data-step="1">Bewerk samenstelling</a></div></div>'+ol+'</div>'+
      '<div class="panel"><h2>Prijsopbouw</h2><div class="ln"><span>Basisprijs '+m.name+'</span><span>'+eur(m.price)+'</span></div><div class="ln"><span>Gekozen opties</span><span>In offerte</span></div>'+
      '<div class="ln"><span>Transport</span><span>In offerte</span></div><div class="ln" style="border:0"><span>Plaatsing</span><span>In offerte</span></div>'+
      '<div class="tot"><b>'+(m.price==null?'Prijs':'Vanafprijs')+'<small class="vat2">'+(m.price==null?'we maken een prijs op maat':'exclusief 21% btw')+'</small></b><strong>'+eur(m.price)+'</strong></div><p class="paynote" style="margin-top:0">De prijs van je gekozen opties, transport en plaatsing staat in je persoonlijke offerte.</p>'+
      '<a class="btn btn-red" href="#contact" data-fromcfg>Offerte aanvragen '+ARR+'</a><button class="btn btn-gold" data-reserve>Reservering aanvragen · aanbetaling € 2.500</button>'+
      '<p class="paynote">Online betalen met iDEAL, creditcard of Klarna komt binnenkort. Tot die tijd regelen we je reservering persoonlijk.</p>'+priceTerms()+'</div></div>';
  }
  var hints={1:'Kies een model — je gaat daarna vanzelf verder.',2:'Kies een gevelafwerking — daarna ga je vanzelf door naar het interieur.',3:'Kies vloer, wand, plafond en stijl — de tabs schuiven vanzelf door.',4:'Kies een keuken en daarna het apparatuurpakket.',5:'Kies een badkamer en daarna het kraanwerk.',6:'Vink aan wat je wilt en klik op Volgende stap. Niets nodig? Ga gewoon verder.',7:'Laatste stap: kies eventuele extra\'s en bekijk daarna je overzicht.',8:''};
  var bar=S.step===8?'<div class="autorow"><button class="btn-back" data-prev style="margin:0">'+I('left',2)+' Terug naar Extra\'s</button></div>':'';
  if(S.step<8)bar='<div class="autorow">'+(S.step>1?'<button class="btn-back top" data-prev>'+I('left',2)+' '+STEPS[S.step-2]+'</button>':'')+'<span class="hint2">'+(S.auto?hints[S.step]:'Automatisch doorgaan staat uit. Gebruik de knop Volgende stap.')+'</span><label class="sw-auto"><input type="checkbox" id="autoT"'+(S.auto?' checked':'')+'><i></i>Automatisch doorgaan</label></div>';
  return '<div class="cfg">'+stepper()+'<div class="wrap cfg-body">'+bar+h+'</div>'+mobileBar()+'</div>';
}

var fromCfg=false,wantReserve=false;
function pageContact(){
  var m=M(S.model),D={};try{D=JSON.parse(localStorage.getItem('nmk_lead_pref')||'{}')}catch(e){}
  var model=D.model||(fromCfg?S.model:'');
  function chips(name,opts,val){return '<div class="chips" data-chips="'+name+'">'+opts.map(function(o){return '<button type="button" class="chip'+(val===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>'}
  function f(id,l,o){o=o||{};return '<div class="fld'+(o.full?' full':'')+'"><label for="'+id+'">'+l+(o.req?'':' <i>(optioneel)</i>')+'</label><input id="'+id+'" name="'+id+'" type="'+(o.type||'text')+'"'+(o.ac?' autocomplete="'+o.ac+'"':'')+(o.im?' inputmode="'+o.im+'"':'')+(o.ph?' placeholder="'+o.ph+'"':'')+(o.req?' data-req="'+o.req+'" required':'')+'><div class="em">'+(o.err||'Dit veld is verplicht')+'</div>'+(o.help?'<div class="help">'+o.help+'</div>':'')+'</div>'}
  var summary=(S.loc&&fromCfg?'<div class="cfg-sum loc">'+I('pin')+'<div><span>Locatie</span><b>'+esc(S.loc.adres)+'</b><em>'+S.loc.rot+'° gedraaid · '+esc(S.loc.afmeting)+'</em></div><a href="#configurator-8">Wijzig</a></div>':'')+(fromCfg?'<div class="cfg-sum"><div class="ph" style="'+bg(mimg(m.id))+'"></div><div><span>Jouw configuratie</span><b>'+m.name+' · '+m.dim+'</b><em>'+(m.price==null?'Prijs op aanvraag':'Vanaf '+eur(m.price)+' excl. btw')+' · opties in de offerte</em></div><a href="#configurator-8">Wijzig</a></div>':'');
  return '<section class="off"><div class="photo" style="'+bg('full_fire')+'"></div><div class="form" id="offForm">'+
   '<h1>Vrijblijvende offerte aanvragen</h1><p class="intro">Binnen 2 werkdagen een complete PDF-offerte in je mailbox. Invullen duurt minder dan een minuut.</p>'+
   '<div class="trust"><span>'+I('check',2.2)+'Vrijblijvend</span><span>'+I('check',2.2)+'Binnen 2 werkdagen</span><span>'+I('check',2.2)+'Persoonlijk advies</span></div>'+summary+
   '<form class="frm2" novalidate>'+
   '<fieldset><legend><b>1</b>Jouw wensen</legend>'+
   (fromCfg?'':'<div class="q"><span>Welk model?</span>'+chips('model',MODELS.map(function(x){return [x.id,x.name]}).concat([['onbekend','Weet ik nog niet']]),model)+'</div>')+
   '<div class="q"><span>Waarvoor? <i>(optioneel)</i></span>'+chips('doel',[['recreatie','Recreatie'],['wonen','Permanent wonen'],['mantelzorg','Mantelzorg'],['verhuur','Verhuur'],['kantoor','Kantoor / werkplek']],D.doel)+'</div>'+
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
   '</ul></div><div><b>Apart in je offerte</b><ul>'+['Gekozen opties en extra’s','Transport','Plaatsing','Fundering en aansluiting op het net, afhankelijk van je locatie'].map(function(x){return '<li class="x">'+I('dots',2.2)+x+'</li>'}).join('')+'</ul></div></div></div>';
}
function pageA28(){
  var specs=[['frame','Afmetingen','6,00 × 4,00 × 2,50 m (L × B × H)'],['area','Totale oppervlakte','24,00 m²'],['bath','Douche','1,50 × 3,00 m = 4,50 m²'],['toilet','Toilet','1,50 × 3,00 m = 4,50 m²'],['sofa','Woonkamer / keuken','3,00 × 4,00 m = 12,00 m²'],['house','Gang','3,00 × 1,00 m = 3,00 m²'],['window','Grote schuifpui & glaspartijen'],['area','Volledig geïsoleerd (vloer, wanden, dak)'],['ac','Airconditioning'],['wind','Ventilatie'],['bolt','Elektriciteit (compleet)'],['drop','Waterleiding & riolering (compleet)'],['wifi','Internet (Starlink-ready)'],['bulb','LED-verlichting (binnen & buiten)'],['house','Turnkey opgeleverd']];
  var inc=['Materialen','Complete installatie','Keuken met apparatuur','Badkamer en sanitair','Airconditioning','Elektra, water en riolering','LED-verlichting','Internet (Starlink-ready)','Binnen- en buitenafwerking','Klaar voor gebruik'];
  var rooms=['Slaapkamer','Badkamer','WC','Keuken','Woonkamer'];
  return '<section class="a28-hero"><div class="hero-bg" style="'+bg('a24_photo')+'"></div><div class="wrap"><div class="a28-brand"><h1>AURORA</h1><p>MODERN LIVING, ANYWHERE</p></div>'+
   '<div class="a28-claim"><b>Luxe modulair wonen</b><span>Compact. Stijlvol. Compleet.</span></div></div><div class="script"><span>More</span><span>Than a House</span><span>A Lifestyle</span></div></section>'+
   '<section class="a28-usp"><div class="wrap">'+[['gem','Premium afwerking'],['leaf','Volledig geïsoleerd'],['cog','Complete installatie'],['house','Turnkey opgeleverd'],['globe','Overal te plaatsen']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'</div></section>'+
   '<section style="background:#fff"><div class="wrap a28-main"><div><div class="eyebrow" style="margin-bottom:1.4rem">Plattegrond Aurora 24</div>'+planHTML('a28-plan')+'</div>'+
   '<div class="a28-specs"><h2>SPECIFICATIES</h2><ul>'+specs.map(function(s){return '<li>'+I(s[0],1.3)+'<div>'+s[1]+(s[2]?'<small>'+s[2]+'</small>':'')+'</div></li>'}).join('')+'</ul></div>'+
   '<div class="a28-price"><h3>TURNKEY PRIJS</h3><div class="big">€ 39.900</div><div class="inc">INCLUSIEF ALLES</div><ul>'+inc.map(function(x){return '<li>'+I('check',2.2)+x+'</li>'}).join('')+'</ul>'+
   '<div class="note">Exclusief btw en transport</div><div class="note">Upgrade naar Premium Plus mogelijk</div>'+
   '<a class="btn btn-gold" href="#configurator" data-start="aurora28">Stel jouw Aurora 24 samen '+ARR+'</a><a class="btn btn-line" href="#contact">Offerte aanvragen</a></div></div></section>'+
   '<section class="a28-seasons"><div class="wrap"><div class="eyebrow">Aurora 24 in elk seizoen</div><h2 class="h2" style="font-size:3.2rem;margin:.6rem 0 2rem">Dag, nacht, zomer en winter</h2><div class="sgrid">'+[['a24_photo','Aurora 24 · avond'],['full_purple','Winteravond · sfeerverlichting'],['full_stone','Natuursteen gevel'],['full_fire','Uitzicht vanuit de woonkamer']].map(function(s,i){return '<button class="sg" data-season="'+i+'" style="'+bg(s[0])+'"><span>'+s[1]+'</span></button>'}).join('')+'</div></div></section>'+
   '<section class="a28-tag"><div class="wrap">'+[['leaf','Duurzaam'],['gem','Tijdloos design'],['house','Waar jij wilt'],['heart','Een slimme investering']].map(function(u){return '<div>'+I(u[0])+u[1]+'</div>'}).join('')+'<em>YOUR SPACE. YOUR FREEDOM.</em></div></section>';
}
function simpleHero(label,title,sub){return '<section class="hero hero-models"><div class="hero-bg" style="'+bg('full_night')+'"></div><div class="wrap"><div class="eyebrow">'+label+'</div><h1>'+title+'</h1><p>'+sub+'</p></div></section>'}
function pageInspiratie(){
  var imgs=['full_night','m_a42b','full_fire','full_day','full_forest','full_nordic','full_purple','full_stone'];
  return simpleHero('Inspiratie','Inspiratie','Laat je inspireren door onze woningen en interieurs.')+'<section class="simple"><div class="wrap"><p class="intro">Warm hout, grote glaspartijen en sfeervolle verlichting. Bekijk hoe onze klanten hun modulaire woning hebben samengesteld en vind ideeën voor jouw eigen plek.</p><div class="insp">'+
   imgs.map(function(k,i){return '<div'+(i===0?' class="w2"':'')+' style="'+bg(k)+'"></div>'}).join('')+'</div></div></section>';
}
function pageOver(){
  return simpleHero('Over ons','Over NMK Living','Modular homes for a better tomorrow.')+'<section class="simple"><div class="wrap"><p class="intro">NMK Living ontwerpt en bouwt luxe modulaire woningen die overal te plaatsen zijn. Met premium materialen, grote glaspartijen en een volledig turnkey oplevering maken we wonen in de natuur bereikbaar, comfortabel en duurzaam.</p><div class="feat3">'+
   [['leaf','Duurzaam & energiezuinig','Volledig geïsoleerd en klaar voor zonne-energie en warmtepomp.'],['gem','Premium afwerking','Hout, metaal en natuursteen, afgewerkt tot in detail.'],['truck','Turnkey opgeleverd','Van vergunning tot plaatsing: wij regelen het hele traject.']]
   .map(function(f){return '<div class="panel">'+I(f[0])+'<h3>'+f[1]+'</h3><p>'+f[2]+'</p></div>'}).join('')+'</div></div></section>'+
   '<section class="simple" style="background:var(--cream)"><div class="wrap"><div class="eyebrow">Voor wie</div><h2 style="font-family:var(--serif);font-weight:400;font-size:clamp(2.8rem,4vw,3.8rem);line-height:1.15;margin:1rem 0 1.6rem">Voor iedereen</h2><p class="intro" style="margin-bottom:3.2rem">Of je nu particulier bent of een bedrijf: we bouwen voor iedereen. Een eigen woning, een vakantieplek, een verhuurunit op een recreatiepark, een tuinkantoor of een mantelzorgwoning. Elk model stel je zelf samen en we leveren het turnkey op.</p><div class="feat3">'+
   [['house','Wonen & recreatie','Permanent wonen of een eigen plek in de natuur, volledig naar jouw smaak.'],['palm','Verhuur & recreatieparken','Luxe verhuurunits die snel geplaatst zijn en direct rendement opleveren.'],['care','Werkplek & zorg','Een representatief tuinkantoor of een levensloopbestendige mantelzorgwoning dichtbij huis.']]
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
  var list=custom||[['full_night','Winteravond'],['full_day','Zomer'],['full_stone','Natuursteen gevel'],['full_fire','Woonkamer met uitzicht'],['full_purple','Sfeerverlichting'],['full_nordic','Spiegelglas in de sneeuw'],['full_forest','Spiegelglas in het bos']],i=typeof start==='number'?start:0;
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
  var to=M(S.model).price,from=lastTotal===null?to:lastTotal;lastTotal=to;
  var els=$$('.pricecard .amt');if(from===to||!els.length||to==null||from==null)return;
  var t0=performance.now(),d=650;
  (function f(now){var k=Math.min(1,(now-t0)/d),e=1-Math.pow(1-k,3),v=Math.round((from+(to-from)*e)/10)*10;els.forEach(function(el){el.textContent=eur(k<1?v:to)});if(k<1)requestAnimationFrame(f)})(t0);
}

/* ---------- 3D-woning ---------- */
function cfg3d(mode){
  var m=M(S.model);
  return {mode:mode||'buiten',model:{name:m.name,m2:m.m2,beds:m.beds,dim:m.dim,layout:m.layout||null},
    keys:{gevel:'gv'+S.gevel,vloer:INT.vloer.opts[S.vloer][2],wand:INT.wand.opts[S.wand][2],plafond:INT.plafond.opts[S.plafond][2]},
    stijl:S.stijl,keuken:S.keuken,app:S.app,bad:S.bad,kraan:S.kraan,opts:S.opts,img:IMG,loc:S.loc||null,gevelIdx:S.gevel,backdrop:'bg_mtn',pano:'pano_day',detail:['hw_bump','hw_rough','lam_bump'],picks:picks3d(),
    onLocation:function(d){S.loc=d;persist();if(route==='configurator'&&S.step===8){var y=scrollY;app.innerHTML=pageConfig();bindCfg();scrollTo(0,y)}},
    onCta:function(){fromCfg=true;location.hash='contact'}};
}
function picks3d(){
  var P=[],pr=function(n){return n?'Meerprijs':'Standaard'};
  P.push({key:'gevel',label:'Gevel · '+GEVEL[S.gevel][0],short:'Gevel '+GEVEL[S.gevel][0].toLowerCase(),price:pr(GEVEL[S.gevel][1])});
  ['vloer','wand','plafond','stijl'].forEach(function(k){var o=INT[k].opts[S[k]];P.push({key:k,label:INT[k].label+' · '+o[0],short:o[0],price:pr(o[1])})});
  P.push({key:'keuken',label:'Keuken · '+KEUKEN[S.keuken][0],short:'Keuken '+KEUKEN[S.keuken][0].toLowerCase(),price:pr(KEUKEN[S.keuken][1])});
  P.push({key:'app',label:'Apparatuur · '+APP[S.app][0].replace(' (inbegrepen)',''),short:'Apparatuur',price:pr(APP[S.app][1])});
  P.push({key:'bad',label:'Badkamer · '+BAD[S.bad][0],short:'Badkamer '+BAD[S.bad][0].toLowerCase(),price:pr(BAD[S.bad][1])});
  P.push({key:'kraan',label:'Kraanwerk · '+KRAAN[S.kraan][0].replace(' (inbegrepen)',''),short:'Kraanwerk',price:pr(KRAAN[S.kraan][1])});
  allOpts().forEach(function(o){if(S.opts[o[0]])P.push({key:o[0]==='kraan'?'buitenkraan':o[0],label:o[1],short:o[1],price:o[4]?'Inbegrepen':plus(o[2])})});
  return P;
}
var v3mod=null;
function open3d(mode){
  var url=new URL((window.NMK_CONFIG&&window.NMK_CONFIG.viewer)||'site/v11/viewer.js',document.baseURI).href;
  toast('3D-woning laden…');
  (v3mod?Promise.resolve(v3mod):import(url)).then(function(mod){v3mod=mod;mod.open(cfg3d(mode))}).catch(function(){toast('De 3D-weergave kon niet worden geladen.')});
}
/* ---------- router ---------- */
var route='home';
function render(){
  var raw=(location.hash||'#home').slice(1).replace(/^aurora-28$/,'aurora-24').replace(/^zakelijk$/,'over-ons'),mm=raw.match(/^configurator-([1-8])$/),h=mm?['configurator',mm[1]]:[raw];route=h[0]||'home';
  if(route==='configurator'){S.step=(h[1]&&+h[1]>=1&&+h[1]<=8)?+h[1]:1;}
  var pages={home:pageHome,modellen:pageModellen,configurator:pageConfig,inspiratie:pageInspiratie,'over-ons':pageOver,contact:pageContact,'aurora-24':pageA28,'mijn-nmk':function(){return pageLogin('Mijn NMK')},beheer:function(){return pageLogin('Beheer')}};
  if(!pages[route])route='home';
  if(route!=='contact')wantReserve=false;
  var META={home:['NMK Living | Luxe modulaire woningen – turnkey en overal te plaatsen','Stijlvolle modulaire woningen, volledig naar wens samen te stellen en turnkey opgeleverd. Aurora 24 vanaf € 39.900.'],
   modellen:['Modellen | Modulaire woningen van 24 tot 72 m² – NMK Living','Bekijk alle modulaire woningen van NMK Living: Aurora 24, Aurora 36, Aurora 42 en Aurora Villa. Alle modellen 4 meter breed.'],
   'aurora-24':['Aurora 24 | 24 m² modulaire woning vanaf € 39.900 – NMK Living','Aurora 24: 6,00 × 4,00 m (24 m²): douche, toilet en woonkamer met keuken. Turnkey opgeleverd vanaf € 39.900 excl. btw en transport.'],
   configurator:['Configurator | Stel je modulaire woning samen – NMK Living','Kies model, gevel, interieur, keuken, badkamer en installaties en zie direct je prijs.'],
   contact:['Vrijblijvende offerte aanvragen – NMK Living','Binnen 2 werkdagen een complete PDF-offerte voor jouw modulaire woning. Invullen duurt minder dan een minuut.'],
   inspiratie:['Inspiratie | Modulaire woningen in elk seizoen – NMK Living','Laat je inspireren door de woningen en interieurs van NMK Living.'],
   'over-ons':['Over NMK Living | Modular homes for a better tomorrow','NMK Living ontwerpt en bouwt luxe modulaire woningen voor iedereen: particulieren en bedrijven, overal te plaatsen.']}[route]||['NMK Living','Luxe modulaire woningen.'];
  document.title=META[0];var md=document.querySelector('meta[name=description]');if(md)md.setAttribute('content',META[1]);
  app.innerHTML=pages[route]();
  document.body.classList.toggle('over-hero',route==='home'||route==='modellen'||route==='aurora-24'||route==='inspiratie'||route==='zakelijk'||route==='over-ons');
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
  var th=['a24_photo','full_fire','full_day','full_night','full_purple'],gi=0;
  function set(i){gi=(i+th.length)%th.length;$('#gMain').style.backgroundImage='url('+IMG[th[gi]]+')';$$('.thumbs .t').forEach(function(t,j){t.classList.toggle('on',j===gi)})}
  $$('[data-gi]').forEach(function(b){b.onclick=function(){set(+b.dataset.gi)}});
  $$('[data-g]').forEach(function(b){b.onclick=function(){set(gi+(+b.dataset.g))}});
}
function bindModels(){
  renderModelGrid();
  $$('[data-cat]').forEach(function(b){b.onclick=function(){F.cat=b.dataset.cat;F.q='';$$('[data-cat]').forEach(function(x){x.classList.toggle('on',x===b)});renderModelGrid()}});
  ['opp','slp','bud','sort'].forEach(function(id){$('#'+id).onchange=function(){F[id]=this.value;renderModelGrid()}});
}
/* ---------- automatisch doorgaan ---------- */
var autoT=null,autoBox=null;
function cancelAuto(){clearTimeout(autoT);autoT=null;if(autoBox){autoBox.remove();autoBox=null}}
function allSeen(){for(var i=1;i<=7;i++)if(!S.seen[i])return false;return true}
function autoNext(label){
  cancelAuto();
  if(!S.auto||S.step>=8)return;
  var target=(S.seen[S.step]&&allSeen())?8:S.step+1;
  if(S.seen[S.step]&&!allSeen())return;            /* eerdere stap aanpassen: blijf staan */
  autoBox=document.createElement('div');autoBox.className='autobar';
  autoBox.innerHTML='<span class="ab-ic">'+I('check',2.4)+'</span><span><b>'+esc(label)+'</b><em>Door naar '+STEPS[target-1]+'…</em></span><button type="button">Blijf hier</button><i class="ab-prog"></i>';
  document.body.appendChild(autoBox);
  autoBox.querySelector('button').onclick=function(){cancelAuto()};
  autoT=setTimeout(function(){cancelAuto();setStep(target)},1400);
}
function autoTab(next){ /* binnen interieur: volgende tab */
  if(!S.auto||S.seen[3])return;
  clearTimeout(autoT);autoT=setTimeout(function(){S.itab=next;rerender();var p=$('.optpanel');if(p&&p.getBoundingClientRect().top<90)p.scrollIntoView({behavior:'smooth',block:'start'})},450);
}
function focusSub(){ /* keuken/badkamer: na hoofdkeuze naar subkeuze */
  var el=$('.kpanel .opt-h:nth-of-type(2)')||$$('.kpanel .opt-h')[1];if(!el)return;
  var r=el.getBoundingClientRect();if(r.top>window.innerHeight-160||r.top<80)el.scrollIntoView({behavior:'smooth',block:'center'});
  $$('.kpanel .radio').forEach(function(x){x.classList.add('pulse')});setTimeout(function(){$$('.kpanel .radio').forEach(function(x){x.classList.remove('pulse')})},1600);
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')cancelAuto();if(route==='configurator'&&!/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''))&&e.altKey){if(e.key==='ArrowLeft'&&S.step>1)setStep(S.step-1);if(e.key==='ArrowRight'&&S.step<8)setStep(S.step+1)}});
window.addEventListener('hashchange',cancelAuto);
function rerender(){var y=window.scrollY;persist();app.innerHTML=pageConfig();bindCfg();window.scrollTo(0,y);animPrice()}
function setStep(n){cancelAuto();if(n>S.step)S.seen[S.step]=1;S.step=Math.max(1,Math.min(8,n));persist();if(location.hash!=='#configurator-'+S.step)location.hash='configurator-'+S.step;else go()}
function bindCfg(){
  persist();
  var cs=$('.stp.cur'),sw=$('.stepper .wrap');if(cs&&sw&&sw.scrollWidth>sw.clientWidth)sw.scrollLeft=cs.offsetLeft-sw.clientWidth/2+cs.offsetWidth/2;
  $$('[data-step]').forEach(function(b){b.onclick=function(){setStep(+b.dataset.step)}});
  $$('[data-prev]').forEach(function(b){b.onclick=function(){cancelAuto();setStep(S.step-1)}});
  $$('[data-next]').forEach(function(b){b.onclick=function(){setStep(S.seen[S.step]&&allSeen()?8:S.step+1)}});
  var at=$('#autoT');if(at)at.onchange=function(){S.auto=at.checked;if(!S.auto)cancelAuto();rerender()};
  $$('[data-reset]').forEach(function(b){b.onclick=function(){resetCfg(S.model);rerender()}});
  $$('[data-model]').forEach(function(b){b.onclick=function(){S.model=b.dataset.model;rerender();autoNext(M(S.model).name+' gekozen')}});
  $$('[data-view]').forEach(function(b){b.onclick=function(){S.view=b.dataset.view;S.room=-1;rerender()}});
  $$('[data-sub]').forEach(function(b){b.onclick=function(){S.sub=b.dataset.sub;S.room=-1;rerender()}});
  $$('[data-room]').forEach(function(b){b.onclick=function(){S.room=S.room===+b.dataset.room?-1:+b.dataset.room;rerender()}});
  $$('[data-dn]').forEach(function(b){b.onclick=function(){S.dn=b.dataset.dn;rerender()}});
  $$('[data-gevel]').forEach(function(b){b.onclick=function(){S.gevel=+b.dataset.gevel;rerender();autoNext('Gevel '+GEVEL[S.gevel][0].toLowerCase()+' gekozen')}});
  $$('[data-more]').forEach(function(b){b.onclick=function(){toast('Meer kleuren (RAL op aanvraag) bespreken we graag in je offerte.')}});
  $$('[data-sw]').forEach(function(b){b.onclick=function(){$('#swTrack').scrollLeft+=(+b.dataset.sw)*240}});
  $$('[data-tour]').forEach(function(b){b.onclick=function(){open3d('binnen')}});
  $$('[data-3d]').forEach(function(b){b.onclick=function(){open3d(b.dataset['3d'])}});
  $$('[data-itab]').forEach(function(b){b.onclick=function(){S.itab=b.dataset.itab;rerender()}});
  $$('[data-mat]').forEach(function(b){b.onclick=function(){var tab=S.itab;S[tab]=+b.dataset.mat;rerender();var order=['vloer','wand','plafond','stijl'],i=order.indexOf(tab);if(i<3)autoTab(order[i+1]);else autoNext('Interieurstijl '+INT.stijl.opts[S.stijl][0].toLowerCase()+' gekozen')}});
  $$('[data-ith]').forEach(function(b){b.onclick=function(){S.ithumb=+b.dataset.ith;rerender()}});
  $$('[data-kth]').forEach(function(b){b.onclick=function(){if(S.step===4)S.kthumb=+b.dataset.kth;else S.bthumb=+b.dataset.kth;rerender()}});
  $$('[data-k]').forEach(function(b){b.onclick=function(){if(S.step===4){S.keuken=+b.dataset.k;S.kthumb=0}else{S.bad=+b.dataset.k;S.bthumb=0}rerender();if(S.auto&&!S.seen[S.step])focusSub()}});
  $$('[data-r2]').forEach(function(b){b.onclick=function(){if(S.step===4)S.app=+b.dataset.r2;else S.kraan=+b.dataset.r2;rerender();autoNext(S.step===4?'Keuken '+KEUKEN[S.keuken][0].toLowerCase()+' + '+APP[S.app][0].replace(' (inbegrepen)','').toLowerCase()+' pakket':'Badkamer '+BAD[S.bad][0].toLowerCase()+' gekozen')}});
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
    if(fromCfg){cfg={model:m.name,afmeting:m.dim,basisprijs:m.price||0,meerwerk:optSum(),transport:TRANSPORT,plaatsing:PLAATSING,totaal:grand()||0,
      keuzes:[['Gevel',GEVEL[S.gevel][0]],['Vloer',INT.vloer.opts[S.vloer][0]],['Wand',INT.wand.opts[S.wand][0]],['Plafond',INT.plafond.opts[S.plafond][0]],['Stijl',INT.stijl.opts[S.stijl][0]],['Keuken',KEUKEN[S.keuken][0]],['Apparatuur',APP[S.app][0]],['Badkamer',BAD[S.bad][0]],['Kraanwerk',KRAAN[S.kraan][0]]].map(function(x){return x[0]+': '+x[1]}).concat(allOpts().filter(function(o){return S.opts[o[0]]}).map(function(o){return 'Optie: '+o[1]}))};}
    return {naam:$('#naam').value.trim(),email:$('#em').value.trim(),telefoon:$('#tel').value.trim(),postcode:$('#pc').value.trim(),opmerking:$('#opm').value.trim(),
      model:fromCfg?m.name:chipTxt('model'),doel:chipTxt('doel'),wanneer:chipTxt('wanneer'),adviesgesprek:$('#callme').checked,locatie:S.loc?{adres:S.loc.adres,lat:S.loc.lat,lon:S.loc.lon,rotatie:S.loc.rot,afmeting:S.loc.afmeting}:null,reservering:wantReserve,configuratie:cfg,website:form.website.value};
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
  var se=e.target.closest('[data-season]');if(se)tour(+se.dataset.season,[['full_day','Zomer · dag'],['full_purple','Winteravond'],['full_stone','Natuursteen gevel'],['full_fire','Uitzicht vanuit de woonkamer'],['full_night','Winternacht']]);
  var ar=e.target.closest('[data-a28room]');if(ar)tour(+ar.dataset.a28room);
  var h3=e.target.closest('.badge360');if(h3&&route==='home'){e.preventDefault();resetCfg('aurora28');open3d('buiten');return}
  if(e.target.closest('[data-video]')){modal('<div class="box"><button class="x" aria-label="Sluiten">×</button><div class="img" style="background-image:url('+IMG.full_stone+')"></div><div class="cap">Bedrijfsvideo volgt binnenkort</div></div>')}
  if(e.target.closest('[data-privacy]')){e.preventDefault();modal('<div class="card" style="text-align:left"><h3>Privacyverklaring</h3><p>NMK Living gebruikt je gegevens alleen om je offerte op te stellen en contact met je op te nemen over je aanvraag. We delen niets met derden zonder jouw toestemming en bewaren je gegevens niet langer dan nodig. Je kunt altijd vragen om inzage of verwijdering.</p><button class="btn btn-gold x" style="width:100%">Sluiten</button></div>')}
  var lb=$('#langBtn');if(e.target.closest('#langBtn'))lb.classList.toggle('open');else lb.classList.remove('open');
});
$('#searchBtn').onclick=function(){$('#searchBar').classList.toggle('open');if($('#searchBar').classList.contains('open'))$('#searchIn').focus()};
$('#searchIn').addEventListener('keydown',function(e){if(e.key==='Enter'){F={cat:'alle',opp:'',slp:'',bud:'',sort:'',q:this.value.trim().toLowerCase()};$('#searchBar').classList.remove('open');if(route==='modellen')go();else location.hash='modellen'}});
$('#menuBtn').onclick=function(){$('#mnav').classList.toggle('open')};
$$('[data-img]').forEach(function(i){i.src=IMG[i.dataset.img]});
render();
})();
