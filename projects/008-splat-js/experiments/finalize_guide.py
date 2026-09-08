"""Finalize the reviewed guide and use the actual SOG render as its cover."""
from pathlib import Path
import json
import shutil

ROOT=Path(__file__).resolve().parents[3]
PROJECT=ROOT/'projects/008-splat-js'
WEB=ROOT/'web/008-splat-js'
(PROJECT/'assets').mkdir(exist_ok=True)
shutil.copy2(WEB/'video-assets/result-cover.webp',PROJECT/'assets/result-cover.webp')
registry=json.loads((ROOT/'projects.json').read_text(encoding='utf-8'))
for p in registry:
    if p['id']=='008':
        p.update(name='Splat.js · 视频到三维实测与扩展指南',summary='已从独立鞋子视频完成本机三维重建，提供原视频与真实结果对照、官方样例、整体架构和商品／空间扩展方向；人体与自由漫游待验证。',status='已完成',cover='assets/result-cover.webp',tags=['视频转三维','真实效果','WebGPU','扩展场景'])
(ROOT/'projects.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

replacements={
 '审阅稿 · 2026-09-09 · 等你确认后再提交':'总结版 · 2026-09-09 · 已完成真实视频重建验证',
 '本轮整理与图表已准备供审阅；提交、推送与发布等待你的确认。':'本轮能力整理与真实样例已完成。商品交互和空间导览是后续可选方向，尚未作为产品实现。',
 '独立视频仅用于本地研究，公开发布前需确认媒体授权或换成自有素材。此页未发布。':'独立视频保留作者归属；公共网页从作者地址加载原视频，不在仓库重复分发 MP4。素材许可不随代码 MIT 许可转移。',
 'video-assets/result-thumb.webp':'video-assets/result-cover.webp',
 '审阅稿 · 2026-09-09。':'总结版 · 2026-09-09。',
 '本文和网页等待用户确认后再提交；尚未提交或发布本轮整理。':'本轮文档和网页已获用户确认，整理为可提交的研究成果。',
 '## 10. 交付与审阅':'## 10. 交付与总结',
 '用户确认后才进行提交。本轮没有 Git commit、push 或部署。':'用户已确认提交远端。本轮交付为研究指南与真实实验，后续产品功能需另行开发。',
 '本次仅作本地实验，公开发布前还需确认素材授权或换成自有拍摄。':'本项目保留来源归属；公共网页从作者地址引用原 MP4，商用素材应取得相应授权或换成自有拍摄。',
 '待提交文件应显式限定在本项目及必要索引，保留工作区其他项目的修改。':'提交范围限定在本项目及必要索引，保留工作区其他项目的修改。',
}
for file in [PROJECT/'notes/capability-guide.md',PROJECT/'experiments/build_guide_page.py',WEB/'sample-guide.js']:
    content=file.read_text(encoding='utf-8')
    for before,after in replacements.items():content=content.replace(before,after)
    file.write_text(content,encoding='utf-8')

readme='''# 008 · Splat.js 视频到三维实测与扩展指南

**结论：可以把静态对象的多角度照片或绕拍视频，在本机浏览器里重建成可拖动、缩放的三维外观。我们已用独立作者的鞋子原视频跑通完整流程。**

[![本项目从鞋子视频训练出的真实三维高斯渲染效果](assets/result-cover.webp)](https://yydshly.github.io/0908_codex_project/demos/008-splat-js/#real)

上图由本次保存的 `model.sog` 实时渲染后导出，是最终三维效果截图；不是输入照片或示意图。README 展示静态预览，点击图片进入可交互网页。

[打开完整网页](https://yydshly.github.io/0908_codex_project/demos/008-splat-js/) · [原视频与三维结果对照](https://yydshly.github.io/0908_codex_project/demos/008-splat-js/video-test.html#result) · [完整能力文档](notes/capability-guide.md)

## 实测总结

| 实验 | 输入 | 实际结果 |
| --- | --- | --- |
| 独立鞋子视频 | N. Escobar / nickesc 的 65.5 秒原视频；非上游样例 | 自动选出 223 帧，223/223 视角定位，10,015 次训练，3.8 MB SOG；已验证重载、拖动和缩放 |
| Truck 本机复训 | 100 张上游照片 | 100/100 定位，10,035 次训练，19.6 MB 高斯 PLY |
| Truck / Bar 官方成品 | 作者已训练的模型 | 已验证成品查看；Bar 没有在本机重新训练 |

视频训练时有 350,000 个高斯，SOG 实际保留 311,757 个。Draft 480 px，训练分数 28.68 dB，无留出测试集。RTX 4070 Laptop GPU 上输入到完成约 27 分钟，含人工启动和观察间隔；纯外观训练约 1 分钟。单次实测不是通用速度承诺。

## 能力与原理

多角度照片／视频 → 浏览器解码选帧 → SIFT 特征与 GPU 匹配 → SfM 相机及空间求解 → WebGPU 三维高斯训练 → PLY／SOG 保存与交互查看。

![Splat.js 从输入、核心计算到输出和产品扩展的整体架构](../../web/008-splat-js/assets/architecture-guide.png)

[下载矢量架构图](../../web/008-splat-js/assets/architecture-guide.svg)

作者实现的是已有视觉与 3DGS 方法的浏览器流程，核心计算不依赖后台建模平台。当前成品 SOG 由原应用内置的 PlayCanvas / WebGL2 查看；训练使用 WebGPU。

## 对我们的意义与扩展方向

- **商品展示：**在真实三维结果上增加细节热点、快捷视角、商品资料和链接，可先复用已验证的鞋子。
- **空间导览：**门店、展厅、房源浏览；先补普通房间视频实测，再增加路线讲解、房间切换和移动限制。
- **视觉留档与内容制作：**工艺品记录、布展前后对照、镜头路线和视频输出，需要版本及内容工具。
- **固定穿搭：**可研究同一姿势的立体展示；人体尚未实测，动作与换装需要额外技术。

当前最明确的价值是“采集真实外观 → 保存三维资产 → 网页交互展示”。结果不自动提供连通网格、准确尺寸、碰撞、骨骼或自动换装。白墙、反光、运动与未覆盖区域可能影响重建质量。

## 复现与查看

1. 在仓库根目录运行 `python projects/008-splat-js/experiments/video-sample/fetch_source.py` 恢复本地原视频（SHA256 校验）。
2. 运行 `python scripts/build.py`，再运行 `python -m http.server 8018 --directory _site`。
3. 打开 `http://localhost:8018/demos/008-splat-js/`。查看已保存模型无需重新训练。

公共网页从作者原地址加载 MP4；原视频不重复提交到本仓库。网页保留照片训练、合成测试、自有素材入口及原理示意。训练需要合适的 WebGPU 设备。

## 记录与来源

- [完整能力、输入输出、房间与人体边界、扩展场景](notes/capability-guide.md)
- [独立视频实测记录](notes/independent-video-validation.md) · [Truck 与官方模型验证](notes/real-demo-validation.md)
- [本机导出的 Truck 高斯 PLY](experiments/results/truck-draft-100photos.ply)
- [封面来源与复现说明](assets/SOURCE.md)
- [上游固定快照](https://github.com/arrival-space/splat.js/tree/128438ac803aacf868938471dcd52f2a16e0d3a6) · [运行器来源与改动](../../web/008-splat-js/engine/NOTICE.md)
- [独立视频作者](https://nickesc.github.io/PhotogrammetryVideoInstructions/) · [Bar 原数据项目 360Roam](https://huajianup.github.io/research/360Roam/)

2026-09-09 已完成本轮能力整理与真实实验。上游代码 MIT；数据与媒体许可独立，Bar 数据为 CC BY-NC-SA。原视频、衍生预览与模型保留来源，不因代码许可而自动获得媒体商用授权。
'''
(PROJECT/'README.md').write_text(readme,encoding='utf-8')
(PROJECT/'assets/SOURCE.md').write_text('''# 真实结果封面

`result-cover.webp` 为本项目训练的 `web/008-splat-js/video-assets/model.sog` 实时渲染截图，1280 × 960，WebP。没有使用原始照片代替三维结果，也没有生成式重绘。

生成入口：`web/008-splat-js/cover-capture.html`；选择相机索引 120，使用固定版本的 `createSogView` / PlayCanvas 渲染，在 postrender 时导出画布。模型校验与来源见视频实测记录。

原拍摄素材作者为 N. Escobar / nickesc：https://nickesc.github.io/PhotogrammetryVideoInstructions/ 。本项目从原视频独立训练三维模型，未使用作者预生成的模型或渲染视频。
''',encoding='utf-8')
print('Final summary, registry and real-render cover prepared.')
