@echo off
title Figs Zebra Local Printer

echo.
echo ==========================================
echo   Figs Zebra Local Printer Bridge
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Download and install Node.js LTS from:
  echo https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "%~dp0zebra-local-printer.js" (
  echo Missing file:
  echo %~dp0zebra-local-printer.js
  echo.
  echo Make sure this BAT file is in the same folder as zebra-local-printer.js
  echo.
  pause
  exit /b 1
)

if "%ZEBRA_PRINTER%"=="" (
  echo Enter Zebra printer share name.
  echo Example: Zebra
  echo.
  set /p ZEBRA_PRINTER=Printer share name: 
)

echo.
echo Starting bridge on:
echo http://127.0.0.1:17888
echo.
echo Printer share name: %ZEBRA_PRINTER%
echo.
echo Keep this window open while printing stickers.
echo.

node "%~dp0zebra-local-printer.js"

echo.
echo Local printer bridge stopped.
pause
