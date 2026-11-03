@echo off
rem Abre el Multiverso en pantalla completa con Microsoft Edge. No necesita internet ni servidor.
set "RUTA=%~dp0index.html"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --start-fullscreen --no-first-run --user-data-dir="%LOCALAPPDATA%\MultiversoPerfil" "file:///%RUTA:\=/%"
) else (
  start "" "%RUTA%"
)
