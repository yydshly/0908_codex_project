# 真实结果封面

`result-cover.webp` 为本项目训练的 `web/008-splat-js/video-assets/model.sog` 实时渲染截图，1280 × 960，WebP。没有使用原始照片代替三维结果，也没有生成式重绘。

生成入口：`web/008-splat-js/cover-capture.html`；选择相机索引 120，使用固定版本的 `createSogView` / PlayCanvas 渲染，在 postrender 时导出画布。模型校验与来源见视频实测记录。

原拍摄素材作者为 N. Escobar / nickesc：https://nickesc.github.io/PhotogrammetryVideoInstructions/ 。本项目从原视频独立训练三维模型，未使用作者预生成的模型或渲染视频。
