"""A controlled local repair experiment using unchanged upstream crawl/audit/verify.

Never writes to obsidian.md. Fixtures are research-owned pages based on public facts.
"""
import copy
import json
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'upstream/geolook/scripts'))
import geolib as G
import crawl, audit, tasks, generate, verify

SLUG='obsidian-lab'
URL='http://127.0.0.1:8771'
OUT=ROOT/'projects/013-geolook/experiments/lab-evidence'
OUT.mkdir(parents=True,exist_ok=True)
phase='before'
intro='''<h1>Obsidian: local notes and linked thinking</h1>
<p>This page is an independent research demonstration, not the official Obsidian website. It exists only on this computer to test GeoLook's technical checks. Product descriptions are based on the public Obsidian website. No claims about marketing results or customer conversions are made here.</p>
<h2>What is Obsidian?</h2><p>Obsidian is a note-taking application that stores notes as local Markdown files. A collection of notes is called a vault. People can keep their notes on their own devices, read them offline, and connect related notes with links. These properties make the application relevant to personal knowledge management. The suitability of any application still depends on a user's needs and workflow.</p>
<h2>What do the optional services do?</h2><p>Obsidian Sync is an optional service for synchronizing notes across devices. Obsidian Publish is an optional service for publishing notes as a website. This research page deliberately does not include prices or plan limits that have not been checked. Readers should verify current terms on the official pages.</p>
<h2>How should this page be interpreted?</h2><p>A crawler finding structured information on this local page proves only that the technical change is visible to that crawler. It does not mean that a search engine has indexed the page, that an AI model will recommend Obsidian more often, or that a business will receive more orders.</p>
<p>Sources: <a href="https://obsidian.md/">Obsidian official website</a>, <a href="https://obsidian.md/sync">Sync</a>, <a href="https://obsidian.md/publish">Publish</a>.</p>'''

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path=self.path.split('?')[0]
        ok=phase in ('after','restored')
        kind='text/plain; charset=utf-8'
        if path=='/':
            schema=''
            if ok:
                f=G.project_dir(SLUG)/'assets/jsonld/software-application.json'
                schema='<script type="application/ld+json">'+f.read_text(encoding='utf-8')+'</script>' if f.exists() else ''
            body=f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Obsidian research page</title><link rel="canonical" href="{URL}/">{schema}</head><body>{intro}<p>Local experiment phase: {phase}</p></body></html>'
            kind='text/html; charset=utf-8'
        elif path=='/robots.txt':body='User-agent: *\nAllow: /\n'+(f'Sitemap: {URL}/sitemap.xml\n' if ok else '')
        elif path=='/sitemap.xml' and ok:
            body=f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{URL}/</loc></url></urlset>'
            kind='application/xml; charset=utf-8'
        elif path=='/llms.txt' and ok:body=(G.project_dir(SLUG)/'assets/llms.en.txt').read_text(encoding='utf-8')
        else:self.send_error(404);return
        data=body.encode('utf-8');self.send_response(200);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
    def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',8771),Handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
cfg=copy.deepcopy(G.load_config('obsidian-real'))
cfg.update(slug=SLUG,questions=[],platforms=[],notes='仅本地技术修复实验；不是官网改动，也不是营销效果采样。')
cfg['brand']['site']=URL
cfg['brand']['name']='Obsidian 研究副本'
cfg['pages']={'seed':[],'max':1}
G.save_config(SLUG,cfg)
(G.project_dir(SLUG)/'content').mkdir(exist_ok=True)
(G.project_dir(SLUG)/'content/facts.md').write_text((G.project_dir('obsidian-real')/'content/facts.md').read_text(encoding='utf-8'),encoding='utf-8')
timeline=[]
for current in ['before','after','regressed','restored']:
    phase=current
    print('LOCAL PHASE:',phase,flush=True)
    crawl.run(SLUG,max_pages=1,delay=0)
    a=audit.run(SLUG)
    if phase=='before':
        tasks.build(SLUG)
        generate.run(SLUG,with_draft=False)
    result=verify.run(SLUG,recrawl=False)
    target=[t for t in tasks.load(SLUG)['tasks'] if t.get('acceptance',{}).get('check') in ('pages.has_jsonld','site.has_sitemap','site.has_llms_txt')]
    snapshot={'phase':phase,'timestamp':G.now_iso(),'score':a['avg_score'],'site':a['site'],'target_tasks':target,'verify':result}
    (OUT/(phase+'.json')).write_text(json.dumps(snapshot,ensure_ascii=False,indent=2),encoding='utf-8')
    timeline.append(snapshot)
(OUT/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding='utf-8')
for s in timeline:print(s['phase'],[(t['acceptance']['check'],t['status']) for t in s['target_tasks']],flush=True)
assert all(t['status']=='done' for t in timeline[1]['target_tasks'])
assert all(t['status']=='todo' for t in timeline[2]['target_tasks'])
assert all(t['status']=='done' for t in timeline[3]['target_tasks'])
print('PASS: actual upstream checks closed, reopened, and restored local tasks. Serving repaired page at '+URL,flush=True)
threading.Event().wait()
