"""Run unchanged upstream modules on the prepared real case inside WSL."""
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT/'upstream/geolook/scripts'))
import crawl, audit, tasks, blueprint, generate, report, verify, deliverables, deliver

slug='obsidian-real'
mode=sys.argv[1] if len(sys.argv)>1 else 'crawl'
if mode=='crawl':
    crawl.run(slug,max_pages=12)
    audit.run(slug)
elif mode=='outputs':
    tasks.build(slug)
    blueprint.build(slug)
    generate.run(slug,with_draft=False)
    report.run(slug)
    verify.run(slug,recrawl=False)
    deliverables.run(slug)
    deliver.run(slug)
else:raise SystemExit('mode must be crawl or outputs')
