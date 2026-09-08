# 独立公开视频 → 三维重建实测

日期：2026-09-09（Asia/Shanghai）。Splat.js 固定版本：128438ac803aacf868938471dcd52f2a16e0d3a6。

## 素材与实验范围

- 拍摄者：N. Escobar / nickesc。
- 教程与原始视频：https://nickesc.github.io/PhotogrammetryVideoInstructions/
- 下载：https://raw.githubusercontent.com/nickesc/PhotogrammetryVideoInstructions/main/sample/sampleVideo.mp4
- 内容：室外凳子上的静止运动鞋，相机绕行、改变高度并拍摄细节。
- 原文件 82,580,751 字节；SHA256 `749d211568634f186b8ddb120e18b336dca7c8eb10573690e978261e73d98926`。
- H.264 / AAC，2160 × 3840，60 fps，65.516667 秒。

使用的是该独立作者公开提供的原始捕获视频。没有使用其 sampleRender.mov、samplePointCloud.ply，也没有使用 Splat.js 官方场景、预训练模型或预计算相机。本次训练不依赖外部建模服务。

## 操作方式

`experiments/video-sample/fetch_source.py` 将源视频下载到实验目录并复制到 Web 本地资源。站点构建后打开 `demos/008-splat-js/engine/app/index.html?videoDemo=nickesc`。

该入口将原始 MP4 包装为浏览器 File，直接调用上游 useOwnVideo → extractSharpFrames；之后通过真实 UI 的 Start training 开始。src/ 抽帧、SfM 和训练代码未修改。仅修复了上游视频输入完成后未打开详细卡片、训练按钮不易到达的问题，与照片入口行为一致。

## 视频输入已验证

浏览器日志：

```text
2026-09-08T16:13:05.369Z [video] video: 2160x3840, 65.5s, 3931 frames @ 60.00 fps bt709/bt709
2026-09-08T16:14:22.750Z [video] scored 3931 frames (0 blur dips); kept 223 — motion budget 10 % of the width, focus median 488
```

真实 UI 显示 223 张、2160 × 3840，Draft。约 77 秒为扫描与评分时间；不包含完整 JPEG 保存、相机求解和训练。

## 重建

通过界面启动 Draft：训练长边 480 px、SH 0、目标 10,000 次迭代、自动高斯预算。完整运行成功：

| 指标 | 本次实际结果 |
| --- | --- |
| 视频抽帧 | 3,931 帧评分，保留 223 帧 |
| 相机注册 | 223 / 223 |
| 实际训练次数 | 10,015（批次提交导致略超过目标） |
| 训练结束高斯数 | 350,000 |
| 训练照片 PSNR | 28.6756 dB，未留出测试集 |
| 纯外观训练 | 界面与保存记录为约 1 分钟 |
| 视频输入到训练完成 | 约 27 分钟，主要耗时在相机求解；含人工启动与观察间隔，不作为严格性能基准 |
| SOG 文件 | 3,783,221 字节 |
| SOG 内实际高斯数 | 311,757；导出时滤除几乎不可见的高斯，查看器顶栏仍显示训练记录的 350,000 |
| SOG SHA256 | `7601ca28bb1a27e4becef6ffaca6d7984108cb394f7f368a98662f50e9201795` |
| GPU | NVIDIA GeForce RTX 4070 Laptop GPU |

实验记录 ID：`run_1788885522715_341819`。原应用将自有捕获的运行名称保存为 Local Scene。指标保存在 `result.json`（保存在项目 experiments 目录），原始相机与训练数据为 `original-recon.json`（保存在项目 experiments 目录）。

## 结果保存与复载验证

原应用的 Download session / Download photos 点击后没有在预期下载目录产生文件，因此不声称这些下载成功。本次通过新增的显式本机导出界面，使用原库 store.js 读取该次已完成记录，将其原始 SOG、recon 与对应的 223 帧保存到项目。接收器只监听 127.0.0.1:8028，限制来源与文件名，保存完成即关闭。没有重新计算或替换三维参数。

- [model.sog](../video-assets/model.sog)：原应用压缩后存入 IndexedDB 的模型原样保存。
- [recon.json](../video-assets/recon.json)：仅改显示名称、照片 URL 并添加来源说明；相机、点云、训练参数和统计与原记录一致。
- frames/：原视频实际抽帧结果缩小为长边 720 px 的 JPEG 预览，用于照片条与对照。不是另一组照片；重新测试输入应使用原 MP4。
- `check_result.py` 核对了 223 个相机与图片、数值元数据不变、SOG ZIP 完整性及文件哈希。

在全新查看器页面从本地 SOG + recon 重新加载成功。暂停自动游览，实际左键拖动后鞋子的观察方向改变；滚轮拉近后鞋面与后跟放大。重载查看使用上游 PlayCanvas / WebGL2，训练使用 Splat.js / WebGPU。

视觉判断：鞋子、鞋带、鞋口、鞋底侧缘与凳子可辨识；背景和细纹理有模糊，凳面有不均匀色块。属于真实草稿重建，不等于精修商品资产。

对照页面：[video-test.html](../video-test.html)。包含原视频播放、独立三维查看、实测指标和重新训练入口。

对照页已在实际浏览器中检查：左右两侧正常显示，原 MP4 可播放（确认推进至约 23 秒，时长 65.516667 秒），右侧模型可独立操作。结果页与独立查看器已保留，临时导出接收器及工作标签页已关闭。

## 边界

原视频的运动鞋放在凳子上，鞋底被遮挡；本次目标是可拖动浏览的三维外观，不是完整鞋底、可编辑网格或可打印模型。单个视频实验不能证明任意网上视频都可成功。

源视频仅为本地测试下载，未发布。本教程仓库未见通用媒体再分发许可证；Splat.js 的 MIT 不覆盖该独立素材。
