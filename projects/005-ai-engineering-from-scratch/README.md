# 005 AI Engineering from Scratch

> 从能力全景图进入 AI 工程知识体系，按问题查技术、选课程，保留可验证的学习成果。

| 项目 | 内容 |
| --- | --- |
| 上游 | [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) |
| 研究版本 | `d18b8fe5a913c46011a3b06cb6ebd6a924414fd3` |
| 上游许可 | MIT，见随附 [许可证](data/UPSTREAM-LICENSE.txt) |
| 整理日期 | 2026-09-08 |
| 研究状态 | 导览整理完成；课程未逐一学习或运行 |
| 覆盖 | 六大模块、20 个阶段、523 节课程目录、技术词典、八条目标路线 |
| 网页 | [AI 工程学习地图](https://yydshly.github.io/0908_codex_project/demos/005-ai-engineering-from-scratch/) |
| 文档 | [学习与技术参考手册](notes/learning-guide.md) · [完整课程索引](notes/course-catalog.md) |

## 外部引导图

![AI 工程能力全景图：基础与训练、感知与生成、模型与决策、应用与连接、智能体与协作、生产与交付，覆盖 P00 至 P19。](assets/capability-map.png)

外部介绍统一使用这张用户已认可的全景图。它把能力范围、阶段编号、典型产出与入门路线集中到一张图片。六个分区为我们的重新归纳，图片不是上游官方图，也不代表示例已完成生产验证。

## 我们的理解与当前决定

本库是带代码、测验与可复用产物的 AI 工程课程集合。它提供原理与工程参考，适合学习、方案验证和规范沉淀。真实业务落地还需要模型调用、数据、权限、异常处理和评估。

当前先保存完整导航，不启动全课程或应用接入。以后从一个真实问题进入对应章节，留下可复现证据，再决定是否扩展。

抽查发现，Agent 入门例子使用 `ToyLLM` 固定脚本，RAG 入门示例使用 TF-IDF 与模拟生成。它们用于解释机制，不能直接证明真实业务效果。相应固定版本来源见手册末尾。

## 阅读方式

1. 先看全景图，找到能力模块。
2. 打开网页，选择学习目标或搜索技术名词。
3. 查看阶段的学习时机、前置知识和验收成果。
4. 通过固定版本课程链接进入学习；在线课程链接指向上游当前版。
5. 用 [实践记录模板](notes/learning-record.md) 记录解释、运行结果与失败案例。

## 与此前 Claude 学习地图的关系

Claude Academy 更适合作为 AI 协作方法与 Claude 产品实践的官方入口；本库补充从数学到模型、Agent、生产的原理与参考实现。两者都有工程内容，不能简单划分为“使用”和“开发”。

[此前的 014 Claude Academy 学习地图](https://yydshly.github.io/0907_codex_project/demos/014-claude-academy/)完成的是资源导航，不等于逐课学习完成。本项目保留相同的研究边界。

## 网页和文档内容

- 六大能力模块及适用边界。
- 20 阶段导读与 523 节课程索引，支持关键词及模块筛选。
- 中英文技术名词、含义、用途与阶段跳转。
- 八条建议路线：资料应用、辅助编程、产品判断、MCP、Skills、模型原理、多模态、长期协作。
- 学习备忘保存在浏览器，支持导出与导入；状态不是自动认证。
- 完整手册可在线阅读、打印或另存 PDF；Markdown 可下载编辑。
- 来源快照、概念比较、实践证据模板和验证记录。

## 文件与维护

`data/guide.json` 是人工整理的结构、阶段导读和路线；`data/terms.tsv` 是术语表；`data/upstream-readme.md` 是固定版本目录来源；`data/catalog.json` 为提取的逐课元数据。`experiments/build_guide.py` 生成文档、索引与网页数据，`web/005-ai-engineering-from-scratch/` 保存静态页面和发布资源。

在总仓库根目录运行：

```sh
python projects/005-ai-engineering-from-scratch/experiments/build_guide.py
python scripts/build.py
python -m http.server 8028 --directory _site
```

打开 `http://localhost:8028/demos/005-ai-engineering-from-scratch/`。生成器会检查 20 阶段覆盖、课程数量与术语数据。更新上游时应先复核来源与计数，避免静默混入变化。

## 来源与许可

上游文档快照和目录信息按 MIT 许可保留出处与许可文件。中文解读、路线与验收建议为本项目整理；只提供原课程链接，不复制完整课程正文和测验。

全景图使用内置图像生成工具生成并经用户确认，详见 [图片来源与生成说明](notes/image-provenance.md)。

[网页验证与发布记录](notes/validation.md) · [返回总索引](../../README.md)
