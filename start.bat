@echo off
echo 🎬 AI Animated Video Generator
echo ==============================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create necessary directories
echo 📁 Creating directories...
if not exist "generated_videos" mkdir generated_videos

REM Check for .env file
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from example...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your API keys for AI generation
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting server...
echo.

REM Run the application
python app.py

pause
