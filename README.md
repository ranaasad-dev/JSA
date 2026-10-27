# Joyia Estate Advisor — GitHub editing guide

## Pehli baar preview
ZIP extract karein. `index.html` browser mein kholein. English/Urdu aur theme controls test karein. Urdu font pehli dafa internet se load hota hai; internet na ho to fallback font use hoga.

## GitHub par upload aur hosting
1. GitHub par sign in karke naya repository banayein, misal `joyia-estate`.
2. Repository mein Add file > Upload files karein.
3. Extracted folder KE ANDAR ki files upload karein. `index.html` repository ke root par hona chahiye, extra folder ke andar nahi. ZIP upload karne se website nahi chalegi.
4. Commit changes karein.
5. Settings > Pages > Build and deployment mein Deploy from a branch choose karein, branch main aur folder /(root), phir Save.
6. Deployment complete hone par Pages section ka website link kholein. Agar option account/plan mein available na ho to GitHub ki current Pages eligibility check karein.
7. Baad ki har edit Commit changes se save karein; successful deployment ke baad website update hogi. Actions tab mein status dekh sakte hain.

## Text, services, plot sizes, number, address
`assets/js/site-content.js` > pencil/Edit button.
- `en` English, `ur` Urdu text hai. Dono update karein.
- Naam, headline, intro, slogan, memorial, address aur links isi file mein hain.
- `services` list mein title aur text edit karein.
- `sizes` list mein size add/remove/change karein.
- Quotes, commas aur brackets na hatayein. Har field ke andar text replace karein.
- Text mein double quote chahiye to \" likhein.
- Phone badalte waqt phone, call aur whatsapp teeno update karein.
- Poster ka address "چھانگا مانگا روڈ گندھیاں روڈ چوک، کوٹ رادھا کشن" transcribe kiya gaya hai; publish karne se pehle local spelling check kar lein.

## Profile picture aur logo
`assets/images/profile.png` aur `assets/images/logo.jpg` ko same naam aur correct format ki file se replace karein. New filename/format ho to site-content.js ke portrait/logo path bhi update karein. Sirf extension rename karke format convert nahi hota. Original portrait ko AI se modify nahi kiya gaya.

## Gallery: abhi khaali, baad mein apni photos
1. `assets/images/gallery/` kholo > Add file > Upload files. Simple filename rakhein: `plot-1.jpg`.
2. `site-content.js` mein `"gallery": []` dhoondein.
3. Isay replace karein:
```js
"gallery": [
  {
    "src": "assets/images/gallery/plot-1.jpg",
    "alt": {"en": "Plot view", "ur": "پلاٹ کا منظر"},
    "caption": {"en": "Plot view", "ur": "پلاٹ کا منظر"}
  }
],
```
4. Har aglay photo ka object comma se separate karein. File ke start par bhi example hai.
5. Entry ka order badalne se photo ka order badlega. Entry delete karne se photo gallery se hat jayegi.
6. Gallery khaali hone par bilingual message automatic aata hai. Koi fake property photos nahi hain.
7. JPG/PNG/WebP use karein. Photos ko upload se pehle compress karein; ideally under 500 KB. Gallery ki count limit nahi.

## Colours aur layout
`assets/css/style.css` ke start mein CSS variables hain. `--gold`, `--navy`, `--bg` edit karein. Dark mode variables neeche hain. Layout badalne ke liye CSS/HTML knowledge chahiye; daily content changes ke liye HTML edit nahi karna.

## Galti ho jaye
Edit se pehle file ka backup rakhein. GitHub file > History mein last working version kholein, uska content copy karke current file mein paste karein aur commit karein. Deployment fail ho to Actions ka error dekhein. Old image nazar aaye to hard refresh (Ctrl+F5) karein.

## Notes
Website ke andar admin dashboard nahi. GitHub hi editing interface hai. localStorage sirf visitor ki language/theme preference save karta hai. Repo mein private documents ya passwords upload na karein.
Poster ki "ملک پلاٹ" wording ko residential plots ke liye "رہائشی پلاٹ" likha gaya hai. Original poster link home page par hai. Memorial text preserve kiya hai; buzurg ki alag photo supply nahi hui is liye separate portrait invent nahi kiya.

## Developer credit
`site-content.js` ke `developer` section mein credit aur email edit kar sakte hain. Email link automatic update hota hai.

## Updated version: profile, icons, gallery details
Ab active logo `assets/images/logo.webp` aur profile `assets/images/profile.webp` hain. New JPG/PNG upload karna ho to site-content.js mein logo/portrait path bhi change karein. Old original files backup ke liye rakhi hain.
Services ke `icon` options: plot, commercial, shop, house, field, key.
`steps` mein process ka text aur `directions` mein Google Maps link editable hai. Directions button ab owner ke supplied Google Maps share link se connected hai.
Gallery entry ka complete example:
```js
{
 "src": "assets/images/gallery/plot-1.jpg",
 "alt": {"en":"Plot view", "ur":"پلاٹ کا منظر"},
 "caption": {"en":"Residential plot", "ur":"رہائشی پلاٹ"},
 "type": {"en":"Residential", "ur":"رہائشی"},
 "size": {"en":"5 Marla", "ur":"5 مرلہ"},
 "area": {"en":"Kot Radha Kishan", "ur":"کوٹ رادھا کشن"}
}
```
Sirf actual photo ki sahi information likhein. Type, size aur area optional hain.
Mobile contact bar har page par hai. Back-to-top arrow 300px scroll ke baad nazar aata hai. Reduced motion setting mein instant top par jata hai.

## New gallery features
Gallery abhi khaali hai. Real images add hone par filters, Available/Sold labels, enlarge button aur property-specific WhatsApp automatic work karenge.
Har entry mein ye optional fields add karein:
```js
"id": "P001",
"category": "plots",
"status": "available"
```
Category sirf `plots`, `houses`, `shops`, `agricultural` rakhein. Commercial plots bhi `plots` mein hain. Status `available` ya `sold`; confirm na ho to field omit karein. `caption`, `alt`, `type`, `size`, `area` English/Urdu objects hain. Image click par bari view khulti hai; Close ya Escape se band hoti hai. WhatsApp message sirf prefill hota hai, visitor khud send karega.
FAQ aur developer credit/portfolio/WhatsApp site-content.js mein editable hain. Property contact 0300-0970707 aur developer 0340-1640693 alag hain. Business branding poster ke mutabiq JOYIA ESTATE ADVISOR rakhi hai.
## WhatsApp link-sharing preview setup
Branded image aur Open Graph tags included hain. Final hosted URL abhi nahi mila, is liye preview fully verified nahi.
Live URL milne par terminal mein `python configure-sharing.py https://YOUR-ACTUAL-SITE-URL/` chalayein (placeholder ko asli website URL se replace karein). Updated HTML, sitemap.xml aur robots.txt upload karein. Ya HTML files mein og:image ko image ke full HTTPS URL se manually replace karein. WhatsApp apna preview cache kar sakta hai.
## Privacy
Website par form ya inquiry database nahi. WhatsApp link external WhatsApp kholta hai; message send karna visitor ka action hai. Language/theme preference browser mein save hoti hai. Public gallery mein sirf publication ke liye approved images/details add karein.


## New landscape Home design
Home page par owner ki photo nahi hai. Owner photo sirf Contact page par hai.
Home background AI-created conceptual landscape hai, real available property nahi.
Background badalne ke liye `assets/images/property-landscape.webp` ko apni image se replace karein, ya `site-content.js` mein `heroImage` path change karein. Wide landscape image use karein. Heading image mein nahi hai; English/Urdu text alag edit ho sakta hai.


## Ajtech.dev developer branding
Footer mein chhota credit click karne par developer popup khulta hai. Close button, Escape key aur popup ke bahar click se band hota hai.
`assets/js/site-content.js` ke `developer` section mein name, brand, bio, portfolio, github, linkedin, whatsapp aur email edit karein. LinkedIn, GitHub aur portfolio ke links add hain. Kisi optional link ko blank karne par uska button hide ho jayega.
Future project ke liye developer-signature aur developer-dialog markup, related CSS aur dialog JS reuse kar sakte hain; content ko us project ki central file se connect karein. Client ke business contact ko developer contact se alag rakhein.


## Property listing with multiple photos (GitHub Pages)
Gallery abhi khaali hai; asli photos milne par `site-content.js` ki `gallery` list mein entry add karein. Sample ko apni confirmed details se replace karein:
```javascript
{
  "id": "JEA-001",
  "caption": {"en": "Property name", "ur": "پراپرٹی کا نام"},
  "alt": {"en": "Property view", "ur": "پراپرٹی کا منظر"},
  "category": "plots",
  "type": {"en": "Residential plot", "ur": "رہائشی پلاٹ"},
  "size": {"en": "5 Marla", "ur": "5 مرلہ"},
  "area": {"en": "Confirmed location", "ur": "تصدیق شدہ علاقہ"},
  "demand": {"en": "Owner-confirmed demand", "ur": "مالک کی تصدیق شدہ قیمت"},
  "status": "available",
  "updated": "2026-10-27",
  "photos": [
    "assets/images/gallery/jea-001-front.jpg",
    "assets/images/gallery/jea-001-street.jpg",
    "assets/images/gallery/jea-001-inside.jpg"
  ]
}
```
Har property ka unique ID rakhein. Photos ki pehli image cover hogi. 3–5 photos add kar sakte hain. Purani single `src` entries bhi supported hain. Category: plots/houses/shops/agricultural. Status: available/sold. Demand ya updated omit karne par woh line hide ho jayegi. Date manually update hoti hai; automatic availability nahi.

## Memorial
Sticky menu ke chhote Memorial & Prayer icon, Home ke memorial text ya footer se popup kholein. Emerald/gold theme light aur dark dono modes mein same hai. Is mein supplied framed photo, ayat (Al-Ankabut 29:57), dua, Sahih Muslim 1631 ki hadees ka mafhoom aur reference link shamil hain. `assets/js/site-content.js` ke `remembrance` section se text, photo aur audio edit karein.

Sirf do user-supplied audio files active hain: `assets/audio/ayat.mp3` (selected recitation, taqreeban 1 minute) aur `assets/audio/yaseen.mp3` (taqreeban 17 minute 40 seconds). Dono ZIP mein shamil hain; GitHub par audio folder zaroor upload karein. Audio Play dabane par chalti hai, track badalne ya popup band karne par rukti hai. Audio automatically download/play nahi hoti.

Personal counters sirf isi browser mein save hote hain. Shared totals Firebase Realtime Database ke liye alag hain; personal counters automatically shared totals mein upload nahi hote. Supplied Firebase config add hai, lekin browser test mein `auth/configuration-not-found` aaya. Live totals chalane ke liye `FIREBASE-SETUP.md` ke mutabik Firebase Console setup aur rules publication baqi hain.

## Office hours
Confirmed timings na milne ki wajah se visit se pehle contact karne ka message hai. `officeHours` mein confirmed timings add kar sakte hain. Sticky navigation sab teen pages par hai.
