# Live total setup — Roman Urdu

Website GitHub Pages par host hogi. Sirf shared counts Firebase Realtime Database mein save honge. User ka joyiamemorial Firebase config `assets/js/firebase-config.js` mein add kar diya gaya hai. Analytics is counter ke liye zaroori nahi, is liye Analytics initialize nahi kiya gaya.

## Abhi kya baqi hai?
Browser connection test mein Firebase ne `auth/configuration-not-found` return kiya. Is liye shared totals abhi live verify nahi hue aur unavailable state mein buttons disabled hain. Personal counters aur baqi website is se mutasir nahi.

1. Firebase Console mein **joyiamemorial** project kholein.
2. **Build → Authentication → Get started** (agar dikh raha ho) par jayein.
3. **Sign-in method → Anonymous → Enable → Save** karein. Visitor ko koi login form nahi dikhega; website anonymous sign-in khud karti hai.
4. **Build → Realtime Database** kholein. Database URL config ke `https://joyiamemorial-default-rtdb.firebaseio.com` se match hona chahiye.
5. **Rules** tab mein is ZIP ki `firebase-database.rules.json` file ka poora content paste karke **Publish** karein. Yeh rules is memorial-only database ke liye hain; agar isi database mein doosra project/data ho to us ki rules overwrite karne ke bajaye rules merge karein. Root read/write `true` na karein.
6. Updated website files GitHub repository mein upload/replace karke commit karein. GitHub Pages deployment ke baad website refresh karein. `index.html` ko file:// se khol kar Firebase test na karein.
7. Do alag browsers mein Memorial & Prayer popup kholein. Jab status live ho, koi zikr/tilawat parhne ke baad usi shared counter par +1 karein; dono browsers mein woh total badhna chahiye. Verification ke liye jhooti tilawat entries na banayein.

## Counts ka matlab
Shared total visitor-submitted recitation counts hai; unique people ya independently verified recitations nahi. Transactions simultaneous updates handle karti hain. Personal counters browser-only hain aur public total se alag hain. Public reset/delete allowed nahi. Pehli successful read se pehle dash dikhaya jata hai, fabricated total nahi.

Rules sirf four named counters par authenticated +1 allow karti hain. Repeated clicks phir bhi possible hain. Zyada traffic par Firebase App Check aur usage monitoring configure ki ja sakti hai.

## Agar error aaye
- `auth/configuration-not-found`: Authentication setup aur project config check karein.
- `auth/operation-not-allowed`: Anonymous sign-in enable karein.
- `PERMISSION_DENIED`: Realtime Database mein supplied rules publish hui hain ya nahi, check karein.
- Network unavailable: internet restore hone par page refresh karein.

## Official references
- Anonymous sign-in: https://firebase.google.com/docs/auth/web/anonymous-auth
- Realtime Database transactions: https://firebase.google.com/docs/database/web/read-and-write
- Database security: https://firebase.google.com/docs/database/security
- Hadith reference: https://sunnah.com/muslim:1631
