# 🚀 Quick Start Guide

Get your AI Video Generator running in 5 minutes!

## Method 1: Automatic Setup (Recommended)

### On Linux/Mac:
```bash
./start.sh
```

### On Windows:
```bash
start.bat
```

The script will:
- Create a virtual environment
- Install all dependencies
- Set up required directories
- Start the server

## Method 2: Manual Setup

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Create Directories
```bash
mkdir generated_videos
```

### Step 3: Set Up Environment (Optional)
```bash
cp .env.example .env
# Edit .env and add your API keys
```

### Step 4: Run the Server
```bash
python app.py
```

## Method 3: Docker

### Using Docker Compose:
```bash
docker-compose up
```

### Using Docker directly:
```bash
docker build -t video-generator .
docker run -p 5000:5000 video-generator
```

## 🌐 Access the Application

Once the server is running, open your browser and go to:

**http://localhost:5000**

## ✅ Verify Installation

You should see:
- ✅ Server running on http://localhost:5000
- 🎬 AI Animated Video Generator interface
- All features accessible

## 🎯 First Video

1. Enter a prompt: "A cute robot dancing"
2. Set duration: 5 seconds
3. Click "Generate Video"
4. Wait for generation (30 seconds - 3 minutes)
5. Download your video!

## ⚡ Enable AI Generation

Without API keys, the app uses fallback generation (animated gradients).

To enable full AI video generation:

1. Get a free Replicate API token:
   - Visit: https://replicate.com
   - Sign up
   - Go to: https://replicate.com/account/api-tokens
   - Copy your token

2. Add to `.env`:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```

3. Restart the server

## 🔧 Troubleshooting

### Port already in use:
```bash
# Change port in app.py (last line)
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Dependencies fail:
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### Need help?
Check the full README.md for detailed documentation.

---

**You're all set! Start creating amazing videos! 🎬✨**
