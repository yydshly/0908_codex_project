const scenes={
 product:['商品详情页','转动鞋子、包、家具，主动查看侧面、后跟、材质细节。','热点标注、预设视角、可信商品资料、购买入口。热点内容需要我们提供。','用户是否找到了想看的细节；目标设备加载和拖动是否流畅。','颜色款式切换需要相应资产；原库不会自动知道材质、库存或价格。'],
 space:['门店、展厅与房源','从门口沿路线参观，点展品看说明，或在多个房间之间切换。','导览内容、路线编辑、室内控制、导航点；自由移动需额外碰撞与范围限制。','关键区域是否覆盖完整；用户能否找到房间或展品；有无严重空洞。','Bar 成品查看已验证，普通房间视频重建与自由行走尚未完成本机测试。'],
 outfit:['固定穿搭作品','观察同一个人穿同一套衣服的正面、侧面与背面。','固定姿态的采集规范、视角收藏、单品关联；首先做人体素材实验。','衣服轮廓、背面和遮挡处能否辨认，呼吸和摆动是否造成重影。','不自动具备换衣、动作或体型测量；这些需要人体模型、服装分层与形变等技术。'],
 archive:['收藏、文化与状态留档','多角度记录工艺品、雕塑、装修或展会布置，并比较不同时间的外观。','来源信息、时间版本、局部说明、同视角对照和人工问题标注。','记录能否帮助定位变化；对照视角是否一致；来源是否完整。','视觉档案不自动等于精确测量或工程验收；尺度和精度需要单独校准与验证。'],
 media:['内容制作与场景问答','在重建场景中选择镜头路线，或点击对象获得有依据的讲解。','路线编辑、字幕、视频录制与编码；问答另需标签、资料库、检索及 AI 接口。','镜头能否稳定导出；讲解是否有来源；用户能否理解关键内容。','相机路线游览已有；定制视频输出和语义问答尚未集成。Splat.js 本身不理解商品语义。']
};
function choose(key){const row=scenes[key]; ['scenario-title','scenario-experience','scenario-work','scenario-check','scenario-limit'].forEach((id,i)=>document.getElementById(id).textContent=row[i]);document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));}
document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.scenario)));
choose('product');
document.getElementById('load-roam').addEventListener('click',()=>{const video=document.createElement('iframe');video.src='https://www.youtube-nocookie.com/embed/jzjKjyIh5qg';video.title='360Roam 原数据项目的 Bar 视频（不是 Splat.js 训练录像）';video.allow='fullscreen; encrypted-media; picture-in-picture';video.allowFullscreen=true;document.getElementById('roam-video').replaceChildren(video);});
