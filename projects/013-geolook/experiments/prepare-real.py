"""Prepare a public-site research case; facts/questions are agent-curated, not API generated."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
P = ROOT / 'upstream/geolook/work/obsidian-real'
cfg = json.loads((P/'geo.json').read_text(encoding='utf-8'))
cfg['brand'].update(aliases=['Obsidian 笔记'], products=['Obsidian','Obsidian Sync','Obsidian Publish'],
    industry='笔记软件与个人知识管理', target_users='需要本地笔记、离线使用、链接笔记与长期保存资料的个人用户',
    business_goal='观察离线笔记与个人知识库选型问题中，Obsidian 是否出现，以及其官网是否提供可核实信息。')
cfg['competitors']=[{'name':'Notion','aliases':[],'site':'https://www.notion.com','confirmed':False},
    {'name':'Joplin','aliases':[],'site':'https://joplinapp.org','confirmed':False},
    {'name':'Logseq','aliases':[],'site':'https://logseq.com','confirmed':False},
    {'name':'Evernote','aliases':[],'site':'https://evernote.com','confirmed':False}]
cfg['questions']=[
    {'id':'q101','group':'推荐','market':'global','text':'What note-taking apps work offline and store notes as local Markdown files? Compare the main options.'},
    {'id':'q102','group':'场景','market':'global','text':'Which note-taking tools are best for a small team that needs shared project databases and real-time collaboration?'},
    {'id':'q103','group':'替代','market':'global','text':'What are good alternatives to Evernote for building a personal knowledge base?'},
    {'id':'q901','group':'品牌验证','market':'both','text':'Is Obsidian free for personal and commercial use, and what do Sync and Publish add?'}]
cfg['platforms']=['perplexity']
cfg['pages']['seed']=['https://obsidian.md/pricing','https://obsidian.md/sync','https://obsidian.md/publish','https://obsidian.md/about','https://obsidian.md/zh']
cfg['notes']='真实公开网站案例。品牌事实与问题由研究助手根据官网准备；非上游 LLM 自动推导。不是 Obsidian 官方营销项目。未获授权修改该官网。'
cfg['bootstrap']={'source':'研究助手依据公开官网整理','needs_review':True,'api_used':False}
(P/'geo.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(P/'content/facts.md').write_text('''# Obsidian 品牌事实卡

> 准备方式：研究助手阅读公开官网后整理；没有运行付费模型自动推导。不是 Obsidian 官方发布材料。

## 一句话定义
> Obsidian 是将笔记以本地 Markdown 文件保存、支持离线使用和笔记链接的笔记与个人知识管理应用。

来源：https://obsidian.md/ （本次查阅 2026-09-09）

## 已核实能力
- 笔记保存在自己的设备上，可离线访问。来源：https://obsidian.md/
- 使用纯文本 Markdown 文件。来源：https://obsidian.md/
- 可在笔记之间创建链接，并以图谱展示关系。来源：https://obsidian.md/
- Sync 提供跨设备同步；Publish 将笔记发布为网站。来源：https://obsidian.md/sync 与 https://obsidian.md/publish

## 关键数字
| 事实 | 数值 | 来源 |
| --- | --- | --- |

不在此卡中记录未复核价格、用户数量或性能数据。

## 适用边界
**适合**：
- 需要本地 Markdown 文件、离线访问和相互链接笔记的用户。
**不适合**：
- 是否适合需要共享数据库、实时协作的团队，应另行比较并核实，不能由本次资料直接下结论。

## 待确认
- 每项付费附加服务的当前价格和配额。
- 竞品逐项能力与同口径价格。
- 在具体 AI 平台的真实推荐表现，需采样。
''',encoding='utf-8')
print('Prepared real case with 4 questions and source-backed brand facts; no generated claims of sampling.')
