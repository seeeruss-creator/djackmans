@echo off
cd /d "%~dp0\backend"
echo Installing backend dependencies...
npm install
echo.
echo Starting backend server...
npm run dev
pause
