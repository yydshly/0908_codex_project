"""Build the guide and static website from reviewed local content. No dependencies."""
import csv
import html
import json
import re
import shutil
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parents[1]
WEB = ROOT / "web" / PROJECT.name
E = html.escape


def table(headers, rows):
    return "| " + " | ".join(headers) + " |\n| " + " | ".join("---" for _ in headers) + " |\n" + "\n".join("| " + " | ".join(str(c).replace("|", "／").replace("\n", " ") for c in r) + " |" for r in rows) + "\n"


def md_html(md):
    """Render the controlled guide dialect without allowing raw HTML."""
    def inline(s):
        s = E(s)
        s = re.sub(r"\[([^\]]+)\]\((https://[^ )]+)\)", r'<a href="\2">\1</a>', s)
        return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    out, in_table, in_list = [], False, False
    for line in md.splitlines() + [""]:
        if not line.startswith("|") and in_table:
            out.append("</tbody></table></div>"); in_table = False
        if not line.startswith("- ") and in_list:
            out.append("</ul>"); in_list = False
        if line.startswith("|"):
            cells = [x.strip() for x in line.strip().strip("|").split("|")]
            if all(re.fullmatch(r"[-: ]+", c) for c in cells):
                continue
            if not in_table:
                out.append('<div class="table-wrap"><table><thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in cells) + '</tr></thead><tbody>'); in_table = True
            else:
                out.append('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in cells) + '</tr>')
        elif line.startswith("#"):
            n = len(line) - len(line.lstrip("#"))
            out.append(f'<h{n}>' + inline(line[n:].strip()) + f'</h{n}>')
        elif line.startswith("- "):
            if not in_list: out.append('<ul>'); in_list = True
            out.append('<li>' + inline(line[2:]) + '</li>')
        elif line.strip():
            out.append('<p>' + inline(line) + '</p>')
    return '\n'.join(out)


def main():
    data = json.loads((PROJECT / 'data/guide.json').read_text(encoding='utf-8'))
    terms = list(csv.DictReader((PROJECT / 'data/terms.tsv').read_text(encoding='utf-8').splitlines(), delimiter='\t'))
    module_ids = {m['id'] for m in data['modules']}
    assert all(t['module'] in module_ids and all(t.values()) for t in terms)
    assert len({t['term'] for t in terms}) == len(terms)
    upstream = (PROJECT / 'data/upstream-readme.md').read_text(encoding='utf-8-sig')
    entries = re.findall(r'\[([^\]]+)\]\((phases/(\d{2})-[^/)]+/\d{2}-[^/)]+?)/?\)', upstream)
    unique = {}
    for title, path, phase in entries:
        unique[path] = {'title':title, 'path':path, 'phase':int(phase)}
    lessons = sorted(unique.values(), key=lambda l:l['path'])
    assert len(lessons) == 523, f'Upstream changed or parsing failed: {len(lessons)} lessons'
    assert sorted(p for m in data['modules'] for p in m['phases']) == list(range(20))
    repo, sha = data['repository'], data['commit']
    for phase in data['phases']:
        phase['lessons'] = [l for l in lessons if l['phase'] == phase['id']]
        phase['directory'] = '/'.join(phase['lessons'][0]['path'].split('/')[:2])
        phase['url'] = f"{repo}/tree/{sha}/{phase['directory']}"
        phase['count'] = len(phase['lessons'])
        phase['module'] = next(m['id'] for m in data['modules'] if phase['id'] in m['phases'])
        for l in phase['lessons']:
            l['url'] = f"{repo}/tree/{sha}/{l['path']}"
            l['web'] = 'https://aiengineeringfromscratch.com/lesson?path=' + l['path']
    sources = [
        ('课程目录与阶段结构', f'{repo}/blob/{sha}/README.md'),
        ('术语索引', f'{repo}/blob/{sha}/glossary/terms.md'),
        ('Agent 入门代码抽查', f'{repo}/blob/{sha}/phases/14-agent-engineering/01-the-agent-loop/code/main.py'),
        ('RAG 课程抽查', f'{repo}/blob/{sha}/phases/11-llm-engineering/06-rag/docs/en.md'),
        ('验收关卡课程抽查', f'{repo}/blob/{sha}/phases/14-agent-engineering/38-verification-gates/docs/en.md'),
        ('教学 Skill', f'{repo}/blob/{sha}/skills/learn/SKILL.md'),
        ('MCP 与 Skills 专题说明', f'{repo}/blob/{sha}/phases/13-tools-and-protocols/README.md'),
        ('Claude Academy 官方课程', 'https://academy.claude.com/courses'),
        ('此前整理的 Claude 学习地图', 'https://yydshly.github.io/0907_codex_project/demos/014-claude-academy/'),
        ('上游 MIT 许可证', f'{repo}/blob/{sha}/LICENSE')
    ]
    data['terms'], data['sources'] = terms, sources
    data['lessonCount'] = len(lessons)
    data['termCount'] = len(terms)
    (PROJECT / 'data/catalog.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    sections = [
        '# AI Engineering from Scratch 学习与技术参考手册',
        f"整理日期：{data['date']}。研究快照：{sha}。覆盖 20 个阶段、{len(lessons)} 节目录课程、六个能力模块、{len(terms)} 组术语与八条建议路线。",
        '## 阅读目的与当前结论', data['position'], data['decision'],
        '本手册回答五个问题：仓库覆盖哪些能力，核心机制是什么，能用于哪些场景，如何扩展，以及我们何时需要学习。它是我们的中文归纳与导航，不是上游官方教材，也不代表已学完或运行全部课程。',
        '## 材料与外部引导',
        '外部分享统一使用用户认可的 AI 工程能力全景图：六大模块、20 个阶段、典型产出及两条入门路线。图片是我们生成的概念导览，不是上游官方架构图。课程编号对应上游目录，六分区是便于理解的重新分组。',
        '读图先回答能做什么，再在本手册查技术与边界，最后进入相应阶段的固定版本课程。图片中的路线是建议路径，不是所有课程的严格先修关系。',
        '## 能力与底层机制',
        '仓库本体由课程文档、代码、测验、学习路线与可复用产物组成。教学 Skill 使用外部 AI 宿主读取课程和进度，组织讲解、提问与复习；课程知识不会因为安装 Skill 自动变成模型权重。',
        'RAG 的核心是文档准备、切块与索引、检索相关内容、组织上下文、生成并核验回答。Agent 的核心是目标、上下文、工具、状态、执行反馈和停止条件。生产工程把这些组件加入评估、可观测性、恢复、权限和成本约束。',
        '代码抽查显示：Agent 入门例子使用 ToyLLM 的固定脚本模拟模型；RAG 入门示例使用 TF-IDF、简单相似度和模拟生成。它们有助于理解控制流，但不能据此推断真实模型的规划、检索或问答效果。',
        '## 六大模块与关键技术'
    ]
    for m in data['modules']:
        ps = '、'.join(f'P{x:02d}' for x in m['phases'])
        sections += [f"### {m['number']} {m['name']}", f"覆盖 {ps}。{m['verb']}。", '关键问题：'+m['question'], '可以构建：'+m['outputs']+'。', '能力边界：'+m['boundary'], table(['技术名词','含义','用途','关联阶段'],[[t['term'],t['meaning'],t['use'],f"P{int(t['phase']):02d}"] for t in terms if t['module']==m['id']])]
    sections += ['## 20 个阶段的学习指引','阶段编号与课数来自目录快照。以下目标、学习时机和验收成果是我们的学习建议；正式进入课程时，还应核对该课要求。']
    for p in data['phases']:
        sections += [f"### P{p['id']:02d} {p['name']} {p['count']} 课", '主要内容：'+p['keywords']+'。', '学习目标：'+p['goal'], '前置知识：'+p['prerequisite'], '何时学习：'+p['trigger'], '验收成果：'+p['proof'], f"[进入该阶段的固定版本课程]({p['url']})"]
    sections += ['## 按目标选择学习路线','不要求先学完 523 节课。先明确希望完成的任务与产物，再选择路线。以下为我们的导览建议；带专题链接的路线应优先遵循仓库清单。']
    for r in data['routes']:
        sections += [f"### {r['name']}", '适合：'+r['audience']+'。'] + ['- '+s for s in r['steps']] + ['阶段产物：'+r['output']+'。','验收重点：'+r['check'],'范围取舍：'+r['skip']]
        if r['path']: sections += [f"[仓库专题清单]({repo}/blob/{sha}/{r['path']})"]
    sections += ['## 每次学习如何形成证据',
        '- 选一个具体问题：写清输入、希望得到的输出和为什么有用。',
        '- 先讲清原理：用自己的话解释机制，并预测一个小改动的效果。',
        '- 运行最小实现：记录环境、工作目录、命令、退出码、关键结果与产物位置。',
        '- 改动并比较：一次只改变一个关键条件，在同一任务集上比较。',
        '- 对照真实工具：区分模拟、真实模型调用与业务数据验证三种证据。',
        '- 记录失败：保留错误样本、原因假设和待验证问题。',
        '- 决定下一步：通过当前验收才扩展范围；未通过时回查相应概念。',
        '网页中的阶段状态由你手动记录，仅保存在当前浏览器；它是学习备忘，不是系统自动认定你已经掌握。可导出 JSON 备份。阅读原理、完成练习和真实验证是不同程度。',
        table(['状态','含义','建议证据'],[['未开始','尚未进入该阶段','无需填写'],['已了解','读过概念，知道主要问题','一段自己的解释'],['练习中','正在运行或改写例子','命令、结果和问题'],['已验证','对选定目标完成实践检查，不代表本阶段全部课程都完成','测试集、产物和局限说明']]),
        '## 我们的应用场景与扩展方向',
        table(['场景','学习材料','需要补充的工作'],[['内部知识助手','P05、P11、P13','真实资料、访问权限、增量更新、引用核验'],['资料和文档处理','P11、P13、P14，图像文档补 P04/P12','文件适配、异常处理、业务字段校验'],['AI 辅助开发','P14、P17','真实仓库测试、范围约束、版本对应的验证结果'],['语音或多媒体应用','P04/P06/P08、P12','输入质量、模态对齐、端到端时延与失败样本'],['长期任务与协作','P14、P15、P16','持久状态、重复执行控制、协调效果与成本比较']]),
        '扩展顺序建议：先把一个教学示例替换为真实数据实验，再建立固定评估集；随后封装业务 Skill 和工具，加入状态与验收机制；只有单任务基线稳定且存在独立工作时，再增加多 Agent。',
        '短期价值是降低原型试错与排错成本；中期价值是建立团队共同的输入、执行和验收标准；长期价值来自我们自己的案例、工具连接、评估集和失败修正记录。',
        '## 与 Claude Academy 的关系',
        table(['维度','Claude Academy','本仓库'],data['comparisons']),
        '两者存在内容重叠。Claude Academy 也包含工程内容，AI 协作方法也不局限于 Claude。我们保留此前官方学习地图作为工作实践入口，把本库作为原理与工程实验补充。',
        '## 容易混淆的概念', table(['概念','关键区别'],data['confusions']),
        '## 后期学习的最小实践建议',
        '准备开始时，可选择“根据一组项目资料生成带出处的项目简报”。先准备少量代表性资料和固定问题；至少包含资料不足、资料冲突和需要追溯出处的情况。先手工核对标准答案或事实依据，再运行简单流程建立基线。',
        '按步骤验证资料检索、字段提取、回答生成和引用检查，记录人工修订时间、引用支持度、成功率、时延与单次成本。若简单流程已经足够，就不增加自主循环；若失败，先根据证据定位对应模块。当前仅保留此建议，不自动启动实践。',
        '## 来源与版本维护',
        f'本手册与目录固定到 {sha}。课程网站链接指向上游当前版本，可能与快照不同。专题协议、SDK、模型名称、费用和认证信息可能更新，执行前应以当时官方说明为准。',
        '我们提取的是目录元数据，并保留上游 README 快照用于复核，随附 MIT 许可证。正文解释、路线建议和全景图为本研究整理。网站不复制完整课程正文或测验。',
        '更新时先记录新 commit，再比较阶段数量、课程路径、专题清单和关键术语，复核后重新生成。不要只更新数字而保留失效路径。']
    sections += [f'- [{label}]({url})' for label,url in sources]
    guide = '\n\n'.join(sections)+'\n'
    (PROJECT/'notes/learning-guide.md').write_text(guide,encoding='utf-8')
    catalog = ['# 完整课程索引',f"来源：{repo}；快照：{sha}；共 {len(lessons)} 节。标题保留上游原文，中文阶段用于导航。"]
    for p in data['phases']:
        catalog += [f"## P{p['id']:02d} {p['name']} {p['count']} 课", table(['课程','固定版本','在线阅读（当前版）'],[[l['title'],f"[GitHub]({l['url']})",f"[课程]({l['web']})"] for l in p['lessons']])]
    (PROJECT/'notes/course-catalog.md').write_text('\n\n'.join(catalog).rstrip()+'\n',encoding='utf-8')
    WEB.mkdir(parents=True,exist_ok=True)
    (WEB/'assets').mkdir(exist_ok=True)
    (WEB/'downloads').mkdir(exist_ok=True)
    shutil.copy2(PROJECT/'assets/capability-map.png',WEB/'assets/capability-map.png')
    for file in ['learning-guide.md','course-catalog.md','learning-record.md']:
        shutil.copy2(PROJECT/'notes'/file,WEB/'downloads'/file)
    shutil.copy2(PROJECT/'data/UPSTREAM-LICENSE.txt',WEB/'downloads/UPSTREAM-LICENSE.txt')
    (WEB/'assets/content.js').write_text('window.GUIDE_DATA = '+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+';\n',encoding='utf-8')
    printable = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 工程学习与技术参考手册</title><link rel="stylesheet" href="../style.css"></head><body class="document"><nav class="document-tools"><a href="../">← 返回学习导览</a><a href="./learning-guide.md" download>下载 Markdown</a><button id="print-guide" type="button">打印或另存为 PDF</button></nav><main><img class="document-map" src="../assets/capability-map.png" alt="六大能力全景图">'+md_html(guide)+'</main><script src="./print.js"></script></body></html>'
    (WEB/'downloads/learning-guide.html').write_text(printable,encoding='utf-8')
    (WEB/'downloads/print.js').write_text("document.getElementById('print-guide').addEventListener('click',()=>window.print());\n",encoding='utf-8')
    print(f'Guide generated: {len(data["phases"])} phases, {len(lessons)} lessons, {len(terms)} terms, {len(data["routes"])} routes.')


if __name__ == '__main__':
    main()
