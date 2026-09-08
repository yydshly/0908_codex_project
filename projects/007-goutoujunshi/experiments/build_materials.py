"""Publish a versioned, curated inventory to both Markdown and the local website."""
from pathlib import Path
import html
import json
import re
import shutil
from urllib.parse import quote
from reuse_content import publish as publish_reuse

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parents[1]
WEB = ROOT / 'web/007-goutoujunshi'
BASE = 'https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/'
K = [
('证据与索引','区分证据强弱、常见推理错误，把承诺、尊重等概念转成行为问题。'),
('关系与人格','综合吸引、回应性、社会交换、承诺、权力与压力，提供关系判断维度。'),
('关系与人格','解释焦虑与回避循环，提供情绪调节方法，限制依恋标签的使用。'),
('关系与人格','讨论 MBTI 局限与 Big Five，将人格标签转成需求和协商问题。'),
('边界与风险','拆解操控机制、风险信号及不操控的替代表达。'),
('约会与沟通','整理吸引与关系启动过程、主动表达和互动判断。'),
('约会与沟通','提供冲突分流、对话结构、暂停与修复方法。'),
('边界与风险','整理持续同意、边界、亲密协商与性沟通的使用范围。'),
('约会与沟通','覆盖线上展示、从聊天到见面、截图证据、数字边界与诈骗识别。'),
('家庭与人文','借哲学传统讨论欲望、自由、承诺与他者，提供反思问题。'),
('家庭与人文','整理婚前议题、关系阶段、家庭系统和外部支持。'),
('家庭与人文','把金钱、家务、照护、育儿和双方家庭转成协商事项。'),
('家庭与人文','梳理现代婚姻制度与爱情观变化，提醒统计与历史语境限制。'),
('家庭与人文','从结构条件、人口与社会变化解释家庭和个人选择。'),
('修复与多元','区分分手、复合、背叛、原谅与修复条件。'),
('修复与多元','覆盖性别身份、性取向、非单偶、异地与跨文化等关系校准。'),
('边界与风险','整理中国法律与安全处理入口、证据保存和危机转介；使用前需复核。'),
('练习与方法','12 组练习：事实拆分、价值排序、约会复盘、冲突暂停、婚前讨论等。'),
('证据与索引','按领域列书目、论文和官方入口，附扩展检索式与资料记录要求。'),
('练习与方法','将 Blueprint、冷读、Mystery、自然流拆为机制、证据、风险与伦理转译。'),
]
P = {
'00-':('导读与工具','区分直接框架、策略性使用和高风险方法，规定话术格式和主题选择。'),
'ChatLab':('导读与工具','规定会话与说话人确认、导入预览、最小范围查询和证据编号使用。'),
'万能吵架':('日常表达','按底层逻辑、技巧、场景话术组织理性冲突处理。'),
'万能夸人':('日常表达','围绕具体、真实认可，整理夸奖方法与场景表达。'),
'为他人':('日常表达','把情绪支持拆为理解、回应和场景化表达，避免无效付出。'),
'主动表达':('关系推进','整理主动档位、表达欣赏、第一次见面、自然接触及反馈调整。'),
'公开表达':('经验转译','说明公开创作者来源边界，保留具体、幽默和行动感，过滤欺骗与施压。'),
'关系投入':('关系推进','四区判断、事实账、行动阶梯、事件观察窗口与不同关系校准。'),
'化解尴尬':('日常表达','分析尴尬场景，组织救场方法和可改写表达。'),
'场景感':('关系推进','拆解真实展示、现场取材、接抛、轻松调情、分级推进与复盘。'),
'实战话术':('关系推进','七种主策略、三层表达、五项口吻校准、12 类话术场景与演练。'),
'巧妙接话':('日常表达','把接话整理为连接内容与情绪的方法，并给场景表达。'),
'废话文学':('日常表达','轻松娱乐式回复的逻辑、技巧和场景素材，按导读限制使用。'),
'托人办事':('社交与职场','请求协助的沟通逻辑、操作方法和场景话术。'),
'提升表达':('日常表达','将混乱表达整理为清楚的逻辑和场景化陈述。'),
'提高气场':('社交与职场','整理自信、表达与行为表现的方法，区分力量感与虚张声势。'),
'有效拓展':('社交与职场','从建立连接到维护关系组织社交方法和表达。'),
'聊天化':('日常表达','梳理被动聊天的原因、主动引导方法与场景话术。'),
'自然流':('经验转译','将内在状态、观察表达邀请、开放假设和结构排错转成练习。'),
'获得领导':('社交与职场','以需求匹配、创造价值和信任为线索整理职场沟通。'),
'被孤立':('社交与职场','从自我调适、建立连接到场景表达组织应对方法。'),
'长期记忆':('导读与工具','规定同意、五类记忆、来源、增量更新、压缩召回与用户控制。'),
'高情商拒绝':('日常表达','整理清晰边界、拒绝技巧与场景话术。'),
}

def inline(s):
    s = html.escape(s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1 ↗</a>', s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)

def markdown(s):
    out=[]; table=False
    for line in s.splitlines():
        if line.startswith('|'):
            if re.fullmatch(r'[| :\-]+',line): continue
            if not table: out.append('<div class="tablewrap"><table>'); table=True
            cells=line.strip('|').split('|')
            out.append('<tr>'+''.join('<td>'+inline(c.strip())+'</td>' for c in cells)+'</tr>')
            continue
        if table: out.append('</table></div>'); table=False
        if not line.strip() or line.startswith('<!--'): continue
        m=re.match(r'^(#{1,6}) (.*)',line)
        if m: out.append(f'<h{len(m[1])}>{inline(m[2])}</h{len(m[1])}>')
        else: out.append('<p>'+inline(line)+'</p>')
    if table: out.append('</table></div>')
    return '\n'.join(out)

def main():
    entries=[]
    for layer in ('knowledge','practical'):
        files=sorted((PROJECT/'upstream/references'/layer).glob('*.md'))
        assert len(files)==(20 if layer=='knowledge' else 23)
        for p in files:
            if layer=='knowledge': category,summary=K[int(p.name[:2])-1]
            else:
                matches=[v for k,v in P.items() if p.name.startswith(k)]
                assert len(matches)==1,p.name
                category,summary=matches[0]
            text=p.read_text(encoding='utf-8')
            entries.append(dict(layer=layer,category=category,title=p.stem,summary=summary,path=f'references/{layer}/{p.name}',url=BASE+quote(f'references/{layer}/{p.name}',safe='/'),headings=[x.lstrip('# ') for x in text.splitlines() if x.startswith('## ')]))
    tables=[]
    for layer,label in [('knowledge','核心知识 · 20 份'),('practical','实用资料 · 23 份')]:
        tables.extend([f'### {label}', '', '| 文档 | 阅读分组 | 汇总描述 |','| --- | --- | --- |'])
        for e in entries:
            if e['layer']==layer: tables.append(f"| [{e['title']}]({e['url']}) | {e['category']} | {e['summary']} |")
        tables.append('')
    note=PROJECT/'notes/materials-overview.md'
    content=note.read_text(encoding='utf-8')
    content=content.split('<!-- CATALOG:START -->')[0]+'<!-- CATALOG:START -->\n'+'\n'.join(tables)+'\n<!-- CATALOG:END -->\n'
    note.write_text(content,encoding='utf-8')
    for target in [PROJECT/'notes/materials-catalog.json',WEB/'materials-catalog.json']:
        target.write_text(json.dumps(dict(commit=BASE.split('/')[-2],note='目录层级为上游原结构；阅读分组和简述为本次研究归纳，不是逐篇证据评分。',documents=entries),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    shutil.copyfile(note,WEB/'materials-overview.md')
    shutil.copyfile(PROJECT/'assets/architecture.svg', WEB/'architecture.svg')
    arch=(PROJECT/'notes/architecture.md').read_text(encoding='utf-8').replace('../assets/architecture.svg', 'architecture.svg')
    (WEB/'architecture.md').write_text(arch, encoding='utf-8')
    cards=[]
    for e in entries:
        layer='核心知识' if e['layer']=='knowledge' else '实用资料'
        cards.append(f'<article class="doc" data-layer="{e["layer"]}"><span class="tag">{layer} / {e["category"]}</span><h3><a href="{e["url"]}">{html.escape(e["title"])} ↗</a></h3><p>{html.escape(e["summary"])}</p><details><summary>查看原文章节</summary><ul>'+''.join('<li>'+html.escape(x)+'</li>' for x in e['headings'])+'</ul></details></article>')
    template=(PROJECT/'experiments/materials-page.html').read_text(encoding='utf-8')
    reuse_html=publish_reuse(PROJECT, WEB, entries)
    (WEB/'materials.html').write_text(template.replace('<!-- DOCUMENT_CARDS -->','\n'.join(cards)).replace('<!-- REUSE_DETAILS -->',reuse_html),encoding='utf-8')
    shutil.copyfile(PROJECT/'experiments/overview-page.html', WEB/'index.html')
    style=template.split('<style>')[1].split('</style>')[0]
    reuse_script="document.getElementById('expand-modules').onclick=()=>document.querySelectorAll('details.module').forEach(d=>d.open=true);document.getElementById('collapse-modules').onclick=()=>document.querySelectorAll('details.module').forEach(d=>d.open=false);"
    (WEB/'reuse.html').write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>模块详解与产品方向 · 狗头军师</title><style>'+style+'</style></head><body><main><nav><a href="./#architecture">← 返回整体架构</a><a href="modules-and-products.md">下载完整 Markdown</a></nav><h1>理解知识模块，<br>判断后期怎样复用。</h1><p>模块说明来自固定版本仓库；产品方向是我们的规划判断，尚未开发或验证市场需求。</p><div class="jump"><a href="#modules">模块详解</a><a href="#reuse-value">参考价值</a><a href="#products">产品方向</a><a href="#personal-product">个人评价方案</a></div>'+reuse_html+'<footer>资料留存 · 产品设想尚未实施 · 上游版本 4ced1d5</footer></main><script>'+reuse_script+'</script></body></html>',encoding='utf-8')
    (WEB/'guide.html').write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>资料整理完整说明 · 狗头军师</title><style>'+style+'</style></head><body><main><nav><a href="./">← 返回资料地图</a><a href="materials-overview.md">Markdown 文档</a></nav><div class="guide">'+markdown(content)+'</div></main></body></html>',encoding='utf-8')
    print('Published 43 documents, full guide and searchable materials map')

if __name__=='__main__': main()
