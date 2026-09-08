# 固定版本源码核对

第三轮已实际运行该固定提交。当前界面导出倍率、代码主题和 GIF 入口与 README 存在差异；以 [原版运行与验证](original-app.md) 中记录的实际界面为准。下表继续用于定位实现原理。

研究日期：2026-09-09。上游 commit：`7c7a38a65a547aa081cb86bf489d27be44aeb4f7`。以下为源码阅读结果，不代表原版完整运行验证。

| 结论 | 证据入口 | 核对内容 |
| --- | --- | --- |
| 完整 Web 应用 | [package.json](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/package.json) | Next.js、React、状态库、编码与服务端依赖；不是单一截图函数库 |
| 主要能力与输出格式 | [README](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/README.md) | 截图美化、外框、标注、代码、推文、动画，静态与视频导出 |
| HTML 画布 | [HTMLCanvasRenderer.tsx](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/components/canvas/html/HTMLCanvasRenderer.tsx) | 注释明确说明替代 Konva Stage，使用固定尺寸 div 容器 |
| 平面透视 | [Perspective3DOverlay.tsx](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/components/canvas/overlays/Perspective3DOverlay.tsx) | CSS perspective、rotateX/Y/Z、translate、scale、drop-shadow |
| DOM 转 Canvas | [export-service.ts](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/lib/export/export-service.ts) | 当前导出调用 domToCanvas；过滤编辑控件、补做模糊区域，再进入压缩路径 |
| 图片服务端压缩 | [sharp-client.ts](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/lib/export/sharp-client.ts) | skipApi 默认 false；FormData 提交 /api/export；失败时 canvas.toBlob 回退 |
| Sharp 处理接口 | [app/api/export/route.ts](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/app/api/export/route.ts) | 接收图片并进行格式压缩；接口名称不代表完整的无头编辑渲染服务 |
| 视频编码 | [export-slideshow-video.ts](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/lib/export-slideshow-video.ts) | 检查 WebCodecs H.264/VPx 能力；MP4/WebM 可回退 FFmpeg；GIF 走 FFmpeg |
| 网页截图依赖 | [app/api/screenshot/route.ts](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/app/api/screenshot/route.ts) | 调用 Microlink 获取托管截图地址，再读取图片；不是本项目自行实现浏览器截图引擎 |
| 代码卡片 | [CodeFrame.tsx](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/components/code-image/CodeFrame.tsx) | react-syntax-highlighter 语法高亮，加排版、字体、窗口背景 |

## 不能照抄旧文档的地方

[ARCHITECTURE.md](https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/ARCHITECTURE.md) 同时存在历史方案与较新说明：Konva、html2canvas、自动加水印、完全浏览器处理等描述不能全部视为当前事实。甚至 export-service.ts 顶部的“fully in-browser”注释与后续调用 Sharp API 的实际路径不一致。

本研究以函数调用及组件实现为判断依据。未运行原版网站的网络审计，不能仅从仓库证明线上部署与该 commit 完全一致。

## 演示设计的推断部分

官网展示、技术卡片、教程反馈与轻量动效等场景，是根据已实现能力归纳的用途；不保证任意素材导出都没有字体、跨域资源或浏览器兼容性问题。当前演示采用本地素材、系统字体和单一 PNG 格式，缩小了运行依赖范围。
