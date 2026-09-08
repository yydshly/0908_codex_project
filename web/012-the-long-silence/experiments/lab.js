// Research-only controls over the pinned upstream game's existing helpers.
const panel = document.createElement('aside');
panel.id = 'research-panel';
panel.innerHTML = `<style>
#research-panel{position:fixed;z-index:9999;right:18px;top:18px;width:270px;padding:18px;border:1px solid #61767588;border-radius:14px;background:#101b22eb;color:#e3efee;font:13px/1.6 system-ui;box-shadow:0 10px 40px #0005}#research-panel *{box-sizing:border-box}#research-panel h2{font-size:17px;margin:0 0 8px}#research-panel p{margin:7px 0;color:#afc4c6}#research-panel button{font:inherit;cursor:pointer;color:#e3efee;background:#243940;border:1px solid #506366;border-radius:7px;padding:7px 9px;text-align:left}#research-panel button:hover{background:#36545b}#research-panel button:disabled{opacity:.4;cursor:wait}#research-panel .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}#lab-status{white-space:pre-line;font-size:12px}#lab-toggle{width:100%;margin-top:8px}#research-panel.folded .body{display:none}#research-panel.folded{width:150px}#research-panel a{color:#8fddd1}#lab-message{color:#b7e4ad!important}#research-panel pre{white-space:pre-wrap;max-height:160px;overflow:auto;font:11px/1.4 monospace}
</style><h2>深空探索 · 能力展示</h2><div class="body"><p>新增的中文快捷入口，调用原版场景与渲染。场景定位会移动飞船，不代表已完成探索任务。</p><div class="grid">
${[['cabin','驾驶舱'],['terran','类地行星'],['gas','气态巨行星'],['rings','星环'],['ship','飞船近景'],['ground','行星着陆'],['foot','地面步行'],['lift','起飞'],['map','星图'],['archive','探索档案'],['scan','扫描目标'],['fold','折叠航行']].map(([k,v])=>`<button data-scene="${k}" disabled>${v}</button>`).join('')}
</div><p id="lab-message" role="status">等待原版加载完成后，点击开始。</p><p id="lab-status"></p><p>自由操作：点击画面捕获鼠标，Esc 释放；W/S 油门，方向键转向，X 停船，V 视角，F 扫描，L 着陆。</p><a href="http://127.0.0.1:8012/" target="_blank" rel="noopener">中文研究导览 ↗</a><details><summary>运行记录</summary><pre id="lab-events"></pre></details></div><button id="lab-toggle">收起面板</button>`;
document.body.append(panel);
const labFlags=new URLSearchParams(location.search);
if(labFlags.get('groundfast')==='1'){
 const note=document.createElement('p');note.textContent='地表诊断：低画质建议；着陆跳过下降动画与预编译等待。正常着陆问题尚未修复。';panel.querySelector('.body').prepend(note);
}
panel.addEventListener('keydown',e=>e.stopPropagation());
panel.addEventListener('keyup',e=>e.stopPropagation());
panel.addEventListener('pointerdown',e=>e.stopPropagation());
for(const type of ['mousedown','mouseup','click','wheel'])panel.addEventListener(type,e=>e.stopPropagation());
const message=panel.querySelector('#lab-message');
const events=[];
const record=(s)=>{events.push(new Date().toISOString()+' '+s);panel.querySelector('#lab-events').textContent=events.join('\n');};
window.addEventListener('error',e=>record('ERROR '+e.message));
window.addEventListener('unhandledrejection',e=>record('REJECTION '+String(e.reason)));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false;
function closePanels(g){g.starmap.close();g.codex.close();g.director.stop();g.inspect({off:true});g.cancelAutopilot();}
async function orbit(g){closePanels(g);if(g.landed){await g.liftOff({now:true});g.director.stop();}g.mode='exterior';g.ship.object.visible=true;g.setLayer('hud',true);}
function world(g,type){const b=g.bodies.find(b=>b.spec?.type===type);if(!b)throw Error('当前星系没有此类行星，请先通过星图探索其他星系。');return b;}
async function run(scene){
 const g=window.__game;if(!g?.started||busy)return;busy=true;message.textContent='正在准备场景…';
 try {
  if(['terran','gas','rings','ship','ground','cabin','scan','fold'].includes(scene))await orbit(g);
  if(['terran','gas','rings','ship','ground','cabin','scan'].includes(scene)){
   const b=scene==='rings'?g.bodies.find(b=>b.spec?.rings):world(g,scene==='gas'?'gas':'terran');
   if(!b)throw Error('当前星系没有星环。');
   g.pose({bodyRef:b,dist:scene==='ship'?7:scene==='scan'?3:1.95,phase:scene==='rings'?110:65,elev:scene==='rings'?24:8,frame:scene==='scan'?0:1.3,throttle:0});
  }
  if(scene==='ship')g.inspect({dist:1.15,az:214,el:14,fov:28});
  if(scene==='cabin'){
   g.player.mode='walk';g.mode='walk';g.player.station=g.interior.stations.find(s=>s.id==='seat');
   g.player.pos.copy(g.player.station.pos);g.player.pos.y=0;g.interact();
  }
  if(scene==='ground'){
   const fast=new URLSearchParams(location.search).get('groundfast')==='1';
   await g.land(g.target,fast?{now:true}:{});if(fast){g.director.stop();record('DIAGNOSTIC land({now:true}) skips descent/precompile wait');}await delay(250);
  }
  if(scene==='foot'){if(!g.landed)throw Error('请先点击「行星着陆」。');if(!g.landed.onFoot)g.disembark();g.player.pos.set(26,0,34);g.player.yaw=Math.atan2(-26,-34)+.9;g.player.pitch=-.12;}
  if(scene==='lift'){if(!g.landed)throw Error('飞船当前已在太空。');await g.liftOff();}
  if(scene==='map')g.starmap.toggle();
  if(scene==='archive')g.codex.toggle();
  if(scene==='scan'){
   // Feed the original scanner's held-button path, without awarding discoveries.
   g.input.touchBtn.add('scan');try{await delay(5500);}finally{g.input.touchBtn.delete('scan');}
   if(!g.discoveries.size)throw Error('尚未完成扫描，可对准目标后按住 F 重试。');
  }
  if(scene==='fold'){g.pose({bodyRef:world(g,'gas'),dist:40,phase:40,elev:10});g.ship.foldCharge=1;g.toggleFold();}
  message.textContent='已进入：'+panel.querySelector(`[data-scene="${scene}"]`).textContent+(scene==='fold'?'（演示补充驱动电量；J 可退出）':scene==='ground'&&labFlags.get('groundfast')==='1'?'（直接地表诊断，已跳过过渡）':'');record('OK '+scene);
 }catch(e){message.textContent=e.message;record('FAIL '+scene+' '+e.message);}finally{busy=false;}
}
panel.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.scene)));
panel.querySelector('#lab-toggle').onclick=()=>{panel.classList.toggle('folded');panel.querySelector('#lab-toggle').textContent=panel.classList.contains('folded')?'展开能力面板':'收起面板';};
setInterval(()=>{
 const g=window.__game,ready=!!g?.started;
 panel.querySelectorAll('[data-scene]').forEach(b=>b.disabled=!ready||busy||!!g?.transition);
 if(!ready)return;
 if(message.textContent==='等待原版加载完成后，点击开始。')message.textContent='已就绪，选择场景开始体验。';
 const gl=g.renderer.getContext(), ext=gl.getExtension('WEBGL_debug_renderer_info');
 panel.querySelector('#lab-status').textContent=`星系 ${g.currentSystemId+1}/${g.galaxy.length} · ${g.system.star.name}\n模式 ${g.mode}${g.landed?' / 已着陆':''} · 扫描 ${g.discoveries.size}\n速度 ${g.ship.speed.toFixed(1)} km/s · 折叠 ${g.ship.foldMode?'开':'关'}\n帧率 ${g.engine.fps.toFixed(1)} · 像素比 ${g.engine.pixelRatio.toFixed(2)}\n绘制 ${g.engine.drawCalls} 次 · ${ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'WebGL2'}`;
},800);
