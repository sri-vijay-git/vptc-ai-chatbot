@echo off
echo ================================
echo VPTC AI Chatbot - Backend Server
echo ================================
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv_stable\Scripts\activate.bat" (
    echo Virtual environment not found! Creating new one...
    py -3.11 -m venv venv_stable
    if errorlevel 1 (
        echo.
        echo ERROR: Python 3.11 not found!
        echo This project requires Python 3.11 or 3.12 for compatibility.
        echo Your system has Python 3.14.3 which is too new for these packages.
        echo.
        echo Please install Python 3.11 or 3.12 from python.org
        echo Then run this script again.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
call venv_stable\Scripts\activate.bat

REM Check if uvicorn is installed
python -c "import uvicorn" 2>nul
if errorlevel 1 (
    echo Installing dependencies...
    python -m pip install --upgrade pip
    pip install fastapi uvicorn[standard] python-multipart python-dotenv pydantic pydantic-settings supabase groq chromadb PyPDF2 httpx pyyaml python-jose passlib
)

echo.
echo Starting backend server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
uvicorn app.main:app --reload
