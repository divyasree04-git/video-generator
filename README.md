# 🎬 AI Animated Video Generator

A powerful web application that generates stunning animated videos from text prompts using advanced AI models. Create videos of any length with multiple animation styles, preview them instantly, and download in high quality.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **🤖 AI-Powered Generation**: Uses state-of-the-art AI models (AnimateDiff, Stable Video Diffusion, etc.)
- **📏 Flexible Duration**: Generate videos from 3 seconds to 60+ seconds
- **🎨 Multiple Styles**: Choose from anime, realistic, cartoon, 3D animation styles
- **⚡ Real-time Progress**: Live updates on generation status with progress tracking
- **💾 Instant Download**: Download generated videos in MP4 format
- **📚 Generation History**: View and manage all your previously generated videos
- **🎯 Example Prompts**: Pre-made prompts to get you started quickly
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- (Optional) Replicate API token for AI generation

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd video-generator
```

2. **Create a virtual environment** (recommended)
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables** (optional for AI generation)
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
REPLICATE_API_TOKEN=your_replicate_token_here
```

To get a Replicate API token:
- Go to [https://replicate.com](https://replicate.com)
- Sign up for a free account
- Navigate to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
- Copy your API token

5. **Run the application**
```bash
python app.py
```

6. **Open your browser**

Navigate to: `http://localhost:5000`

## 🎯 Usage

### Generating a Video

1. **Enter a prompt**: Describe the animated video you want to create
   - Example: "A cute robot dancing in a futuristic city at sunset with neon lights"

2. **Set duration**: Choose video length (3-60 seconds)

3. **Select style**: Pick an animation style
   - Default
   - Anime
   - Realistic
   - Cartoon
   - 3D Animation

4. **Click "Generate Video"**: Wait for the AI to create your video

5. **Download**: Once complete, preview and download your video

### Example Prompts

Try these prompts to get started:

- 🌟 "A magical forest with glowing fireflies and mystical creatures at night"
- 🤖 "A futuristic robot cooking in a high-tech kitchen"
- 🚀 "An astronaut floating in space with colorful nebulas in the background"
- 🎹 "A cute cat playing piano in a cozy living room"
- 🐬 "Underwater scene with dolphins and coral reefs with sunlight streaming through water"

## 🛠️ Technical Details

### Architecture

- **Backend**: Flask (Python web framework)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Video Generation**: 
  - Primary: Replicate API (AnimateDiff, Stable Video Diffusion)
  - Fallback: MoviePy (local generation with animated gradients)
- **Video Format**: MP4 (H.264 codec)

### API Endpoints

#### POST `/api/generate`
Generate a new video from a text prompt.

**Request Body:**
```json
{
  "prompt": "A cute robot dancing",
  "duration": 5,
  "style": "anime"
}
```

**Response:**
```json
{
  "task_id": "uuid-here",
  "message": "Video generation started",
  "status": "pending"
}
```

#### GET `/api/status/{task_id}`
Check the status of a video generation task.

**Response:**
```json
{
  "status": "completed",
  "progress": 100,
  "message": "Video generated successfully!",
  "video_url": "/download/uuid.mp4",
  "prompt": "A cute robot dancing",
  "duration": 5,
  "style": "anime"
}
```

#### GET `/download/{filename}`
Download a generated video file.

#### GET `/api/history`
Get a list of all completed video generations.

**Response:**
```json
[
  {
    "task_id": "uuid",
    "prompt": "A cute robot dancing",
    "status": "completed",
    "video_url": "/download/uuid.mp4",
    "created_at": "2025-10-05T12:00:00"
  }
]
```

## 🎨 Customization

### Modifying Styles

Edit `app.py` to add more video generation models:

```python
models = {
    'anime': 'your-model-id',
    'realistic': 'your-model-id',
    'custom': 'your-model-id',
    # Add more styles here
}
```

### Adjusting Duration Limits

Modify the duration limits in `templates/index.html`:

```html
<input 
    type="number" 
    id="duration" 
    min="3" 
    max="120"  <!-- Change maximum duration -->
    value="5"
>
```

### Styling

All CSS is in `static/css/style.css`. Customize colors, fonts, and layouts as needed.

## 🔧 Troubleshooting

### Video generation fails

**Problem**: API errors or timeout

**Solutions**:
- Check your API key is correctly set in `.env`
- Ensure you have API credits available
- Try a shorter duration
- Check your internet connection

### Installation issues

**Problem**: Dependencies fail to install

**Solutions**:
```bash
# Upgrade pip
pip install --upgrade pip

# Install with specific versions
pip install -r requirements.txt --no-cache-dir

# On Linux, you may need system dependencies
sudo apt-get install python3-dev ffmpeg
```

### Video playback issues

**Problem**: Videos don't play in browser

**Solutions**:
- Ensure your browser supports H.264 MP4
- Try downloading and playing in VLC or another media player
- Check that FFmpeg is properly installed

## 📊 Performance

- **Generation Time**: 30 seconds to 5 minutes (depending on duration and complexity)
- **Supported Duration**: 3-60 seconds (can be extended)
- **Resolution**: Varies by model (typically 512x512 to 1024x1024)
- **Frame Rate**: 8-30 fps (depending on model)

## 🔒 Security

- All user inputs are sanitized
- Generated videos are stored locally
- API keys are stored in environment variables (never committed)
- CORS is enabled for API access

## 🌟 Future Enhancements

- [ ] Multiple AI model providers (OpenAI, Stability AI, etc.)
- [ ] Custom video resolution settings
- [ ] Audio generation and synchronization
- [ ] Video editing capabilities
- [ ] User authentication and personal galleries
- [ ] Batch video generation
- [ ] Video templates and presets
- [ ] Social media integration
- [ ] Advanced prompt engineering tools

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the API documentation

## 🙏 Acknowledgments

- [Replicate](https://replicate.com) for AI model hosting
- [AnimateDiff](https://animatediff.github.io/) for animation generation
- [Stable Video Diffusion](https://stability.ai/) for video generation
- [MoviePy](https://zulko.github.io/moviepy/) for video processing
- [Flask](https://flask.palletsprojects.com/) for the web framework

## 📸 Screenshots

### Main Interface
The clean and intuitive interface makes it easy to generate videos with just a few clicks.

### Generation Progress
Real-time progress tracking keeps you informed throughout the generation process.

### Video Result
Preview and download your generated videos instantly.

### History Gallery
Access all your previously generated videos in a beautiful gallery view.

---

Made with ❤️ using AI Technology

**Start creating amazing animated videos today!** 🎬✨
