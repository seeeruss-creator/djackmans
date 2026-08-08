@echo off
cd /d "%~dp0"

echo ============================================
echo  D'Jackman Tailoring - Setup and Start
echo ============================================
echo.

echo [1/4] Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo ERROR: npm install failed for frontend
    pause
    exit /b 1
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
npm install
if errorlevel 1 (
    echo ERROR: npm install failed for backend
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Starting backend in a new window...
start "D'Jackman Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting frontend...
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo  Login:    http://localhost:5173/login
echo  Admin:    username=admin  password=admin123
echo.
npm run dev
pause
