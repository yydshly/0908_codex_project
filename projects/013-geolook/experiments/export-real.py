"""Publish measured outputs into a static walkthrough without fabricating data."""
import json
import shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
P=ROOT/'upstream/geolook/work/obsidian-real'
W=ROOT/'web/013-geolook/real'
W.mkdir(parents=True,exist_ok=True)
read=lambda f:json.loads(f.read_text(encoding='utf-8'))
cfg=read(P/'geo.json')
audit=read(P/'audit.json')
metric_files=sorted((P/'metrics').glob('*.json'))
metrics=read(metric_files[-1]) if metric_files else None
sample_files=sorted((P/'samples').glob('*.jsonl'))
samples=[json.loads(line) for f in sample_files for line in f.read_text(encoding='utf-8').splitlines() if line.strip()]
unique={ (r['question_id'],r['platform'],r['round']):r for r in samples }
samples=list(unique.values())
verify_files=sorted((P/'verify').glob('*.json'))
lab=read(Path(__file__).parent/'lab-evidence/timeline.json')
data={'meta':{'upstream':'https://github.com/aigclink/geolook','commit':'9492cb3a1952f1370cca0f66715f87165fd56e2c','run_at':audit['generated_at'] if 'generated_at' in audit else audit['site']['crawled_at'],'site':'https://obsidian.md','runtime':'Ubuntu 22.04 / Python 3.10 / 原版 Python 模块','api_keys_used':False,'brand':'Obsidian'},
    'config':cfg,'audit':audit,'metrics':metrics,'samples':samples,'tasks':read(P/'tasks.json'),
    'verify':read(verify_files[-1]),'facts':(P/'content/facts.md').read_text(encoding='utf-8'),
    'assets':{name:(P/path).read_text(encoding='utf-8') for name,path in {
        'jsonld':'assets/jsonld/software-application.json','llms':'assets/llms.en.txt',
        'outline':'assets/outlines/q101.md','definition':'assets/snippets/definition.en.html'}.items()},
    'asset_index':read(P/'assets/index.json'),'lab':lab,
    'collection_limits':['单一网页产品、单轮、3 条未点名题与 1 条点名题，不能代表总体推荐概率。','实际观察到未登录新会话，但未确认浏览器隐私模式，导入统一标为 D 待复核。','回答是否联网以可见来源判断；无来源的样本标为未知，不补造引用。','Perplexity 返回登录要求，已排除，不记作品牌缺席。'],
    'files':[]}
files=[('真实网站体检数据',P/'audit.json','audit.json'),('原版任务清单',P/'tasks.json','tasks.json'),('品牌事实卡',P/'content/facts.md','facts.md'),('生成的结构化资产',P/'assets/jsonld/software-application.json','software-application.json'),('生成的资料索引',P/'assets/llms.en.txt','llms.en.txt'),('真实采样原文',sample_files[-1],'samples.jsonl')]
for f in (P/'deliverables').glob('*.html'):files.append((f.stem,f,f.name))
report_files=sorted((P/'reports').glob('*/report.html'))
if report_files:files.append(('原版阶段报告',report_files[-1],'report.html'))
for label,src,name in files:
    shutil.copy2(src,W/name)
    data['files'].append({'label':label,'url':'./real/'+name})
(W/'case-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
(W/'case-data.js').write_text('window.REAL_CASE='+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
assert len(samples)==4,'Expected four real browser samples before final export'
print('Exported',len(samples),'real samples,',audit['page_count'],'audited pages,',len(data['tasks']['tasks']),'tasks and',len(data['files']),'downloadable files.')
