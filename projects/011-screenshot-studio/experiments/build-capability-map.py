"""Render the original, editable capability guide as SVG and a shareable PNG.

Requires Pillow. Default Chinese fonts are Microsoft YaHei on Windows;
set --font and --bold-font to use another CJK font on other systems.
"""
from pathlib import Path
from html import escape
import argparse
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--font', default='C:/Windows/Fonts/msyh.ttc')
parser.add_argument('--bold-font', default='C:/Windows/Fonts/msyhbd.ttc')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'assets'
out.mkdir(exist_ok=True)
W, H = 1800, 1200
image = Image.new('RGB', (W, H), '#F5F7EF')
draw = ImageDraw.Draw(image)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
       '<title id="title">Screenshot Studio 能力全景</title>',
       '<desc id="desc">素材输入、展示设计、信息表达、成品输出四个环节，覆盖代码、网页、设备套壳、三维透视、图层标注、单图动画、多图视频与部署接口。</desc>',
       '<rect width="1800" height="1200" fill="#F5F7EF"/>']
fonts = {}
def font(size, bold=False):
    key = size, bold
    if key not in fonts:
        fonts[key] = ImageFont.truetype(args.bold_font if bold else args.font, size)
    return fonts[key]

def text(x, y, content, size=24, color='#25483B', bold=False):
    draw.text((x, y), content, font=font(size,bold), fill=color, anchor='lt')
    weight = '700' if bold else '400'
    svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(content)}</text>')

def box(x,y,w,h,color,radius=16,border=None):
    draw.rounded_rectangle((x,y,x+w,y+h),radius,fill=color,outline=border,width=2 if border else 1)
    stroke = f' stroke="{border}" stroke-width="2"' if border else ''
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{color}"{stroke}/>')

def line(points,color='#A0B39A',width=2):
    draw.line(points,fill=color,width=width,joint='curve')
    svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in points)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')

text(70,45,'OPEN SOURCE / 011 / 能力引导',19,'#6D856A',True)
text(70,94,'Screenshot Studio 能力全景',63,bold=True)
text(73,181,'把截图、代码和网页，变成可分享的视觉作品。',29,'#61765D')
box(1450,64,280,48,'#E5EDD9',24)
text(1479,76,'截图创作与展示工具',22,'#456743',True)

groups = [
    ('01','素材输入','先获得需要展示的内容','#E8EFE1','#436948',[
        ('已有截图','上传图片，继续编辑'),('代码转图','语法高亮、主题与行号'),
        ('网页截图','输入网址获取页面'),('推文卡片','导入公开推文内容')]),
    ('02','展示设计','把内容放入合适的视觉环境','#E3EEEA','#2B7162',[
        ('背景与光影','渐变、材质、留白、阴影'),('浏览器外框','Chrome、Safari 等样式'),
        ('设备套壳','手机、手表、电脑外壳'),('三维透视','平面旋转、倾斜与缩放')]),
    ('03','信息表达','说明重点，也让画面动起来','#F0EADC','#8E7142',[
        ('图层组合','叠加图片、文字与装饰'),('文字与标注','箭头、形状、局部模糊'),
        ('单图动画','淡入、翻转、漂浮等动效'),('多图视频','多页截图按顺序展示')]),
    ('04','成品输出','分享作品，并复用制作流程','#E7E9F0','#606889',[
        ('图片成品','PNG / JPEG / WebP'),('视频成品','MP4 / WebM'),
        ('模板与草稿','复用风格，继续编辑'),('部署与接口','自行运行，接入素材流程')])
]
for i,(number,title,subtitle,tint,accent,items) in enumerate(groups):
    x,y=70+i*420,272
    box(x,y,400,573,'#FFFFFF',20,'#D8E1D1')
    box(x+20,y+22,54,44,tint,12)
    text(x+32,y+29,number,25,accent,True)
    text(x+91,y+26,title,33,accent,True)
    text(x+24,y+86,subtitle,21,'#6E7E67')
    line([(x+24,y+127),(x+376,y+127)],'#E5EADD')
    for j,(name,detail) in enumerate(items):
        yy=y+151+j*100
        box(x+25,yy+5,7,48,accent,3)
        text(x+48,yy,name,29,'#2C4839',True)
        text(x+48,yy+45,detail,21,'#657760')
    if i<3:
        # Direction indicators occupy the gutter between the four columns.
        line([(x+403,y+284),(x+417,y+284)],'#809476',3)
        line([(x+411,y+278),(x+417,y+284),(x+411,y+290)],'#809476',3)

box(70,877,1660,167,'#E8EFE0',20)
text(99,902,'从理解到掌握',27,'#365A37',True)
text(99,944,'先看效果，再完成自己的作品。',21,'#6B7D61')
for x,number,title,detail in [
    (575,'1','看能力与样片','理解素材怎样变成成品'),
    (950,'2','跟随 18 项练习','按目标操作，用标准自检'),
    (1325,'3','用自己的素材复现','记录问题，逐项独立完成')]:
    box(x,913,42,42,'#CADBBE',21)
    text(x+14,919,number,23,'#3D633E',True)
    text(x+57,914,title,25,'#315835',True)
    text(x+57,956,detail,19,'#63785D')

text(74,1080,'理解边界',21,'#486641',True)
text(195,1081,'不提供 AI 画质修复或三维模型重建；网页和推文获取依赖外部服务。',21,'#687962')
text(74,1131,'单图动画 = 一张图随时间变化     ·     多图视频 = 多张图连续展示',21,'#496A48',True)
text(1260,1134,'核对版本 7c7a38a  /  2026-09-09',16,'#8B9981')
svg.append('</svg>')
(out/'capability-map.svg').write_text('\n'.join(svg),encoding='utf-8')
image.save(out/'capability-map.png',optimize=True)
print(f'Created {W} x {H} PNG and editable SVG in {out}')
