param([switch]$InstallOnly)
$ErrorActionPreference = 'Stop'
$workspaceDir = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$checkoutDir = Join-Path $workspaceDir 'upstream/the-long-silence'
$runtimeDir = Join-Path $workspaceDir 'upstream/the-long-silence-runtime'
$revision = '69b3296b4b6ecb3ca75ed6193e4b785c4c791c0f'
$nodeExe = (Get-Command node -ErrorAction Stop).Source
$npmExe = (Get-Command npm.cmd -ErrorAction Stop).Source
if (!(Test-Path -LiteralPath $checkoutDir)) {
  & git clone https://github.com/achimala/TheLongSilence.git $checkoutDir
  if ($LASTEXITCODE -ne 0) { throw 'Clone failed' }
  & git -C $checkoutDir checkout --detach $revision
  if ($LASTEXITCODE -ne 0) { throw 'Revision checkout failed' }
}
$actualRevision = & git -C $checkoutDir rev-parse HEAD
if ($actualRevision -ne $revision) { throw 'Unexpected upstream revision; left unchanged.' }
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
if (!(Test-Path (Join-Path $checkoutDir 'node_modules/vite/bin/vite.js'))) {
 Push-Location $checkoutDir
 try { & $npmExe ci --no-audit --no-fund; if ($LASTEXITCODE -ne 0) {throw 'Dependency install failed'} } finally {Pop-Location}
}
# Separate HTML entry; original tracked source remains unchanged.
$originalHtml = [IO.File]::ReadAllText((Join-Path $checkoutDir 'index.html'))
$labHtml = $originalHtml.Replace('</body>', '<script type="module" src="/research-lab.js"></script></body>')
function Write-IfChanged($path, $content) {
 if (!(Test-Path -LiteralPath $path) -or [IO.File]::ReadAllText($path) -ne $content) {[IO.File]::WriteAllText($path, $content)}
}
# An unchanged restart must not trigger Vite HMR and erase game progress.
Write-IfChanged (Join-Path $checkoutDir 'lab.html') $labHtml
Write-IfChanged (Join-Path $checkoutDir 'research-lab.js') ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'lab.js')))
Write-IfChanged (Join-Path $checkoutDir 'public/research-health.json') '{"app":"the-long-silence","revision":"69b3296b4b6ecb3ca75ed6193e4b785c4c791c0f"}'
if ($InstallOnly) {exit 0}
$running=$false
try {$h=Invoke-RestMethod 'http://127.0.0.1:5112/research-health.json' -TimeoutSec 3;$running=$h.app -eq 'the-long-silence'}catch{}
if (!$running) {
 if(Get-NetTCPConnection -LocalPort 5112 -State Listen -ErrorAction SilentlyContinue){throw 'Port 5112 occupied'}
 $p=Start-Process -FilePath $nodeExe -ArgumentList @('node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5112','--strictPort') -WorkingDirectory $checkoutDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'game.log') -RedirectStandardError (Join-Path $runtimeDir 'game-error.log') -PassThru
 $p.Id | Set-Content (Join-Path $runtimeDir 'game.pid')
}
$webDir=Join-Path $workspaceDir 'web/012-the-long-silence'
if((Test-Path (Join-Path $webDir 'index.html')) -and !(Get-NetTCPConnection -LocalPort 8012 -State Listen -ErrorAction SilentlyContinue)){
 $pythonExe=(Get-Command python -ErrorAction Stop).Source
 $p=Start-Process -FilePath $pythonExe -ArgumentList @('-m','http.server','8012','--bind','127.0.0.1') -WorkingDirectory $webDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'guide.log') -RedirectStandardError (Join-Path $runtimeDir 'guide-error.log') -PassThru
 $p.Id | Set-Content (Join-Path $runtimeDir 'guide.pid')
}
Write-Host 'Game: http://127.0.0.1:5112/   Lab: http://127.0.0.1:5112/lab.html'
Write-Host 'Guide: http://127.0.0.1:8012/ (available after guide files exist)'
