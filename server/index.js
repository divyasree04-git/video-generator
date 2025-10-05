const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const VideoGenerator = require('./videoGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/videos', express.static(path.join(__dirname, 'generated')));
app.use(express.static(path.join(__dirname, '../client/build')));

// Create directories
const generatedDir = path.join(__dirname, 'generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Initialize video generator
const videoGenerator = new VideoGenerator();

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

// Store active connections
const clients = new Map();

wss.on('connection', (ws, req) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);
  
  ws.on('close', () => {
    clients.delete(clientId);
  });
});

// Broadcast progress updates
function broadcastProgress(jobId, progress, message) {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'progress',
        jobId,
        progress,
        message
      }));
    }
  });
}

// Routes
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, duration, style, resolution, fps } = req.body;
    const jobId = uuidv4();
    
    res.json({ jobId, message: 'Video generation started' });
    
    // Start video generation in background
    videoGenerator.generateVideo({
      prompt,
      duration: duration || 10,
      style: style || 'animated',
      resolution: resolution || '1920x1080',
      fps: fps || 30,
      jobId
    }, (progress, message) => {
      broadcastProgress(jobId, progress, message);
    }).then((result) => {
      broadcastProgress(jobId, 100, 'Video generation completed');
    }).catch((error) => {
      broadcastProgress(jobId, -1, `Error: ${error.message}`);
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/video/:jobId', (req, res) => {
  const { jobId } = req.params;
  const videoPath = path.join(generatedDir, `${jobId}.mp4`);
  
  if (fs.existsSync(videoPath)) {
    res.json({ 
      status: 'completed',
      videoUrl: `/videos/${jobId}.mp4`,
      downloadUrl: `/api/download/${jobId}`
    });
  } else {
    res.json({ status: 'processing' });
  }
});

app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const videoPath = path.join(generatedDir, `${jobId}.mp4`);
  
  if (fs.existsSync(videoPath)) {
    res.download(videoPath, `animated-video-${jobId}.mp4`);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

app.get('/api/styles', (req, res) => {
  res.json([
    { id: 'animated', name: 'Animated', description: 'Classic 2D animation style' },
    { id: '3d', name: '3D', description: 'Three-dimensional animation' },
    { id: 'motion-graphics', name: 'Motion Graphics', description: 'Modern motion graphics' },
    { id: 'whiteboard', name: 'Whiteboard', description: 'Whiteboard drawing animation' },
    { id: 'infographic', name: 'Infographic', description: 'Data visualization style' },
    { id: 'cartoon', name: 'Cartoon', description: 'Cartoon-style animation' },
    { id: 'realistic', name: 'Realistic', description: 'Realistic animation' },
    { id: 'abstract', name: 'Abstract', description: 'Abstract artistic style' }
  ]);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on port 8080`);
});