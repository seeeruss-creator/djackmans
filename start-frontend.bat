@echo off
cd /d "%~dp0"
echo Installing frontend dependencies...
npm install
echo.
echo Starting frontend dev server...
npm run dev
pause
