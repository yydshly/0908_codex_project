"""Validate the registry, sync README, and build a dependency-free static site."""

import argparse
import html
import json
import re
import shutil
from pathlib import Path
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
REPO = "https://github.com/yydshly/0908_codex_project"
START, END = "<!-- PROJECTS:START -->", "<!-- PROJECTS:END -->"


def md(value):
    return html.escape(value).replace("|", "&#124;").replace("[", "&#91;").replace("]", "&#93;")


def load_projects():
    projects = json.loads((ROOT / "projects.json").read_text(encoding="utf-8"))
    if not isinstance(projects, list):
        raise ValueError("projects.json 必须是数组")
    seen = set()
    for p in projects:
        for key in ("id", "slug", "name", "summary", "repository", "status"):
            if not isinstance(p.get(key), str) or not p[key].strip() or any(c in p[key] for c in "\r\n"):
                raise ValueError(f"字段 {key} 必须是非空单行字符串")
        if not re.fullmatch(r"\d{3,}", p["id"]) or int(p["id"]) < 1 or p["id"] != f'{int(p["id"]):03d}':
            raise ValueError("id 应为 001、002 等固定编号")
        if int(p["id"]) in seen:
            raise ValueError(f'编号重复：{p["id"]}')
        seen.add(int(p["id"]))
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", p["slug"]):
            raise ValueError("slug 只允许小写英文、数字与分隔短横线")
        url = urlparse(p["repository"])
        if url.scheme != "https" or url.netloc != "github.com" or len(url.path.strip("/").split("/")) != 2 or any(c in p["repository"] for c in ' <>"|'):
            raise ValueError("repository 应为 GitHub 仓库 HTTPS 地址")
        if p["status"] not in ("待研究", "研究中", "已完成", "暂停"):
            raise ValueError("未知研究状态")
        if not isinstance(p.get("demo", False), bool):
            raise ValueError("demo 必须是布尔值")
        if not isinstance(p.get("tags", []), list) or not all(isinstance(t, str) for t in p.get("tags", [])):
            raise ValueError("tags 必须是字符串数组")
        p["folder"] = f'{p["id"]}-{p["slug"]}'
        project = ROOT / "projects" / p["folder"]
        if not (project / "README.md").is_file():
            raise ValueError(f'缺少 {project.relative_to(ROOT)}/README.md')
        if p.get("cover") is not None:
            cover = p["cover"]
            if not isinstance(cover, str) or not cover.startswith("assets/") or "\\" in cover:
                raise ValueError("cover 必须是 assets/ 下的相对图片路径")
            path = (project / cover).resolve()
            if not path.is_relative_to((project / "assets").resolve()) or not path.is_file() or path.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"):
                raise ValueError(f"封面路径无效：{cover}")
        if p.get("demo") and not (ROOT / "web" / p["folder"] / "index.html").is_file():
            raise ValueError(f'缺少演示入口：web/{p["folder"]}/index.html')
    return sorted(projects, key=lambda p: int(p["id"]))


def sync_readme(projects, check):
    lines = ["| 编号 | 项目 / 研究说明 | 摘要 | 状态 | 上游 | Web |", "| --- | --- | --- | --- | --- | --- |"]
    for p in projects:
        demo = f'[演示](https://yydshly.github.io/0908_codex_project/demos/{p["folder"]}/)' if p.get("demo") else "—"
        lines.append(f'| {p["id"]} | [{md(p["name"])}](projects/{p["folder"]}/README.md) | {md(p["summary"])} | {p["status"]} | [GitHub]({p["repository"]}) | {demo} |')
    index = "\n".join(lines) if projects else "暂无研究项目。首个项目从 **001** 开始。"
    path = ROOT / "README.md"
    old = path.read_text(encoding="utf-8")
    if old.count(START) != 1 or old.count(END) != 1 or old.index(START) >= old.index(END):
        raise ValueError("README 索引标记缺失或重复")
    new = old.split(START)[0] + START + "\n" + index + "\n" + END + old.split(END)[1]
    if check and old != new:
        raise ValueError("README 索引未同步，请运行 python scripts/build.py 并提交更新")
    if not check and old != new:
        path.write_text(new, encoding="utf-8")


def build(projects):
    # Only remove the generated output at this fixed, verified workspace path.
    if OUTPUT.is_symlink() or OUTPUT.resolve() != ROOT.resolve() / "_site":
        raise ValueError("输出目录不能重定向到其他位置")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    cards = []
    esc = html.escape
    for p in projects:
        folder = p["folder"]
        cover = ""
        if p.get("cover"):
            target = OUTPUT / "images" / folder / Path(p["cover"]).name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / "projects" / folder / p["cover"], target)
            cover = f'<img loading="lazy" src="{quote(target.relative_to(OUTPUT).as_posix())}" alt="{esc(p["name"])} 项目截图">'
        demo = ""
        if p.get("demo"):
            shutil.copytree(ROOT / "web" / folder, OUTPUT / "demos" / folder)
            demo = f'<a href="./demos/{folder}/">打开演示 ↗</a>'
        cards.append(f'<article>{cover}<div class="meta">{p["id"]} / {p["status"]}</div><h2>{esc(p["name"])}</h2><p>{esc(p["summary"])}</p><p class="tags">{esc(" · ".join(p.get("tags", [])))}</p><nav><a href="{REPO}/tree/main/projects/{folder}">研究说明 ↗</a><a href="{esc(p["repository"], quote=True)}">上游仓库 ↗</a>{demo}</nav></article>')
    content = "\n".join(cards) or '<article class="empty"><div class="meta">NEXT / 001</div><h2>研究，从一个好项目开始。</h2><p>这里将按编号收录开源项目的研究笔记、实现分析和 Web 演示。</p><p>当前尚未收录项目。</p></article>'
    page = '''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="优秀 GitHub 开源项目的研究笔记、实现分析与 Web 演示"><title>GitHub 项目研究集</title>
<style>
:root{color-scheme:light;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172b32;background:#f4f6f3}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:64px 24px}header{padding-bottom:42px;border-bottom:1px solid #ced8d1}.eyebrow,.meta{font-family:monospace;letter-spacing:.08em;color:#476257;font-size:13px}h1{font-size:clamp(32px,6vw,56px);letter-spacing:-.04em;margin:18px 0}header p{max-width:650px;font-size:18px;line-height:1.8;color:#526269}a{color:#12634f;text-underline-offset:4px}a:focus-visible{outline:3px solid #12634f;outline-offset:4px}.bar{display:flex;justify-content:space-between;gap:16px;margin:28px 0;font-size:14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:22px}article{background:#fff;border:1px solid #dce3dd;border-radius:14px;padding:28px;overflow-wrap:anywhere}article img{width:100%;aspect-ratio:16/9;object-fit:contain;background:#f4f6f3;border-radius:7px;margin-bottom:22px}h2{font-size:23px;line-height:1.5;margin:14px 0}article p{line-height:1.8;color:#526269}.tags{font-size:13px}nav{display:flex;flex-wrap:wrap;gap:16px;font-size:14px}.empty{grid-column:1/-1;padding:44px 32px}footer{margin-top:48px;color:#526269;font-size:13px;line-height:1.8}@media(max-width:480px){main{padding:36px 18px}.bar{flex-wrap:wrap}.empty{padding:28px 22px}}
</style></head><body><main><header><div class="eyebrow">OPEN SOURCE / RESEARCH NOTEBOOK</div><h1>GitHub 项目研究集</h1><p>发现值得研究的开源项目，记录原理、实验与可复用的经验。</p><a href="__REPO__">浏览 GitHub 总仓库 ↗</a></header><div class="bar"><span>项目索引 · __COUNT__ 个项目</span><span>按固定编号升序排列</span></div><section class="grid" aria-label="研究项目">__CONTENT__</section><footer>研究笔记与实验持续积累。每个项目的来源与许可见对应研究说明。</footer></main></body></html>
'''
    page = page.replace("__REPO__", REPO).replace("__COUNT__", str(len(projects))).replace("__CONTENT__", content)
    (OUTPUT / "index.html").write_text(page, encoding="utf-8")
    (OUTPUT / ".nojekyll").touch()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="校验 README 已同步，不修改源文件")
    args = parser.parse_args()
    projects = load_projects()
    sync_readme(projects, args.check)
    build(projects)
    print(f"OK: {len(projects)} projects; site generated in _site/")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, KeyError, TypeError) as error:
        raise SystemExit(f"ERROR: {error}") from error
