# Obsidian 原版实测记录

2026-09-09（北京时间），版本 9492cb3a1952f1370cca0f66715f87165fd56e2c。WSL Ubuntu 22.04 / Python 3.10.12，未修改上游源码。

## 证据链

1. `prepare-real.py` 保存研究助手整理的事实与 4 道问题到原版 `work/obsidian-real`，不冒充 bootstrap 模型输出。
2. `run-real.py crawl` 调用原版抓取和体检：12/12 页返回 200，均分 41.4。页面包含多语言版本。首页四种 AI User-Agent 返回 200，不证明平台已收录。
3. 通过浏览器逐题创建 ChatGPT 未登录会话，保存原回答与可见来源至 `experiments/real-samples/q*.json`。Perplexity 要求登录，未计入有效样本。q101/q102/q901 有来源，q103 未显示来源，联网状态未知。具体模型未披露、隐私模式未确认，统一 D 待复核。原版 UI 对未知会话类型回退显示“专用号”，该标签不代表实际环境；以保存的 session_note 为准。
4. `import-real.py` 使用原版解析、点名判断与存储。q101/q103 提及 Obsidian，q102 未提及；q901 点名题单列。因此本轮未点名提及 2/3、官网引用 0/3，不能代表市场概率。
5. `run-real.py outputs` 执行任务、蓝图、生成、报告、验收、交付：18 条任务、12 项资产索引（含 4 份大纲）。真实官网未修改，14 条自动条件未达标、4 条待人工。
6. `run-lab.py` 启动本地研究 HTTP 服务，真实执行四次抓取、体检和验收。`site.has_sitemap`、`site.has_llms_txt`、`pages.has_jsonld` 状态为 todo → done → todo → done。规则分 31.9 → 34.1 → 31.9 → 34.1。证据在 `experiments/lab-evidence/`。
7. `export-real.py` 导出原版文件与报告至 `web/013-geolook/real/`。中文导览读取这些记录，未将官网完整 HTML 导出到静态网站。

## 实际问题

JSON-LD 生成器写入 `operatingSystem: Web` 和价格占位符；英文定义文件包含中文输入。检查因为“存在 JSON-LD”通过，不证明字段真实。

重复导入 q101/q102 后，原始 JSONL 有 6 行、4 个独立回答。`sample.store_manual_rows` 对指标去重，但 `analytics` 读取原始行，总览曾显示 60%，指标文件为 66.7%。清理前文件保留为 `real-samples/import-before-dedup.jsonl`；研究导入脚本按问题、平台、轮次和原始时间避免同一会话重复导入，保留其他会话。清理后原始文件、导览与指标均为 4 条。

浏览器验收期间曾触发一次多余的自动引导，已在抓取阶段终止。随后从四条保存的原始回答重新生成任务与交付文件，没有用自动生成事实替代研究材料。

## 复现

原版启动用 `experiments/start-original.ps1`。本机 WSL 无 pip，依赖通过 Windows 下载 Linux CPython 3.10 wheels 后解包至 `upstream/geolook-runtime/deps`。

在根目录执行以下命令会更新本地研究项目（官网只读）：

```powershell
wsl -d Ubuntu-22.04 -- env PYTHONPATH=/mnt/f/codex_project/0908_codex_project/upstream/geolook-runtime/deps python3 /mnt/f/codex_project/0908_codex_project/projects/013-geolook/experiments/run-real.py crawl
wsl -d Ubuntu-22.04 -- env PYTHONPATH=/mnt/f/codex_project/0908_codex_project/upstream/geolook-runtime/deps python3 /mnt/f/codex_project/0908_codex_project/projects/013-geolook/experiments/import-real.py
wsl -d Ubuntu-22.04 -- env PYTHONPATH=/mnt/f/codex_project/0908_codex_project/upstream/geolook-runtime/deps python3 /mnt/f/codex_project/0908_codex_project/projects/013-geolook/experiments/run-real.py outputs
python projects/013-geolook/experiments/export-real.py
```

同样通过 WSL 运行 `run-lab.py` 可重新执行四阶段实验并保持 8771 服务；需先停止已有实验服务，避免端口冲突。重新抓取可能改变结果；重新导入保存会话不会重新询问 AI。

## 未执行

API 批量采样、模型自动准备品牌事实、AI 长文草稿、公开发布、品牌官网修改、上线后的多轮营销测量、访问与成交归因。未配置密钥，服务仅绑定本机。
