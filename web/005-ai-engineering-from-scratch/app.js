(() => {
  'use strict';
  const data = window.GUIDE_DATA;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const phaseLabel = id => `P${String(id).padStart(2, '0')}`;
  const phaseById = new Map(data.phases.map(p => [p.id, p]));
  const states = ['未开始', '已了解', '练习中', '已验证'];
  const storageKey = 'aiefs-guide-005-progress-v1';
  let progress = {};
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const p of data.phases) if (states.includes(raw[p.id])) progress[p.id] = raw[p.id];
    }
  } catch { $('progress-message').textContent = '当前无法读取本地备忘；可使用导出功能保存。'; }
  const contains = (value, query) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
  const phaseOptions = data.modules.map(m => `<option value="${m.id}">${m.number} ${esc(m.name)}</option>`).join('');
  $('course-module').insertAdjacentHTML('beforeend', phaseOptions);
  $('term-module').insertAdjacentHTML('beforeend', phaseOptions);
  $('term-total').textContent = `${data.termCount} 组技术术语`;
  $('module-grid').innerHTML = data.modules.map(m => `<article class="module-card" style="--accent:var(--${m.color})"><span class="number">MODULE ${m.number}</span><h3>${esc(m.name)}</h3><span class="verb">${esc(m.verb)}</span><p>${esc(m.question)}</p><span class="phase-tags">${m.phases.map(phaseLabel).join(' · ')}</span><p class="output">可构建：${esc(m.outputs)}</p><details><summary>理解能力边界</summary><p>${esc(m.boundary)}</p></details><a href="#glossary" data-module-link="${m.id}">查看技术与名词 →</a></article>`).join('');
  document.querySelectorAll('[data-module-link]').forEach(a => a.addEventListener('click', () => {
    $('term-module').value = a.dataset.moduleLink; $('term-query').value = ''; renderTerms();
  }));
  $('route-buttons').innerHTML = data.routes.map((r,i) => `<button type="button" data-route="${r.id}" aria-pressed="${i===0}" aria-controls="route-detail">${esc(r.name)}</button>`).join('');
  function renderRoute(id) {
    const r = data.routes.find(item => item.id === id);
    document.querySelectorAll('[data-route]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.route === id)));
    $('route-detail').innerHTML = `<h3>${esc(r.name)}</h3><p>${esc(r.audience)}</p><ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="route-proof"><p><strong>阶段产物：</strong>${esc(r.output)}</p><p><strong>验收重点：</strong>${esc(r.check)}</p><p><strong>范围取舍：</strong>${esc(r.skip)}</p></div>${r.path?link(`${data.repository}/blob/${data.commit}/${r.path}`,'打开仓库专题清单'):''}`;
  }
  $('route-buttons').addEventListener('click', e => { const b=e.target.closest('[data-route]'); if(b) renderRoute(b.dataset.route); });
  renderRoute(data.routes[0].id);
  function renderPhases() {
    const query = $('course-query').value.trim(), mod = $('course-module').value;
    const results = data.phases.filter(p=>!mod || p.module===mod).map(p=> {
      const phaseMatch = !query || contains([phaseLabel(p.id),p.name,p.keywords,p.goal,p.trigger].join(' '),query);
      const lessons = phaseMatch ? p.lessons : p.lessons.filter(l=>contains(l.title+' '+l.path, query));
      return {p,lessons};
    }).filter(x=>x.lessons.length);
    const total = results.reduce((n,x)=>n+x.lessons.length,0);
    $('course-count').textContent=`${results.length} / 20 个阶段 · ${total} / ${data.lessonCount} 节课程`;
    $('phase-list').innerHTML = results.length ? results.map(({p,lessons})=>`<details class="phase" id="phase-${p.id}" ${query?'open':''}><summary><span class="phase-id">${phaseLabel(p.id)}</span><span class="phase-title">${esc(p.name)}</span><span class="phase-count">${lessons.length}${lessons.length===p.count?'':' / '+p.count} 课</span><span class="phase-arrow" aria-hidden="true">›</span></summary><div class="phase-body"><p>${esc(p.keywords)}</p><div class="phase-meta"><p><strong>学习目标</strong>${esc(p.goal)}</p><p><strong>前置知识</strong>${esc(p.prerequisite)}</p><p><strong>何时学习</strong>${esc(p.trigger)}</p><p><strong>验收成果</strong>${esc(p.proof)}</p></div><div class="phase-progress"><label for="state-${p.id}">我的学习状态</label><select id="state-${p.id}" data-phase-state="${p.id}">${states.map(s=>`<option${s===(progress[p.id]||states[0])?' selected':''}>${s}</option>`).join('')}</select>${link(p.url,'阶段目录')}</div><ul class="lesson-list">${lessons.map(l=>`<li><span class="lesson-name">${esc(l.title)}</span><span class="lesson-links">${link(l.url,'固定版本')}${link(l.web,'在线课程')}</span></li>`).join('')}</ul></div></details>`).join('') : '<p class="empty">没有找到对应课程。试试中英文关键词，或清除筛选。</p>';
  }
  $('phase-list').addEventListener('change', e=> {
    if(!e.target.matches('[data-phase-state]')) return;
    progress[e.target.dataset.phaseState]=e.target.value;
    saveProgress();
  });
  function saveProgress() {
    try { localStorage.setItem(storageKey,JSON.stringify(progress)); $('progress-message').textContent='学习备忘已保存到当前浏览器。'; }
    catch { $('progress-message').textContent='浏览器存储不可用，请导出备忘保留本次记录。'; }
  }
  ['course-query','course-module'].forEach(id=>$(id).addEventListener(id.endsWith('query')?'input':'change',renderPhases));
  $('course-reset').addEventListener('click',()=>{$('course-query').value='';$('course-module').value='';renderPhases();});
  renderPhases();
  function renderTerms() {
    const query=$('term-query').value.trim(), mod=$('term-module').value;
    const terms=data.terms.filter(t=>(!mod||t.module===mod)&&contains([t.term,t.meaning,t.use,phaseLabel(Number(t.phase))].join(' '),query));
    $('term-count').textContent=`${terms.length} / ${data.termCount} 组技术名词`;
    $('term-list').innerHTML = terms.length ? data.modules.map(m=>{
      const items=terms.filter(t=>t.module===m.id); if(!items.length) return '';
      return `<section class="term-group"><h3>${m.number} · ${esc(m.name)}</h3><div class="table-wrap"><table><thead><tr><th scope="col">技术名词</th><th scope="col">含义</th><th scope="col">实际用途</th><th scope="col">入口</th></tr></thead><tbody>${items.map(t=>`<tr><td>${esc(t.term)}</td><td>${esc(t.meaning)}</td><td>${esc(t.use)}</td><td><a href="#phases" data-open-phase="${t.phase}">${phaseLabel(Number(t.phase))}</a></td></tr>`).join('')}</tbody></table></div></section>`;
    }).join('') : '<p class="empty">没有找到这个名词。试试简称、英文或用途关键词。</p>';
  }
  $('term-list').addEventListener('click',e=>{
    const a=e.target.closest('[data-open-phase]'); if(!a) return;
    e.preventDefault();$('course-query').value='';$('course-module').value='';renderPhases();
    const el=$('phase-'+a.dataset.openPhase);el.open=true;el.scrollIntoView({block:'start'});el.querySelector('summary').focus();
  });
  ['term-query','term-module'].forEach(id=>$(id).addEventListener(id.endsWith('query')?'input':'change',renderTerms));
  $('term-reset').addEventListener('click',()=>{$('term-query').value='';$('term-module').value='';renderTerms();});
  renderTerms();
  const simpleTable=(headers,rows)=>`<table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  $('confusion-list').innerHTML='<div class="table-wrap">'+simpleTable(['概念','关键区别'],data.confusions)+'</div>';
  $('comparison-table').innerHTML=simpleTable(['维度','Claude Academy','本仓库'],data.comparisons);
  $('source-version').textContent=`整理于 ${data.date}，固定版本 ${data.commit}。完整目录经路径去重，共 ${data.lessonCount} 节。`;
  $('source-list').innerHTML=data.sources.map(([label,url])=>'<li>'+link(url,label)+'</li>').join('');
  $('export-progress').addEventListener('click',()=>{
    const value={schema:'aiefs-study-progress-v1',sourceCommit:data.commit,exportedAt:new Date().toISOString(),progress};
    const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='ai-engineering-learning-progress.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('progress-message').textContent='学习备忘已导出；请保留下载文件作为备份。';
  });
  $('import-progress').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try {
      if(file.size>100000)throw Error('文件过大');
      const parsed=JSON.parse(await file.text());
      if(parsed.schema!=='aiefs-study-progress-v1'||!parsed.progress||typeof parsed.progress!=='object'||Array.isArray(parsed.progress))throw Error('文件格式不正确');
      const entries=Object.entries(parsed.progress);
      if(entries.some(([k,v])=>!/^\d+$/.test(k)||String(Number(k))!==k||!phaseById.has(Number(k))||!states.includes(v)))throw Error('存在未知阶段或状态');
      for(const [k,v] of entries)progress[k]=v;
      saveProgress();renderPhases();
      $('progress-message').textContent=`已合并导入 ${entries.length} 个阶段的备忘。${parsed.sourceCommit!==data.commit?'备份对应的上游版本不同，请复核阶段内容。':''}`;
    }catch(err){$('progress-message').textContent='未导入：'+err.message+'。原有记录未改变。';}
    e.target.value='';
  });
})();
