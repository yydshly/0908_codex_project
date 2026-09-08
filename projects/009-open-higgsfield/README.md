# 009 · OpenHiggsfield

> 调用外部生成 API 的图片／视频 Web 工作台，主要提供模型参数适配、任务状态管理和素材展示；不包含生成模型实现。当前仅作摘要留档，不继续深入研究。

## 基本信息

| 项目 | 内容 |
| --- | --- |
| 上游仓库 | [wide-trace/open-higgsfield](https://github.com/wide-trace/open-higgsfield) |
| 检查版本 | `eac4a2563c91479ff053246fe17c93e362d43cfa` |
| 源码检查日期 | 2026-09-08 |
| 整理日期 | 2026-09-09 |
| 状态 | 已完成基础判断与摘要留档，不继续深入研究 |
| 技术栈 | Next.js、React、TypeScript、Zustand、IndexedDB、Vercel Blob |
| 验证范围 | 静态源码检查；未安装运行，未配置 Key 或实测生成接口 |
| 上游许可证 | 所检查版本根目录未见 LICENSE 文件，未确认明确许可 |

## 定位与结论

它是一个独立实现界面的生成工具，主要满足统一选择模型、填写参数、提交生成和浏览结果的需求。核心调用链没有抓取 Higgsfield 页面、模拟网站操作或复用网站登录会话的逻辑，因此“提取了网站页面”不是准确描述。

生成流程为：**提示词与素材 → 参数映射 → 外部 API 提交 → 状态轮询 → 图片／视频结果展示与本地历史记录。**

仓库中的模型目录是接口与参数配置，不是模型源码或权重；没有训练、推理引擎或生成算法实现。API 地址由 `HF_API_BASE_URL` 配置，示例值为空，不能仅据仓库确认线上实际连接的服务。自部署界面仍依赖兼容的上游生成服务和有效 Key。

**本项目不列入后续深入研究计划。** 对理解 AI 生成原理或 Higgsfield 内部技术帮助有限；以后确有自建生成工作台的需求时，再参考其界面和适配方式。

## 保留的参考入口

以下链接均固定到本次检查版本。

| 入口 | 实际职责与可参考内容 |
| --- | --- |
| [模型目录](https://github.com/wide-trace/open-higgsfield/tree/eac4a2563c91479ff053246fe17c93e362d43cfa/src/generation/catalog) | 声明模型、参数和素材角色，供界面生成控件 |
| [参数映射](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/generation/to-platform.ts) | 选择文生／图生等接口路径，将界面参数转换成上游字段 |
| [API 客户端](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/generation/platform.ts) | 携带 Key 提交生成请求与查询状态，解析返回结果 |
| [服务端入口](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/generation/actions.ts) | 读取凭据和 API 地址、校验参数、并行查询任务状态 |
| [任务轮询](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/generation/poll.ts) | 合并状态查询、管理终态和超时 |
| [历史记录](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/openhiggsfield/history.ts) | 浏览器本地持久化、收藏保留和运行记录合并 |

这些属于常规应用工程参考，不构成独立的 AI 技术能力。现有实现也不能直接视为完整的多用户商业平台：历史主要保存在浏览器本地，[上传接口](https://github.com/wide-trace/open-higgsfield/blob/eac4a2563c91479ff053246fe17c93e362d43cfa/src/app/api/blob/route.ts)明确留有待加入身份验证的注释。

## 归档范围

仅保留本摘要、版本与源码链接；不制作演示，不开展模型实测，不接入服务。本说明为源码阅读后的原创归纳，未复制上游实现代码或素材。“已完成”仅指本次筛选与摘要整理完成，不表示所有功能已验证。
