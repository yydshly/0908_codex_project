/* Original teaching fixtures. Every brand, answer and domain below is fictional. */
(function(root){
  'use strict';
  const brand='山野咖啡', rivals=['留白咖啡','河岸咖啡'];
  const questions=[
    {id:'q1',group:'推荐',text:'杭州有哪些适合带电脑、安静办公的咖啡店？'},
    {id:'q2',group:'价格',text:'杭州人均 40 元左右的咖啡店有哪些？'},
    {id:'q3',group:'比较',text:'杭州有哪些既有手冲、又适合久坐的咖啡店？'},
    {id:'q4',group:'替代',text:'不想去连锁店，杭州还有哪些社区咖啡店？'},
    {id:'q5',group:'场景',text:'周末和朋友聊天，杭州有哪些咖啡店可选？'},
    {id:'q6',group:'品牌验证',text:'山野咖啡适合办公吗？',probe:true}
  ];
  const guide='city-guide.example', work='work-spaces.example', own='shanye.example';
  const baseline=[
    ['q1','A','可以看看留白咖啡和河岸咖啡，先确认插座与营业时间。',[guide,work]],
    ['q1','B','河岸咖啡是一个可选地点。出发前建议询问现场是否适合办公。',[work]],
    ['q2','A','可以看看山野咖啡，示例资料中的饮品价格为 28–38 元。实际价格需向门店确认。',[own,guide]],
    ['q2','B','留白咖啡和河岸咖啡可以加入预算清单，具体消费以门店为准。',[guide]],
    ['q3','A','可以比较留白咖啡与河岸咖啡的手冲菜单和座位安排。',[guide]],
    ['q3','B','留白咖啡可以作为候选，久坐规则建议提前询问。',[work]],
    ['q4','A','可考虑留白咖啡、山野咖啡这两家社区店，再按距离选择。',[guide,own]],
    ['q4','B','河岸咖啡和留白咖啡是两个社区店候选。',[guide]],
    ['q5','A','河岸咖啡可加入周末清单，建议避开繁忙时段。',[guide]],
    ['q5','B','山野咖啡可以作为聊天地点的候选，但安静程度需要看具体时段。',[own]],
    ['q6','A','山野咖啡的办公条件需要进一步确认，建议询问插座和 Wi-Fi。',[own]],
    ['q6','B','山野咖啡可以了解一下，现有信息不足以判断是否适合长时间办公。',[guide]]
  ];
  function row([qid,engine,answer,domains]){return {qid,engine,answer,domains:[...new Set(domains)]};}
  function analyze(answer){
    const candidates=[brand,...rivals].map(name=>({name,pos:answer.indexOf(name)})).filter(x=>x.pos>=0).sort((a,b)=>a.pos-b.pos);
    const rank=candidates.findIndex(x=>x.name===brand)+1;
    return {mentioned:rank>0,rank,candidates:candidates.map(x=>x.name)};
  }
  function samples(outcome='baseline'){
    const rows=baseline.map(row);
    if(outcome==='improved'){
      const changes={
        'q1-A':['山野咖啡与留白咖啡可列入办公候选。示例资料写有插座和 Wi-Fi，现场情况仍需确认。',[own,work]],
        'q1-B':['河岸咖啡、山野咖啡都可先了解，建议核实办公时段。',[work,own]],
        'q3-B':['留白咖啡、山野咖啡可作为手冲与久坐候选，注意门店规则。',[guide,own]]
      };
      for(const r of rows){const c=changes[`${r.qid}-${r.engine}`];if(c){r.answer=c[0];r.domains=c[1];}}
    } else if(outcome==='declined'){
      for(const r of rows){if(['q2','q4'].includes(r.qid)&&r.engine==='A'){r.answer='可以先了解留白咖啡和河岸咖啡，再向门店核实具体条件。';r.domains=[guide];}}
    }
    return rows;
  }
  function metrics(rows){
    const probe=rows.filter(r=>questions.find(q=>q.id===r.qid)?.probe);
    const valid=rows.filter(r=>!questions.find(q=>q.id===r.qid)?.probe);
    const n=valid.length, count=valid.filter(r=>analyze(r.answer).mentioned).length;
    const first=valid.filter(r=>analyze(r.answer).rank===1).length;
    const cited=valid.filter(r=>r.domains.includes(own)).length;
    return {n,count,first,cited,probe:probe.length,mention:n?count/n:null,top1:n?first/n:null,cite:n?cited/n:null};
  }
  function draftChecks(text){return [
    {label:'一句清楚的定义',detail:'说明这是什么、在哪里。',ok:/是一[家款种个]|是指/.test(text)},
    {label:'带单位的具体数字',detail:'如价格、时间；出处仍需人工核实。',ok:/\d[\d–—~\-]*\s*(元|点|小时|分钟|个|%)/.test(text)},
    {label:'明确的使用场景',detail:'说明适合办公、聊天或其他什么需求。',ok:/办公|聊天|手冲|久坐/.test(text)},
    {label:'适用边界',detail:'写清注意事项与不适合的情况。',ok:/不适合|需确认|需要确认|以.*为准|建议.*询问/.test(text)}
  ];}
  const layers=[
    {name:'访问',sub:'能拿到内容吗？',title:'先确定资料能被抓到',checks:['页面是否能正常访问','robots.txt 是否限制相关爬虫','响应头或页面是否要求不收录','静态 HTML 中是否有实际正文'],example:'教学线索：店铺页面只有图片和一句口号，机器可能拿不到办公条件。',boundary:'模拟爬虫 User-Agent 的探测，只能提示访问问题；不能证明真实平台已经抓取或收录。',file:'crawl.py'},
    {name:'定向',sub:'能找到正确页面吗？',title:'给每份资料一个明确位置',checks:['站点地图是否包含关键页面','canonical 是否指向预期页面','llms.txt 中的链接是否有效','多语言页面关联是否完整'],example:'教学动作：让门店介绍、营业信息和办公规则有稳定的页面地址。',boundary:'生成 llms.txt 只是整理资料，不能保证各平台会读取它，更不等于被引用。',file:'crawl.py'},
    {name:'理解',sub:'能认清你的品牌吗？',title:'让品牌信息前后一致',checks:['页面是否明确品牌名称与类别','JSON-LD 是否提供结构化说明','结构化说明与可见正文是否一致','品牌别名与不同语言名称是否明确'],example:'教学动作：官网和外部资料统一使用“山野咖啡”，避免地址、营业时间冲突。',boundary:'提供结构化数据有助于组织信息，其存在本身不能证明模型已经正确理解。',file:'audit.py'},
    {name:'可引用',sub:'有没有具体答案？',title:'提供能独立回答问题的内容',checks:['是否有一句直接的定义','是否包含有依据的数字、对比或步骤','段落是否能独立回答用户问题','内容是否与目标问题相关'],example:'教学动作：补充办公条件、消费范围和注意事项，帮助回答“适不适合带电脑”。',boundary:'上游以长度、关键词和结构规则近似判断；真实内容质量仍需人工复核。',file:'audit.py'}
  ];
  const tasks=[
    {id:'facts',title:'核实办公条件，补齐品牌资料',why:'顾客关心插座、网络和安静程度，目前介绍不够具体。',accept:'核对实际门店条件，记录来源与更新时间。',owner:'店主',risk:'资料核实',priority:'P0'},
    {id:'page',title:'新增“适合办公吗”介绍段落',why:'让一个具体段落直接回应顾客问题。',accept:'重新抓取页面，检查定义、办公条件与注意事项是否可见。',owner:'内容负责人',risk:'需观察',priority:'P1'},
    {id:'channel',title:'检查城市指南中的门店信息',why:'示例答案引用了城市指南，值得检查相关资料是否准确。',accept:'人工核查第三方页面的名称、地址和信息出处。',owner:'运营',risk:'人工核查',priority:'P1'},
    {id:'sample',title:'用相同问题再采一轮答案',why:'动作完成后，要独立观察 AI 回答有没有变化。',accept:'保留新答案、引用、平台、时间与采样环境，再比较同口径数据。',owner:'分析负责人',risk:'效果观察',priority:'P1'}
  ];
  const modules=[
    {name:'品牌与问题',file:'bootstrap.py',title:'先定义要观察什么',how:'根据官网或品牌材料，调用语言模型生成品牌事实、竞品候选与七类问题。人工核对后作为观察基础。',output:'品牌事实、竞品候选、固定问题库',boundary:'模型提取可能出错，事实与竞品不能只靠生成结果确认。'},
    {name:'抓取与评分',file:'audit.py',title:'用规则寻找技术和内容缺口',how:'crawl.py 抓取代表性页面；audit.py 根据正文、标题、列表、定义、数字等计算六维评分，并输出问题代码。',output:'页面快照、audit.json、问题代码',boundary:'采用固定阈值和正则，不是对真实引用概率的预测模型。'},
    {name:'采样与指标',file:'sample.py',title:'将答案保存下来，再计算表现',how:'API 调用或人工导入答案。通过名称与别名匹配识别品牌，按出现顺序计算名次，解析引用域名；排除点名题后汇总。',output:'samples/*.jsonl、metrics/*.json',boundary:'API 与网页端有差异。名次按已配置品牌首次出现顺序计算；同名与复杂语境需要复核。'},
    {name:'任务与内容',file:'generate.py',title:'让结论对应到可执行动作',how:'tasks.py 根据缺口生成任务和验收条件。generate.py 从品牌事实生成资产，支持 AI 草稿和编造风险提示。',output:'任务、文章大纲、草稿、llms.txt、JSON-LD',boundary:'草稿风险检查不能替代事实核验；公开发布需人工操作与审核。'},
    {name:'复查与报告',file:'verify.py',title:'检查改动是否落实，并保留变化',how:'重新抓取并执行任务检查器。通过则完成，再次失败则重新打开；结合新的采样生成报告和交付包。',output:'verify/*.json、HTML / CSV 交付物',boundary:'检查通过只代表对应条件达标；前后变化不自动证明因果关系。'}
  ];
  const extensions=[
    ['更可靠的测量','增加重复采样、置信区间和对照问题；按平台、模型、地区、联网状态、环境分组，降低随机波动带来的误判。'],
    ['更准确地读懂回答','增加品牌同名消歧、推荐或反对的立场判断，以及引用内容是否支持结论的检查。'],
    ['从曝光追到订单','接入网站分析和客户管理系统，观察 AI 来源访问、咨询、注册与成交。当前归因素材还不是完整业务追踪。'],
    ['适应具体行业','区分产品页、文档、价格页与知识文章，使用本行业真实样本调整检查规则。'],
    ['多人协作与多客户','加入权限、审批、数据库、任务队列、预算控制与客户隔离，支持服务团队长期运营。'],
    ['更完整的内容治理','给事实增加来源、有效期与审核记录，接入更多内容管理系统，并跟踪发布版本与回滚。']
  ];
  const api={brand,questions,own,analyze,samples,metrics,draftChecks,layers,tasks,modules,extensions};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GeoDemo=api;
})(typeof globalThis!=='undefined'?globalThis:this);
