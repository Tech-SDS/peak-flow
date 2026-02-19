@echo off
echo ==========================================
echo   PEAK FLOW - FLUID SYNC PLATFORM
echo ==========================================
echo.
echo [1/2] Installing Dependencies (this may take a minute)...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed. Please ensure Node.js is installed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Starting Development Server...
echo       The app will open at http://localhost:5174
echo.
call npm run dev
pause
