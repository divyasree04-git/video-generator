# 🎬 Animated Video Generator

Transform your text prompts into stunning animated videos with AI-powered generation. Create videos of any length with multiple animation styles and download them in high quality.

## ✨ Features

- **Multiple Animation Styles**: Choose from 8 different animation styles including 3D, motion graphics, whiteboard, cartoon, and more
- **Customizable Duration**: Generate videos from 5 seconds to 60 seconds
- **High Quality Output**: Support for HD, Full HD, 2K, and 4K resolutions
- **Real-time Progress**: Live progress tracking during video generation
- **Instant Download**: Download your generated videos immediately
- **Share Functionality**: Share your videos with others
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🎨 Animation Styles

1. **Animated** - Classic 2D animation with bouncing effects
2. **3D** - Three-dimensional rotating text effects
3. **Motion Graphics** - Modern geometric motion graphics
4. **Whiteboard** - Hand-drawn whiteboard animation style
5. **Infographic** - Data visualization and chart animations
6. **Cartoon** - Bright, colorful cartoon-style animations
7. **Realistic** - Realistic text with depth and shadows
8. **Abstract** - Artistic abstract animations with flowing colors

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- FFmpeg installed on your system
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd animated-video-generator
   ```

2. **Run the installation script**
   ```bash
   ./install.sh
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Installation

If you prefer to install manually:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Start both servers
npm run dev
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **FFmpeg** - Video processing
- **Canvas** - Image generation
- **WebSocket** - Real-time updates
- **Sharp** - Image processing

### Frontend
- **React** - UI framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Player** - Video playback
- **Axios** - HTTP client

## 📖 API Endpoints

### Generate Video
```http
POST /api/generate-video
Content-Type: application/json

{
  "prompt": "Your video description",
  "duration": 10,
  "style": "animated",
  "resolution": "1920x1080",
  "fps": 30
}
```

### Get Video Status
```http
GET /api/video/{jobId}
```

### Download Video
```http
GET /api/download/{jobId}
```

### Get Available Styles
```http
GET /api/styles
```

## 🎯 Usage

1. **Enter your prompt**: Describe the video you want to create
2. **Choose style**: Select from 8 different animation styles
3. **Customize settings**: Adjust duration, resolution, and FPS
4. **Generate**: Click "Generate Video" and watch the progress
5. **Download**: Once complete, download your video

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

### Video Settings

- **Duration**: 5-60 seconds
- **Resolution**: 1280x720, 1920x1080, 2560x1440, 3840x2160
- **FPS**: 24-60 frames per second

## 🔧 Development

### Project Structure

```
animated-video-generator/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── videoGenerator.js  # Video generation logic
│   └── generated/         # Generated videos
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production
- `npm start` - Start production server

## 🎥 How It Works

1. **Text Analysis**: The system analyzes your text prompt
2. **Frame Generation**: Creates individual frames based on the selected style
3. **Animation Logic**: Applies animation effects and transitions
4. **Video Compilation**: Combines frames into a video using FFmpeg
5. **Quality Optimization**: Applies compression and quality settings
6. **Delivery**: Provides download and sharing options

## 🚨 Troubleshooting

### Common Issues

1. **FFmpeg not found**
   - Install FFmpeg on your system
   - Make sure it's in your PATH

2. **Video generation fails**
   - Check server logs for detailed error messages
   - Ensure sufficient disk space
   - Verify FFmpeg installation

3. **Slow generation**
   - Reduce video duration or resolution
   - Lower FPS settings
   - Check system resources

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space
- **CPU**: Multi-core processor recommended
- **OS**: Windows, macOS, or Linux

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FFmpeg for video processing
- React community for excellent tools
- Canvas API for image generation
- All contributors and users

## 📞 Support

If you encounter any issues or have questions:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Happy Video Creating! 🎬✨**