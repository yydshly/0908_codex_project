const root = './engine/app/index.html';
const modelBase = 'https://ugc.arrival.space/splatjs/models/';
const samples = {
  truck: {title:'Truck · 实拍场景的三维重建', note:'作者训练完成的真实模型：251 张照片、约 105 万高斯。首次加载模型约 15 MB；这些是作者的训练记录，不是本机刚刚训练的数据。', url:root+'?model='+encodeURIComponent(modelBase+'truck_1h_v3_2026-09-06.sog')+'&recon='+encodeURIComponent(modelBase+'truck_1h_v3_2026-09-06_recon.json')},
  bar: {title:'Bar · 360° 全景重建的室内空间', note:'作者提供的真实酒吧模型，约 400 万高斯，加载和显存开销更大。原始场景来自 360Roam（CC BY-NC-SA）。', url:root+'?model='+encodeURIComponent(modelBase+'bar360_v5test.sog')+'&recon='+encodeURIComponent(modelBase+'bar360_v5test_recon.json')},
  train: {title:'用 Truck 照片，现场重新训练', note:'加载 100 张真实照片。点击界面中的 Start training，实际执行特征提取、相机求解与 10,000 轮草稿训练。可暂停、旋转查看、对比照片并导出。它的效果不会等同于上方长时间训练的样例。', url:root+'?sample=truck'},
  synthetic: {title:'12 张标准渲染图片 · 轻量真实训练', note:'输入是上游提供的合成测试图片；相机求解和高斯训练是真实计算，适合先检查设备。点击 Start training 开始。这组不是实拍素材。', url:root+'?sample=synthetic'},
  own: {title:'用你自己的多角度照片重建', note:'点击 Choose photos / 添加照片选择本地图片。解算与训练在本机完成；上游应用另有主动分享功能，只有自行使用该功能才会进入发布流程。', url:root}
};
const frame=document.getElementById('real-engine');
const initial=new URLSearchParams(location.search).get('demo');
function select(key){const s=samples[key]||samples.truck;document.getElementById('real-title').textContent=s.title;document.getElementById('real-note').textContent=s.note;document.getElementById('real-full').href=s.url;document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demo===key)));frame.src=s.url;}
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.demo)));
select(samples[initial]?initial:'truck');
