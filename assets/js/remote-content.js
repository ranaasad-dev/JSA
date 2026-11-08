/* Load public content only. No admin session is read on public pages. */
(()=>{
'use strict';
const model=window.JSA_MODEL, fallback=model.normalize(window.SITE_CONTENT);
window.SITE_CONTENT=fallback;
window.JSA_CONTENT_READY=(async()=>{
 try{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);
  let response;try{response=await fetch(window.JSA_CONFIG.url+'/rest/v1/jsa_content?id=eq.website&select=content',{headers:{apikey:window.JSA_CONFIG.key},signal:controller.signal,cache:'no-store'})}finally{clearTimeout(timer)}
  if(!response.ok)throw Error('Content unavailable');
  const rows=await response.json();
  if(rows[0]?.content){const next=model.validate(model.normalize(rows[0].content));for(const key of Object.keys(fallback))delete fallback[key];Object.assign(fallback,next);}
 }catch(e){console.warn('Using bundled website content.');}
 const root=document.documentElement;
 try{if(!localStorage.getItem('joyia-language')){root.lang=fallback.appearance.defaultLanguage;root.dir=root.lang==='ur'?'rtl':'ltr'}if(!localStorage.getItem('joyia-theme'))root.dataset.theme=fallback.appearance.defaultTheme}catch(e){}
 root.style.setProperty('--gold',fallback.appearance.accent);
 root.style.setProperty('--navy',fallback.appearance.brandColor);
 root.dataset.menuLayout=fallback.appearance.menuLayout;
 root.dataset.font=fallback.appearance.font;
 root.dataset.headingStyle=fallback.appearance.headingStyle;
 root.style.setProperty('--body-font-size',fallback.appearance.fontSize+'px');
 return fallback;
})();
})();
