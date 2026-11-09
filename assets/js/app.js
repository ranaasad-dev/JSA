(async()=>{
'use strict';
await window.JSA_CONTENT_READY;
const C=window.SITE_CONTENT,root=document.documentElement;
let lang=root.lang;
const tr=v=>typeof v==='object'&&v!==null?(v[lang]||v.en||''):String(v??'');
const path=k=>k.split('.').reduce((o,x)=>o?.[x],C);
const text=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=tr(value);if(cls)e.className=cls;return e};
const ICON_PATHS={"plot": "M3 20h18M5 17V9l7-6 7 6v8M9 20v-7h6v7M3 9l9-7 9 7", "commercial": "M5 21V3h14v18M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3", "shop": "M3 10l2-6h14l2 6M3 10c0 4 5 4 5 0 0 4 8 4 8 0 0 4 5 4 5 0M5 14v7h14v-7M9 21v-6h6v6", "house": "M2 11l10-8 10 8M5 10v11h14V10M9 21v-7h6v7", "field": "M12 21V6M12 13C5 13 4 8 4 8c6 0 8 5 8 5M12 10c7 0 8-5 8-5-6 0-8 5-8 5M3 21c5-5 13-5 18 0M12 6V2", "key": "M14 3a6 6 0 1 1-4 10l-7 7v-4l6-6a6 6 0 0 1 5-7M16 7h.01"};
function makeIcon(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.6');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',ICON_PATHS[name]||ICON_PATHS.house);svg.append(path);return svg}
let category='all',activePhotos=[],activePhoto=0,activeProperty=null;
function propertyPhotos(s){return Array.isArray(s.photos)&&s.photos.length?s.photos.map(x=>typeof x==='string'?{src:x,alt:s.alt}:x):[{src:s.src,alt:s.alt}]}
function showPropertyPhoto(){const item=activePhotos[activePhoto];document.querySelector('#large-photo').src=item.src;document.querySelector('#large-photo').alt=tr(item.alt||activeProperty.alt);document.querySelector('#photo-caption').textContent=tr(activeProperty.caption||activeProperty.alt);document.querySelector('#photo-count').textContent=(activePhoto+1)+' / '+activePhotos.length;document.querySelector('#photo-prev').disabled=activePhoto===0;document.querySelector('#photo-next').disabled=activePhoto===activePhotos.length-1}

function renderGallery(){
 const gallery=document.querySelector('#gallery');if(!gallery)return;
 gallery.replaceChildren();const filters=document.querySelector('#gallery-filters');filters.replaceChildren();filters.hidden=!C.gallery.length;
 [{id:'all',name:C.labels.all},...C.categories].forEach(({id:key,name})=>{const b=text('button',name);b.type='button';b.setAttribute('aria-pressed',String(category===key));b.onclick=()=>{category=key;renderGallery()};filters.append(b)});
 document.querySelector('#empty').hidden=C.gallery.length>0;
 const items=C.gallery.filter(s=>category==='all'||s.category===category);
 document.querySelector('#filter-status').textContent=C.gallery.length&&!items.length?tr(C.labels.noMatch):'';
 items.forEach(s=>{const f=document.createElement('figure');const open=text('button','','photo-open');open.type='button';open.setAttribute('aria-label',tr(C.labels.openPhoto)+': '+tr(s.caption||s.alt));const im=document.createElement('img');im.src=propertyPhotos(s)[0].src;im.alt=tr(s.alt);im.loading='lazy';im.width=900;im.height=675;open.append(im);open.onclick=()=>{activeProperty=s;activePhotos=propertyPhotos(s);activePhoto=0;showPropertyPhoto();document.querySelector('#lightbox').showModal()};f.append(open);
 const caption=document.createElement('figcaption');if(s.caption)caption.append(text('strong',s.caption));const details=[s.type,s.size,s.area].filter(Boolean).map(tr).filter(Boolean).join(' · ');if(details)caption.append(text('p',details,'gallery-details'));
 if(s.id)caption.append(text('p',tr(C.labels.reference)+': '+s.id,'property-reference'));
 if(tr(s.demand))caption.append(text('p',tr(C.labels.demand)+': '+tr(s.demand),'property-demand'));
 if(s.updated)caption.append(text('p',tr(C.labels.updated)+': '+s.updated,'property-updated'));
 if(propertyPhotos(s).length>1)caption.append(text('p',tr(C.labels.photos)+': '+propertyPhotos(s).length,'gallery-details'));
 if(['available','sold'].includes(s.status))caption.append(text('span',C.labels[s.status],'property-status '+s.status));
 const a=text('a',C.labels.enquire,'property-enquiry');const name=tr(s.caption||s.alt);const message=lang==='ur'?'السلام علیکم، اس پراپرٹی کے بارے میں معلومات چاہیے: '+name:'Assalam-o-Alaikum, please share details about this property: '+name;a.href=C.whatsapp+'?text='+encodeURIComponent(message+(details?' ('+details+')':'')+(s.id?' [ID: '+s.id+']':''));a.target='_blank';a.rel='noopener noreferrer';caption.append(a);f.append(caption);gallery.append(f)})
}
function renderOffice(){
 const gallery=document.querySelector('#office-gallery');if(!gallery)return;gallery.replaceChildren();
 const feature=document.querySelector('#office-feature'),featureImg=document.querySelector('#office-feature-image');feature.hidden=!C.office.photos.length;if(C.office.photos.length){featureImg.src=C.office.photos[0].image;featureImg.alt=tr(C.office.photos[0].alt)||tr(C.labels.office)}else{featureImg.removeAttribute('src');featureImg.alt=''}
 C.office.photos.slice(1).forEach(photo=>{const figure=document.createElement('figure'),a=document.createElement('a'),img=document.createElement('img');a.href=photo.image;a.target='_blank';a.rel='noopener noreferrer';img.src=photo.image;img.alt=tr(photo.alt)||tr(C.labels.office);img.loading='lazy';img.width=900;img.height=675;a.append(img);figure.append(a);gallery.append(figure)});
 const hasMore=C.office.photos.length>1;document.querySelector('.office-gallery-section').hidden=!hasMore&&C.office.photos.length>0;document.querySelector('#office-empty').hidden=!!C.office.photos.length;document.querySelector('#office-empty').textContent=lang==='ur'?'دفتر کی تصاویر جلد شامل کی جائیں گی۔':'Office photographs will be added soon.';document.querySelector('#office-gallery-heading').textContent=lang==='ur'?'دفتر کی تصاویر':'A look around our office';
 document.querySelector('#office-address-label').textContent=lang==='ur'?'ہمارا پتہ':'FIND US';document.querySelector('#office-visit-label').textContent=lang==='ur'?'ہمارے دفتر آئیں':'Come visit us';
 const schedule=C.office.schedule,weekly=C.office.weekly,days=document.querySelector('#office-schedule-days'),hours=document.querySelector('#office-schedule-time'),fallback=document.querySelector('#office-hours-fallback'),list=document.querySelector('#office-weekly');
 document.querySelector('#office-hours-label').textContent=lang==='ur'?'دفتر کے اوقات':'Office hours';
 const format=t=>{const [h,m]=t.split(':').map(Number);return ((h%12)||12)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM')};
 days.hidden=weekly.enabled||!schedule.enabled;hours.hidden=weekly.enabled||!schedule.enabled;fallback.hidden=weekly.enabled||schedule.enabled;list.hidden=!weekly.enabled;
 if(schedule.enabled){days.textContent=tr(schedule.days);hours.textContent=format(schedule.opening)+' – '+format(schedule.closing)}
 list.replaceChildren();const names=lang==='ur'?['پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ','اتوار']:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];weekly.days.forEach((d,i)=>{const row=document.createElement('div'),name=text('span',names[i]),value=text('span',d.status==='closed'?(lang==='ur'?'بند':'Closed'):d.status==='unset'?(lang==='ur'?'مقرر نہیں':'Not set'):format(d.opening)+' – '+format(d.closing));if(d.status==='open'){value.dir='ltr';value.className='office-day-time'}row.append(name,value);list.append(row)});
 document.querySelector('#pakistan-clock-wrap').hidden=!schedule.showClock;document.querySelector('#pakistan-clock-label').textContent=lang==='ur'?'پاکستان کا وقت':'Pakistan time';updateOfficeClock();
}
function updateOfficeClock(){const clock=document.querySelector('#pakistan-clock');if(!clock)return;try{clock.textContent=new Intl.DateTimeFormat('en-PK',{timeZone:'Asia/Karachi',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date())}catch(e){clock.textContent=''}}
if(document.querySelector('#pakistan-clock'))setInterval(updateOfficeClock,30000);
function render(){
 document.querySelectorAll('[data-owner-label]').forEach(e=>e.textContent=lang==='ur'?'تعارف دیکھیں':'View profile');
 const floatButton=document.querySelector('.floating-whatsapp');if(floatButton){const b=C.whatsappButton;floatButton.hidden=!b.visible;floatButton.dataset.shape=b.shape;floatButton.dataset.position=b.position;floatButton.style.backgroundColor=b.color;floatButton.replaceChildren();if(b.icon!=='text'){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');const shape=document.createElementNS(icon.namespaceURI,'path');shape.setAttribute('d',b.icon==='phone'?'M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.46.56 3.58a1 1 0 01-.25 1.02z':'M20.52 3.48A11.85 11.85 0 0012.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.96 11.96 0 005.85 1.49c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.5-8.41zM12.05 21.84c-1.77 0-3.51-.47-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.85 9.85 0 01-1.52-5.24c0-5.46 4.44-9.9 9.91-9.9a9.84 9.84 0 017 2.9 9.83 9.83 0 012.9 7c0 5.46-4.44 9.87-9.91 9.87zm5.43-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.49-1.66-1.79-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5 0-.2-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.15-.28-.22-.58-.37z');shape.setAttribute('fill','currentColor');icon.append(shape);floatButton.append(icon)}if(b.shape!=='round'||b.icon==='text'){const label=document.createElement('span');label.textContent='WhatsApp';floatButton.append(label)}floatButton.setAttribute('aria-label','WhatsApp');}
 const ticker=document.querySelector('#announcement');if(ticker){ticker.hidden=!C.announcement.enabled; ticker.querySelector('.ticker-heading').textContent=tr(C.announcement.headline);ticker.querySelector('.ticker-message').textContent=tr(C.announcement.text);ticker.style.setProperty('--ticker-duration',C.announcement.speed+'s');} document.querySelectorAll('.owner-nav').forEach(e=>e.setAttribute('aria-label',lang==='ur'?'رانا عرفان کا تعارف':'View Rana Irfan profile'));
 document.querySelectorAll('[data-t]').forEach(e=>e.textContent=tr(path(e.dataset.t)));
 document.querySelectorAll('[data-image]').forEach(e=>e.src=C[e.dataset.image]);
 document.querySelectorAll('[data-alt]').forEach(e=>e.alt=tr(path(e.dataset.alt)));
 document.querySelectorAll('[data-link]').forEach(e=>e.href=e.dataset.link==='whatsapp'?C.whatsapp+'?text='+encodeURIComponent(lang==='ur'?'السلام علیکم، موجودہ دستیاب پراپرٹیز کے بارے میں معلومات چاہیے۔':'Assalam-o-Alaikum, please share your currently available properties.'):C[e.dataset.link]);
 document.querySelectorAll('[data-developer-email]').forEach(e=>{e.textContent=C.developer.email;e.href='mailto:'+C.developer.email});
 document.querySelectorAll('[data-phone]').forEach(e=>e.textContent=C.phone);
 document.querySelectorAll('[data-poster]').forEach(e=>e.href=C.poster);
 document.querySelector('nav').setAttribute('aria-label',lang==='ur'?'مرکزی نیویگیشن':'Main navigation');
 document.querySelectorAll('[data-nav]').forEach(e=>{if(e.dataset.nav===document.body.dataset.page)e.setAttribute('aria-current','page')});
 document.title=(document.body.dataset.page==='owner'?tr(C.owner):tr(C.labels[document.body.dataset.page]))+' | '+tr(C.seo.title);
 document.querySelector('meta[name="description"]').content=tr(C.seo.description);
 document.querySelectorAll('meta[property="og:title"]').forEach(e=>e.content=tr(C.seo.title));
 document.querySelectorAll('meta[property="og:description"]').forEach(e=>e.content=tr(C.seo.description));
 document.querySelectorAll('meta[property="og:image"]').forEach(e=>e.content=new URL(C.seo.shareImage,document.baseURI).href);
 document.querySelectorAll('link[rel="icon"]').forEach(e=>e.href=C.logo);
 document.querySelectorAll('[data-business-email]').forEach(e=>{e.hidden=!C.email;e.textContent=C.email;e.href='mailto:'+C.email});
 document.querySelectorAll('.memorial-photo').forEach(e=>e.src=C.remembrance.image);
 document.querySelectorAll('.memorial-nav img').forEach(e=>e.src=C.remembrance.icon);
 document.querySelectorAll('.quran-arabic-main').forEach(e=>e.textContent=C.remembrance.arabicVerse);
 document.querySelectorAll('.arabic-prayer').forEach(e=>e.textContent=C.remembrance.arabicPrayer);
 document.querySelectorAll('.memorial-hadith a').forEach(e=>e.href=C.remembrance.hadithUrl);
 const nav=document.querySelector('nav');nav.querySelectorAll('a').forEach(e=>e.remove());
 C.navigation.filter(item=>item.visible).forEach(item=>{const link=text('a',item.label);link.href=item.url;if(item.id===document.body.dataset.page)link.setAttribute('aria-current','page');nav.insertBefore(link,nav.querySelector('[data-open-memorial]'))});
 const profileDetails=document.querySelector('#profile-details');if(profileDetails){profileDetails.replaceChildren();C.profileDetails.forEach(item=>{if(!tr(item.title)&&!tr(item.value))return;const el=document.createElement('div');el.className='profile-detail';el.append(text('strong',item.title),text('p',item.value));profileDetails.append(el)})}
 const socialIcons={facebook:'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.412c0-3.027 1.792-4.699 4.533-4.699 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.49 0-1.956.93-1.956 1.884v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.092 24 18.1 24 12.073z',instagram:'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm6-3a1.2 1.2 0 100 2.4A1.2 1.2 0 0018 6z',tiktok:'M16.7 1c.3 2.5 1.7 4 4.3 4.2v3.1c-1.5.1-2.8-.4-4.3-1.3v6.1c0 7.8-8.5 10.2-11.9 4.6-2.2-3.6-.8-10 6.3-10.2v3.3c-.5.1-1.1.2-1.6.4-1.5.5-2.3 1.4-2.1 3 .3 3.1 6 4 5.5-2V1z',youtube:'M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6z',linkedin:'M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2zM8 19H5V9h3zm-1.5-11A1.5 1.5 0 116.5 5a1.5 1.5 0 010 3zM19 19h-3v-5c0-3-3-2.7-3 0v5h-3V9h3v1.4c1.5-2.7 6-2.9 6 2.6z',x:'M18.9 2h3.7l-8.1 9.2L24 22h-7.4l-5.8-7.5L4.2 22H.5l8.7-10L0 2h7.6l5.2 6.9z'};
 document.querySelectorAll('.social-links').forEach(container=>{container.replaceChildren();C.socialLinks.filter(s=>s.visible&&socialIcons[s.platform]&&/^https:\/\//i.test(s.url)).forEach(s=>{const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',s.platform);a.title=s.platform;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',socialIcons[s.platform]);svg.append(path);a.append(svg);container.append(a)})});
 const services=document.querySelector('#services');if(services){services.replaceChildren();C.services.forEach((s,i)=>{const card=document.createElement('article');card.className='service';const top=document.createElement('div');top.className='service-top';const icon=document.createElement('span');icon.className='service-icon';icon.append(makeIcon(s.icon));icon.setAttribute('aria-hidden','true');top.append(icon,text('span',String(i+1).padStart(2,'0'),'service-no'));card.append(top,text('h3',s.title),text('p',s.text));services.append(card)})}
 const sizes=document.querySelector('#sizes');if(sizes){sizes.replaceChildren();C.sizes.forEach(s=>{const card=document.createElement('div');card.className='size';const parts=tr(s).split(' ');card.append(text('strong',parts.shift(),'size-number'),text('span',parts.join(' '),'size-unit'));sizes.append(card)})}
 const process=document.querySelector('#process');if(process){process.replaceChildren();C.steps.forEach((step,i)=>{const item=document.createElement('article');item.append(text('span',String(i+1).padStart(2,'0'),'step-number'),text('h3',step));process.append(item)})}
 renderGallery();
 renderOffice();
 renderMemorial();
 const faq=document.querySelector('#faq');if(faq){faq.replaceChildren();C.faq.forEach(item=>{const d=document.createElement('details');d.append(text('summary',item.q),text('p',item.a));faq.append(d)})}
 document.querySelectorAll('[data-developer-url]').forEach(e=>{const url=C.developer[e.dataset.developerUrl];e.hidden=!url;if(url)e.href=url;else e.removeAttribute('href')});
 document.querySelectorAll('[data-developer-portfolio]').forEach(e=>e.href=C.developer.portfolio);
 document.querySelectorAll('[data-developer-whatsapp]').forEach(e=>e.href=C.developer.whatsapp);
 const l=document.querySelector('#language');l.textContent=(lang==='en'?'🌐 اردو':'🌐 English');l.lang=lang==='en'?'ur':'en';l.setAttribute('aria-label',lang==='en'?'Switch to Urdu':'انگریزی میں تبدیل کریں');
 const topButton=document.querySelector('#back-to-top');topButton.setAttribute('aria-label',tr(C.labels.backToTop));topButton.title=tr(C.labels.backToTop);
 updateTheme();
}
function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function updateTheme(){const dark=root.dataset.theme==='dark';const b=document.querySelector('#theme');b.textContent=(dark?'☀️ ':'🌙 ')+tr(C.labels[dark?'light':'dark']);b.setAttribute('aria-label',tr(C.labels[dark?'light':'dark']));b.setAttribute('aria-pressed',String(dark))}
document.querySelector('#language').onclick=()=>{lang=lang==='en'?'ur':'en';root.lang=lang;root.dir=lang==='ur'?'rtl':'ltr';save('joyia-language',lang);render()};
document.querySelector('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('joyia-theme',root.dataset.theme);updateTheme()};
const menuToggle=document.querySelector('#menu-toggle'),mainNav=document.querySelector('#main-navigation');
function setMenu(open){if(!menuToggle||!mainNav)return;document.documentElement.dataset.menuOpen=open?'true':'false';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close menu':'Open menu')}
if(menuToggle){setMenu(false);menuToggle.onclick=()=>setMenu(menuToggle.getAttribute('aria-expanded')!=='true');document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){setMenu(false);menuToggle.focus()}});document.addEventListener('click',e=>{if(menuToggle.getAttribute('aria-expanded')==='true'&&!mainNav.contains(e.target)&&!menuToggle.contains(e.target))setMenu(false)})}
const topButton=document.querySelector('#back-to-top');
function updateTopButton(){topButton.hidden=window.scrollY<300}
window.addEventListener('scroll',updateTopButton,{passive:true});
topButton.onclick=()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const main=document.querySelector('#main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});main.addEventListener('blur',()=>main.removeAttribute('tabindex'),{once:true})};
const close=document.querySelector('#close-photo');if(close)close.onclick=()=>document.querySelector('#lightbox').close();
const copy=document.querySelector('.copy-number');if(copy)copy.onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText(C.phone);ok=true}catch(e){const t=document.createElement('textarea');t.value=C.phone;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();try{ok=document.execCommand('copy')}catch(e){}t.remove()}document.querySelector('#copy-status').textContent=tr(C.labels[ok?'copied':'copyFail']);copy.focus()};
document.querySelectorAll('[data-owner-label]').forEach(e=>e.textContent=lang==='ur'?'تعارف دیکھیں':'View profile');
const ownerDialog=document.querySelector('#owner-dialog'),ownerOpen=document.querySelector('#owner-open');
if(ownerDialog&&ownerOpen){ownerOpen.onclick=()=>ownerDialog.showModal();document.querySelector('#owner-close').onclick=()=>ownerDialog.close();ownerDialog.addEventListener('click',e=>{if(e.target===ownerDialog)ownerDialog.close()});}
const ajtechDialog=document.querySelector('#ajtech-dialog');
const ajtechOpen=document.querySelector('#ajtech-open');
if(ajtechDialog&&ajtechOpen){
 const card=document.querySelector('#ajtech-card');
 ajtechOpen.onclick=()=>{card.src='ajtech-card/index.html';ajtechDialog.showModal()};
 document.querySelector('#ajtech-close').onclick=()=>ajtechDialog.close();
 ajtechDialog.addEventListener('close',()=>{card.removeAttribute('src');ajtechOpen.focus()});
 ajtechDialog.addEventListener('click',event=>{if(event.target===ajtechDialog){const r=ajtechDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)ajtechDialog.close()}});
}

let counts=[];try{counts=JSON.parse(localStorage.getItem('joyia-recitation')||'[]')}catch(e){}if(!Array.isArray(counts))counts=[];
function renderMemorial(){const select=document.querySelector('#recitation-select');if(!select)return;const selected=select.value||'0';select.replaceChildren();C.remembrance.tracks.forEach((track,i)=>{const option=text('option',track.name);option.value=String(i);select.append(option)});select.value=selected;
 const box=document.querySelector('#recitation-counters');box.replaceChildren();C.remembrance.counters.forEach((label,i)=>{const card=document.createElement('article');const n=Number.isSafeInteger(counts[i])&&counts[i]>=0?counts[i]:0;counts[i]=n;const value=text('output',String(n));value.setAttribute('aria-live','polite');const button=text('button',C.remembrance.add);button.type='button';button.onclick=()=>{counts[i]++;value.textContent=String(counts[i]);save('joyia-recitation',JSON.stringify(counts))};card.append(text('h4',label),value,button);box.append(card)})}
const memorialDialog=document.querySelector('#memorial-dialog');
if(memorialDialog){let opener;const audio=document.querySelector('#memorial-audio');document.querySelectorAll('[data-open-memorial]').forEach(b=>b.onclick=()=>{opener=b;memorialDialog.showModal()});document.querySelector('#memorial-close').onclick=()=>memorialDialog.close();memorialDialog.addEventListener('close',()=>{audio.pause();opener?.focus()});const select=document.querySelector('#recitation-select');audio.src=C.remembrance.tracks[0].src;select.onchange=()=>{audio.pause();audio.src=C.remembrance.tracks[Number(select.value)].src;document.querySelector('#audio-status').textContent=''};audio.onerror=()=>document.querySelector('#audio-status').textContent=tr(C.remembrance.audioError);document.querySelector('#reset-counters').onclick=()=>{counts=[];save('joyia-recitation','[]');renderMemorial()}}
const prevPhoto=document.querySelector('#photo-prev'),nextPhoto=document.querySelector('#photo-next');if(prevPhoto){prevPhoto.onclick=()=>{if(activePhoto>0){activePhoto--;showPropertyPhoto()}};nextPhoto.onclick=()=>{if(activePhoto<activePhotos.length-1){activePhoto++;showPropertyPhoto()}}}

render();
updateTopButton();
})();