const meanings={
pace:['自转：每个人都有自己的回复节奏','有人适合即时交流，有人每天集中回复，也有人喜欢慢速通信。自转表达本人选择的节奏，并用于安排通知。','小雨设置“周末集中回复”，访客可随时留言，并知道不需要立即得到回应。','转速不代表活跃价值，也不用于推断性格或催促回复。'],
air:['大气：谁可以看到哪一层内容','将公开作品、主题成员内容和指定对象内容分层展示。每条内容仍可单独选择开放范围。','小林的摄影集公开，项目草稿仅合作伙伴可见，私人日志只对自己开放。','真实访问控制必须在服务端执行；视觉上的遮挡不能保护数据。'],
day:['昼夜：让联系尊重彼此的时间','用户选择可联系时段和勿扰安排。夜间仍能收到异步留言，在合适的时间集中查看。','小雨的星球进入夜晚，访客看到“可以留言，我会在下次查看时回复”。','不要求公开真实在线轨迹，也不把在线状态当作必须回复的承诺。'],
weather:['天气：临时表达此刻的状态','“今天想安静”“欢迎聊创作”等状态由本人选择，并设置有效期，到期自动回到中性。','小林正在赶作品，选择一天的安静状态；第二天无需解释就能恢复默认。','不根据文字、表情或使用频率推断心理状态，不形成永久标签。'],
ring:['星环和卫星：长期兴趣与具体项目','星环展示持续关注的主题；卫星承载有目标、资料与进度的独立项目，必要时邀请共同维护。','摄影是长期星环，“夜行短片”是一颗项目卫星，合作成熟后连接共同空间站。','项目数量和装饰复杂度不代表人的价值。合作权限与作品署名需要单独约定。'],
orbit:['轨道：共同节奏，不改变各自的生活','双方约定周期交流或活动，只使用主动共享的时间窗口寻找交会。每个人保留自己的回复节奏。','两人约定每周日交换一版短片，平时异步讨论；临时暂停不会损失关系等级。','航道建立需要接受邀请，允许暂停、退出和屏蔽；距离不排名亲密度。'],
stars:['星星：让值得保留的经历有一个位置','把交流、旅行或成果保存为记忆，再按主题连成星座。参与者各自保留叙述与可见性选择。','短片完成后，两人把首映保存为共同记忆，但只公开双方同意展示的部分。','共同经历不等于共同授权；删除、退出后的内容保留与署名规则必须清楚。']
};
document.querySelectorAll('[data-element]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-element]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 const [title,body,example,boundary]=meanings[button.dataset.element];
 const detail=document.querySelector('#element-detail');
 detail.querySelector('h3').textContent=title;
 detail.querySelector('h3 + p').textContent=body;
 detail.querySelector('.example').textContent='例如：'+example;
 detail.querySelector('.boundary').textContent=boundary;
}));
