$ErrorActionPreference='Stop'
$workspaceDir=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$runtimeDir=Join-Path $workspaceDir 'upstream/the-long-silence-runtime'
foreach($service in @(@{Name='game';Port=5112;Executable='node';Match='vite/bin/vite.js'},@{Name='guide';Port=8012;Executable='python';Match='http.server'})){
 $pidPath=Join-Path $runtimeDir ($service.Name+'.pid')
 if(!(Test-Path -LiteralPath $pidPath)){continue}
 $serverPid=[int](Get-Content -LiteralPath $pidPath)
 $proc=Get-CimInstance Win32_Process -Filter "ProcessId=$serverPid" -ErrorAction SilentlyContinue
 $listener=Get-NetTCPConnection -LocalPort $service.Port -State Listen -ErrorAction SilentlyContinue
 if($proc -and $proc.Name -like ($service.Executable+'*') -and $proc.CommandLine -like ('*'+$service.Match+'*') -and $proc.CommandLine -match [string]$service.Port -and $listener.OwningProcess -contains $serverPid){
  Stop-Process -Id $serverPid
  Write-Host ('Stopped '+$service.Name+' on port '+$service.Port)
 }else{Write-Host ('No matching '+$service.Name+' process; left unchanged.')}
}
