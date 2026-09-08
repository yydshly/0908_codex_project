import { videoSourceUrl } from './video-source.js';
const root = './engine/app/index.html';
const modelBase = 'https://ugc.arrival.space/splatjs/models/';
const dataBase = 'https://ugc.arrival.space/splatjs/data/';
const modelUrl = (model, recon) => root+'?model='+encodeURIComponent(model)+'&recon='+encodeURIComponent(recon);
const picture = (src, alt, caption) => `<h4>原始输入示例</h4><img src="${src}" alt="${alt}" loading="lazy"><p>${caption}</p><a href="${src}" target="_blank" rel="noopener">打开原图 ↗</a>`;
const truckPhoto = dataBase+'truck/000001.jpg';
const barPhoto = dataBase+'bar360/web/0_0000.jpg';
const syntheticPhoto = './engine/data/synthetic/synthetic_00.png';
const samples = {
  ours: {
    title:'本机实测 · 运动鞋原视频 → 可交互三维',
    note:'原视频由 N. Escobar / nickesc 拍摄，本项目从原 MP4 重新训练。223/223 视角定位，10,015 次训练；右侧加载的是我们保存的真实结果，不需要重新计算。',
    url:modelUrl('../../video-assets/model.sog','../../video-assets/recon.json'),
    poster:'video-assets/result-cover.webp',
    input:'<h4>我们选用的原视频 · 65.5 秒</h4><video controls playsinline preload="metadata" poster="video-assets/source-poster.jpg" aria-label="独立运动鞋原始拍摄视频"><source src="video-assets/source.mp4" type="video/mp4">浏览器无法播放此视频。</video><p>相机绕鞋移动，鞋和凳子保持静止。原视频来自独立作者，并非我们拍摄；三维结果由本项目实际训练。</p><a href="https://nickesc.github.io/PhotogrammetryVideoInstructions/" target="_blank" rel="noopener">原视频出处 ↗</a>'
  },
  truck: {title:'官方 Truck · 实拍场景的三维重建', note:'作者成品：251 张照片、约 105 万训练高斯，模型约 15 MB。左侧是原始输入中的一张照片，右侧是作者训练结果。', url:modelUrl(modelBase+'truck_1h_v3_2026-09-06.sog',modelBase+'truck_1h_v3_2026-09-06_recon.json'), poster:truckPhoto, input:picture(truckPhoto,'Truck 原始输入照片','Tanks & Temples / Truck，上游提供的 251 张照片之一。查看器下方照片条可切换更多拍摄视角。')},
  bar: {title:'官方 Bar · 360° 全景重建的室内空间', note:'作者成品：102 张全景、约 400 万训练高斯。加载和显存开销较大。原始数据来自 360Roam（CC BY-NC-SA）；本项目没有重新训练这个房间。', url:modelUrl(modelBase+'bar360_v5test.sog',modelBase+'bar360_v5test_recon.json'), poster:barPhoto, input:picture(barPhoto,'Bar 原始 360 度全景照片','这是一个位置拍摄的展开全景。训练使用多个不同位置的全景，不是靠这一张图恢复整个房间。')},
  train: {title:'Truck 照片 · 本机重新训练入口', note:'加载 100 张真实照片，点击 Start training 开始实际求解和 10,000 轮 Draft 训练。此前实测记录为 100/100 定位、10,035 次训练；此入口会开始一次新的计算。', url:root+'?sample=truck', poster:truckPhoto, input:picture(truckPhoto,'Truck 重训所用输入照片','本机复训选用 100 张上游照片。100 张草稿结果与作者 251 张的成品质量不同。')},
  synthetic: {title:'12 张标准渲染图片 · 轻量训练入口', note:'上游合成测试图，相机求解和高斯训练是真实计算。进入卡片后点击 Start training；这组不是实拍素材。', url:root+'?sample=synthetic', poster:syntheticPhoto, input:picture(syntheticPhoto,'合成测试第一张渲染图','上游提供的 12 张渲染图片之一，附带在本地，用于轻量流程测试。')},
  own: {title:'用自己的照片或视频重建', note:'进入原应用后选择本地照片或视频。核心求解与训练在本机浏览器完成；视频要覆盖静态目标的多个角度。训练需要支持 WebGPU 的设备。', url:root, input:'<h4>准备你的输入素材</h4><p>照片：同一对象、多角度、清晰且相互重叠。</p><p>视频：相机围绕静物移动，或在房间不同位置移动拍摄，目标尽量保持不变。</p><p>打开右侧输入界面后选择文件，再启动训练。也可以回到独立视频对照页，重跑已验证的鞋子素材。</p><a href="video-test.html#result">打开鞋子视频实测页 ↗</a>'}
};
const frame = document.getElementById('real-engine');
const placeholder = document.getElementById('viewer-placeholder');
const poster = document.getElementById('viewer-poster');
const loadButton = document.getElementById('load-viewer');
let current = 'ours';
function loadViewer(){
  frame.src = samples[current].url;
  frame.hidden = false;
  placeholder.hidden = true;
}
function select(key, load = false){
  current = Object.hasOwn(samples,key) ? key : 'ours';
  const sample = samples[current];
  frame.src = 'about:blank';
  frame.hidden = true;
  placeholder.hidden = false;
  poster.hidden = !sample.poster;
  if(sample.poster) poster.src = sample.poster;
  document.getElementById('real-title').textContent = sample.title;
  document.getElementById('real-note').textContent = sample.note;
  document.getElementById('real-full').href = sample.url;
  document.getElementById('sample-input').innerHTML = sample.input;
  const video = document.querySelector('#sample-input video');
  if(video){ video.src = videoSourceUrl; }
  loadButton.textContent = ['train','synthetic','own'].includes(current) ? '打开真实训练界面' : '加载可交互三维效果';
  document.querySelectorAll('[data-demo]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.demo === current)));
  if(load) loadViewer();
}
loadButton.addEventListener('click',loadViewer);
document.querySelectorAll('[data-demo]').forEach(b => b.addEventListener('click',() => select(b.dataset.demo,true)));
const initial = new URLSearchParams(location.search).get('demo');
select(initial, initial !== null && Object.hasOwn(samples,initial));
