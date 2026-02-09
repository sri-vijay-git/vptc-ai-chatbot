@echo off
echo =================================
echo VPTC AI Chatbot - Frontend Server
echo =================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing Node.js dependencies...
    echo This may take a few minutes...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed!
        echo Make sure Node.js is installed and in your PATH.
        echo Download from: https://nodejs.org/
        pause
        exit /b 1
    )
)

echo.
echo Starting frontend server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev
