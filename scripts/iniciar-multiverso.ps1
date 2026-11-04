# Abre el Multiverso en Edge dandole prioridad de recursos. Solo ASCII a proposito (compatibilidad).
$ErrorActionPreference = 'SilentlyContinue'
$carpeta = Split-Path -Parent $MyInvocation.MyCommand.Path
$pagina  = 'file:///' + ($carpeta.Replace('\', '/')) + '/index.html'
$perfil  = Join-Path $env:LOCALAPPDATA 'MultiversoPerfil'
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { Start-Process (Join-Path $carpeta 'index.html'); exit }

# 1) Plan de energia: Alto rendimiento mientras dure la presentacion (se restaura al cerrar).
$planAnterior = $null
$activo = (powercfg /getactivescheme) -join ' '
if ($activo -match '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})') { $planAnterior = $Matches[1] }
$altoRendimiento = '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c'
if ($planAnterior -and $activo -notmatch 'Alto rendimiento|High performance|Maximo rendimiento|Ultimate' -and $planAnterior -ne $altoRendimiento) { powercfg /setactive $altoRendimiento | Out-Null } else { $planAnterior = $null }

# 2) Edge con perfil propio, aceleracion por GPU y sin ahorro de segundo plano.
$opciones = @('--start-fullscreen', '--no-first-run', "--user-data-dir=$perfil",
  '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--enable-zero-copy',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  '--disable-extensions', '--disable-sync', '--disable-component-update', '--disable-breakpad', $pagina)
Start-Process -FilePath $edge -ArgumentList $opciones

# 3) Prioridad alta para los procesos de esta presentacion (se reintenta unos segundos: Edge los crea de a poco).
$principal = $null
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  $procs = Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | Where-Object { $_.CommandLine -like '*MultiversoPerfil*' }
  foreach ($p in $procs) { try { (Get-Process -Id $p.ProcessId).PriorityClass = 'High' } catch {} }
  if (-not $principal) { $principal = $procs | Where-Object { $_.CommandLine -notlike '*--type=*' } | Select-Object -First 1 }
  if ($i -gt 12 -and $principal) { break }
}

# 4) Al cerrar la presentacion, se restaura el plan de energia anterior.
if ($principal) { Wait-Process -Id $principal.ProcessId }
if ($planAnterior) { powercfg /setactive $planAnterior | Out-Null }
