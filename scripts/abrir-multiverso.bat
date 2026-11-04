@echo off
rem Abre el Multiverso en pantalla completa priorizando los recursos de la PC. No necesita internet.
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0iniciar-multiverso.ps1"
