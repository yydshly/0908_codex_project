"""Fetch the explicitly published original capture for this local experiment."""
from pathlib import Path
from urllib.request import urlretrieve
import hashlib
import shutil

ROOT = Path(__file__).resolve().parents[4]
URL = 'https://raw.githubusercontent.com/nickesc/PhotogrammetryVideoInstructions/main/sample/sampleVideo.mp4'
SOURCE = Path(__file__).with_name('source.mp4')
if not SOURCE.exists():
    urlretrieve(URL, SOURCE)
digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
if digest != '749d211568634f186b8ddb120e18b336dca7c8eb10573690e978261e73d98926':
    raise ValueError('Source differs from the video used in the recorded experiment.')
target = ROOT / 'web/008-splat-js/video-assets/source.mp4'
target.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(SOURCE, target)
print(f'{SOURCE.stat().st_size:,} bytes; SHA256 {digest}')
print('Source copied. Run python scripts/build.py, then open the video-test page.')
