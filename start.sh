#!/bin/bash

echo "🎬 AI Animated Video Generator"
echo "=============================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p generated_videos

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys for AI generation"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting server..."
echo ""

# Run the application
python app.py
