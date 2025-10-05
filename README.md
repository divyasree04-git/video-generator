# 🎬 AI Video Generator

A powerful web application that generates animated videos from text prompts using artificial intelligence. Create stunning videos in various styles, from cartoon animations to cinematic masterpieces, all from simple text descriptions.

## ✨ Features

### 🎯 Core Functionality
- **Text-to-Video Generation**: Transform any text prompt into animated videos
- **Multiple Animation Styles**: Choose from 10+ styles including cartoon, realistic, anime, 3D, watercolor, and more
- **Flexible Duration**: Generate videos from 10 seconds to 10+ minutes
- **High Quality Output**: Support for HD, Full HD, and 4K resolution
- **Variable Frame Rates**: 24fps, 30fps, or 60fps options

### 🎨 Advanced Features
- **Background Music Integration**: Add upbeat, calm, dramatic, electronic, or classical music
- **AI Voice-over**: Male, female, child, or robot voice options
- **Transition Effects**: Smooth, quick cuts, fade, slide, or zoom transitions
- **Real-time Progress Tracking**: Visual progress indicators with step-by-step updates
- **Instant Download**: Download generated videos in MP4 format

### 🔧 Technical Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful, intuitive interface with smooth animations
- **RESTful API**: Complete backend API for video generation and management
- **File Upload Support**: Upload reference images or videos
- **Generation History**: Track and manage your video generation history

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have git
   git clone <repository-url>
   cd ai-video-generator
   
   # Or simply ensure all files are in your project directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create required directories**
   ```bash
   mkdir -p uploads generated_videos
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## 📖 Usage Guide

### Basic Video Generation

1. **Enter Your Prompt**
   - Describe the video you want to create
   - Be specific about characters, actions, and settings
   - Example: "A cute cat dancing in a colorful garden with butterflies flying around"

2. **Choose Settings**
   - **Duration**: Select from preset options or enter custom duration
   - **Style**: Pick from cartoon, realistic, anime, 3D, etc.
   - **Resolution**: HD (720p), Full HD (1080p), or 4K
   - **Frame Rate**: 24fps, 30fps, or 60fps

3. **Advanced Options** (Optional)
   - **Background Music**: Add atmospheric music
   - **Voice-over**: Include AI-generated narration
   - **Transitions**: Choose how scenes connect

4. **Generate & Download**
   - Click "Generate Video" and wait for processing
   - Download your video when complete

### Example Prompts

**Cartoon Style:**
```
A friendly robot teaching children about space in a colorful classroom, with planets and stars floating around
```

**Cinematic Style:**
```
A lone warrior walking through a misty forest at dawn, with golden sunlight filtering through ancient trees
```

**Watercolor Style:**
```
A peaceful lake scene with swans gliding across the water, surrounded by blooming cherry blossoms in spring
```

## 🛠️ API Documentation

### Endpoints

#### Generate Video
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Your video description",
  "duration": 30,
  "style": "cartoon",
  "resolution": "1080p",
  "fps": 30,
  "music": "upbeat",
  "voiceover": "female",
  "transitions": "smooth"
}
```

#### Check Generation Status
```http
GET /api/status/{jobId}
```

#### Download Video
```http
GET /api/download/{jobId}
```

#### Cancel Generation
```http
DELETE /api/generate/{jobId}
```

#### Get Available Styles
```http
GET /api/styles
```

#### Upload Reference Media
```http
POST /api/upload
Content-Type: multipart/form-data

FormData: media (file)
```

### Response Examples

**Generation Started:**
```json
{
  "jobId": "uuid-here",
  "estimatedTime": 45,
  "message": "Video generation started"
}
```

**Status Check:**
```json
{
  "id": "uuid-here",
  "status": "processing",
  "progress": 65,
  "steps": [
    {"name": "Analyzing prompt", "completed": true},
    {"name": "Creating scenes", "completed": true},
    {"name": "Rendering video", "completed": false},
    {"name": "Adding audio", "completed": false},
    {"name": "Finalizing", "completed": false}
  ]
}
```

## 🎨 Supported Styles

| Style | Description | Processing Time |
|-------|-------------|-----------------|
| Cartoon | Colorful, animated cartoon style | Fast |
| Realistic | Photorealistic video generation | Slow |
| Anime | Japanese animation style | Medium |
| 3D | Three-dimensional animated style | Slow |
| Watercolor | Artistic watercolor painting style | Medium |
| Sketch | Hand-drawn sketch style | Fast |
| Pixel | 8-bit pixel art style | Fast |
| Abstract | Abstract artistic style | Medium |
| Cinematic | Movie-like cinematic style | Slow |
| Vintage | Retro vintage style | Medium |

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:

```env
PORT=3000
MAX_FILE_SIZE=100MB
MAX_VIDEO_DURATION=600
CLEANUP_INTERVAL=3600000
```

### Server Configuration
Modify `server.js` for advanced settings:
- File upload limits
- CORS settings
- Rate limiting
- Security headers

## 🚀 Deployment

### Local Production
```bash
NODE_ENV=production npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
The application is ready for deployment on:
- Heroku
- Vercel
- Netlify
- AWS
- Google Cloud
- Azure

## 🛡️ Security Features

- Input validation and sanitization
- File type restrictions
- Size limits on uploads
- CORS protection
- Rate limiting
- Secure headers

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm start
```

**Large File Upload Fails**
- Check `MAX_FILE_SIZE` setting
- Ensure sufficient disk space
- Verify network timeout settings

**Video Generation Stuck**
- Check server logs
- Restart the application
- Clear browser cache

### Debug Mode
Enable detailed logging:
```bash
DEBUG=* npm start
```

## 📊 Performance

### Optimization Tips
- Use appropriate resolution for your needs
- Shorter videos process faster
- Cartoon style is fastest, realistic is slowest
- Close other applications during generation

### System Requirements
- **Minimum**: 4GB RAM, 2GB free disk space
- **Recommended**: 8GB RAM, 10GB free disk space
- **For 4K videos**: 16GB RAM, 50GB free disk space

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup
```bash
git clone <repository-url>
cd ai-video-generator
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Express.js and modern web technologies
- UI inspired by modern design principles
- Icons from Font Awesome
- Fonts from Google Fonts

## 📞 Support

For support and questions:
- 📧 Email: support@aivideogen.com
- 💬 Discord: [Join our community]
- 📖 Documentation: [Full docs]
- 🐛 Issues: [GitHub Issues]

---

**Made with ❤️ by the AI Video Generator Team**

*Transform your ideas into stunning animated videos with the power of AI!*