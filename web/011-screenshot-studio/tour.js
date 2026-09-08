(() => {
  'use strict';
  const cards = [
    ['input','截图、拖放与替换','Choose File / Add Slide','已实测 PNG','下载练习截图并上传；再加入第二张自己的界面截图，观察画面如何适配画布。','原图内容保持不变，后续编辑修改呈现方式。','/'],
    ['input','网址 → 网页截图','初始画面 · Enter website URL','接口已返回图片','在新画布输入 https://example.com，选择 Light / Dark 后获取。服务端调用 Microlink，等待截图返回。','这一步是实际获取网页内容；需要网络，与上传本地图片不同。','/'],
    ['input','推文 → 展示卡片','Design → Add a Tweet','依赖外部服务','输入一条可公开访问的 X 推文链接，获取后调整卡片与背景。私有或已删除内容无法保证获取。','文字、头像与元信息形成可排版的卡片，获取结果受外部服务影响。','/'],
    ['design','背景、渐变与光影','BG → Mesh / Paper / Light & Shadow','已切换素材','展开背景分类，选择 Mesh；继续试 Paper、纯色、Transparent 和自定义背景，叠加光影。','相同截图可以从柔和产品图变成纸张、海报或透明素材。','/'],
    ['design','截图样式与浏览器外框','Image / Browser → Style','已实测 Chrome','先试玻璃、边框、圆角和阴影，再切 Browser，选择 Chrome 或 Safari 并编辑 URL。','外框帮助交代软件环境；阴影、留白与比例决定层次。','/'],
    ['design','手机、手表与电脑套壳','Device → Phone / Watch / Laptop','已实测手机','选择 iPhone 17 Pro；再比较 Watch 和 Laptop 家族。使用适合设备比例的截图，调整大小和位置。','设备是带屏幕区域的展示外壳，宽图放入手机时要留意裁切。','/'],
    ['design','三维透视与构图','右侧 3D → 预设 / Fine Tune','原版入口','选择透视预设，再调整旋转、深度、缩放与位置。轻微倾斜适合产品配图，正面更适合阅读。','它变换的是截图平面，不会重建可交互三维模型。','/'],
    ['layers','文字排版','Image → Design → Add Text','已新增中文文字','展开 Add Text 并新增文字，输入标题，试字体、粗细、字号、颜色、透明度与阴影。','文字是独立图层，可以与主体截图分别调整。','/'],
    ['layers','箭头、形状与局部模糊','Design → Draw & Markup','原版入口','展开面板，选择 Arrow / Curve / Line / Rect / Circle / Blur，再在画布拖出标注区域。','比较指向、圈选与遮挡三种表达；导出后检查遮挡范围。','/'],
    ['layers','叠加素材与图层管理','Layers → 3D Objects / Upload Image','已新增装饰图层','点选内置装饰素材或上传图片，移动、缩放并调整图层前后关系；也可删除多余图层。','这里的 3D Objects 是有立体外观的图像素材，适合点缀构图。','/'],
    ['layers','图片与背景滤镜','Design → Color Filters','原版入口','分别选择 Image 和 Background，尝试 Brightness、Contrast、Saturation、Grayscale、Sepia、Hue、Blur、Invert。','同一组调节可作用于主体或背景；去模糊恢复细节不在能力范围内。','/'],
    ['motion','动效预设与片段时间轴','Motion → 展开 Fade → Fade In → Animate','已导出真实动画','先展开 Fade 分类再点 Fade In 卡片。用 Animate 展开时间轴，确认出现片段；继续添加另一个动效并调整时长。','仅看到预设缩略图不表示已经加入动画；轨道中应出现片段名称。','/'],
    ['motion','多页展示','Add Slide → Export Video → Slideshow','已实测单页视频','加入不同截图，逐页设计，再选择 Slideshow 与每页时长。与 Animation 模式的单画布动效比较。','多页视频把不同截图组织为连续展示。多页组合尚未穷举验证。','/'],
    ['output','完整代码卡片','Code Images → Theme / Language','已实测 PNG','编辑代码，切 Forest / Midnight 等主题，试行号、深浅模式、背景开关、留白和 Mac 窗口，最后 Export Image。','当前下拉菜单为 14 种主题；关闭 Background 可制作透明素材。','/code'],
    ['output','图片格式、倍率与复制','Save / Copy','已实测 JPEG','在 Save 中比较 PNG、JPEG、WebP 与 1× / 2× / 3×；透明背景优先 PNG。Copy 用于粘贴到其他工具。','倍率提高输出像素，无法恢复原始位图缺失的细节；复制可能需要浏览器权限。','/'],
    ['output','动画视频导出','Export Video → Animation / Slideshow','已实测 MP4','先确保时间轴中有片段，再选择 Animation、MP4 或 WebM 与画质，等待逐帧渲染完成。','MP4 已验证 3 秒 / 180 帧；WebM 可选。GIF 仅确认底层路径，当前菜单无入口。','/'],
    ['service','模板、草稿与编辑辅助','Templates / Undo / Redo / 标尺 / 网格','部分入口已检查','应用预设后继续微调，尝试 Save Current as Preset；使用撤销、网格和标尺辅助排版。原版还有浏览器草稿保存逻辑。','模板复用视觉参数；浏览器草稿与导出文件是两种不同的保存方式。','/'],
    ['service','接口与部署分工','/docs → API documentation','本地接口可用','阅读原版接口说明，区分图片压缩、网页截图、推文获取、图片代理与缓存。需要集成时再研究请求参数。','编辑与视频主要在浏览器；Sharp 在本地服务端，在线获取依赖外部网络，远程缓存需另配。','/docs']
  ];
  // Each task has a concrete deliverable, a self-check and a common mistake.
  const training = [
    ['用同一张截图做两个不同留白的版本，保存其中更清楚的一张。','图中文字可读，主体完整；能说明留白对画面聚焦的影响。','输入图片过小，再放大导出也不会补回细节。','#lab'],
    ['获取 example.com 的网页截图，再为它选择一个合适的展示外框。','能区分网址获取与上传图片；知道获取失败时先检查网址和网络。','截图由外部服务获取，登录态和动态内容未必与本机浏览器一致。',''],
    ['导入一条公开推文，做一个浅色和一个深色背景版本。','作者、正文及链接信息清晰，没有被裁切；能解释卡片与普通截图的区别。','删除、私有或受限推文可能无法获取，不要把网络失败当作排版问题。',''],
    ['同一截图分别制作浅色、渐变、透明背景三个版本。','背景不抢正文；透明版在深色和浅色底上都能检查边缘。','装饰光影过重会压低主体对比度。','#gallery'],
    ['用 Chrome 和玻璃样式各做一张图，调整圆角与阴影。','能根据产品环境选择外框；边框不挤压内容，地址栏文字与作品一致。','外框只是展示元素，不会让截图内部按钮可操作。','#lab'],
    ['把合适比例的截图放入手机和电脑外壳，比较屏幕适配。','屏幕没有明显拉伸或关键内容裁切，设备与背景之间留白均衡。','横版后台截图直接塞入竖版手机会丢失细节。',''],
    ['做一个正面和一个轻度倾斜版本，比较不同用途。','能独立调整旋转与缩放；产品宣传有层次，教程版本保持可读。','过强透视会让远端文字变小；二维倾斜不等于三维重建。','#lab'],
    ['增加主标题和补充说明，建立两级文字层次。','标题优先被看见，字号、颜色和位置一致；缩小预览仍能读懂。','文字压住主体或使用太多字体，会削弱信息结构。','#lab'],
    ['用箭头解释一个按钮，用局部模糊遮挡一块虚构信息。','箭头准确指向目标，文字不遮挡操作区域；导出后检查模糊覆盖范围。','只有预览看起来遮住还不够，需要检查导出文件。','#lab'],
    ['加入一张装饰图和文字，调整它们与主截图的前后关系。','可以选择、移动、缩放并删除指定图层，不误改其他元素。','装饰图不是可旋转的真实三维对象；过多点缀容易抢主体。',''],
    ['先只调背景饱和度，再只调主体亮度，比较影响。','能分清 Image 与 Background 的作用对象，调整后截图文字仍清晰。','滤镜会改变颜色表达，产品色彩需要准确时应适度使用。',''],
    ['给截图加入 Fade In，再加入另一个动效，查看时间轴。','时间轴中出现片段名称；能调整时长并解释起止状态，播放时没有突跳。','预设缩略图的预览不等于动画已添加到轨道。','#lab'],
    ['用两张不同截图制作一段多页展示，每页停留足够阅读。','两页顺序正确，画布比例统一，导出视频能完整显示每一页。','Slideshow 的页面切换与 Animation 的单画布动效是不同流程。',''],
    ['用自己的代码做深色与浅色两张卡片，设置语言、行号和标题。','语法主题与语言匹配，长行不被截断，分享尺寸下仍能读懂。','代码页只排版代码，不会执行或验证程序是否正确。','#code-lab'],
    ['同一画面分别导出 PNG 与 JPEG，再比较 1× 与 2×。','能按透明度、清晰度和文件大小选择格式；检查导出尺寸与实际画面。','JPEG 不保留透明背景；倍率不是 AI 超分辨率。','#gallery'],
    ['导出一段约 3 秒的 MP4，完整播放并检查第一帧和最后一帧。','视频可播放、时长正确、主体无缺失；知道动画片段与 Slideshow 的选择位置。','逐帧导出需要等待；当前菜单没有 GIF 入口，不能照 README 寻找按钮。',''],
    ['从模板开始做一张图，撤销一次修改，再保存自己的预设。','能解释模板、浏览器草稿和成品文件分别保存什么，并再次找到自己的预设。','浏览器草稿不等于跨设备同步；重要作品要另行导出保存。',''],
    ['画出“输入 → 编辑 → 渲染 → 输出”的流程，标出服务端与外部调用。','能解释网页获取、图片压缩、视频编码和云端缓存的不同依赖。','本地可编辑不代表所有路径完全离线；云缓存需要单独配置。','#principle']
  ];
  const local = ['127.0.0.1','localhost','[::1]'].includes(location.hostname);
  const origin = local ? 'http://127.0.0.1:3011' : 'https://www.screenshot-studio.com';
  const key = 'screenshot-studio-full-tour-v1';
  const learningKey = 'screenshot-studio-learning-v1';
  const validIndex = n => Number.isInteger(n) && n >= 0 && n < cards.length;
  let done = new Set(), mastered = new Set(), notes = {};
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) done = new Set(saved.filter(validIndex));
    const learning = JSON.parse(localStorage.getItem(learningKey) || '{}');
    if (Array.isArray(learning?.mastered)) mastered = new Set(learning.mastered.filter(validIndex));
    if (learning?.notes && typeof learning.notes === 'object') {
      cards.forEach((_, i) => { if (typeof learning.notes[i] === 'string') notes[i] = learning.notes[i].slice(0,600); });
    }
    mastered.forEach(i => done.add(i));
  } catch {}
  let filter = 'all';
  const container = document.getElementById('tour-cards');
  if (!container) return;
  const storageStatus = document.createElement('p');
  storageStatus.className = 'ft-small'; storageStatus.id='learning-storage'; storageStatus.setAttribute('role','status');
  document.getElementById('reset-progress').after(storageStatus);
  function save() {
    try {
      localStorage.setItem(key,JSON.stringify([...done]));
      localStorage.setItem(learningKey,JSON.stringify({mastered:[...mastered],notes}));
      storageStatus.textContent='学习记录已保存到当前浏览器。'; return true;
    } catch { storageStatus.textContent='浏览器未允许保存，本次记录仅保留在当前页面。'; return false; }
  }
  cards.forEach(([group,title,path,badge,step,observe,route],index) => {
    const [goal,criterion,pitfall,lab] = training[index];
    const article=document.createElement('article'); article.className='ft-card'; article.dataset.group=group; article.dataset.index=index; article.id=`ability-${index+1}`;
    article.innerHTML=`<div class="ft-card-top"><span class="ft-card-number">${String(index+1).padStart(2,'0')}</span><span class="ft-badge"></span></div><h3></h3><p class="ft-path"></p><p class="ft-step"></p><p class="ft-observe"><b>这项能力的作用</b><br><span></span></p><details class="ft-training"><summary>练习与自检</summary><dl><dt>练习目标</dt><dd class="ft-goal"></dd><dt>完成标准</dt><dd class="ft-criterion"></dd><dt>常见问题</dt><dd class="ft-pitfall"></dd></dl><a class="ft-local-link">先在本页做基础练习 ↓</a><label>我的练习笔记<textarea maxlength="600" rows="3" placeholder="记录这次完成的作品、遇到的问题，以及下次要改进什么…"></textarea></label><p class="ft-note-status" role="status"></p></details><div class="ft-card-bottom"><label><input class="ft-practiced" type="checkbox">已体验</label><label><input class="ft-mastered" type="checkbox">可独立完成</label><a target="_blank" rel="noopener">打开原版 ↗</a></div>`;
    article.querySelector('.ft-badge').textContent=badge; article.querySelector('h3').textContent=title; article.querySelector('.ft-path').textContent=path; article.querySelector('.ft-step').textContent=step; article.querySelector('.ft-observe span').textContent=observe;
    article.querySelector('.ft-goal').textContent=goal; article.querySelector('.ft-criterion').textContent=criterion; article.querySelector('.ft-pitfall').textContent=pitfall;
    article.querySelector('.ft-training summary').setAttribute('aria-label',`练习与自检：${title}`);
    article.querySelector('.ft-card-bottom>a').href=origin+route;
    const basic=article.querySelector('.ft-local-link'); if(lab)basic.href=lab;else basic.hidden=true;
    const checkbox=article.querySelector('.ft-practiced'), mastery=article.querySelector('.ft-mastered');
    checkbox.setAttribute('aria-label',`已体验：${title}`); mastery.setAttribute('aria-label',`可独立完成：${title}`);
    checkbox.addEventListener('change',()=>{if(checkbox.checked)done.add(index);else{done.delete(index);mastered.delete(index);}save();refresh();});
    mastery.addEventListener('change',()=>{if(mastery.checked){mastered.add(index);done.add(index);}else mastered.delete(index);save();refresh();});
    const note=article.querySelector('textarea'); note.value=notes[index]||''; note.setAttribute('aria-label',`练习笔记：${title}`);
    note.addEventListener('input',()=>{notes[index]=note.value;const saved=save();article.querySelector('.ft-note-status').textContent=saved?`已保存 · ${note.value.length} / 600`:'本次笔记暂存于当前页面。';});
    container.append(article);
  });
  function refresh(){
    container.querySelectorAll('.ft-card').forEach(card=>{
      const i=Number(card.dataset.index),checked=done.has(i),complete=mastered.has(i);
      card.classList.toggle('is-done',checked);card.classList.toggle('is-mastered',complete);
      card.querySelector('.ft-practiced').checked=checked;card.querySelector('.ft-mastered').checked=complete;
      card.hidden=filter==='todo'?checked:filter==='improve'?(!checked||complete):filter!=='all'&&card.dataset.group!==filter;
    });
    document.getElementById('progress-count').textContent=`${done.size} / ${cards.length}`;document.getElementById('tour-progress').value=done.size;
    document.getElementById('mastery-count').textContent=`${mastered.size} / ${cards.length}`;document.getElementById('mastery-progress').value=mastered.size;
    const empty=document.getElementById('tour-empty');
    empty.hidden=Boolean(container.querySelector('.ft-card:not([hidden])'));
    empty.textContent=filter==='improve'?(done.size===0?'还没有标记为已体验的能力。先完成一次练习，再查看需要巩固的内容。':'已体验的能力都已标记为可独立完成，可以选择尚未体验的项目继续学习。'):'当前分类已全部体验，可以切换“全部”继续复习。';
    const next=cards.findIndex((_,i)=>!mastered.has(i));
    document.getElementById('next-title').textContent=next<0?'把单项能力组合成完整作品':`${String(next+1).padStart(2,'0')} / ${cards[next][1]}`;
    document.getElementById('next-description').textContent=next<0?'完成下方三个综合练习，尝试用新的素材独立复现。':training[next][0];
    document.getElementById('next-practice').href=next<0?'#practice-projects':`#ability-${next+1}`;
    document.getElementById('next-practice').textContent=next<0?'开始综合练习 ↓':'查看练习 ↓';
  }
  function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));refresh();}
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
  document.getElementById('next-practice').addEventListener('click',event=>{setFilter('all');const target=document.querySelector(event.currentTarget.getAttribute('href'));if(target?.classList.contains('ft-card'))target.querySelector('details').open=true;});
  document.getElementById('reset-progress').addEventListener('click',()=>{done.clear();mastered.clear();save();refresh();storageStatus.textContent='学习进度已清空，练习笔记仍保留。';});
  document.querySelectorAll('[data-original]').forEach(a=>a.href=origin+a.dataset.original);
  async function check(){
    const status=document.getElementById('service-status'),button=document.getElementById('check-service');
    if(!local){status.textContent='当前使用官方在线入口。';button.hidden=true;return;}
    button.disabled=true;status.textContent='正在检测本地原版…';
    try{const response=await fetch(origin+'/api/local-health',{signal:AbortSignal.timeout(8000),cache:'no-store'});const data=await response.json();if(data.app!=='screenshot-studio')throw new Error();status.textContent='● 本地原版已运行 · 可打开完整编辑器与代码卡片';}
    catch{status.textContent='本地原版尚未就绪，请查看“本地编辑器打不开时”的启动说明；首页练习指导仍可使用。';}
    finally{button.disabled=false;}
  }
  document.getElementById('check-service').addEventListener('click',check);
  refresh();check();
  // Reveal a bookmarked capability even when it is below the initial viewport.
  if (/^#ability-\d+$/.test(location.hash)) document.querySelector(location.hash)?.scrollIntoView();
})();
