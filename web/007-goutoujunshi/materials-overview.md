# 狗头军师：资料如何沉淀为专业方法

本汇总基于已获取版本 `4ced1d57561563f4b556f555ee1c8c91ffb16355`，研究日期 2026-09-08。目录清单来自本地文件，组织方法来自上游治理文档、导读、核心指令及主题正文。这里总结的是仓库的内容组织规则与整理成果，不声称还原了作者完整的采集和编辑历史，也未逐一核验外部参考资料的有效性。

**留存结论：整理完成，供后期按需复用；不继续深入研究、模型评测或系统接入。** 整体关系见[架构导读](architecture.md)。

进一步查阅：[模块详解、后期参考价值与产品方向](modules-and-products.md)，包括 10 个模块、6 个产品设想及个人评价的具体范围。

## 1. 资料规模与层次

实际参考目录包含 **43 份 Markdown：20 份核心知识 + 23 份实用资料**。这个数字是文件数，不是论文数、独立来源数或训练样本数。

| 层次 | 位置 | 沉淀成果 | 运行作用 |
| --- | --- | --- | --- |
| 行为入口 | `SKILL.md` | 总原则、分析顺序、问题到资料的路由表、输出要求 | 指导模型选择并应用方法 |
| 核心知识 | `references/knowledge/`，20 份 | 理论解释、研究依据、行为指标、风险边界、书目与练习 | 回答依据是什么、可以推断到哪里 |
| 实用资料 | `references/practical/`，23 份 | 方法步骤、策略选择、表达骨架、反馈分支及工具规则 | 回答怎么做、怎么说、何时调整 |
| 治理文档 | `documentation/knowledge-base.md`、`CONTRIBUTING.md` | 来源要求、分级、更新与贡献规则 | 指导维护者整理内容；不是默认运行资料 |
| 用户档案 | 可选 SQLite，本地动态生成 | 用户事实、关系状态、事件与假设 | 补充具体情境；不属于公开专业知识库 |

目录不是绝对的内容分类：核心知识里也有练习和书目；实用资料中有 ChatLab、记忆两份工具流程文档。不能把 43 份都理解为同一种“专家知识”。

## 2. 它整理了哪些来源

以下按书目索引的实际主题归纳；名称举例只用于描述上游收录范围，不意味着本次验证了所有书籍、研究或法规。

| 来源类型 | 仓库列出的代表资料 | 在库中的用途 |
| --- | --- | --- |
| 关系科学与心理学 | Miller《亲密关系》、Bowlby 依恋理论、Reis 与 Shaver 回应性模型、Rusbult 投入模型、Joel 等纵向数据研究 | 组织吸引、回应性、承诺、投入与压力等判断维度 |
| 沟通与伴侣干预 | 非暴力沟通、整合行为伴侣治疗、情绪取向治疗、Gottman 相关读物、伴侣干预综述 | 提供表达与修复框架；区分研究与治疗模型 |
| 人格与测量 | Big Five、MBTI 官方材料与独立测量研究 | 校准人格标签的用法，转成可协商的具体需求 |
| 哲学、人文与社会学 | 柏拉图、亚里士多德、布伯、弗洛姆、波伏瓦、bell hooks；Coontz、Giddens、Illouz；费孝通、阎云翔 | 提供自由、承诺、家庭制度和社会结构的解释背景 |
| 官方统计、法律与公共卫生 | OECD 家庭数据库、联合国婚姻数据、中国统计与法律资料、WHO | 提供宏观背景与安全依据；使用前复核地区和日期 |
| 数字关系与多元关系研究 | 在线约会综述、数字文化研究、性沟通与少数群体压力相关研究 | 解释平台、隐私、关系结构与社会压力 |
| 社交体系及公开表达经验 | Blueprint、Mystery、自然流、冷读；童锦程与梵公子项目参考；北疯小同学与鄙人李洋洋公开表达 | 拆取表达与互动方法，保留证据局限并过滤操控内容 |
| 工具设计参考 | ChatLab；长期记忆文档列出的 OpenClaw、claude-mem、Napkin、Mem0、Letta 等 | 借鉴工具使用和记忆分层，不代表依赖这些系统或提升咨询证据等级 |

书目索引还提供检索词，要求新材料记录样本、地区、研究设计、主要效应、因果限制、是否双人数据、年份与利益冲突。这是编辑规则；仓库没有为所有来源建立统一结构化元数据表。

## 3. 从资料到方法：仓库规定的整理逻辑

以下步骤归纳自治理说明、贡献规则和主题实例，是内容维护方法，不是自动运行的数据流水线。

1. **确认来源与适用性。** 优先原始研究、政府、法院、国际组织和大学资料；公开创作者内容确认归属，不将二手语录升级成稳定主张。
2. **标明证据和限制。** 区分研究、理论、流行框架和经验；不把群体相关性当成个人因果结论。
3. **按问题主题重组。** 关系科学总论综合教材、原始研究和综述，围绕吸引、回应性、承诺、投入、权力等主题展开，而非按单个作者排列。
4. **把抽象概念转成行为。** 例如承诺对应未来安排与言行一致，尊重对应能否接受拒绝，修复对应承担影响并落实改变。
5. **把经验转成操作方法。** 常见实用指南使用“底层逻辑—技能技巧—场景话术”；专门方法进一步列出信号、主策略、表达校准、反馈与停止条件。
6. **过滤不适用的做法。** 经典社交体系采用“原概念—可观察机制—风险—伦理转译”；不保存课程原文、逐字稿或惯例句库。
7. **加入入口路由，按需读取。** 模型通常先读当前问题相关的 1–3 份资料，争议或风险出现时增补，不一次加载全库。
8. **持续维护。** 时效内容使用前复核，删除文件检查路由和链接，流程修改需提供成功和失败／边界场景；校验脚本检查结构与规则文本，不测试模型回答质量。

## 4. 三种分级不能混用

| 所在文档 | 分级内容 | 回答什么问题 |
| --- | --- | --- |
| 知识库治理 | 较强证据、理论框架、流行说法、经验策略 | 这项内容属于什么性质？ |
| 知识 01：证据分级与内容边界 | A：综述／元分析／大型研究等；B：设计良好的单项研究等；C：小样本／横断面／案例经验等；D：流行框架 | 能用多确定的措辞，能否推断因果或个体？ |
| 实用 00：导读与使用分级 | A：可直接作为框架；B：策略性使用；C：高风险慎用或拒绝协助 | 这个沟通策略应当怎样使用？ |

实用 A 不等于研究 A。能直接使用的表达框架，并不自动获得高等级实证支持。这些分级主要写在说明文字中，不是每个句子都附有机器可核验的证据标签。

## 5. 三个可以追踪到原文的整理实例

### 5.1 关系理论 → 行为判断 → 行动阶梯

知识 01 把承诺、回应性、尊重、修复、公平变成行为问题。投入失衡指南进一步分为“互惠但节奏不同、证据不足、持续失衡、明确拒绝或危险”四区，对应协商节奏、获取新信息、降低投入、停止或安全处理。观察窗口绑定下一次约见、考试结束或排班等事件，不设置通用天数和比例阈值。

研究为观察维度提供背景，四区与行动阶梯是项目的决策框架，并非研究直接验证的诊断量表。

### 5.2 表达经验 → 七种策略 → 一句话与后续分支

话术编排器从承接、降压、调侃、轻推、约见、澄清、收线中选一个主策略；按需组合逻辑、情绪、情感三层，再校准长度、熟悉度、用词、媒介和关系结构。

原文处理“最近忙，下次吧”时，本轮先降压、不连环追加；有新的时间或活动信息且无明确拒绝时，再考虑一次具体邀请。先前本地教学演示中的“当场追加下周六邀约”未体现这条规则，现已纠正。该案例用于说明资料如何限制选择，不代表实际模型咨询测试。

### 5.3 冷读体系 → 机制拆解 → 可纠正假设

知识 20 分析泛化陈述、确认偏误、从反馈中读取信息等如何产生“准确感”，再把可用部分改写为“可确认事实＋暂定解释＋邀请纠正”。对应实用指南将其用于练习，要求猜错就更新，不能伪装成读心。

知识层说明机制与限制，实用层安排表达和练习；两层分工是该库整理资料的具体例子。

## 6. 文档怎样参与一次回答

`用户问题 → SKILL.md 识别场景并指向主题资料 → 模型读取相关文件 → 结合用户事实应用方法 → 建议、理由、行动与反馈条件`。

- 问一句话回复：优先话术编排器。
- 问投入是否失衡：优先投入失衡指南。
- 问冷读或经典社交体系：先知识 20，需要落地再读伦理能力转译。
- 问其他实用主题：先实用 00，再选具体指南；职场文档仅在涉及同事、协助或权力结构时读取。
- 问长期档案：读取记忆说明，按同意状态调用 Python 脚本。

以上是模型执行的文档指导，不是独立检索引擎或强制状态机。用户聊天和记忆为分析提供具体事实；公开知识库提供方法，两者没有自动合并回流流程。

## 7. 已有成果与尚未提供的环节

**已有：** 分类文档、书目及来源入口、证据与使用边界、行为化判断、策略步骤、场景骨架、按需路由、维护规范与有限记忆脚本。

**未见完整实现：** 自动采集清洗系统、逐条来源元数据与结论溯源图、全量原始材料包、向量索引、最终回答自动审核、真实用户收益评测。资料中的维护要求不能当作所有条目都已审查通过的证据。

对我们的参考价值在于：学习如何把来源整理为领域方法，再让模型按问题应用。不能从当前仓库反推作者已完成一套自动知识生产系统。

## 8. 原文依据

所有链接固定到研究版本；完整目录清单中的每份文档也附原文链接。

- [知识库治理](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/documentation/knowledge-base.md)
- [贡献与来源要求](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/CONTRIBUTING.md)
- [运行入口与路由](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/SKILL.md)
- [架构及原始研究排除规则](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/documentation/architecture.md)
- [模型引导与程序边界](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/documentation/automation.md)

## 9. 完整资料目录

<!-- CATALOG:START -->
### 核心知识 · 20 份

| 文档 | 阅读分组 | 汇总描述 |
| --- | --- | --- |
| [01-证据分级与内容边界](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/01-%E8%AF%81%E6%8D%AE%E5%88%86%E7%BA%A7%E4%B8%8E%E5%86%85%E5%AE%B9%E8%BE%B9%E7%95%8C.md) | 证据与索引 | 区分证据强弱、常见推理错误，把承诺、尊重等概念转成行为问题。 |
| [02-亲密关系心理学总论](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/02-%E4%BA%B2%E5%AF%86%E5%85%B3%E7%B3%BB%E5%BF%83%E7%90%86%E5%AD%A6%E6%80%BB%E8%AE%BA.md) | 关系与人格 | 综合吸引、回应性、社会交换、承诺、权力与压力，提供关系判断维度。 |
| [03-依恋理论与情绪调节](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/03-%E4%BE%9D%E6%81%8B%E7%90%86%E8%AE%BA%E4%B8%8E%E6%83%85%E7%BB%AA%E8%B0%83%E8%8A%82.md) | 关系与人格 | 解释焦虑与回避循环，提供情绪调节方法，限制依恋标签的使用。 |
| [04-MBTI人格与匹配](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/04-MBTI%E4%BA%BA%E6%A0%BC%E4%B8%8E%E5%8C%B9%E9%85%8D.md) | 关系与人格 | 讨论 MBTI 局限与 Big Five，将人格标签转成需求和协商问题。 |
| [05-PUA操控与伦理替代](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/05-PUA%E6%93%8D%E6%8E%A7%E4%B8%8E%E4%BC%A6%E7%90%86%E6%9B%BF%E4%BB%A3.md) | 边界与风险 | 拆解操控机制、风险信号及不操控的替代表达。 |
| [06-吸引约会与关系启动](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/06-%E5%90%B8%E5%BC%95%E7%BA%A6%E4%BC%9A%E4%B8%8E%E5%85%B3%E7%B3%BB%E5%90%AF%E5%8A%A8.md) | 约会与沟通 | 整理吸引与关系启动过程、主动表达和互动判断。 |
| [07-沟通冲突与修复](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/07-%E6%B2%9F%E9%80%9A%E5%86%B2%E7%AA%81%E4%B8%8E%E4%BF%AE%E5%A4%8D.md) | 约会与沟通 | 提供冲突分流、对话结构、暂停与修复方法。 |
| [08-同意边界性与亲密](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/08-%E5%90%8C%E6%84%8F%E8%BE%B9%E7%95%8C%E6%80%A7%E4%B8%8E%E4%BA%B2%E5%AF%86.md) | 边界与风险 | 整理持续同意、边界、亲密协商与性沟通的使用范围。 |
| [09-在线约会与数字关系](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/09-%E5%9C%A8%E7%BA%BF%E7%BA%A6%E4%BC%9A%E4%B8%8E%E6%95%B0%E5%AD%97%E5%85%B3%E7%B3%BB.md) | 约会与沟通 | 覆盖线上展示、从聊天到见面、截图证据、数字边界与诈骗识别。 |
| [10-恋爱哲学](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/10-%E6%81%8B%E7%88%B1%E5%93%B2%E5%AD%A6.md) | 家庭与人文 | 借哲学传统讨论欲望、自由、承诺与他者，提供反思问题。 |
| [11-婚姻家庭与生命周期](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/11-%E5%A9%9A%E5%A7%BB%E5%AE%B6%E5%BA%AD%E4%B8%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.md) | 家庭与人文 | 整理婚前议题、关系阶段、家庭系统和外部支持。 |
| [12-金钱家务育儿与双方家庭](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/12-%E9%87%91%E9%92%B1%E5%AE%B6%E5%8A%A1%E8%82%B2%E5%84%BF%E4%B8%8E%E5%8F%8C%E6%96%B9%E5%AE%B6%E5%BA%AD.md) | 家庭与人文 | 把金钱、家务、照护、育儿和双方家庭转成协商事项。 |
| [13-现代婚姻变迁史](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/13-%E7%8E%B0%E4%BB%A3%E5%A9%9A%E5%A7%BB%E5%8F%98%E8%BF%81%E5%8F%B2.md) | 家庭与人文 | 梳理现代婚姻制度与爱情观变化，提醒统计与历史语境限制。 |
| [14-社会发展与家庭变迁](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/14-%E7%A4%BE%E4%BC%9A%E5%8F%91%E5%B1%95%E4%B8%8E%E5%AE%B6%E5%BA%AD%E5%8F%98%E8%BF%81.md) | 家庭与人文 | 从结构条件、人口与社会变化解释家庭和个人选择。 |
| [15-分手背叛与关系修复](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/15-%E5%88%86%E6%89%8B%E8%83%8C%E5%8F%9B%E4%B8%8E%E5%85%B3%E7%B3%BB%E4%BF%AE%E5%A4%8D.md) | 修复与多元 | 区分分手、复合、背叛、原谅与修复条件。 |
| [16-多元关系与反刻板印象](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/16-%E5%A4%9A%E5%85%83%E5%85%B3%E7%B3%BB%E4%B8%8E%E5%8F%8D%E5%88%BB%E6%9D%BF%E5%8D%B0%E8%B1%A1.md) | 修复与多元 | 覆盖性别身份、性取向、非单偶、异地与跨文化等关系校准。 |
| [17-中国法律安全与危机转介](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/17-%E4%B8%AD%E5%9B%BD%E6%B3%95%E5%BE%8B%E5%AE%89%E5%85%A8%E4%B8%8E%E5%8D%B1%E6%9C%BA%E8%BD%AC%E4%BB%8B.md) | 边界与风险 | 整理中国法律与安全处理入口、证据保存和危机转介；使用前需复核。 |
| [18-实用练习与对话卡](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/18-%E5%AE%9E%E7%94%A8%E7%BB%83%E4%B9%A0%E4%B8%8E%E5%AF%B9%E8%AF%9D%E5%8D%A1.md) | 练习与方法 | 12 组练习：事实拆分、价值排序、约会复盘、冲突暂停、婚前讨论等。 |
| [19-核心书单与论文索引](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/19-%E6%A0%B8%E5%BF%83%E4%B9%A6%E5%8D%95%E4%B8%8E%E8%AE%BA%E6%96%87%E7%B4%A2%E5%BC%95.md) | 证据与索引 | 按领域列书目、论文和官方入口，附扩展检索式与资料记录要求。 |
| [20-经典社交体系的机制、证据与风险边界](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/knowledge/20-%E7%BB%8F%E5%85%B8%E7%A4%BE%E4%BA%A4%E4%BD%93%E7%B3%BB%E7%9A%84%E6%9C%BA%E5%88%B6%E3%80%81%E8%AF%81%E6%8D%AE%E4%B8%8E%E9%A3%8E%E9%99%A9%E8%BE%B9%E7%95%8C.md) | 练习与方法 | 将 Blueprint、冷读、Mystery、自然流拆为机制、证据、风险与伦理转译。 |

### 实用资料 · 23 份

| 文档 | 阅读分组 | 汇总描述 |
| --- | --- | --- |
| [00-导读与使用分级](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/00-%E5%AF%BC%E8%AF%BB%E4%B8%8E%E4%BD%BF%E7%94%A8%E5%88%86%E7%BA%A7.md) | 导读与工具 | 区分直接框架、策略性使用和高风险方法，规定话术格式和主题选择。 |
| [ChatLab聊天记录分析适配](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/ChatLab%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%88%86%E6%9E%90%E9%80%82%E9%85%8D.md) | 导读与工具 | 规定会话与说话人确认、导入预览、最小范围查询和证据编号使用。 |
| [万能吵架技巧：理性冲突处理指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E4%B8%87%E8%83%BD%E5%90%B5%E6%9E%B6%E6%8A%80%E5%B7%A7%EF%BC%9A%E7%90%86%E6%80%A7%E5%86%B2%E7%AA%81%E5%A4%84%E7%90%86%E6%8C%87%E5%8D%97.md) | 日常表达 | 按底层逻辑、技巧、场景话术组织理性冲突处理。 |
| [万能夸人的话术技巧：真诚认可的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E4%B8%87%E8%83%BD%E5%A4%B8%E4%BA%BA%E7%9A%84%E8%AF%9D%E6%9C%AF%E6%8A%80%E5%B7%A7%EF%BC%9A%E7%9C%9F%E8%AF%9A%E8%AE%A4%E5%8F%AF%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 围绕具体、真实认可，整理夸奖方法与场景表达。 |
| [为他人提供情绪价值：温暖且有效的回应指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E4%B8%BA%E4%BB%96%E4%BA%BA%E6%8F%90%E4%BE%9B%E6%83%85%E7%BB%AA%E4%BB%B7%E5%80%BC%EF%BC%9A%E6%B8%A9%E6%9A%96%E4%B8%94%E6%9C%89%E6%95%88%E7%9A%84%E5%9B%9E%E5%BA%94%E6%8C%87%E5%8D%97.md) | 日常表达 | 把情绪支持拆为理解、回应和场景化表达，避免无效付出。 |
| [主动表达、第一次见面与自然接触](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E4%B8%BB%E5%8A%A8%E8%A1%A8%E8%BE%BE%E3%80%81%E7%AC%AC%E4%B8%80%E6%AC%A1%E8%A7%81%E9%9D%A2%E4%B8%8E%E8%87%AA%E7%84%B6%E6%8E%A5%E8%A7%A6.md) | 关系推进 | 整理主动档位、表达欣赏、第一次见面、自然接触及反馈调整。 |
| [公开表达案例的伦理转译](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%85%AC%E5%BC%80%E8%A1%A8%E8%BE%BE%E6%A1%88%E4%BE%8B%E7%9A%84%E4%BC%A6%E7%90%86%E8%BD%AC%E8%AF%91.md) | 经验转译 | 说明公开创作者来源边界，保留具体、幽默和行动感，过滤欺骗与施压。 |
| [关系投入失衡：互惠判断、降级投入与退出决策](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%85%B3%E7%B3%BB%E6%8A%95%E5%85%A5%E5%A4%B1%E8%A1%A1%EF%BC%9A%E4%BA%92%E6%83%A0%E5%88%A4%E6%96%AD%E3%80%81%E9%99%8D%E7%BA%A7%E6%8A%95%E5%85%A5%E4%B8%8E%E9%80%80%E5%87%BA%E5%86%B3%E7%AD%96.md) | 关系推进 | 四区判断、事实账、行动阶梯、事件观察窗口与不同关系校准。 |
| [化解尴尬：轻松救场的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%8C%96%E8%A7%A3%E5%B0%B4%E5%B0%AC%EF%BC%9A%E8%BD%BB%E6%9D%BE%E6%95%91%E5%9C%BA%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 分析尴尬场景，组织救场方法和可改写表达。 |
| [场景感、松弛感与社交校准：从接话到关系推进](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%9C%BA%E6%99%AF%E6%84%9F%E3%80%81%E6%9D%BE%E5%BC%9B%E6%84%9F%E4%B8%8E%E7%A4%BE%E4%BA%A4%E6%A0%A1%E5%87%86%EF%BC%9A%E4%BB%8E%E6%8E%A5%E8%AF%9D%E5%88%B0%E5%85%B3%E7%B3%BB%E6%8E%A8%E8%BF%9B.md) | 关系推进 | 拆解真实展示、现场取材、接抛、轻松调情、分级推进与复盘。 |
| [实战话术编排器：从一句回复到后续分支](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%AE%9E%E6%88%98%E8%AF%9D%E6%9C%AF%E7%BC%96%E6%8E%92%E5%99%A8%EF%BC%9A%E4%BB%8E%E4%B8%80%E5%8F%A5%E5%9B%9E%E5%A4%8D%E5%88%B0%E5%90%8E%E7%BB%AD%E5%88%86%E6%94%AF.md) | 关系推进 | 七种主策略、三层表达、五项口吻校准、12 类话术场景与演练。 |
| [巧妙接话技巧：让沟通更流畅的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%B7%A7%E5%A6%99%E6%8E%A5%E8%AF%9D%E6%8A%80%E5%B7%A7%EF%BC%9A%E8%AE%A9%E6%B2%9F%E9%80%9A%E6%9B%B4%E6%B5%81%E7%95%85%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 把接话整理为连接内容与情绪的方法，并给场景表达。 |
| [废话文学回复指南：轻松应对各类场景](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E5%BA%9F%E8%AF%9D%E6%96%87%E5%AD%A6%E5%9B%9E%E5%A4%8D%E6%8C%87%E5%8D%97%EF%BC%9A%E8%BD%BB%E6%9D%BE%E5%BA%94%E5%AF%B9%E5%90%84%E7%B1%BB%E5%9C%BA%E6%99%AF.md) | 日常表达 | 轻松娱乐式回复的逻辑、技巧和场景素材，按导读限制使用。 |
| [托人办事的高效话术指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E6%89%98%E4%BA%BA%E5%8A%9E%E4%BA%8B%E7%9A%84%E9%AB%98%E6%95%88%E8%AF%9D%E6%9C%AF%E6%8C%87%E5%8D%97.md) | 社交与职场 | 请求协助的沟通逻辑、操作方法和场景话术。 |
| [提升表达逻辑性：从混乱到清晰的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E6%8F%90%E5%8D%87%E8%A1%A8%E8%BE%BE%E9%80%BB%E8%BE%91%E6%80%A7%EF%BC%9A%E4%BB%8E%E6%B7%B7%E4%B9%B1%E5%88%B0%E6%B8%85%E6%99%B0%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 将混乱表达整理为清楚的逻辑和场景化陈述。 |
| [提高气场：从内到外的力量感塑造指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E6%8F%90%E9%AB%98%E6%B0%94%E5%9C%BA%EF%BC%9A%E4%BB%8E%E5%86%85%E5%88%B0%E5%A4%96%E7%9A%84%E5%8A%9B%E9%87%8F%E6%84%9F%E5%A1%91%E9%80%A0%E6%8C%87%E5%8D%97.md) | 社交与职场 | 整理自信、表达与行为表现的方法，区分力量感与虚张声势。 |
| [有效拓展人脉：从建立到维护的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E6%9C%89%E6%95%88%E6%8B%93%E5%B1%95%E4%BA%BA%E8%84%89%EF%BC%9A%E4%BB%8E%E5%BB%BA%E7%AB%8B%E5%88%B0%E7%BB%B4%E6%8A%A4%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 社交与职场 | 从建立连接到维护关系组织社交方法和表达。 |
| [聊天化被动为主动：引导互动的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E8%81%8A%E5%A4%A9%E5%8C%96%E8%A2%AB%E5%8A%A8%E4%B8%BA%E4%B8%BB%E5%8A%A8%EF%BC%9A%E5%BC%95%E5%AF%BC%E4%BA%92%E5%8A%A8%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 梳理被动聊天的原因、主动引导方法与场景话术。 |
| [自然流、内在状态与结构化互动：伦理能力转译](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E8%87%AA%E7%84%B6%E6%B5%81%E3%80%81%E5%86%85%E5%9C%A8%E7%8A%B6%E6%80%81%E4%B8%8E%E7%BB%93%E6%9E%84%E5%8C%96%E4%BA%92%E5%8A%A8%EF%BC%9A%E4%BC%A6%E7%90%86%E8%83%BD%E5%8A%9B%E8%BD%AC%E8%AF%91.md) | 经验转译 | 将内在状态、观察表达邀请、开放假设和结构排错转成练习。 |
| [获得领导青睐：从价值匹配到信任建立的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E8%8E%B7%E5%BE%97%E9%A2%86%E5%AF%BC%E9%9D%92%E7%9D%90%EF%BC%9A%E4%BB%8E%E4%BB%B7%E5%80%BC%E5%8C%B9%E9%85%8D%E5%88%B0%E4%BF%A1%E4%BB%BB%E5%BB%BA%E7%AB%8B%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 社交与职场 | 以需求匹配、创造价值和信任为线索整理职场沟通。 |
| [被孤立如何破局：从自我调适到建立连接的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E8%A2%AB%E5%AD%A4%E7%AB%8B%E5%A6%82%E4%BD%95%E7%A0%B4%E5%B1%80%EF%BC%9A%E4%BB%8E%E8%87%AA%E6%88%91%E8%B0%83%E9%80%82%E5%88%B0%E5%BB%BA%E7%AB%8B%E8%BF%9E%E6%8E%A5%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 社交与职场 | 从自我调适、建立连接到场景表达组织应对方法。 |
| [长期记忆与关系档案](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E9%95%BF%E6%9C%9F%E8%AE%B0%E5%BF%86%E4%B8%8E%E5%85%B3%E7%B3%BB%E6%A1%A3%E6%A1%88.md) | 导读与工具 | 规定同意、五类记忆、来源、增量更新、压缩召回与用户控制。 |
| [高情商拒绝他人：体面护边界的实用指南](https://github.com/shengjidaguai-china/goutoujunshi/blob/4ced1d57561563f4b556f555ee1c8c91ffb16355/references/practical/%E9%AB%98%E6%83%85%E5%95%86%E6%8B%92%E7%BB%9D%E4%BB%96%E4%BA%BA%EF%BC%9A%E4%BD%93%E9%9D%A2%E6%8A%A4%E8%BE%B9%E7%95%8C%E7%9A%84%E5%AE%9E%E7%94%A8%E6%8C%87%E5%8D%97.md) | 日常表达 | 整理清晰边界、拒绝技巧与场景话术。 |

<!-- CATALOG:END -->
