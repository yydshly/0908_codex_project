"""Check the published guide's real local links and data consistency."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[3]
PROJECT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'web' / PROJECT.name

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.ids=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for key in ('href','src'):
            if attrs.get(key): self.links.append(attrs[key])

def main():
    missing=[]
    for path in WEB.rglob('*.html'):
        parser=Links(); parser.feed(path.read_text(encoding='utf-8'))
        assert len(parser.ids)==len(set(parser.ids)), f'Duplicate HTML ID: {path}'
        for href in parser.links:
            url=urlsplit(href)
            if url.scheme or url.netloc: continue
            if not url.path:
                if url.fragment and url.fragment not in parser.ids: missing.append((str(path),href))
                continue
            target=(path.parent / unquote(url.path)).resolve()
            # The main page links back to the site root, which is generated separately.
            if href=='../../': continue
            if target.is_dir():target=target/'index.html'
            if not target.is_file():missing.append((str(path),href))
    assert not missing,missing
    payload=(WEB/'assets/content.js').read_text(encoding='utf-8')
    data=json.loads(payload.removeprefix('window.GUIDE_DATA = ').strip().removesuffix(';'))
    assert len(data['phases'])==20 and data['lessonCount']==523 and len(data['terms'])==100
    lessons=[l for p in data['phases'] for l in p['lessons']]
    assert len(lessons)==len({l['path'] for l in lessons})==523
    for t in data['terms']: assert 0<=int(t['phase'])<20
    for file in ['learning-guide.md','course-catalog.md','learning-record.md']:
        assert (PROJECT/'notes'/file).read_bytes()==(WEB/'downloads'/file).read_bytes()
    assert (PROJECT/'assets/capability-map.png').read_bytes()==(WEB/'assets/capability-map.png').read_bytes()
    for path in [PROJECT/'README.md',WEB/'index.html',PROJECT/'data/guide.json']:
        assert '002-ai-engineering-from-scratch' not in path.read_text(encoding='utf-8')
    print('PASS: local links, unique IDs, 20 phases / 523 lessons / 100 terms, image and document parity.')

if __name__=='__main__':main()
