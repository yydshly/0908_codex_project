import {listRuns, loadLastCapture} from './engine/app/js/store.js';
const status = document.getElementById('status');
const save = document.getElementById('save');
const runs = await listRuns();
const run = runs.find(r => r.ownSrc && r.status === 'finished' && r.recon?.frames?.length === 223 && r.createdAt === 1788885522825);
const capture = await loadLastCapture();
if (!run?.sog || capture?.kind !== 'video' || capture.files?.length !== 223 || !run.recon.source.names.every((n, i) => n === capture.files[i].name)) {
  status.textContent = '实验保存状态：' + JSON.stringify({captureKind:capture?.kind,captureFrames:capture?.files?.length, runs:runs.filter(r=>r.ownSrc).map(r=>({name:r.name,status:r.status,createdAt:r.createdAt,frames:r.recon?.frames?.length,sogBytes:r.sog?.size,sourceNames:r.recon?.source?.names?.length}))});
} else {
  status.textContent = `${run.recon.cams.length} / 223 个视角 · ${run.iter} 次训练 · ${run.splats.toLocaleString()} 个高斯 · ${run.psnr?.toFixed(2)} dB · 模型 ${(run.sog.size / 1e6).toFixed(2)} MB`;
  if (run.thumb) document.getElementById('thumb').src = URL.createObjectURL(run.thumb);
  save.disabled = false;
  save.addEventListener('click', async () => {
    save.disabled = true;
    const write = async (name, blob) => {
      const response = await fetch(`http://127.0.0.1:8028/export/${name}`, {method:'POST', headers:{'Content-Type':'application/octet-stream','X-Splat-Experiment':'nickesc-shoe-video'}, body:blob});
      if (!response.ok) throw new Error(`保存失败 ${name}: ${response.status}`);
    };
    try {
      await write('model.sog', run.sog);
      await write('original-recon.json', new Blob([JSON.stringify(run.recon)]));
      const recon = structuredClone(run.recon);
      recon.name = '运动鞋 · 独立公开视频重建';
      recon.source.urls = capture.files.map(f => `../../video-assets/frames/${f.name}`);
      recon.experiment = {source:'https://nickesc.github.io/PhotogrammetryVideoInstructions/', previewNote:'720px previews of the actual video-extracted frames. Retrain from the original MP4.'};
      await write('recon.json', new Blob([JSON.stringify(recon)]));
      await write('run-record.json', new Blob([JSON.stringify({id:run.id,createdAt:run.createdAt,updatedAt:run.updatedAt,iter:run.iter,splats:run.splats,psnr:run.psnr,minutes:run.minutes,frames:run.frames,sogBytes:run.sog.size})]));
      if (run.thumb) await write('result-thumb.webp', run.thumb);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      for (let i=0; i<capture.files.length; i++) {
        const f = capture.files[i];
        const bitmap = await createImageBitmap(f.blob);
        const ratio = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
        canvas.width = Math.round(bitmap.width * ratio); canvas.height = Math.round(bitmap.height * ratio);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .88));
        await write(`frames/${f.name}`, blob);
        status.textContent = `模型已保存；正在保存实际视频帧 ${i+1} / 223`;
      }
      status.textContent = '保存完成：模型、相机位置与 223 张实际视频帧已写入本地演示项目。';
    } catch(error) { status.textContent = error.message; save.disabled = false; }
  });
}
