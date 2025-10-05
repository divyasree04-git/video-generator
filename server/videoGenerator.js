const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const GIFEncoder = require('gifencoder');
const puppeteer = require('puppeteer');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

class VideoGenerator {
  constructor() {
    this.generatedDir = path.join(__dirname, 'generated');
  }

  async generateVideo(options, progressCallback) {
    const { prompt, duration, style, resolution, fps, jobId } = options;
    
    try {
      progressCallback(10, 'Initializing video generation...');
      
      // Parse resolution
      const [width, height] = resolution.split('x').map(Number);
      const totalFrames = duration * fps;
      
      progressCallback(20, 'Creating animation frames...');
      
      // Generate frames based on style
      const frames = await this.generateFrames(prompt, style, width, height, totalFrames, fps, progressCallback);
      
      progressCallback(70, 'Compiling video...');
      
      // Create video from frames
      const videoPath = path.join(this.generatedDir, `${jobId}.mp4`);
      await this.createVideoFromFrames(frames, videoPath, fps, progressCallback);
      
      progressCallback(90, 'Finalizing video...');
      
      // Clean up temporary files
      this.cleanupFrames(frames);
      
      progressCallback(100, 'Video generation completed!');
      
      return { success: true, videoPath };
      
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  async generateFrames(prompt, style, width, height, totalFrames, fps, progressCallback) {
    const frames = [];
    const frameDir = path.join(this.generatedDir, 'frames', Date.now().toString());
    
    if (!fs.existsSync(frameDir)) {
      fs.mkdirSync(frameDir, { recursive: true });
    }

    for (let i = 0; i < totalFrames; i++) {
      const progress = 20 + (i / totalFrames) * 50;
      progressCallback(progress, `Generating frame ${i + 1}/${totalFrames}...`);
      
      const frame = await this.createFrame(prompt, style, width, height, i, totalFrames);
      const framePath = path.join(frameDir, `frame_${i.toString().padStart(6, '0')}.png`);
      
      await frame.save(framePath);
      frames.push(framePath);
    }

    return frames;
  }

  async createFrame(prompt, style, width, height, frameIndex, totalFrames) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate animation progress
    const progress = frameIndex / totalFrames;
    
    switch (style) {
      case 'animated':
        return this.createAnimatedFrame(ctx, prompt, width, height, progress);
      case '3d':
        return this.create3DFrame(ctx, prompt, width, height, progress);
      case 'motion-graphics':
        return this.createMotionGraphicsFrame(ctx, prompt, width, height, progress);
      case 'whiteboard':
        return this.createWhiteboardFrame(ctx, prompt, width, height, progress);
      case 'infographic':
        return this.createInfographicFrame(ctx, prompt, width, height, progress);
      case 'cartoon':
        return this.createCartoonFrame(ctx, prompt, width, height, progress);
      case 'realistic':
        return this.createRealisticFrame(ctx, prompt, width, height, progress);
      case 'abstract':
        return this.createAbstractFrame(ctx, prompt, width, height, progress);
      default:
        return this.createAnimatedFrame(ctx, prompt, width, height, progress);
    }
  }

  createAnimatedFrame(ctx, prompt, width, height, progress) {
    // Animated text with bouncing effect
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    const bounceY = height / 2 + Math.sin(progress * Math.PI * 4) * 20;
    const textX = width / 2;
    const textY = bounceY;
    
    // Add glow effect
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.fillText(prompt, textX, textY);
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Add animated particles
    this.addParticles(ctx, width, height, progress);
    
    return ctx.canvas;
  }

  create3DFrame(ctx, prompt, width, height, progress) {
    // 3D rotating text effect
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    const rotation = progress * Math.PI * 2;
    const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
    
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    // 3D effect with multiple layers
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 - i * 0.04})`;
      ctx.fillText(prompt, i * 2, i * 2);
    }
    
    ctx.restore();
    
    return ctx.canvas;
  }

  createMotionGraphicsFrame(ctx, prompt, width, height, progress) {
    // Modern motion graphics with geometric shapes
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Animated background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
    gradient.addColorStop(0, `hsl(${progress * 360}, 70%, 20%)`);
    gradient.addColorStop(1, `hsl(${(progress * 360 + 180) % 360}, 70%, 10%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Animated shapes
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 10; i++) {
      const angle = (progress * Math.PI * 2) + (i * Math.PI / 5);
      const radius = 100 + Math.sin(progress * Math.PI * 4 + i) * 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 10 + Math.sin(progress * Math.PI * 2 + i) * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(prompt, centerX, centerY);
    
    return ctx.canvas;
  }

  createWhiteboardFrame(ctx, prompt, width, height, progress) {
    // Whiteboard drawing effect
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Animated drawing effect
    const textProgress = Math.min(progress * 2, 1);
    const visibleText = prompt.substring(0, Math.floor(prompt.length * textProgress));
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    
    // Simulate handwriting with slight offset
    const offsetX = Math.sin(progress * Math.PI * 4) * 2;
    const offsetY = Math.cos(progress * Math.PI * 4) * 2;
    
    ctx.fillText(visibleText, width / 2 + offsetX, height / 2 + offsetY);
    
    // Add drawing cursor
    if (textProgress < 1) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(width / 2 + 200, height / 2 - 20, 2, 30);
    }
    
    return ctx.canvas;
  }

  createInfographicFrame(ctx, prompt, width, height, progress) {
    // Data visualization style
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Animated charts
    const chartWidth = width * 0.8;
    const chartHeight = 200;
    const chartX = (width - chartWidth) / 2;
    const chartY = height / 2 - 100;
    
    // Bar chart animation
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < 5; i++) {
      const barHeight = (Math.sin(progress * Math.PI * 2 + i) * 0.5 + 0.5) * chartHeight;
      const barWidth = chartWidth / 5 - 10;
      const barX = chartX + i * (barWidth + 10);
      const barY = chartY + chartHeight - barHeight;
      
      ctx.fillRect(barX, barY, barWidth, barHeight);
    }
    
    // Text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(prompt, width / 2, chartY - 20);
    
    return ctx.canvas;
  }

  createCartoonFrame(ctx, prompt, width, height, progress) {
    // Cartoon style with bright colors
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.5, '#4ecdc4');
    gradient.addColorStop(1, '#45b7d1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Cartoon clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const cloudX = (progress * width * 2 + i * 200) % (width + 100) - 50;
      const cloudY = 50 + Math.sin(progress * Math.PI * 2 + i) * 20;
      this.drawCloud(ctx, cloudX, cloudY);
    }
    
    // Bouncing text
    const bounceY = height / 2 + Math.sin(progress * Math.PI * 4) * 30;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(prompt, width / 2, bounceY);
    ctx.fillText(prompt, width / 2, bounceY);
    
    return ctx.canvas;
  }

  createRealisticFrame(ctx, prompt, width, height, progress) {
    // Realistic style with depth
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Realistic text with shadow
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    // Text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(prompt, width / 2 + 3, height / 2 + 3);
    
    // Main text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(prompt, width / 2, height / 2);
    
    return ctx.canvas;
  }

  createAbstractFrame(ctx, prompt, width, height, progress) {
    // Abstract artistic style
    const hue = (progress * 360) % 360;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 70%, 30%)`);
    gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, 70%, 20%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Abstract shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      const angle = (progress * Math.PI * 2) + (i * Math.PI / 10);
      const radius = 50 + Math.sin(progress * Math.PI * 4 + i) * 100;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 20 + Math.sin(progress * Math.PI * 2 + i) * 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Text with artistic effect
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(prompt, width / 2, height / 2);
    
    return ctx.canvas;
  }

  addParticles(ctx, width, height, progress) {
    // Add floating particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 50; i++) {
      const x = (progress * width * 2 + i * 50) % (width + 20) - 10;
      const y = height / 2 + Math.sin(progress * Math.PI * 2 + i) * 100;
      const size = 2 + Math.sin(progress * Math.PI * 4 + i) * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCloud(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 25, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  async createVideoFromFrames(frames, outputPath, fps, progressCallback) {
    return new Promise((resolve, reject) => {
      const framePattern = path.dirname(frames[0]) + '/frame_%06d.png';
      
      ffmpeg()
        .input(framePattern)
        .inputFPS(fps)
        .outputOptions([
          '-c:v libx264',
          '-pix_fmt yuv420p',
          '-crf 23',
          '-preset medium'
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          const percent = Math.round(progress.percent || 0);
          progressCallback(70 + (percent * 0.2), `Compiling video: ${percent}%`);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  }

  cleanupFrames(frames) {
    const frameDir = path.dirname(frames[0]);
    if (fs.existsSync(frameDir)) {
      fs.rmSync(frameDir, { recursive: true, force: true });
    }
  }
}

module.exports = VideoGenerator;