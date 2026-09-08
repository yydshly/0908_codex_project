$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$linuxRoot = (& wsl -d Ubuntu-22.04 -- wslpath -a $projectRoot).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve project path in Ubuntu-22.04.' }
if (!(Test-Path -LiteralPath (Join-Path $projectRoot 'upstream/geolook/scripts/geo.py'))) { throw 'The researched upstream checkout is missing.' }
Write-Host 'GeoLook: http://127.0.0.1:8765/ (keep this terminal open)'
& wsl -d Ubuntu-22.04 -- env "PYTHONPATH=$linuxRoot/upstream/geolook-runtime/deps" python3 -u "$linuxRoot/upstream/geolook/scripts/geo.py" ui --port 8765 --no-open
