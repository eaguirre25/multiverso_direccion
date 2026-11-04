@echo off
rem Instala la presentacion de forma permanente en esta PC (carpeta Multiverso + acceso directo en el Escritorio).
setlocal
set "ORIGEN=%~dp0..\dist"
set "DESTINO=%USERPROFILE%\Multiverso"
if not exist "%ORIGEN%\index.html" (
  echo Falta compilar. Ejecuta primero: npm run build
  pause
  exit /b 1
)
robocopy "%ORIGEN%" "%DESTINO%" /MIR /NFL /NDL /NJH /NJS >nul
copy /Y "%~dp0abrir-multiverso.bat" "%DESTINO%\Abrir Multiverso.bat" >nul
copy /Y "%~dp0iniciar-multiverso.ps1" "%DESTINO%\iniciar-multiverso.ps1" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=[Environment]::GetFolderPath(\"Desktop\"); $s=(New-Object -ComObject WScript.Shell).CreateShortcut(\"$d\Multiverso de la direccion escolar.lnk\"); $s.TargetPath=\"%DESTINO%\Abrir Multiverso.bat\"; $s.WorkingDirectory=\"%DESTINO%\"; $s.WindowStyle=7; $s.IconLocation=\"${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe,0\"; $s.Save()"
echo Listo: %DESTINO%
echo Acceso directo creado en el Escritorio.
