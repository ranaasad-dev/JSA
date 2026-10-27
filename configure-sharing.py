from pathlib import Path
from urllib.parse import urlsplit
import re,sys
base=sys.argv[1].rstrip('/')+'/' if len(sys.argv)>1 else ''
assert urlsplit(base).scheme=='https' and urlsplit(base).netloc, 'Use your actual HTTPS website URL'
p=Path(__file__).resolve().parent
for name in ['index.html','gallery.html','contact.html']:
 f=p/name;s=f.read_text();s=re.sub(r'<meta property="og:image" content="[^"]*">','<meta property="og:image" content="'+base+'assets/images/share-preview.jpg">',s)
 s=re.sub(r'<link rel="canonical"[^>]*>|<meta property="og:url"[^>]*>','',s)
 s=s.replace('</head>','<link rel="canonical" href="'+base+name+'"><meta property="og:url" content="'+base+name+'"></head>');f.write_text(s)
(p/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+base+n+'</loc></url>' for n in ['index.html','gallery.html','contact.html'])+'</urlset>')
(p/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n')
print('Sharing metadata configured. Upload updated HTML, sitemap.xml and robots.txt.')
