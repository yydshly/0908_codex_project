"""Check evidence consistency, exclusions, local task transitions and file links."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
W=ROOT/'web/013-geolook'
data=json.loads((W/'real/case-data.json').read_text(encoding='utf-8'))
rows=[json.loads(x) for x in (W/'real/samples.jsonl').read_text(encoding='utf-8').splitlines()]
assert len(rows)==len(data['samples'])==4
assert len({(r['question_id'],r['platform'],r['round'],r['ts']) for r in rows})==4
eligible=[r for r in rows if not r['brand_in_question']]
assert len(eligible)==3
assert sum(r['analysis']['brand_mentioned'] for r in eligible)==2
assert all(r['evidence_level']=='D_待复核' for r in rows)
assert next(r for r in rows if r['question_id']=='q103')['search_enabled'] is None
assert data['metrics']['platforms']['chatgpt']['mention_rate']==.667
assert data['metrics']['sample_count']==4
assert data['audit']['page_count']==12
assert len(data['tasks']['tasks'])==18
assert len(data['asset_index']['assets'])==12
for phase,status in zip(data['lab'],['todo','done','todo','done']):
    assert len(phase['target_tasks'])==3
    assert all(t['status']==status for t in phase['target_tasks'])
    assert all(t['evidence'] for t in phase['target_tasks'])
for f in data['files']: assert (W/f['url']).is_file(),f
assert '<填>' in data['assets']['jsonld']
assert '"operatingSystem": "Web"' in data['assets']['jsonld']
print('PASS: 4 unique real samples, probe exclusion, 12 pages, 18 tasks, 12 asset entries, 4 real lab phases, all deliverables present.')
