#!/bin/bash

echo "🎬 Installing Animated Video Generator..."

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p server/generated
mkdir -p server/generated/frames

# Set permissions
chmod +x install.sh

echo "✅ Installation complete!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "📱 The app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🎥 Make sure you have FFmpeg installed on your system!"