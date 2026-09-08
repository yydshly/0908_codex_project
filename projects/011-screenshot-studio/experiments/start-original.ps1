$ErrorActionPreference = 'Stop'
$workspaceDir = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$checkoutDir = Join-Path $workspaceDir 'upstream/screenshot-studio'
$runtimeDir = Join-Path $workspaceDir 'upstream/screenshot-studio-runtime'
$revision = '7c7a38a65a547aa081cb86bf489d27be44aeb4f7'
$nodeExe = (Get-Command node -ErrorAction Stop).Source
$npmExe = (Get-Command npm.cmd -ErrorAction Stop).Source
Get-Command git -ErrorAction Stop | Out-Null
try {
  $health = Invoke-RestMethod 'http://127.0.0.1:3011/api/local-health' -TimeoutSec 5
  if ($health.app -eq 'screenshot-studio') {
    Write-Host 'Original editor is running: http://127.0.0.1:3011/'
    exit 0
  }
} catch { }
if (Get-NetTCPConnection -LocalPort 3011 -State Listen -ErrorAction SilentlyContinue) {
  throw 'Port 3011 is occupied. No existing service was stopped.'
}
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
if (!(Test-Path -LiteralPath $checkoutDir)) {
  & git clone https://github.com/opennookorg/screenshot-studio.git $checkoutDir
  if ($LASTEXITCODE -ne 0) { throw 'Clone failed' }
  & git -C $checkoutDir checkout --detach $revision
  if ($LASTEXITCODE -ne 0) { throw 'Pinned revision checkout failed' }
}
$actualRevision = & git -C $checkoutDir rev-parse HEAD
if ($actualRevision -ne $revision) { throw 'Checkout is on a different revision; left unchanged.' }
& $nodeExe (Join-Path $PSScriptRoot 'configure-local.mjs') $checkoutDir
if ($LASTEXITCODE -ne 0) { throw 'Local configuration failed' }
Push-Location $checkoutDir
try {
  if (!(Test-Path 'node_modules/next/dist/bin/next')) {
    # The pinned upstream lock omits @swc/helpers@0.5.23; npm install repairs it.
    & $npmExe install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed' }
  }
  & $nodeExe 'node_modules/prisma/build/index.js' generate
  if ($LASTEXITCODE -ne 0) { throw 'Prisma client generation failed' }
  $oldLocal = $env:LOCAL_RESEARCH
  $oldPublic = $env:NEXT_PUBLIC_LOCAL_RESEARCH
  $oldTelemetry = $env:NEXT_TELEMETRY_DISABLED
  try {
    $env:LOCAL_RESEARCH = '1'
    $env:NEXT_PUBLIC_LOCAL_RESEARCH = '1'
    $env:NEXT_TELEMETRY_DISABLED = '1'
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $serverProcess = Start-Process -FilePath $nodeExe -ArgumentList @('node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port','3011') -WorkingDirectory $checkoutDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir "$stamp.log") -RedirectStandardError (Join-Path $runtimeDir "$stamp-error.log") -PassThru
    $serverProcess.Id | Set-Content (Join-Path $runtimeDir 'server.pid')
  } finally {
    $env:LOCAL_RESEARCH = $oldLocal
    $env:NEXT_PUBLIC_LOCAL_RESEARCH = $oldPublic
    $env:NEXT_TELEMETRY_DISABLED = $oldTelemetry
  }
} finally { Pop-Location }
Write-Host 'Starting: http://127.0.0.1:3011/   Code: http://127.0.0.1:3011/code'
Write-Host 'First page compilation can take 1-2 minutes. Logs are in upstream/screenshot-studio-runtime.'
