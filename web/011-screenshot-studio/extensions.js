/* Original code-card and comparison demos. Code input is displayed, never executed. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const samples={
    javascript:{title:'showcase.js',label:'JS',code:'// 让一张截图拥有更好的出场方式\nconst style = {\n  background: "mint",\n  radius: 16,\n  shadow: 24\n};\n\nfunction showcase(screenshot) {\n  return { image: screenshot, ...style };\n}\n\nconsole.log("让想法，被看见。");'},
    python:{title:'showcase.py',label:'PY',code:'# 内容不变，表达可以更好\ndef make_card(screenshot):\n    style = {\n        "background": "mint",\n        "radius": 16,\n        "shadow": 24\n    }\n    return {"image": screenshot, **style}\n\nprint("让想法，被看见。")'},
    json:{title:'showcase.json',label:'JSON',code:'{\n  "title": "让想法，被看见。",\n  "background": "mint",\n  "frame": "browser",\n  "radius": 16,\n  "shadow": 24,\n  "export": {\n    "format": "png",\n    "scale": 2\n  }\n}'}
  };
  const input=$('code-input'),card=$('code-card'),output=card.querySelector('.code-output');
  let exporting=false, valid=true;
  const message=text=>{$('code-status').textContent=text;};
  function fitCode() {
    const parent=card.parentElement,scale=Math.min(1,parent.clientWidth/660);
    card.style.transform=`scale(${scale})`;
    card.style.left=`${Math.max(0,(parent.clientWidth-660*scale)/2)}px`;
    parent.style.height=`${Math.ceil(card.offsetHeight*scale)}px`;
  }
  function renderCode() {
    const text=input.value;
    valid=text.length<=2000 && text.split('\n').length<=60;
    $('code-export').disabled=!valid||exporting;
    const shown=valid?text:text.split('\n').slice(0,60).join('\n').slice(0,2000);
    output.replaceChildren();
    // A small lexer for presentation; text nodes prevent markup from becoming HTML.
    const tokens=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|\b(const|let|var|function|return|async|await|if|else|for|while|class|new|import|from|export|def|in|True|False|None|true|false|null|print)\b|\b(\d+(?:\.\d+)?)\b/g;
    let cursor=0;
    for(const match of shown.matchAll(tokens)){
      output.append(document.createTextNode(shown.slice(cursor,match.index)));
      const span=document.createElement('span');span.className=match[1]?'token-string':match[2]?'token-comment':match[3]?'token-keyword':'token-number';span.textContent=match[0];output.append(span);cursor=match.index+match[0].length;
    }
    output.append(document.createTextNode(shown.slice(cursor)||(!shown?' ':'')));
    card.querySelector('.code-file').textContent=$('code-title').value||'untitled';
    card.querySelector('.code-language-label').textContent=samples[$('code-language').value].label;
    card.dataset.theme=$('code-theme').value;
    if(!exporting)message(valid?'基础语法高亮演示，支持中文与长行换行。':'超过 60 行或 2,000 字符；预览只展示范围内内容，请缩短后再导出。');
    fitCode();
  }
  function loadSample(){const sample=samples[$('code-language').value];input.value=sample.code;$('code-title').value=sample.title;renderCode();}
  ['code-input','code-title'].forEach(id=>$(id).addEventListener('input',renderCode));
  ['code-language','code-theme'].forEach(id=>$(id).addEventListener('change',renderCode));
  $('code-sample').addEventListener('click',loadSample);
  new ResizeObserver(fitCode).observe(card.parentElement);
  function lock(value){exporting=value;['code-input','code-title','code-language','code-theme','code-sample','code-export'].forEach(id=>$(id).disabled=value);if(!value)$('code-export').disabled=!valid;}
  $('code-export').addEventListener('click',async()=>{
    if(exporting||!valid)return;lock(true);message('正在生成代码卡片…');let mount;
    try{
      if(!window.modernScreenshot)throw new Error('导出组件未加载，请刷新页面。');
      await document.fonts.ready;
      mount=document.createElement('div');Object.assign(mount.style,{position:'fixed',left:'-12000px',top:'0',width:'660px'});
      const clone=card.cloneNode(true);clone.removeAttribute('id');Object.assign(clone.style,{position:'relative',left:'0',top:'0',transform:'none'});
      mount.appendChild(clone);document.body.appendChild(mount);
      const height=clone.offsetHeight;
      const blob=await modernScreenshot.domToBlob(clone,{width:660,height,scale:2,type:'image/png',features:{copyScrollbar:false}});
      if(!blob)throw new Error('未能生成图片，请重试。');
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`screenshot-studio-code-${$('code-language').value}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
      message(`代码卡片已生成：1320 × ${height*2} PNG，${Math.round(blob.size/1024)} KB。`);
    }catch(error){message(`导出失败：${error.message}`);}finally{mount?.remove();lock(false);}
  });
  const examples={
    beautify:['背景与光影','添加渐变背景、标题和阴影的实际导出图片','留白分隔画面，渐变建立氛围，阴影让主体从背景中浮现。原始界面内容保持不变。'],
    frame:['窗口外框','添加浏览器外框和标题的实际导出图片','地址栏与窗口边缘帮助读者理解软件的使用环境。装饰外框不会改变截图内部内容。'],
    perspective:['透视倾斜','带倾斜和立体投影的实际导出图片','二维平面通过透视旋转形成空间感。倾斜越大，界面文字通常越难读，需要在展示与说明之间取舍。'],
    annotate:['说明与箭头','带说明卡片、箭头和高亮框的实际导出图片','标注引导阅读顺序。先确定要说明什么，再把箭头和文字放到对应位置，避免遮住关键内容。']
  };
  document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.example,[title,alt,description]=examples[key];
    document.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $('example-title').textContent=title;$('example-image').src=`./assets/gallery/${key}.png`;$('example-image').alt=alt;$('example-description').textContent=description;
  }));
  const recipes={product:{mode:'perspective',bg:'lilac',title:'新功能，换个角度看。',padding:65,rotate:-12},tutorial:{mode:'annotate',bg:'paper',title:'三步完成你的第一个项目。',padding:44,radius:8},social:{mode:'beautify',bg:'peach',title:'一个想法，值得分享。',padding:75,radius:24}};
  document.querySelectorAll('[data-recipe]').forEach(button=>button.addEventListener('click',()=>{
    if($('export').disabled)return;
    const recipe=recipes[button.dataset.recipe];document.querySelector(`[data-mode="${recipe.mode}"]`).click();document.querySelector(`[data-bg="${recipe.bg}"]`).click();
    $('caption').value=recipe.title;$('caption').dispatchEvent(new Event('input'));
    for(const key of ['padding','radius','rotate'])if(recipe[key]!==undefined){$(key).value=recipe[key];$(key).dispatchEvent(new Event('input'));}
    $('lab').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    $('status').textContent='已套用场景风格，保留当前截图。可以继续调整。';
  }));
  loadSample();
})();
