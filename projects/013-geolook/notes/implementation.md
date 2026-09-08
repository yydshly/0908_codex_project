# GeoLook 源码导读

来源均固定到 `9492cb3a1952f1370cca0f66715f87165fd56e2c`，以下是本项目的源码阅读归纳，不代表上游运行测试通过。

| 环节 | 实现 | 输入 → 输出 | 关键边界 |
| --- | --- | --- | --- |
| 项目编排 | [geo.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/geo.py) | 项目配置 → 各步骤产物 | 全流程编排不等于自动修改和发布品牌官网 |
| 品牌与题库 | [bootstrap.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/bootstrap.py) | 官网摘要 / 品牌资料 → 品牌事实、竞品候选、问题 | LLM 输出需复核；七类问题包括推荐、比较、替代、价格、风险、品牌验证、场景 |
| 网页取证 | [crawl.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/crawl.py) | 站点 URL → 站点与代表性网页快照 | 静态 HTML 为主，UA 探测不证明真实平台抓取成功 |
| 规则评分 | [audit.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/audit.py) | 正文、标题、结构等 → 六维分数、问题代码 | 长度、定义、数字、对题性等为启发式指标，不是引用概率 |
| 答案采样 | [sample.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/sample.py) | 固定问题 / 答案导入 → 样本 JSONL、指标 JSON | 10 个 API 入口、7 个人工入口；多数 API 默认不联网 |
| 派生分析 | [analytics.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/analytics.py) | 样本、渠道和核查记录 → 健康分、分组诊断、前后对比 | 未测维度重分配权重，事实一致性依赖人工记录 |
| 任务管理 | [tasks.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/tasks.py) | 缺口 → 带负责人、风险、验收表达式的任务 | 优先级和实施风险是两个维度 |
| 资产生成 | [generate.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/generate.py) | 品牌事实 → llms.txt、JSON-LD、内容片段、草稿、归因素材 | 编造风险检查依赖规则，不能代替事实核验 |
| 内容发布 | [publish.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/publish.py) | 内容与凭据 → 发布记录 | 包含 GitHub、WordPress / 公众号草稿、X、Reddit、Webhook；接口资格和当前可用性未验证 |
| 自动验收 | [verify.py](https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/verify.py) | 重抓结果与采样指标 → 任务状态和验收证据 | 完成任务再次不达标会重开；效果阈值通过不证明因果 |

## 两个容易混淆的指标

1. 官网引用率：包含自有域名的未点名答案占比。
2. 官网引用份额：答案提取出的引用域名条目中，自有域名条目所占比例（上游在单条答案内对域名去重）。

教学页面选用第一个，便于从逐条答案复算。对于无官网品牌，上游将官网引用指标记为不适用，而不是 0。

## 研究判断

- 本质是营销运营工作台，核心是观察、规则诊断、任务管理与交付。
- 固定问题、平台分组、重复采样和保留原始证据比单一健康分更重要。
- 把观察结果误当成原因，是使用中最容易犯的错误。体检高分也不等于必然被引用。
- 可优先扩展置信区间和对照观察、实体与推荐语义分析、访问到咨询/成交的归因。
- 上游是单机文件存储架构。多人使用需要额外的权限、持久化、作业调度与客户隔离。

## 本演示文件

`web/013-geolook/index.html`：五页结构与中文教学说明。

`web/013-geolook/style.css`：响应式样式、键盘焦点、减少动画偏好。

`web/013-geolook/data.js`：虚构样本、纯统计函数、能力和源码对应数据。

`web/013-geolook/app.js`：筛选、答案回放、任务与草稿存储、复查、报告导出。

没有后台，无密钥，无真实品牌数据外发。外部链接只在主动点击上游来源时打开。
