// GitHub Pages shows saved evidence; local execution remains available locally.
(() => {
  const local = ['127.0.0.1','localhost',''].includes(location.hostname);
  if (local) return;
  const adapt = () => {
    document.querySelectorAll('a[href^="http://127.0.0.1:8765"]').forEach(a => {
      a.href='./real/original-samples.png';
      a.textContent='查看原版工作台实测截图 ↗';
    });
    document.querySelectorAll('a[href^="http://127.0.0.1:8771"]').forEach(a => {
      a.href='./real/case-data.json';
      a.textContent='查看保存的本地实验记录 ↗';
    });
    const receipt=document.querySelector('.receipt-foot');
    if(receipt) Array.from(receipt.childNodes).filter(n=>n.nodeType===3).forEach(n=>n.textContent='本次原版运行结果已保存 ');
    const description=document.getElementById('step-description');
    if(location.hash==='#delivery'&&description)description.textContent='打开原版报告、查看原始记录，了解如何自行运行下一轮调研。';
    document.querySelectorAll('.range-note').forEach(p=>{
      if(p.textContent.includes('本地实验页在服务运行时'))p.innerHTML='本地实验服务不在 GitHub Pages 上运行。上方展示四次实际运行记录；<a href="./real/case-data.json" target="_blank" rel="noopener">查看完整实验数据 ↗</a>。';
      if(p.textContent.includes('原版入口依赖本机服务'))p.textContent='当前是公开静态导览，所有下方报告与证据都能直接查看；重新采样和执行需自行运行原版。';
    });
    const title=document.querySelector('#real-view > article h3');
    if(title?.textContent==='现在可以直接操作原版'){
      title.textContent='查看原版记录，或自行运行新一轮调研';
      const paragraph=title.nextElementSibling;
      paragraph.innerHTML='这里展示实际运行过的原版结果。下方报告可以直接打开；如需重新采样或修改任务，请按<a href="https://github.com/yydshly/0908_codex_project/tree/main/projects/013-geolook">研究说明</a>启动 GeoLook，再进入品牌 <b>Obsidian</b>。以下是原版操作路径：';
    }
  };
  adapt();
  window.addEventListener('hashchange',adapt);
  const content=document.getElementById('real-view');
  if(content){
    const observer=new MutationObserver(()=>{
      observer.disconnect();
      adapt();
      observer.observe(content,{childList:true,subtree:true});
    });
    observer.observe(content,{childList:true,subtree:true});
  }
})();
