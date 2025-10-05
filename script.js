// AI Video Generator - Main JavaScript File

class VideoGenerator {
    constructor() {
        this.isGenerating = false;
        this.currentVideo = null;
        this.generationProgress = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAdvancedOptions();
        this.setupDurationSelector();
    }

    bindEvents() {
        // Main generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateVideo();
        });

        // Cancel generation
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelGeneration();
        });

        // Download video
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadVideo();
        });

        // Share video
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareVideo();
        });

        // Generate another video
        document.getElementById('regenerateBtn').addEventListener('click', () => {
            this.resetGenerator();
        });

        // Gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                this.playGalleryVideo(item);
            });
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupAdvancedOptions() {
        const toggleBtn = document.querySelector('.toggle-advanced');
        const panel = document.querySelector('.advanced-panel');
        
        toggleBtn.addEventListener('click', () => {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'grid';
            toggleBtn.innerHTML = isVisible 
                ? '<i class="fas fa-cog"></i> Advanced Options'
                : '<i class="fas fa-times"></i> Hide Advanced Options';
        });
    }

    setupDurationSelector() {
        const durationSelect = document.getElementById('duration');
        const customInput = document.getElementById('customDuration');
        
        durationSelect.addEventListener('change', () => {
            if (durationSelect.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    }

    async generateVideo() {
        if (this.isGenerating) return;

        const prompt = document.getElementById('prompt').value.trim();
        if (!prompt) {
            this.showNotification('Please enter a video description', 'error');
            return;
        }

        this.isGenerating = true;
        this.showProgressSection();
        this.hideResultSection();

        try {
            // Get generation parameters
            const params = this.getGenerationParams();
            
            // Start the generation process
            await this.simulateVideoGeneration(params);
            
            // Show the result
            this.showResult();
            
        } catch (error) {
            console.error('Video generation failed:', error);
            this.showNotification('Video generation failed. Please try again.', 'error');
            this.resetGenerator();
        }
    }

    getGenerationParams() {
        const durationSelect = document.getElementById('duration');
        const customDuration = document.getElementById('customDuration');
        
        return {
            prompt: document.getElementById('prompt').value.trim(),
            duration: durationSelect.value === 'custom' 
                ? parseInt(customDuration.value) || 30 
                : parseInt(durationSelect.value),
            style: document.getElementById('style').value,
            resolution: document.getElementById('resolution').value,
            fps: parseInt(document.getElementById('fps').value),
            music: document.getElementById('music').value,
            voiceover: document.getElementById('voiceover').value,
            transitions: document.getElementById('transitions').value
        };
    }

    async simulateVideoGeneration(params) {
        const steps = [
            { id: 'step1', text: 'Analyzing your prompt...', duration: 2000 },
            { id: 'step2', text: 'Creating scenes and characters...', duration: 3000 },
            { id: 'step3', text: 'Rendering video frames...', duration: 5000 },
            { id: 'step4', text: 'Adding audio and finalizing...', duration: 2000 }
        ];

        let totalProgress = 0;
        const progressIncrement = 100 / steps.length;

        for (let i = 0; i < steps.length; i++) {
            if (!this.isGenerating) return; // Check if cancelled

            const step = steps[i];
            
            // Update step status
            this.updateProgressStep(step.id, 'active');
            this.updateProgressText(step.text);
            
            // Simulate processing time with progress updates
            const stepDuration = step.duration;
            const updateInterval = 100;
            const updates = stepDuration / updateInterval;
            const progressPerUpdate = progressIncrement / updates;
            
            for (let j = 0; j < updates; j++) {
                if (!this.isGenerating) return;
                
                await this.sleep(updateInterval);
                totalProgress += progressPerUpdate;
                this.updateProgressBar(Math.min(totalProgress, 100));
            }
            
            // Mark step as completed
            this.updateProgressStep(step.id, 'completed');
        }

        // Generate the actual video data
        this.currentVideo = this.createVideoData(params);
    }

    createVideoData(params) {
        // In a real implementation, this would call an AI video generation API
        // For demo purposes, we'll create a sample video using canvas
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on resolution
        const resolutions = {
            '720p': { width: 1280, height: 720 },
            '1080p': { width: 1920, height: 1080 },
            '4k': { width: 3840, height: 2160 }
        };
        
        const res = resolutions[params.resolution];
        canvas.width = res.width;
        canvas.height = res.height;
        
        // Create a simple animated video
        const frames = [];
        const totalFrames = params.duration * params.fps;
        
        for (let i = 0; i < totalFrames; i++) {
            // Clear canvas
            ctx.fillStyle = this.getBackgroundColor(params.style);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add animated elements based on the prompt
            this.drawAnimatedFrame(ctx, i, totalFrames, params);
            
            // Convert frame to blob
            frames.push(canvas.toDataURL('image/png'));
        }
        
        // Create video blob (simplified - in reality would use WebCodecs or similar)
        const videoBlob = this.createVideoFromFrames(frames, params);
        
        return {
            blob: videoBlob,
            url: URL.createObjectURL(videoBlob),
            duration: params.duration,
            resolution: params.resolution,
            size: this.formatFileSize(videoBlob.size),
            params: params
        };
    }

    getBackgroundColor(style) {
        const colors = {
            cartoon: '#87CEEB',
            realistic: '#F0F8FF',
            anime: '#FFB6C1',
            '3d': '#E6E6FA',
            watercolor: '#F0FFFF',
            sketch: '#FFFAF0',
            pixel: '#000080',
            abstract: '#FF69B4',
            cinematic: '#2F4F4F',
            vintage: '#F5DEB3'
        };
        return colors[style] || '#87CEEB';
    }

    drawAnimatedFrame(ctx, frameIndex, totalFrames, params) {
        const progress = frameIndex / totalFrames;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        
        // Draw animated elements based on style
        switch (params.style) {
            case 'cartoon':
                this.drawCartoonAnimation(ctx, progress, centerX, centerY);
                break;
            case '3d':
                this.draw3DAnimation(ctx, progress, centerX, centerY);
                break;
            case 'watercolor':
                this.drawWatercolorAnimation(ctx, progress, centerX, centerY);
                break;
            default:
                this.drawDefaultAnimation(ctx, progress, centerX, centerY);
        }
        
        // Add text overlay with prompt
        this.drawTextOverlay(ctx, params.prompt, progress);
    }

    drawCartoonAnimation(ctx, progress, centerX, centerY) {
        // Bouncing circle animation
        const radius = 50 + Math.sin(progress * Math.PI * 4) * 20;
        const y = centerY + Math.sin(progress * Math.PI * 6) * 100;
        
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(centerX, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX - 15, y - 10, 8, 0, Math.PI * 2);
        ctx.arc(centerX + 15, y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX - 15, y - 10, 4, 0, Math.PI * 2);
        ctx.arc(centerX + 15, y - 10, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    draw3DAnimation(ctx, progress, centerX, centerY) {
        // Rotating cube effect
        const size = 100;
        const rotation = progress * Math.PI * 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Draw cube faces with gradient
        const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
        gradient.addColorStop(0, '#4ECDC4');
        gradient.addColorStop(1, '#44A08D');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-size/2, -size/2, size, size);
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-size/2, -size/2, size/3, size/3);
        
        ctx.restore();
    }

    drawWatercolorAnimation(ctx, progress, centerX, centerY) {
        // Flowing watercolor effect
        const numBlobs = 5;
        for (let i = 0; i < numBlobs; i++) {
            const angle = (progress * Math.PI * 2) + (i * Math.PI * 2 / numBlobs);
            const x = centerX + Math.cos(angle) * 150;
            const y = centerY + Math.sin(angle) * 100;
            const radius = 30 + Math.sin(progress * Math.PI * 3 + i) * 15;
            
            const alpha = 0.3 + Math.sin(progress * Math.PI * 2 + i) * 0.2;
            ctx.fillStyle = `hsla(${200 + i * 30}, 70%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawDefaultAnimation(ctx, progress, centerX, centerY) {
        // Simple pulsing animation
        const radius = 80 + Math.sin(progress * Math.PI * 4) * 30;
        const hue = progress * 360;
        
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTextOverlay(ctx, prompt, progress) {
        // Add animated text
        const fontSize = Math.max(20, ctx.canvas.width / 40);
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Truncate long prompts
        const maxLength = 60;
        const displayText = prompt.length > maxLength 
            ? prompt.substring(0, maxLength) + '...' 
            : prompt;
        
        const y = ctx.canvas.height - 50;
        const alpha = Math.sin(progress * Math.PI) * 0.5 + 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillText(displayText, ctx.canvas.width / 2, y);
        ctx.globalAlpha = 1;
    }

    createVideoFromFrames(frames, params) {
        // In a real implementation, this would use WebCodecs or ffmpeg.wasm
        // For demo purposes, we'll create a simple video-like blob
        
        // Create a simple MP4-like structure (this is just for demo)
        const videoData = new Uint8Array(1024 * 1024); // 1MB demo video
        
        // Fill with some demo data
        for (let i = 0; i < videoData.length; i++) {
            videoData[i] = Math.floor(Math.random() * 256);
        }
        
        return new Blob([videoData], { type: 'video/mp4' });
    }

    showProgressSection() {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('progressSection').classList.add('animate-fade-in');
        document.getElementById('generateBtn').disabled = true;
        this.resetProgress();
    }

    hideProgressSection() {
        document.getElementById('progressSection').style.display = 'none';
    }

    showResultSection() {
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultSection').classList.add('animate-fade-in');
    }

    hideResultSection() {
        document.getElementById('resultSection').style.display = 'none';
    }

    resetProgress() {
        this.generationProgress = 0;
        this.updateProgressBar(0);
        this.updateProgressText('Initializing...');
        
        // Reset all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.getElementById('step1').classList.add('active');
    }

    updateProgressBar(percentage) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    updateProgressText(text) {
        document.getElementById('progressText').textContent = text;
    }

    updateProgressStep(stepId, status) {
        const step = document.getElementById(stepId);
        step.classList.remove('active', 'completed');
        step.classList.add(status);
    }

    showResult() {
        this.hideProgressSection();
        this.showResultSection();
        
        if (this.currentVideo) {
            // Set video source
            const video = document.getElementById('generatedVideo');
            video.src = this.currentVideo.url;
            
            // Update video info
            document.getElementById('videoDuration').textContent = `${this.currentVideo.duration}s`;
            document.getElementById('videoResolution').textContent = this.currentVideo.resolution;
            document.getElementById('videoSize').textContent = this.currentVideo.size;
        }
        
        this.isGenerating = false;
        document.getElementById('generateBtn').disabled = false;
    }

    cancelGeneration() {
        this.isGenerating = false;
        this.resetGenerator();
        this.showNotification('Video generation cancelled', 'info');
    }

    resetGenerator() {
        this.isGenerating = false;
        this.hideProgressSection();
        this.hideResultSection();
        document.getElementById('generateBtn').disabled = false;
        
        if (this.currentVideo && this.currentVideo.url) {
            URL.revokeObjectURL(this.currentVideo.url);
        }
        this.currentVideo = null;
    }

    downloadVideo() {
        if (!this.currentVideo) return;
        
        const link = document.createElement('a');
        link.href = this.currentVideo.url;
        link.download = `ai-generated-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Video download started!', 'success');
    }

    shareVideo() {
        if (!this.currentVideo) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Video',
                text: 'Check out this amazing video I created with AI!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Sharing not supported on this device', 'error');
            });
        }
    }

    playGalleryVideo(item) {
        // In a real implementation, this would load and play the actual gallery video
        const title = item.querySelector('h5').textContent;
        this.showNotification(`Playing: ${title}`, 'info');
        
        // Simulate loading a gallery video
        item.classList.add('animate-pulse');
        setTimeout(() => {
            item.classList.remove('animate-pulse');
        }, 1000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '300px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: this.getNotificationColor(type)
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the video generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.videoGenerator = new VideoGenerator();
    
    // Add some interactive animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    document.querySelectorAll('.feature-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Add some utility functions for enhanced user experience
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Handle window resize for responsive video player
window.addEventListener('resize', () => {
    const video = document.getElementById('generatedVideo');
    if (video && video.src) {
        // Adjust video player size if needed
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate video
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!window.videoGenerator.isGenerating) {
            window.videoGenerator.generateVideo();
        }
    }
    
    // Escape to cancel generation
    if (e.key === 'Escape' && window.videoGenerator.isGenerating) {
        window.videoGenerator.cancelGeneration();
    }
});

// Add drag and drop functionality for prompt input
const promptTextarea = document.getElementById('prompt');
if (promptTextarea) {
    promptTextarea.addEventListener('dragover', (e) => {
        e.preventDefault();
        promptTextarea.style.borderColor = '#667eea';
        promptTextarea.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
    });
    
    promptTextarea.addEventListener('dragleave', () => {
        promptTextarea.style.borderColor = '#e9ecef';
        promptTextarea.style.backgroundColor = 'white';
    });
    
    promptTextarea.addEventListener('drop', (e) => {
        e.preventDefault();
        promptTextarea.style.borderColor = '#e9ecef';
        promptTextarea.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('text/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    promptTextarea.value = e.target.result;
                };
                reader.readAsText(file);
            }
        }
    });
}