// AI Video Generator - Backend Server
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = './uploads';
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'));
        }
    }
});

// In-memory storage for generation jobs (in production, use Redis or database)
const generationJobs = new Map();

// Video generation styles and their configurations
const videoStyles = {
    cartoon: {
        name: 'Cartoon',
        description: 'Colorful, animated cartoon style',
        processingTime: 1.2
    },
    realistic: {
        name: 'Realistic',
        description: 'Photorealistic video generation',
        processingTime: 2.0
    },
    anime: {
        name: 'Anime',
        description: 'Japanese animation style',
        processingTime: 1.5
    },
    '3d': {
        name: '3D Animation',
        description: 'Three-dimensional animated style',
        processingTime: 2.5
    },
    watercolor: {
        name: 'Watercolor',
        description: 'Artistic watercolor painting style',
        processingTime: 1.8
    },
    sketch: {
        name: 'Sketch',
        description: 'Hand-drawn sketch style',
        processingTime: 1.3
    },
    pixel: {
        name: 'Pixel Art',
        description: '8-bit pixel art style',
        processingTime: 1.0
    },
    abstract: {
        name: 'Abstract',
        description: 'Abstract artistic style',
        processingTime: 1.6
    },
    cinematic: {
        name: 'Cinematic',
        description: 'Movie-like cinematic style',
        processingTime: 2.2
    },
    vintage: {
        name: 'Vintage',
        description: 'Retro vintage style',
        processingTime: 1.4
    }
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Get available video styles
app.get('/api/styles', (req, res) => {
    res.json(videoStyles);
});

// Generate video endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const {
            prompt,
            duration = 30,
            style = 'cartoon',
            resolution = '1080p',
            fps = 30,
            music = 'none',
            voiceover = 'none',
            transitions = 'smooth'
        } = req.body;

        // Validate input
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Prompt is required',
                code: 'MISSING_PROMPT'
            });
        }

        if (duration < 1 || duration > 600) {
            return res.status(400).json({ 
                error: 'Duration must be between 1 and 600 seconds',
                code: 'INVALID_DURATION'
            });
        }

        if (!videoStyles[style]) {
            return res.status(400).json({ 
                error: 'Invalid video style',
                code: 'INVALID_STYLE'
            });
        }

        // Create generation job
        const jobId = uuidv4();
        const job = {
            id: jobId,
            prompt: prompt.trim(),
            duration,
            style,
            resolution,
            fps,
            music,
            voiceover,
            transitions,
            status: 'queued',
            progress: 0,
            createdAt: new Date(),
            estimatedTime: Math.ceil(duration * videoStyles[style].processingTime),
            steps: [
                { name: 'Analyzing prompt', completed: false },
                { name: 'Creating scenes', completed: false },
                { name: 'Rendering video', completed: false },
                { name: 'Adding audio', completed: false },
                { name: 'Finalizing', completed: false }
            ]
        };

        generationJobs.set(jobId, job);

        // Start video generation process (async)
        generateVideoAsync(jobId);

        res.json({
            jobId,
            estimatedTime: job.estimatedTime,
            message: 'Video generation started'
        });

    } catch (error) {
        console.error('Error starting video generation:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            code: 'GENERATION_ERROR'
        });
    }
});

// Get generation status
app.get('/api/status/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = generationJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ 
            error: 'Job not found',
            code: 'JOB_NOT_FOUND'
        });
    }

    res.json({
        id: job.id,
        status: job.status,
        progress: job.progress,
        steps: job.steps,
        estimatedTime: job.estimatedTime,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.error,
        videoUrl: job.videoUrl
    });
});

// Cancel generation
app.delete('/api/generate/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = generationJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ 
            error: 'Job not found',
            code: 'JOB_NOT_FOUND'
        });
    }

    if (job.status === 'completed') {
        return res.status(400).json({ 
            error: 'Cannot cancel completed job',
            code: 'JOB_COMPLETED'
        });
    }

    job.status = 'cancelled';
    job.completedAt = new Date();

    res.json({ message: 'Job cancelled successfully' });
});

// Download video
app.get('/api/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const job = generationJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ 
            error: 'Job not found',
            code: 'JOB_NOT_FOUND'
        });
    }

    if (job.status !== 'completed' || !job.videoPath) {
        return res.status(400).json({ 
            error: 'Video not ready for download',
            code: 'VIDEO_NOT_READY'
        });
    }

    try {
        const videoPath = job.videoPath;
        const filename = `ai-video-${jobId}.mp4`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Stream the video file
        const fs = require('fs');
        const stream = fs.createReadStream(videoPath);
        stream.pipe(res);
        
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ 
            error: 'Error downloading video',
            code: 'DOWNLOAD_ERROR'
        });
    }
});

// Upload reference media
app.post('/api/upload', upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No file uploaded',
                code: 'NO_FILE'
            });
        }

        const fileInfo = {
            id: uuidv4(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            uploadedAt: new Date()
        };

        res.json({
            message: 'File uploaded successfully',
            file: fileInfo
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ 
            error: 'Upload failed',
            code: 'UPLOAD_ERROR'
        });
    }
});

// Get generation history
app.get('/api/history', (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    
    const jobs = Array.from(generationJobs.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + parseInt(limit))
        .map(job => ({
            id: job.id,
            prompt: job.prompt.substring(0, 100) + (job.prompt.length > 100 ? '...' : ''),
            style: job.style,
            duration: job.duration,
            status: job.status,
            createdAt: job.createdAt,
            completedAt: job.completedAt
        }));

    res.json({
        jobs,
        total: generationJobs.size,
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
});

// Async video generation function
async function generateVideoAsync(jobId) {
    const job = generationJobs.get(jobId);
    if (!job) return;

    try {
        job.status = 'processing';
        job.startedAt = new Date();

        // Simulate video generation process
        const steps = job.steps;
        const totalSteps = steps.length;
        
        for (let i = 0; i < totalSteps; i++) {
            if (job.status === 'cancelled') return;
            
            // Update current step
            steps[i].completed = false;
            steps[i].active = true;
            job.progress = (i / totalSteps) * 90; // Reserve 10% for finalization
            
            // Simulate processing time
            const stepTime = (job.estimatedTime / totalSteps) * 1000;
            await sleep(stepTime);
            
            if (job.status === 'cancelled') return;
            
            // Complete current step
            steps[i].completed = true;
            steps[i].active = false;
        }

        // Generate the actual video file
        const videoPath = await createVideoFile(job);
        
        // Finalize
        job.progress = 100;
        job.status = 'completed';
        job.completedAt = new Date();
        job.videoPath = videoPath;
        job.videoUrl = `/api/download/${jobId}`;
        
        // Clean up old jobs (keep only last 100)
        if (generationJobs.size > 100) {
            const oldestJobs = Array.from(generationJobs.entries())
                .sort((a, b) => new Date(a[1].createdAt) - new Date(b[1].createdAt))
                .slice(0, generationJobs.size - 100);
            
            for (const [oldJobId] of oldestJobs) {
                const oldJob = generationJobs.get(oldJobId);
                if (oldJob && oldJob.videoPath) {
                    try {
                        await fs.unlink(oldJob.videoPath);
                    } catch (error) {
                        console.error('Error deleting old video file:', error);
                    }
                }
                generationJobs.delete(oldJobId);
            }
        }

    } catch (error) {
        console.error('Error generating video:', error);
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date();
    }
}

// Create actual video file (simplified implementation)
async function createVideoFile(job) {
    const outputDir = './generated_videos';
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `video_${job.id}_${Date.now()}.mp4`;
    const videoPath = path.join(outputDir, filename);
    
    // In a real implementation, this would use FFmpeg or similar to create actual video
    // For demo purposes, we'll create a placeholder video file
    const videoSize = Math.max(1024 * 1024, job.duration * 100 * 1024); // Minimum 1MB
    const videoData = Buffer.alloc(videoSize);
    
    // Fill with some demo data to simulate a real video file
    for (let i = 0; i < videoData.length; i += 4) {
        videoData.writeUInt32BE(Math.floor(Math.random() * 0xFFFFFFFF), i);
    }
    
    await fs.writeFile(videoPath, videoData);
    
    return videoPath;
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'File too large',
                code: 'FILE_TOO_LARGE'
            });
        }
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        code: 'NOT_FOUND'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Video Generator Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to access the application`);
    console.log(`🔧 API endpoints available at http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;