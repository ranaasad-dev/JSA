/* Shared content defaults and validation. Database RLS, not this file, enforces access. */
(()=>{
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const bi=(en='',ur='')=>({en,ur});
function normalize(input){
 const c=clone(input);
 c.categories??=['plots','houses','shops','agricultural'].map(id=>({id,name:clone(c.labels[id])}));
 c.navigation??=[{id:'home',label:clone(c.labels.home),url:'index.html',visible:true},{id:'gallery',label:clone(c.labels.gallery),url:'gallery.html',visible:true},{id:'contact',label:clone(c.labels.contact),url:'contact.html',visible:true}];
 c.appearance??={defaultTheme:'light',defaultLanguage:'en',accent:'#dbb765'};
 c.appearance.brandColor??='#072b49';
 c.appearance.font??='classic';
 c.appearance.fontSize??=17;
 c.appearance.headingStyle??='bold';
 c.socialLinks??=c.tiktok?[{platform:'tiktok',url:c.tiktok,visible:true}]:[];
 c.appearance.palette??='custom';
 c.whatsappButton??={visible:true,shape:'pill',icon:'whatsapp',color:'#176044',position:'right'};
 c.appearance.menuLayout??='horizontal';
 c.profileDetails??=[];
 c.announcement??={enabled:false,headline:{en:'Announcements',ur:'اعلانات'},text:{en:'Welcome to Joyia Estate Advisor',ur:'جویہ اسٹیٹ ایڈوائزر میں خوش آمدید'},speed:25};
 c.developer.card??={name:'Rana Asad Arshad',role:'Aspiring Data Analyst · Developer · Creative Designer',education:'BS Computer Science · Superior University',intro:'Building useful websites, data projects, and professional posters & banners.',email:'ajtech.dev17@gmail.com',portfolio:'https://ranaasad-dev.github.io/rana_Asad_Portfolio/',whatsapp:'https://wa.me/923401640693',linkedin:'https://www.linkedin.com/in/rana-asad-arshad-pk',github:'https://github.com/ranaasad-dev',image:'assets/images/ajtech-profile.webp'};
 c.seo??={title:clone(c.brand),description:clone(c.intro),shareImage:'assets/images/share-preview.jpg'};
 c.email??='';
 c.ownerBio??=bi();
 c.developer.connect??='https://ranaasad-dev.github.io/ajtech-connect/';
 c.remembrance.icon??='assets/images/memorial-icon.png';
 c.remembrance.arabicVerse??='كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۖ ثُمَّ إِلَيْنَا تُرْجَعُونَ';
 c.remembrance.arabicPrayer??='إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ';
 c.remembrance.hadithUrl??='https://sunnah.com/muslim:1631';
 return c;
}
function safeUrl(value,kind='link'){
 if(typeof value!=='string')return false;
 if(!value)return true;
 if(/[\u0000-\u0020\\]/.test(value))return false;
 if(kind==='image')return /^https:\/\//i.test(value)||/^assets\/images\/[\w./%-]+$/i.test(value);
 if(kind==='audio')return /^https:\/\//i.test(value)||/^assets\/audio\/[\w./%-]+$/i.test(value);
 return /^(https?:\/\/|mailto:|tel:)/i.test(value)||/^(?:index|gallery|contact)\.html(?:#[\w-]+)?$/.test(value)||/^#[\w-]+$/.test(value);
}
function validate(c){
 const fail=m=>{throw new Error(m)};
 for(const k of ['brand','owner','headline','intro','labels','developer','remembrance'])if(!c[k]||typeof c[k]!=='object')fail('Missing content section: '+k);
 for(const k of ['services','sizes','steps','faq','gallery','categories','navigation'])if(!Array.isArray(c[k]))fail('Invalid list: '+k);
 if(c.remembrance.counters.length!==4||!c.remembrance.tracks.length)fail('Keep four memorial counters and at least one audio track.');
 const ids=new Set();for(const p of c.gallery){if(!p.id||ids.has(p.id))fail('Each property needs a unique reference.');ids.add(p.id);if(!['available','sold'].includes(p.status))fail('Choose Available or Sold for '+p.id);if(!c.categories.some(x=>x.id===p.category))fail('Choose a valid category for '+p.id);const photos=p.photos?.length?p.photos:[p.src];if(!photos.length||photos.some(x=>!x||!safeUrl(typeof x==='string'?x:x.src,'image')))fail('Add a valid photo for '+p.id)}
 const cats=new Set();for(const cat of c.categories){if(!/^[a-z0-9-]+$/.test(cat.id)||cat.id==='all'||cats.has(cat.id))fail('Category IDs must be unique lowercase words without spaces.');cats.add(cat.id)}
 if(!c.navigation.some(x=>x.visible))fail('Keep at least one menu link visible.');
 if(!c.whatsappButton||typeof c.whatsappButton.visible!=='boolean'||!['pill','round','square'].includes(c.whatsappButton.shape)||!['whatsapp','phone','text'].includes(c.whatsappButton.icon)||!['left','right'].includes(c.whatsappButton.position)||!/^#[0-9a-f]{6}$/i.test(c.whatsappButton.color))fail('Invalid WhatsApp button settings.');
 if(!['horizontal','vertical','menu'].includes(c.appearance.menuLayout)||!Array.isArray(c.profileDetails))fail('Invalid profile or menu settings.');
 if(!Number.isFinite(Number(c.appearance.fontSize))||Number(c.appearance.fontSize)<14||Number(c.appearance.fontSize)>22||!['bold','elegant'].includes(c.appearance.headingStyle))fail('Font settings are invalid.');
 if(!Array.isArray(c.socialLinks)||c.socialLinks.some(x=>!['tiktok','facebook','instagram','youtube','linkedin','x'].includes(x.platform)||!/^https:\/\//i.test(x.url)||!safeUrl(x.url)))fail('Social media links must be valid HTTPS links.');
 if(!Number.isFinite(Number(c.announcement.speed)) || Number(c.announcement.speed)<5 || Number(c.announcement.speed)>120)fail('Announcement speed must be between 5 and 120 seconds.');
 if(!/^#[0-9a-f]{6}$/i.test(c.appearance.brandColor)||!['classic','modern'].includes(c.appearance.font))fail('Invalid brand colour or font.');
 if(!['light','dark'].includes(c.appearance.defaultTheme)||!['en','ur'].includes(c.appearance.defaultLanguage)||!/^#[0-9a-f]{6}$/i.test(c.appearance.accent))fail('Invalid appearance settings.');
 const imageKeys=new Set(['logo','portrait','poster','heroImage','image','icon','shareImage']);
 const linkKeys=new Set(['call','whatsapp','tiktok','directions','portfolio','github','linkedin','connect','url','hadithUrl']);
 function walk(v,path=[]){if(v===null||typeof v!=='object')return;for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))fail('Invalid field');if(typeof x==='string'){
  if(x.length>20000)fail('Text is too long: '+k);
  if(imageKeys.has(k)&&!(k==='icon'&&(path[0]==='services'||path[0]==='whatsappButton'))&&!safeUrl(x,'image'))fail('Invalid image URL: '+k);
  if(linkKeys.has(k)&&!safeUrl(x))fail('Invalid link: '+k);
  if(k==='src'&&!safeUrl(x,path.includes('tracks')?'audio':'image'))fail('Invalid media URL');
 }else walk(x,[...path,k])}}
 walk(c);return c;
}
window.JSA_MODEL={normalize,validate,safeUrl,clone,bi};
})();
