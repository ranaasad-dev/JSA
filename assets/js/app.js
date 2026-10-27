(()=>{
'use strict';
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
 ['all','plots','houses','shops','agricultural'].forEach(key=>{const b=text('button',C.labels[key]);b.type='button';b.setAttribute('aria-pressed',String(category===key));b.onclick=()=>{category=key;renderGallery()};filters.append(b)});
 document.querySelector('#empty').hidden=C.gallery.length>0;
 const items=C.gallery.filter(s=>category==='all'||s.category===category);
 document.querySelector('#filter-status').textContent=C.gallery.length&&!items.length?tr(C.labels.noMatch):'';
 items.forEach(s=>{const f=document.createElement('figure');const open=text('button','','photo-open');open.type='button';open.setAttribute('aria-label',tr(C.labels.openPhoto)+': '+tr(s.caption||s.alt));const im=document.createElement('img');im.src=propertyPhotos(s)[0].src;im.alt=tr(s.alt);im.loading='lazy';im.width=900;im.height=675;open.append(im);open.onclick=()=>{activeProperty=s;activePhotos=propertyPhotos(s);activePhoto=0;showPropertyPhoto();document.querySelector('#lightbox').showModal()};f.append(open);
 const caption=document.createElement('figcaption');if(s.caption)caption.append(text('strong',s.caption));const details=[s.type,s.size,s.area].filter(Boolean).map(tr).filter(Boolean).join(' · ');if(details)caption.append(text('p',details,'gallery-details'));
 if(s.id)caption.append(text('p',tr(C.labels.reference)+': '+s.id,'property-reference'));
 if(s.demand)caption.append(text('p',tr(C.labels.demand)+': '+tr(s.demand),'property-demand'));
 if(s.updated)caption.append(text('p',tr(C.labels.updated)+': '+s.updated,'property-updated'));
 if(propertyPhotos(s).length>1)caption.append(text('p',tr(C.labels.photos)+': '+propertyPhotos(s).length,'gallery-details'));
 if(['available','sold'].includes(s.status))caption.append(text('span',C.labels[s.status],'property-status '+s.status));
 const a=text('a',C.labels.enquire,'property-enquiry');const name=tr(s.caption||s.alt);const message=lang==='ur'?'السلام علیکم، اس پراپرٹی کے بارے میں معلومات چاہیے: '+name:'Assalam-o-Alaikum, please share details about this property: '+name;a.href=C.whatsapp+'?text='+encodeURIComponent(message+(details?' ('+details+')':'')+(s.id?' [ID: '+s.id+']':''));a.target='_blank';a.rel='noopener noreferrer';caption.append(a);f.append(caption);gallery.append(f)})
}
function render(){
 document.querySelectorAll('[data-t]').forEach(e=>e.textContent=tr(path(e.dataset.t)));
 document.querySelectorAll('[data-image]').forEach(e=>e.src=C[e.dataset.image]);
 document.querySelectorAll('[data-alt]').forEach(e=>e.alt=tr(path(e.dataset.alt)));
 document.querySelectorAll('[data-link]').forEach(e=>e.href=e.dataset.link==='whatsapp'?C.whatsapp+'?text='+encodeURIComponent(lang==='ur'?'السلام علیکم، موجودہ دستیاب پراپرٹیز کے بارے میں معلومات چاہیے۔':'Assalam-o-Alaikum, please share your currently available properties.'):C[e.dataset.link]);
 document.querySelectorAll('[data-developer-email]').forEach(e=>{e.textContent=C.developer.email;e.href='mailto:'+C.developer.email});
 document.querySelectorAll('[data-phone]').forEach(e=>e.textContent=C.phone);
 document.querySelectorAll('[data-poster]').forEach(e=>e.href=C.poster);
 document.querySelector('nav').setAttribute('aria-label',lang==='ur'?'مرکزی نیویگیشن':'Main navigation');
 document.querySelectorAll('[data-nav]').forEach(e=>{if(e.dataset.nav===document.body.dataset.page)e.setAttribute('aria-current','page')});
 document.title=tr(C.labels[document.body.dataset.page])+' | '+tr(C.brand);
 document.querySelector('meta[name="description"]').content=tr(C.intro);
 const services=document.querySelector('#services');if(services){services.replaceChildren();C.services.forEach((s,i)=>{const card=document.createElement('article');card.className='service';const top=document.createElement('div');top.className='service-top';const icon=document.createElement('span');icon.className='service-icon';icon.append(makeIcon(s.icon));icon.setAttribute('aria-hidden','true');top.append(icon,text('span',String(i+1).padStart(2,'0'),'service-no'));card.append(top,text('h3',s.title),text('p',s.text));services.append(card)})}
 const sizes=document.querySelector('#sizes');if(sizes){sizes.replaceChildren();C.sizes.forEach(s=>{const card=document.createElement('div');card.className='size';const parts=tr(s).split(' ');card.append(text('strong',parts.shift(),'size-number'),text('span',parts.join(' '),'size-unit'));sizes.append(card)})}
 const process=document.querySelector('#process');if(process){process.replaceChildren();C.steps.forEach((step,i)=>{const item=document.createElement('article');item.append(text('span',String(i+1).padStart(2,'0'),'step-number'),text('h3',step));process.append(item)})}
 renderGallery();
 renderMemorial();
 const faq=document.querySelector('#faq');if(faq){faq.replaceChildren();C.faq.forEach(item=>{const d=document.createElement('details');d.append(text('summary',item.q),text('p',item.a));faq.append(d)})}
 document.querySelectorAll('[data-developer-url]').forEach(e=>{const url=C.developer[e.dataset.developerUrl];e.hidden=!url;if(url)e.href=url;else e.removeAttribute('href')});
 document.querySelectorAll('[data-developer-portfolio]').forEach(e=>e.href=C.developer.portfolio);
 document.querySelectorAll('[data-developer-whatsapp]').forEach(e=>e.href=C.developer.whatsapp);
 const l=document.querySelector('#language');l.textContent=lang==='en'?'اردو':'English';l.lang=lang==='en'?'ur':'en';l.setAttribute('aria-label',lang==='en'?'Switch to Urdu':'انگریزی میں تبدیل کریں');
 const topButton=document.querySelector('#back-to-top');topButton.setAttribute('aria-label',tr(C.labels.backToTop));topButton.title=tr(C.labels.backToTop);
 updateTheme();
}
function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function updateTheme(){const dark=root.dataset.theme==='dark';const b=document.querySelector('#theme');b.textContent=(dark?'☀ ':'☾ ')+tr(C.labels[dark?'light':'dark']);b.setAttribute('aria-label',tr(C.labels[dark?'light':'dark']));b.setAttribute('aria-pressed',String(dark))}
document.querySelector('#language').onclick=()=>{lang=lang==='en'?'ur':'en';root.lang=lang;root.dir=lang==='ur'?'rtl':'ltr';save('joyia-language',lang);render()};
document.querySelector('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('joyia-theme',root.dataset.theme);updateTheme()};
const topButton=document.querySelector('#back-to-top');
function updateTopButton(){topButton.hidden=window.scrollY<300}
window.addEventListener('scroll',updateTopButton,{passive:true});
topButton.onclick=()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const main=document.querySelector('#main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});main.addEventListener('blur',()=>main.removeAttribute('tabindex'),{once:true})};
const close=document.querySelector('#close-photo');if(close)close.onclick=()=>document.querySelector('#lightbox').close();
const copy=document.querySelector('.copy-number');if(copy)copy.onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText(C.phone);ok=true}catch(e){const t=document.createElement('textarea');t.value=C.phone;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();try{ok=document.execCommand('copy')}catch(e){}t.remove()}document.querySelector('#copy-status').textContent=tr(C.labels[ok?'copied':'copyFail']);copy.focus()};
const developerDialog=document.querySelector('#developer-dialog');
const developerOpen=document.querySelector('#developer-open');
if(developerDialog&&developerOpen){
 developerOpen.onclick=()=>developerDialog.showModal();
 document.querySelector('#developer-close').onclick=()=>developerDialog.close();
 developerDialog.addEventListener('close',()=>developerOpen.focus());
 developerDialog.addEventListener('click',event=>{if(event.target===developerDialog){const r=developerDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)developerDialog.close()}});
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