@echo off
chcp 65001 >nul
echo ========================================
echo   MERN-TTP - Rebuilding Frontend
echo ========================================
echo.

echo [1/2] Building Client...
cd /d C:\Users\OS\Desktop\Mern-TTP\Mern-TTP\client
call npm run build
if %errorlevel%==0 (
    echo   [OK] Client built successfully
) else (
    echo   [FAIL] Client build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Building Admin...
cd /d C:\Users\OS\Desktop\Mern-TTP\Mern-TTP\admin
call npm run build
if %errorlevel%==0 (
    echo   [OK] Admin built successfully
) else (
    echo   [FAIL] Admin build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Frontend rebuild complete!
echo   Nginx will serve the new files automatically.
echo ========================================
pause
