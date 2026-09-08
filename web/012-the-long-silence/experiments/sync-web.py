"""Copy this project's verified evidence and portable notes into its web guide."""
from pathlib import Path
import shutil

project = Path(__file__).resolve().parents[1]
workspace = project.parents[1]
web = workspace / 'web' / project.name
for file in (project / 'assets').iterdir():
    if file.is_file():
        shutil.copy2(file, web / 'assets' / file.name)
shutil.copy2(project / 'assets/LICENSE-upstream.txt', web / 'LICENSE-upstream.txt')
shutil.copy2(project / 'notes/generation-audit.json', web / 'universe.json')
shutil.copy2(project / 'notes/validation.md', web / 'validation.md')
for folder in ('notes', 'experiments'):
    (web / folder).mkdir(exist_ok=True)
    for file in (project / folder).iterdir():
        if file.is_file():
            shutil.copy2(file, web / folder / file.name)
shutil.copy2(project / 'README.md', web / 'research.md')
print('Synced project evidence and notes to', web)
