"""Render the same labelled architecture guide as editable SVG and PNG."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'web/008-splat-js/assets'
OUT.mkdir(parents=True, exist_ok=True)
W,H,S=1600,1280,2
im=Image.new('RGB',(W*S,H*S),'#101b21')
draw=ImageDraw.Draw(im)
svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc"><title id="title">Splat.js 整体架构引导图</title><desc id="desc">照片或视频经本机选帧、空间求解和高斯训练，输出可交互三维外观；应用扩展与额外算法研发分别标注。</desc><rect width="1600" height="1280" fill="#101b21"/>']
def rect(x,y,w,h,fill,stroke=None,r=18):
    draw.rounded_rectangle((x*S,y*S,(x+w)*S,(y+h)*S),r*S,fill=fill,outline=stroke,width=2*S)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke or fill}" stroke-width="2"/>')
def text(x,y,label,size=24,color='#e6efec',bold=False):
    font=ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc' if bold else 'C:/Windows/Fonts/msyh.ttc',size*S)
    draw.text((x*S,y*S),label,font=font,fill=color,anchor='lt')
    svg.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{700 if bold else 400}" font-family="Microsoft YaHei,Arial,sans-serif" dominant-baseline="text-before-edge">{escape(label)}</text>')
def arrow(x1,y1,x2,y2,color='#8adcb7'):
    draw.line((x1*S,y1*S,x2*S,y2*S),fill=color,width=3*S)
    pts=[(x2,y2),(x2-10,y2-6),(x2-10,y2+6)] if x2>x1 else [(x2,y2),(x2-6,y2-10),(x2+6,y2-10)]
    draw.polygon([(x*S,y*S) for x,y in pts],fill=color)
    svg.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3"/><polygon points="'+ ' '.join(f'{x},{y}' for x,y in pts)+f'" fill="{color}"/>')
def card(x,y,w,title,lines,accent='#8adcb7',h=130):
    rect(x,y,w,h,'#1a2b33','#35515b')
    rect(x,y,5,h,accent,r=2)
    text(x+22,y+18,title,26,accent,True)
    for i,line in enumerate(lines): text(x+22,y+61+i*29,line,21,'#bbcbc9')

text(64,38,'Splat.js：从拍摄到可交互三维',43,bold=True)
text(66,101,'读图顺序：输入真实素材 → 本机重建 → 保存与查看 → 扩展产品体验',23,'#b8cac6')
text(66,162,'01  输入层',24,'#8adcb7',True)
card(64,207,470,'多角度照片',['同一个静态对象；连续视角与重叠','物体绕拍 / 房间内移动拍摄'])
card(565,207,470,'视频 → 清晰帧',['浏览器逐帧分析并自动选择照片','已实测：65.5 秒 → 223 帧'])
card(1066,207,470,'多位置 360° 全景',['应用切分为相机组后求解','Bar 成品已查看；未本机复训'])
arrow(800,344,800,383)
text(66,386,'02  核心计算层 · 在本机浏览器执行',24,'#8adcb7',True)
card(64,434,445,'找相同细节',['SIFT 特征 / CPU 与 Workers','跨照片匹配 / WebGPU'],h=145)
arrow(516,505,548,505)
card(561,434,445,'恢复拍摄位置与空间',['相机位置 + 镜头参数 + 稀疏点','SfM / 联合校正误差'],h=145)
arrow(1013,505,1045,505)
card(1058,434,478,'训练三维高斯',['渲染 → 对比原照片 → 优化参数','位置、方向、尺度、颜色、透明度'],h=145)
rect(64,596,1472,53,'#203d36')
text(87,608,'理解关键：已有算法的浏览器实现；核心重建不依赖后台建模平台。网络用于素材获取、托管或主动分享。',22,'#bfefcf')
arrow(800,656,800,692)
text(66,697,'03  输出与查看层',24,'#8adcb7',True)
card(64,744,695,'可保存的三维外观',['3DGS PLY / 压缩 SOG + 相机与素材关联','高斯是真实三维数据，但没有天然连通的三角网格'],h=135)
arrow(770,811,810,811)
card(825,744,711,'可改变视角的网页体验',['拖动旋转 / 滚轮缩放 / 拍摄路径游览','本项目：WebGPU 训练；PlayCanvas / WebGL2 查看 SOG'],h=135)
arrow(800,886,800,922)
text(66,925,'04  产品扩展层 · 以下需另行设计与开发',24,'#a7c6ff',True)
card(64,973,470,'商品与内容',['细节热点 / 快捷视角 / 商品资料','收藏记录 / 镜头路线与视频输出'],'#a7c6ff',h=125)
card(565,973,470,'空间与导览',['房间切换 / 导览讲解 / 版本对照','自由移动需控制与导航，防穿墙需碰撞'],'#a7c6ff',h=125)
card(1066,973,470,'人体与更深层能力',['固定穿搭：尚待人体素材验证','网格、骨骼、换装、动态三维需额外技术'],'#edc693',h=125)
rect(64,1124,1472,102,'#2d2925','#665642')
text(86,1140,'边界：没拍到 ≠ 已还原；看起来真实 ≠ 精确尺寸；能转动 ≠ 能换装或做骨骼动画。',25,'#f0d2ac',True)
text(86,1181,'已实测：Truck 照片重建 + 独立运动鞋视频完整流程。人体、普通房间视频与自由漫游尚未完成本机验证。',21,'#d3c2b0')
text(67,1245,'研究快照 128438ac803a · 2026-09-09 · 能力总结与真实实验记录',18,'#95a9ad')
svg.append('</svg>')
(OUT/'architecture-guide.svg').write_text('\n'.join(svg),encoding='utf-8')
im.save(OUT/'architecture-guide.png')
print('SVG + PNG architecture guide generated.')
