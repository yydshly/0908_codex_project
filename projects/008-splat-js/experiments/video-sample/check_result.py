"""Check the actual persisted independent-video result and record its metrics."""
from pathlib import Path
import hashlib
import json
from zipfile import ZipFile

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parents[3] / 'web/008-splat-js/video-assets'
recon = json.loads((ASSETS / 'recon.json').read_text(encoding='utf-8'))
original = json.loads((HERE / 'original-recon.json').read_text(encoding='utf-8'))
model = ASSETS / 'model.sog'
for field in ('cams', 'frames', 'cloud', 'recipe', 'iter', 'splats', 'stats'):
    assert recon[field] == original[field], f'Reconstruction changed: {field}'
assert len(recon['cams']) == len(recon['frames']) == 223
assert len(recon['source']['urls']) == 223
assert all((ASSETS / 'frames' / name).is_file() for name in recon['source']['names'])
with ZipFile(model) as archive:
    assert archive.testzip() is None
    meta = json.loads(archive.read('meta.json'))
summary = {
    'selectedFrames':len(recon['frames']), 'registeredCameras':len(recon['cams']),
    'iterations':recon['iter'], 'trainingGaussians':recon['splats'],
    'trainingPSNR':recon['stats']['psnrTrain'], 'trainingMinutes':recon['stats']['minutes'],
    'sogBytes':model.stat().st_size, 'sogSha256':hashlib.sha256(model.read_bytes()).hexdigest(),
    'sogMetadata':meta,
    'inputVideoSha256':'749d211568634f186b8ddb120e18b336dca7c8eb10573690e978261e73d98926',
}
(HERE / 'result.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
print(json.dumps({k:v for k,v in summary.items() if k != 'sogMetadata'}, indent=2))
