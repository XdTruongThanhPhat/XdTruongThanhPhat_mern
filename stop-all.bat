@echo off
chcp 65001 >nul
echo ========================================
echo   MERN-TTP - Stopping All Services
echo ========================================
echo.

echo Stopping Node.js server...
taskkill /F /IM node.exe 2>nul
if %errorlevel%==0 (
    echo   [OK] Node.js server stopped
) else (
    echo   [--] Node.js server was not running
)

echo Stopping Nginx...
cd /d C:\nginx
nginx.exe -s quit 2>nul
taskkill /F /IM nginx.exe 2>nul
if %errorlevel%==0 (
    echo   [OK] Nginx stopped
) else (
    echo   [--] Nginx was not running
)

echo.
echo ========================================
echo   All services stopped.
echo ========================================
pause
