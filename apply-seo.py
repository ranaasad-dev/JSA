"""Run: python apply-seo.py jsa-seo.json .
Updates static social metadata on the three public pages without touching scripts.
Export jsa-seo.json from Admin > Backup first. Commit resulting HTML to GitHub.
"""
import json, sys, re, html
from pathlib import Path
from urllib.parse import urljoin
seo=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
root=Path(sys.argv[2] if len(sys.argv)>2 else '.')
def en(v): return v.get('en') or v.get('ur','') if isinstance(v,dict) else str(v)
title=html.escape(en(seo['title']),quote=True)
description=html.escape(en(seo['description']),quote=True)
image=html.escape(urljoin('https://ranaasad-dev.github.io/JSA/',seo['shareImage']),quote=True)
for filename in ['index.html','gallery.html','contact.html']:
 p=root/filename;s=p.read_text(encoding='utf-8')
 s=re.sub(r'<title>.*?</title>',lambda m:'<title>'+title+'</title>',s,flags=re.S)
 for attr,key,value in [('name','description',description),('property','og:title',title),('property','og:description',description),('property','og:image',image)]:
  pattern=r'<meta '+attr+'="'+re.escape(key)+r'" content="[^"]*">'
  replacement='<meta '+attr+'="'+key+'" content="'+value+'">'
  if re.search(pattern,s):s=re.sub(pattern,lambda m:replacement,s)
  else:s=s.replace('</head>',replacement+'</head>')
 p.write_text(s,encoding='utf-8');print('Updated',filename)
