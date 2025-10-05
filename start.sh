#!/bin/bash

echo "🎬 Starting Animated Video Generator..."

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client
    npm install
    cd ..
fi

# Create necessary directories
mkdir -p server/generated
mkdir -p server/generated/frames

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  Warning: FFmpeg is not installed or not in PATH"
    echo "   Please install FFmpeg to generate videos"
    echo "   Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   macOS: brew install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/"
fi

echo "🚀 Starting the application..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend API will be available at: http://localhost:5000"
echo "   WebSocket server will be available at: ws://localhost:8080"
echo ""

# Start the application
npm run dev