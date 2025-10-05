// Global variables
let currentTaskId = null;
let pollInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadHistory();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('generateForm');
    const promptInput = document.getElementById('prompt');
    
    form.addEventListener('submit', handleFormSubmit);
    promptInput.addEventListener('input', updateCharCount);
}

// Update character count
function updateCharCount() {
    const prompt = document.getElementById('prompt').value;
    const charCount = document.getElementById('charCount');
    charCount.textContent = prompt.length;
}

// Set example prompt
function setPrompt(text) {
    document.getElementById('prompt').value = text;
    updateCharCount();
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const prompt = document.getElementById('prompt').value;
    const duration = document.getElementById('duration').value;
    const style = document.getElementById('style').value;
    
    if (!prompt.trim()) {
        alert('Please enter a prompt for your video');
        return;
    }
    
    // Disable form
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
    
    try {
        // Send generation request
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                duration: parseFloat(duration),
                style: style
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to start video generation');
        }
        
        const data = await response.json();
        currentTaskId = data.task_id;
        
        // Show progress section
        showProgressSection(prompt, duration, style);
        
        // Start polling for status
        startPolling();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to start video generation: ' + error.message);
        resetGenerateButton();
    }
}

// Show progress section
function showProgressSection(prompt, duration, style) {
    // Hide other sections
    document.querySelector('.generator-section').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    
    // Show progress
    const progressSection = document.getElementById('progressSection');
    progressSection.style.display = 'block';
    
    // Set details
    document.getElementById('generatingPrompt').textContent = prompt;
    document.getElementById('generatingDuration').textContent = duration;
    document.getElementById('generatingStyle').textContent = style;
    
    // Reset progress
    updateProgress(0, 'Starting video generation...');
    
    // Scroll to progress
    progressSection.scrollIntoView({ behavior: 'smooth' });
}

// Update progress
function updateProgress(percent, message) {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressMessage = document.getElementById('progressMessage');
    
    progressFill.style.width = percent + '%';
    progressPercent.textContent = Math.round(percent) + '%';
    progressMessage.textContent = message;
}

// Start polling for status
function startPolling() {
    // Clear any existing polling
    if (pollInterval) {
        clearInterval(pollInterval);
    }
    
    // Poll every 2 seconds
    pollInterval = setInterval(checkStatus, 2000);
    
    // Check immediately
    checkStatus();
}

// Check generation status
async function checkStatus() {
    if (!currentTaskId) return;
    
    try {
        const response = await fetch(`/api/status/${currentTaskId}`);
        
        if (!response.ok) {
            throw new Error('Failed to get status');
        }
        
        const data = await response.json();
        
        if (data.status === 'completed') {
            // Stop polling
            clearInterval(pollInterval);
            
            // Show result
            showResult(data);
            
        } else if (data.status === 'failed') {
            // Stop polling
            clearInterval(pollInterval);
            
            // Show error
            alert('Video generation failed: ' + (data.error || data.message));
            resetForm();
            
        } else {
            // Update progress
            const progress = data.progress || 0;
            const message = data.message || 'Generating video...';
            updateProgress(progress, message);
        }
        
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

// Show result
function showResult(data) {
    // Hide progress
    document.getElementById('progressSection').style.display = 'none';
    
    // Show result
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // Set video source
    const videoSource = document.getElementById('videoSource');
    const video = document.getElementById('generatedVideo');
    videoSource.src = data.video_url;
    video.load();
    
    // Set download link
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = data.video_url;
    downloadBtn.download = `generated-video-${currentTaskId}.mp4`;
    
    // Set prompt
    document.getElementById('resultPrompt').textContent = data.prompt;
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reload history
    loadHistory();
    
    // Reset generate button
    resetGenerateButton();
}

// Reset generate button
function resetGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Video';
}

// Reset form
function resetForm() {
    // Hide result and progress
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    
    // Show generator
    document.querySelector('.generator-section').style.display = 'block';
    
    // Clear form
    document.getElementById('generateForm').reset();
    updateCharCount();
    
    // Reset state
    currentTaskId = null;
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
    
    // Reset button
    resetGenerateButton();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load history
async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        
        if (!response.ok) {
            throw new Error('Failed to load history');
        }
        
        const history = await response.json();
        
        const container = document.getElementById('historyContainer');
        
        if (history.length === 0) {
            container.innerHTML = '<p class="empty-state">No videos generated yet. Create your first video above!</p>';
            return;
        }
        
        // Sort by date (newest first)
        history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Display history items
        container.innerHTML = history.map(item => `
            <div class="history-item" onclick="window.open('${item.video_url}', '_blank')">
                <video class="history-thumbnail" muted>
                    <source src="${item.video_url}" type="video/mp4">
                </video>
                <div class="history-content">
                    <p class="history-prompt">${escapeHtml(item.prompt)}</p>
                    <p class="history-date">${formatDate(item.created_at)}</p>
                </div>
            </div>
        `).join('');
        
        // Play videos on hover
        document.querySelectorAll('.history-thumbnail').forEach(video => {
            video.parentElement.addEventListener('mouseenter', () => {
                video.play();
            });
            video.parentElement.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}

// Auto-refresh history every 30 seconds
setInterval(loadHistory, 30000);
