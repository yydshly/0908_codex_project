const stages = [
  ['围绕同一个场景拍摄','相邻照片需要充分重叠。移动拍摄位置，让同一细节出现在多张照片里，才有机会恢复空间关系。','人体应保持同一姿势。不是随意收集几张不同角度的照片就能成功。'],
  ['找到照片之间的对应关系','SIFT 提取特征，匹配照片中的相同细节，再通过 SfM 求解相机位置和稀疏三维点，联合校正误差。','此阶段主要解决“从哪里拍、这些点在哪里”，尚未得到完整视觉外观。'],
  ['用彩色高斯拟合照片','把三维点初始化为有大小、方向、颜色和透明度的高斯。反复渲染、比较照片、更新参数，并调整高斯分布。','训练针对当前场景；没有调用通用大模型凭空生成背面。'],
  ['换视角观看与导出','把高斯投影到屏幕上叠加，得到新的观察画面。训练完成后，可导出标准 3DGS PLY 供兼容工具使用。','得到的是视觉外观，不自动包含网格、骨骼、碰撞结构或真实尺寸。']
];
const humans = [
  ['可以尝试','像记录一尊真人雕像。','让人保持姿势，由摄影者绕行，并补充不同高度。呼吸、头部晃动和衣服摆动仍可能导致模糊或重影；头发与手指尤其难。'],
  ['更合适','用同一个瞬间减少不一致。','同步相机可减轻身体移动的影响，但仍需要清晰图像、足够覆盖和可靠的相机求解。该库不负责同步相机硬件，也不保证人体重建成功。'],
  ['不适合直接输入','姿态变化打破静态场景假设。','抬手、转身、衣服变化会使对应特征与三维位置不一致，可能求解失败或形成重影。动态人体需要额外的时序和形变建模。'],
  ['通常不足','两张照片不能补齐整个身体。','正背面之间可能缺少可匹配的共同特征，侧面、腋下及遮挡区域也没有足够约束。需要连续的中间视角，而不是自动脑补。']
];
let stage=0;
const $=id=>document.getElementById(id);
function setStage(n){stage=n;document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.stage===n)));['stage-title','stage-body','stage-note'].forEach((id,i)=>$(id).textContent=stages[n][i]);$('view-label').textContent=['01 / 多角度采集','02 / 特征与稀疏点','03 / 高斯外观拟合','04 / 自由视角浏览'][n];draw();}
function setHuman(n){document.querySelectorAll('[data-human]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.human===n)));['human-status','human-title','human-body'].forEach((id,i)=>$(id).textContent=humans[n][i]);}
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>setStage(+b.dataset.stage)));
document.querySelectorAll('[data-human]').forEach(b=>b.addEventListener('click',()=>setHuman(+b.dataset.human)));
const canvas=$('scene'),ctx=canvas.getContext('2d');
// Deterministic synthetic vase: explanatory geometry, never a trained model.
const points=Array.from({length:2800},(_,i)=>{const t=i/2800,y=t*2-1,a=i*2.399963229728653,r=.38+.22*Math.sin((t*.95+.04)*Math.PI)-.2*Math.exp(-(((t-.85)*9)**2));return {x:r*Math.cos(a),y,z:r*Math.sin(a),h:155+35*t};});
function draw(){if(!ctx)return;const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const a=+$('angle').value*Math.PI/180,scale=Math.min(w*.28,h*.31);function project(p){let x=p.x*Math.cos(a)+p.z*Math.sin(a),z=-p.x*Math.sin(a)+p.z*Math.cos(a);return {x:w/2+x*scale,y:h/2-p.y*scale+z*scale*.23,z};}
ctx.strokeStyle='#55737544';ctx.lineWidth=1;for(let i=-3;i<=3;i++){for(const swap of [false,true]){let p=project({x:swap?-2:i*.6,y:-1.08,z:swap?i*.6:-2}),q=project({x:swap?2:i*.6,y:-1.08,z:swap?i*.6:2});ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
let count=+$('density').value;const step=stage===1?7:1;const visible=[];for(let i=0;i<count;i+=step){const p=points[Math.floor(i*2800/count)],q=project(p);visible.push({...q,h:p.h});}visible.sort((a,b)=>a.z-b.z);for(const p of visible){const radius=stage<2?1.5:stage===2?5:3.5;ctx.fillStyle=`hsla(${p.h},${stage===1?30:60}%,${50+p.z*18}%,${stage<2?.8:.55})`;ctx.beginPath();ctx.ellipse(p.x,p.y,radius,radius*(stage>=2?.7:1),a,0,Math.PI*2);ctx.fill();}
if(stage<2){for(let i=0;i<8;i++){const t=i*Math.PI/4,p=project({x:1.65*Math.cos(t),y:.1,z:1.65*Math.sin(t)});ctx.strokeStyle='#b7f7d44d';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(w/2,h/2);ctx.stroke();ctx.fillStyle='#182e30';ctx.fillRect(p.x-13,p.y-9,26,18);ctx.strokeStyle='#a8d5bc';ctx.strokeRect(p.x-13,p.y-9,26,18);ctx.fillStyle='#b7f7d4';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(String(i+1).padStart(2,'0'),p.x,p.y+3);}}
}
for(const id of ['angle','density'])$(id).addEventListener('input',()=>{$(id+'-value').textContent=$(id).value+(id==='angle'?'°':'');draw();});
new ResizeObserver(draw).observe(canvas.parentElement);
setStage(0);setHuman(0);
$('gpu-status').textContent=navigator.gpu?'本浏览器暴露了 WebGPU 接口；实际可用性、显存与训练速度仍需在官方应用中验证。':'本浏览器未暴露 WebGPU 接口；可以阅读本页，真实训练需要支持 WebGPU 的设备与浏览器。';
