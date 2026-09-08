/* Original educational demo. Upstream source references are pinned below. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const modes = {
    beautify: {number:'01',title:'让截图更有层次',description:'背景、留白、圆角和阴影，让普通截图成为可以直接使用的产品配图。',insight:'改变的是呈现方式。',detail:'截图中的文字、图表和界面内容保持原样；背景与光影帮助读者聚焦产品。',use:'官网配图 / 产品发布',frame:'none',bg:'mint',caption:'让想法，被看见。'},
    frame: {number:'02',title:'为界面加一个外框',description:'将截图放入窗口或玻璃外框，帮助读者理解产品所在的使用环境。',insight:'外框也是一种视觉语境。',detail:'三色按钮与地址栏都是装饰元素，不会让截图变成可操作的浏览器。',use:'产品演示 / 作品集',frame:'browser',bg:'paper',caption:'一个窗口，打开更多可能。'},
    perspective: {number:'03',title:'给平面一点空间感',description:'拖动倾斜滑杆，观察二维截图如何通过透视与投影呈现悬浮感。',insight:'平面倾斜，产生立体观感。',detail:'变换只作用于截图平面，不会生成图中物体的背面，也不会重建三维模型。',use:'官网首屏 / 宣传海报',frame:'mac',bg:'lilac',caption:'换个角度，看见细节。'},
    annotate: {number:'04',title:'让重点更容易被找到',description:'修改标注文字，拖动水平与垂直滑杆，将说明放到希望读者关注的位置。',insight:'为读者提供清晰的阅读顺序。',detail:'本页可编辑一组文字与箭头的位置；原库还提供更多形状、图片叠加和局部模糊功能。',use:'操作教程 / 问题反馈',frame:'browser',bg:'peach',caption:'把注意力，留给重点。'},
    motion: {number:'05',title:'让静态画面动起来',description:'播放或拖动时间轴，观察位置、倾斜和透明度如何随时间连续变化。',insight:'动画是参数的连续变化。',detail:'4 秒入场演示移动的是整张截图。本页导出当前静帧，视频请使用原版工具；当前菜单提供 MP4 / WebM。',use:'功能发布 / 短时展示',frame:'glass',bg:'mint',caption:'让每一次出现，都有节奏。'}
  };
  const stage = $('stage'), shot = $('shot'), source = $('source-image');
  let mode='beautify', background='mint', raw=false, playing=false, raf=0, elapsed=2200, busy=false, imageURL=null;
  const defaults={padding:44,radius:12,shadow:24,rotate:-18};
  const status = (text) => { $('status').textContent=text; };
  function fitStage() {
    const parent=stage.parentElement;
    const scale=Math.min(parent.clientWidth/800,parent.clientHeight/620);
    stage.style.transform=`scale(${scale})`;
    stage.style.position='absolute';
    stage.style.left=`${(parent.clientWidth-800*scale)/2}px`;
    stage.style.top=`${(parent.clientHeight-620*scale)/2}px`;
  }
  new ResizeObserver(fitStage).observe(stage.parentElement);
  function setBackground(name) {
    background=name; stage.dataset.background=name;
    document.querySelectorAll('[data-bg]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bg===name)));
  }
  function stop() {
    playing=false;cancelAnimationFrame(raf);$('play').textContent='▶ 播放';$('play').setAttribute('aria-label','播放动画');
  }
  function updateFrame() {
    shot.dataset.frame=$('frame').value;
    $('window-title').textContent=$('frame').value==='browser'?'folio.design / overview':'Folio — 工作空间';
  }
  function renderMotion() {
    const t=elapsed/4000;
    const p=Math.min(1,t/0.65), e=1-Math.pow(1-p,3);
    stage.style.setProperty('--rotate',`${-26*(1-e)}deg`);
    stage.style.setProperty('--pitch',`${12*(1-e)}deg`);
    stage.style.setProperty('--y',`${60*(1-e)}px`);
    stage.style.setProperty('--scale',String(.84+.16*e));
    stage.style.setProperty('--opacity',String(Math.min(1,t/.2)));
    $('timeline').value=String(Math.round(t*1000));$('time-label').textContent=`${(elapsed/1000).toFixed(1)} / 4.0 s`;
  }
  function updateTransform() {
    ['--rotate','--pitch','--y','--scale','--opacity'].forEach(k=>stage.style.removeProperty(k));
    if(mode==='perspective') {stage.style.setProperty('--rotate',`${$('rotate').value}deg`);stage.style.setProperty('--pitch','9deg');stage.style.setProperty('--scale','.94');}
    if(mode==='motion') renderMotion();
  }
  function setRaw(value) {
    raw=value;stage.classList.toggle('raw',raw);$('compare').setAttribute('aria-pressed',String(raw));
    $('compare').textContent=raw?'返回效果':'查看原图';$('preview-label').textContent=raw?'原始截图 · 无展示包装':'效果预览';
    if(raw)stop();$('play').disabled=raw;
  }
  function selectMode(name) {
    if(busy)return;stop();mode=name;const m=modes[name];setRaw(false);
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===name)));
    $('mode-number').textContent=`CAPABILITY ${m.number}`;$('mode-title').textContent=m.title;$('mode-description').textContent=m.description;
    $('insight-title').textContent=m.insight;$('insight-text').textContent=m.detail;$('use-tag').textContent=m.use;
    $('frame').value=m.frame;updateFrame();setBackground(m.bg);$('caption').value=m.caption;$('stage-title').textContent=m.caption;
    $('perspective-fields').hidden=name!=='perspective';$('motion-strip').hidden=name!=='motion';stage.classList.toggle('annotated',name==='annotate');
    $('annotation-fields').hidden=name!=='annotate';
    elapsed=2200;updateTransform();status(name==='motion'?'点击播放，或拖动时间轴查看任意时刻。':'');
  }
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>selectMode(b.dataset.mode)));
  document.querySelectorAll('[data-bg]').forEach(b=>b.addEventListener('click',()=>setBackground(b.dataset.bg)));
  $('frame').addEventListener('change',updateFrame);
  for(const id of Object.keys(defaults)) {
    $(id).addEventListener('input',()=>{
      $(`${id}-value`).textContent=$(id).value+(id==='rotate'?'°':'');
      if(id==='padding')stage.style.setProperty('--pad',`${$(id).value}px`);
      if(id==='radius')stage.style.setProperty('--radius',`${$(id).value}px`);
      if(id==='shadow')stage.style.setProperty('--shadow',$(id).value);
      if(id==='rotate')updateTransform();
    });
  }
  $('caption').addEventListener('input',()=>{$('stage-title').textContent=$('caption').value;});
  function updateAnnotation() {
    $('annotation').querySelector('span').textContent=$('annotation-text').value;
    for(const axis of ['x','y']){
      const val=$(`annotation-${axis}`).value;
      $(`annotation-${axis}-value`).textContent=val+'%';
      $('annotation').style[axis==='x'?'left':'top']=val+'%';
    }
  }
  ['annotation-text','annotation-x','annotation-y'].forEach(id=>$(id).addEventListener('input',updateAnnotation));
  $('compare').addEventListener('click',()=>{if(!busy)setRaw(!raw);});
  $('play').addEventListener('click',()=>{
    if(busy||raw)return;if(playing){stop();return;}
    if(elapsed>=4000)elapsed=0;
    playing=true;$('play').textContent='Ⅱ 暂停';$('play').setAttribute('aria-label','暂停动画');
    const start=performance.now()-elapsed;
    function tick(now) {if(!playing)return;elapsed=Math.min(4000,now-start);renderMotion();if(elapsed>=4000){stop();return;}raf=requestAnimationFrame(tick);}
    raf=requestAnimationFrame(tick);
  });
  $('timeline').addEventListener('input',()=>{stop();elapsed=Number($('timeline').value)*4;renderMotion();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  function lock(value) {
    busy=value;$('control-fields').disabled=value;
    document.querySelectorAll('[data-mode],#compare,#play,#timeline,#upload,#reset,#export').forEach(el=>el.disabled=value);
    if(!value)$('play').disabled=raw;
  }
  $('upload').addEventListener('change',async()=>{
    const file=$('upload').files[0];if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)){status('请选择 PNG、JPEG 或 WebP 图片。');$('upload').value='';return;}
    if(file.size>15*1024*1024){status('图片超过 15 MB，请选择较小的截图。');$('upload').value='';return;}
    stop();lock(true);status('正在读取截图…');let nextURL=null;
    try {
      nextURL=URL.createObjectURL(file);const test=new Image();test.src=nextURL;await test.decode();
      if(test.naturalWidth*test.naturalHeight>40000000)throw new Error('图片像素过大，请缩小到 4000 万像素以内。');
      if(imageURL)URL.revokeObjectURL(imageURL);imageURL=nextURL;nextURL=null;
      source.src=imageURL;source.alt='用户上传的截图';await source.decode();
      $('image-info').textContent=`本地截图 · ${test.naturalWidth} × ${test.naturalHeight}`;
      setRaw(false);status('截图已替换。可切换效果继续调整，图片不会上传。');
    }catch(error){status(error.message.startsWith('图片')?error.message:'无法读取此图片，请换一张有效截图。');}
    finally{if(nextURL)URL.revokeObjectURL(nextURL);$('upload').value='';lock(false);}
  });
  $('reset').addEventListener('click',()=>{
    if(busy)return;stop();if(imageURL){URL.revokeObjectURL(imageURL);imageURL=null;}
    source.src='./assets/sample.svg';source.alt='用于演示的 Folio 项目管理界面，包含任务进度和项目列表';$('image-info').textContent='原创示例界面 · 画面内容保持不变';
    for(const [key,val] of Object.entries(defaults)){$(key).value=val;$(key).dispatchEvent(new Event('input'));}
    $('annotation-text').value='关注这里';$('annotation-x').value=53;$('annotation-y').value=18;updateAnnotation();
    selectMode('beautify');status('已恢复默认示例。');
  });
  $('export').addEventListener('click',async()=>{
    if(busy)return;stop();lock(true);status('正在生成 1600 × 1240 PNG…');$('export').textContent='正在导出…';
    let clone=null, mount=null;
    try {
      if(!window.modernScreenshot)throw new Error('导出组件未加载，请刷新页面后重试。');
      await source.decode();await document.fonts.ready;
      // Capture an unscaled clone so export dimensions do not depend on viewport.
      mount=document.createElement('div');Object.assign(mount.style,{position:'fixed',left:'-12000px',top:'0',width:'800px',height:'620px'});
      clone=stage.cloneNode(true);clone.id='export-stage';clone.style.transform='none';clone.style.position='relative';clone.style.left='0';clone.style.top='0';
      clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      // ID-only styling on the address label is replaced for the standalone clone.
      if($('frame').value==='browser')Object.assign(clone.querySelector('.window-bar>span').style,{background:'#eff2ef',borderRadius:'4px',minWidth:'55%',textAlign:'center',padding:'4px'});
      mount.appendChild(clone);document.body.appendChild(mount);
      const blob=await window.modernScreenshot.domToBlob(clone,{width:800,height:620,scale:2,type:'image/png',style:{position:'relative',left:'0',top:'0',transform:'none'},features:{copyScrollbar:false}});
      if(!blob)throw new Error('图片生成失败，请稍后重试。');
      const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`screenshot-studio-${mode}${raw?'-original':''}.png`;link.click();
      setTimeout(()=>URL.revokeObjectURL(url),60000);status(`已生成 PNG（1600 × 1240，${Math.round(blob.size/1024)} KB）。${mode==='motion'?'已保存当前静帧。':''}`);
    }catch(error){status(`导出失败：${error.message||'请稍后重试。'}`);}
    finally{mount?.remove();lock(false);$('export').textContent='↓ 导出当前画面';}
  });
  const base='https://github.com/opennookorg/screenshot-studio/blob/7c7a38a65a547aa081cb86bf489d27be44aeb4f7/';
  const links=[['功能清单','README.md'],['HTML 画布','components/canvas/html/HTMLCanvasRenderer.tsx'],['透视变换','components/canvas/overlays/Perspective3DOverlay.tsx'],['图片导出','lib/export/export-service.ts'],['服务端压缩','lib/export/sharp-client.ts'],['动画编码','lib/export-slideshow-video.ts'],['网页截图','app/api/screenshot/route.ts']];
  for(const [label,path] of links){const a=document.createElement('a');a.href=base+path;a.textContent=label+' ↗';a.target='_blank';a.rel='noopener noreferrer';$('source-links').appendChild(a);}
  fitStage();
})();
