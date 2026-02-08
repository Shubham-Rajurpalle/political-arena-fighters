@echo off
echo.
echo ========================================
echo   Political Arena Fighters - Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo [OK] npm found
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Setup Complete!
    echo ========================================
    echo.
    echo To start the game, run:
    echo    npm run dev
    echo.
    echo Controls:
    echo    Arrow Keys - Move
    echo    Z - Light Attack
    echo    X - Heavy Attack
    echo    C - Ranged Attack
    echo    A - Block
    echo    S - Special
    echo    D - Ultimate
    echo.
    echo Have fun!
    echo.
) else (
    echo.
    echo Installation failed!
    echo Please check the error messages above.
    echo.
)

pause
