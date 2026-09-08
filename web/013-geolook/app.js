'use strict';
const D=window.GeoDemo;
const $=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=v=>v===null?'未测':Math.round(v*100)+'%';
const source=file=>`https://github.com/aigclink/geolook/blob/9492cb3a1952f1370cca0f66715f87165fd56e2c/scripts/${file}`;
const pages={status:['01 / OBSERVE','看见现状','先看 AI 的答案，再判断品牌有没有被看见。'],diagnosis:['02 / DIAGNOSE','找到问题','把已经看到的现象，与还需要验证的原因分开。'],action:['03 / TAKE ACTION','着手改进','从一条建议出发，做成有负责人、有验收条件的任务。'],review:['04 / VERIFY','回来复查','任务有没有做完、效果有没有变化，是两个问题。'],inside:['05 / UNDER THE HOOD','原理与扩展','理解这套营销工作台如何运转，以及能继续往哪里做。']};
let selectedQuestion='q1',selectedEngine='A',layerIndex=0,moduleIndex=0,timer;
let saved={done:[],draft:null};
try{const raw=JSON.parse(localStorage.getItem('geolook-demo-v1')||'null');if(raw&&Array.isArray(raw.done))saved={done:raw.done.filter(id=>D.tasks.some(t=>t.id===id)),draft:typeof raw.draft==='string'?raw.draft:null};}catch{}
function persist(){try{localStorage.setItem('geolook-demo-v1',JSON.stringify(saved));}catch{notify('当前浏览器未保存进度，本次页面内仍可体验。');}}
function notify(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(timer);timer=setTimeout(()=>$('toast').hidden=true,2800);}
function route(){const page=Object.prototype.hasOwnProperty.call(pages,location.hash.slice(1))?location.hash.slice(1):'status';document.querySelectorAll('.page').forEach(s=>s.hidden=s.id!==`page-${page}`);document.querySelectorAll('nav a').forEach(a=>{const active=a.dataset.page===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});const [eye,title,desc]=pages[page];$('eyebrow').textContent=eye;$('page-title').textContent=title;$('page-desc').textContent=desc;document.title=`${title} · GeoLook 能力体验馆`;}
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();$('main').focus();$('main').scrollIntoView();});
window.addEventListener('hashchange',()=>{route();$('main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});
function visibleRows(){const engine=$('engine').value;return D.samples().filter(r=>engine==='all'||r.engine===engine);}
function renderStatus(){
  const rows=visibleRows(),m=D.metrics(rows);
  $('metrics').innerHTML=[['主动提及率',pct(m.mention),`${m.count} / ${m.n} 条未点名答案提到了品牌`],['首位出现率',pct(m.top1),`${m.first} / ${m.n} 条中先于已配置竞品出现`],['官网引用率',pct(m.cite),`${m.cited} / ${m.n} 条答案包含官网域名`],['有效观察样本',String(m.n),`另有 ${m.probe} 条点名题，不计入以上比例`]].map(([title,value,note])=>`<article class="metric"><span class="metric-title">${title}</span><div class="metric-value">${value}</div><small>${note}</small></article>`).join('');
  if(!rows.some(r=>r.qid===selectedQuestion&&r.engine===selectedEngine)){selectedQuestion=rows[0].qid;selectedEngine=rows[0].engine;}
  $('question-list').innerHTML=D.questions.map(q=>{const rs=rows.filter(r=>r.qid===q.id),count=rs.filter(r=>D.analyze(r.answer).mentioned).length;return `<button class="question-button ${q.id===selectedQuestion?'active':''}" data-q="${q.id}" aria-pressed="${q.id===selectedQuestion}"><span class="q-id">${q.id.toUpperCase()}</span><span class="q-text">${q.text}<small>${q.group}${q.probe?' · 点名题，单独观察':''}</small></span><span class="q-result">${q.probe?'不计提及率':count+'/'+rs.length+' 提及'}</span></button>`;}).join('');
  $('question-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selectedQuestion=b.dataset.q;renderStatus();}));renderAnswer(rows);
}
function renderAnswer(rows){
  const q=D.questions.find(q=>q.id===selectedQuestion),rs=rows.filter(r=>r.qid===q.id),r=rs.find(r=>r.engine===selectedEngine)||rs[0];selectedEngine=r.engine;const a=D.analyze(r.answer);
  $('answer-detail').innerHTML=`<div class="module-tabs">${rs.map(x=>`<button data-engine="${x.engine}" class="${x.engine===selectedEngine?'active':''}" aria-pressed="${x.engine===selectedEngine}">样本组 ${x.engine}</button>`).join('')}</div><small>基线轮 / ${q.id.toUpperCase()} / 虚构答案</small><h3>${q.text}</h3><blockquote>${esc(r.answer)}</blockquote><div class="answer-meta"><span class="badge ${a.mentioned?'green':'amber'}">${a.mentioned?'已提到山野咖啡':'未提到山野咖啡'}</span><span class="badge">${q.probe?'点名题 · 排除可见性统计':a.rank?'已配置品牌中第 '+a.rank+' 个出现':'品牌缺席'}</span></div><div class="source-line"><b>引用来源（虚构域名）</b><br>${r.domains.map(esc).join(' · ')}</div><div class="callout">${q.probe?'问题已经告诉 AI 品牌名，即使答案复述了名字，也不证明品牌会被主动推荐。':a.mentioned?'这条答案出现了品牌名。出现顺序只是文本位置，不代表推荐强度；信息准确性还需要核对。':'能确定的是：这条答案没有品牌。还不能确定的是：为什么没有。下一步需要检查信息与来源。'}</div>`;
  $('answer-detail').querySelectorAll('[data-engine]').forEach(b=>b.addEventListener('click',()=>{selectedEngine=b.dataset.engine;renderAnswer(rows);}));
}
$('engine').addEventListener('change',renderStatus);
function renderLayers(){
  $('layers').innerHTML=D.layers.map((l,i)=>`<button class="layer-button ${i===layerIndex?'active':''}" data-layer="${i}" aria-pressed="${i===layerIndex}"><strong>0${i+1}</strong><span><b>${l.name}</b><small>${l.sub}</small></span></button>`).join('');
  const l=D.layers[layerIndex];$('layer-detail').innerHTML=`<span class="badge green">第 ${layerIndex+1} 层 / ${l.name}</span><h3>${l.title}</h3><ul class="check-list">${l.checks.map(c=>`<li>${c}</li>`).join('')}</ul><p>${l.example}</p><div class="callout">${l.boundary}</div><p style="margin-top:16px"><a class="text-link" href="${source(l.file)}" target="_blank" rel="noopener">查看对应实现 ↗</a></p>`;
  $('layers').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{layerIndex=Number(b.dataset.layer);renderLayers();}));
}
$('weights').innerHTML=[['可抓取性',15],['内容长度',15],['结构规范',20],['可抽取块',25],['权威信号',15],['对题性',10]].map(([name,n])=>`<div class="weight"><span>${name}</span><span><i style="width:${n*4}%"></i></span><b>${n}</b></div>`).join('');
function renderTasks(){
  $('tasks').innerHTML=D.tasks.map(t=>`<article class="task ${saved.done.includes(t.id)?'done':''}"><label><input type="checkbox" data-task="${t.id}" ${saved.done.includes(t.id)?'checked':''}><span><h3>${t.title}</h3><p>${t.why}</p></span></label><div class="task-tags"><span class="badge">${t.priority}</span><span class="badge">${t.owner}</span><span class="badge amber">${t.risk}</span></div><div class="acceptance"><b>验收方式</b><br>${t.accept}</div></article>`).join('');
  $('tasks').querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{saved.done=input.checked?[...new Set([...saved.done,input.dataset.task])]:saved.done.filter(x=>x!==input.dataset.task);persist();input.closest('.task').classList.toggle('done',input.checked);renderProgress();}));renderProgress();
}
function renderProgress(){$('task-count').textContent=`${saved.done.length} / ${D.tasks.length}`;$('task-progress').style.width=`${saved.done.length/D.tasks.length*100}%`;}
function renderDraft(){$('draft-checks').innerHTML=D.draftChecks($('draft').value).map(c=>`<div class="draft-check ${c.ok?'ok':''}"><span>${c.ok?'✓':'○'}</span><div><b>${c.label} · ${c.ok?'已检测到':'尚未检测到'}</b><small>${c.detail}</small></div></div>`).join('');}
if(saved.draft!==null)$('draft').value=saved.draft;
$('draft').addEventListener('input',()=>{saved.draft=$('draft').value;persist();renderDraft();});
$('example').addEventListener('click',()=>{$('draft').value='山野咖啡是一家位于杭州的社区咖啡店，提供手冲咖啡。\n\n【以下均为教学虚构信息】饮品价格为 28–38 元，店内有 6 个带插座座位，适合短时办公与轻声聊天。\n\n不适合大声会议或多人团建。Wi-Fi、营业时间与久坐规则需要确认，以门店当日公告为准。\n\n真实发布前：请店主核实以上每项信息，并补充来源与更新时间。';saved.draft=$('draft').value;persist();renderDraft();notify('已填入虚构完整示例，可继续修改。');});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('draft').value);notify('草稿已复制。');}catch{$('draft').focus();$('draft').select();notify('请选择并复制文本；当前浏览器未开放剪贴板。');}});
$('reset').addEventListener('click',()=>{saved={done:[],draft:null};persist();$('draft').value='山野咖啡是一家位于杭州的社区咖啡店。我们希望提供舒适的咖啡体验。';renderTasks();renderDraft();notify('任务与草稿已重置。');});
function renderReview(){
  const outcome=$('outcome').value,base=D.metrics(D.samples()),next=D.metrics(D.samples(outcome));
  $('comparison-chart').innerHTML=[['主动提及率','mention'],['首位出现率','top1'],['官网引用率','cite']].map(([name,key])=>`<div class="chart-row"><span>${name}</span><div class="bar-pair"><div class="bar"><div class="bar-fill" style="width:${base[key]*100}%"></div><span class="bar-label">基线 ${pct(base[key])}</span></div><div class="bar after"><div class="bar-fill" style="width:${next[key]*100}%"></div><span class="bar-label">复查 ${pct(next[key])}</span></div></div>`).join('');
  const diff=Math.round((next.mention-base.mention)*100),verdict=diff>0?`复查样本中的提及率增加了 ${diff} 个百分点。`:diff<0?`复查样本中的提及率下降了 ${-diff} 个百分点。`:'两轮样本中的提及率相同。';
  $('review-verdict').innerHTML=`${verdict}<small>${diff>0?'这是观察到的变化，不能据此证明是改进任务带来的增长。':diff<0?'先检查样本、模型变化与外部事件，不能直接认定改动有害。':'完成任务并不保证获得更多提及，需继续核查原因与观察窗口。'}当前仅为预置的教学情境。</small>`;
  $('delta-table').innerHTML=D.questions.filter(q=>!q.probe).map(q=>{const b=D.metrics(D.samples().filter(r=>r.qid===q.id)),n=D.metrics(D.samples(outcome).filter(r=>r.qid===q.id)),delta=n.count-b.count;return `<tr><td>${q.text}</td><td>${b.count} / ${b.n}</td><td>${n.count} / ${n.n}</td><td><span class="badge ${delta>0?'green':delta<0?'amber':''}">${delta>0?'增加 '+delta+' 条':delta<0?'减少 '+(-delta)+' 条':'未变化'}</span></td></tr>`;}).join('');
}
$('outcome').addEventListener('change',renderReview);
function renderModules(){
  $('modules').innerHTML=D.modules.map((m,i)=>`<button data-module="${i}" class="${moduleIndex===i?'active':''}" aria-pressed="${moduleIndex===i}">${m.name}</button>`).join('');
  const m=D.modules[moduleIndex];$('module-detail').innerHTML=`<a class="module-code" href="${source(m.file)}" target="_blank" rel="noopener">scripts/${m.file} ↗</a><h3>${m.title}</h3><p>${m.how}</p><div class="module-columns"><div><h4>留下什么</h4><p>${m.output}</p></div><div><h4>如何理解边界</h4><p>${m.boundary}</p></div></div>`;
  $('modules').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{moduleIndex=Number(b.dataset.module);renderModules();}));
}
$('extensions').innerHTML=D.extensions.map(([name,detail])=>`<details><summary>${name}</summary><p>${detail}</p></details>`).join('');
let reportUrl;
$('export').addEventListener('click',()=>{
  const base=D.metrics(D.samples()),next=D.metrics(D.samples($('outcome').value));
  const report=`# GeoLook 教学体验报告\n\n生成时间：${new Date().toISOString()}\n\n本报告为静态教学模拟；不含真实 AI 采样、网站诊断或营销效果。品牌、答案和域名均为虚构。\n\n## 基线观察\n\n未点名样本 ${base.n} 条；主动提及 ${base.count} 条（${pct(base.mention)}）；首位出现率 ${pct(base.top1)}；官网引用率 ${pct(base.cite)}。另外 ${base.probe} 条点名题不计入上述比例。排名只是已配置品牌的首次出现顺序。\n\n## 改进任务\n\n${D.tasks.map(t=>`- [${saved.done.includes(t.id)?'x':' '}] ${t.title}\n  负责人：${t.owner}；验收：${t.accept}`).join('\n')}\n\n## 当前草稿\n\n${$('draft').value}\n\n## 复查情境\n\n${$('outcome').selectedOptions[0].textContent}：提及率 ${pct(base.mention)} → ${pct(next.mention)}。情境来自预置答案，与任务勾选无关。前后变化不证明因果，也不代表订单增长。\n\n## 基线样本原文\n\n${D.samples().map(r=>`### ${r.qid} / 组 ${r.engine}\n\n${D.questions.find(q=>q.id===r.qid).text}\n\n${r.answer}\n\n虚构引用域名：${r.domains.join('、')}\n`).join('\n')}\n## 来源\n\nhttps://github.com/aigclink/geolook/tree/9492cb3a1952f1370cca0f66715f87165fd56e2c\n\n分析基于源码阅读，未验证上游端到端运行。`;
  if(reportUrl)URL.revokeObjectURL(reportUrl);
  reportUrl=URL.createObjectURL(new Blob([report],{type:'text/markdown;charset=utf-8'}));
  $('report-text').value=report;$('download-report').href=reportUrl;$('report-dialog').showModal();
});
$('close-report').addEventListener('click',()=>$('report-dialog').close());
$('copy-report').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('report-text').value);notify('报告全文已复制。');}catch{$('report-text').focus();$('report-text').select();notify('全文已选中，请使用复制快捷键保存。');}});
route();renderStatus();renderLayers();renderTasks();renderDraft();renderReview();renderModules();
