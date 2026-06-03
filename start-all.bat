@echo off
chcp 65001 >nul
echo ========================================
echo   MERN-TTP - Starting All Services
echo ========================================
echo.

REM 1. Start Express Server (background)
echo [1/2] Starting Express Server on port 5000...
start "MERN-Server" cmd /k "cd /d C:\Users\OS\Desktop\Mern-TTP\Mern-TTP\server && node server.js"
timeout /t 3 /nobreak >nul

REM 2. Start Nginx (port 80)
echo [2/2] Starting Nginx on port 80...
cd /d C:\nginx
start "" nginx.exe
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All services started successfully!
echo ========================================
echo.
echo   Client:  http://truongthanhphatdn.vn
echo   Admin:   http://admin.truongthanhphatdn.vn
echo   API:     http://localhost:5000
echo.
echo   To stop all services, run stop-all.bat
echo ========================================
pause
