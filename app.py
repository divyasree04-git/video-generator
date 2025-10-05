from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import os
import uuid
import json
import time
import requests
from datetime import datetime
import threading
from pathlib import Path

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'generated_videos'
Path(UPLOAD_FOLDER).mkdir(exist_ok=True)

# Store generation status
generation_status = {}

# Video generation providers configuration
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN', '')
STABILITY_API_KEY = os.environ.get('STABILITY_API_KEY', '')

def generate_video_with_replicate(prompt, duration, style, task_id):
    """Generate video using Replicate API (AnimateDiff, Stable Video Diffusion, etc.)"""
    try:
        headers = {
            'Authorization': f'Token {REPLICATE_API_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        # Choose model based on style
        models = {
            'anime': 'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f',
            'realistic': 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
            'cartoon': 'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f',
            '3d': 'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f',
            'default': 'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f'
        }
        
        model = models.get(style, models['default'])
        
        # Calculate frames based on duration (assuming 8 fps)
        num_frames = max(16, min(int(duration * 8), 256))
        
        payload = {
            'version': model.split(':')[1],
            'input': {
                'prompt': prompt,
                'num_frames': num_frames,
                'num_inference_steps': 25,
                'guidance_scale': 7.5
            }
        }
        
        generation_status[task_id]['status'] = 'processing'
        generation_status[task_id]['message'] = 'Sending request to AI service...'
        
        response = requests.post(
            f'https://api.replicate.com/v1/predictions',
            headers=headers,
            json=payload
        )
        
        if response.status_code != 201:
            raise Exception(f'API request failed: {response.text}')
        
        prediction = response.json()
        prediction_id = prediction['id']
        
        generation_status[task_id]['message'] = 'Generating video... This may take a few minutes.'
        
        # Poll for completion
        max_attempts = 180  # 15 minutes max
        for attempt in range(max_attempts):
            time.sleep(5)
            
            status_response = requests.get(
                f'https://api.replicate.com/v1/predictions/{prediction_id}',
                headers=headers
            )
            
            if status_response.status_code != 200:
                continue
                
            status_data = status_response.json()
            
            if status_data['status'] == 'succeeded':
                video_url = status_data['output']
                if isinstance(video_url, list):
                    video_url = video_url[0]
                
                # Download the video
                generation_status[task_id]['message'] = 'Downloading generated video...'
                video_response = requests.get(video_url)
                
                if video_response.status_code == 200:
                    filename = f"{task_id}.mp4"
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    
                    with open(filepath, 'wb') as f:
                        f.write(video_response.content)
                    
                    generation_status[task_id]['status'] = 'completed'
                    generation_status[task_id]['video_url'] = f'/download/{filename}'
                    generation_status[task_id]['message'] = 'Video generated successfully!'
                    return
                else:
                    raise Exception('Failed to download video')
                    
            elif status_data['status'] == 'failed':
                raise Exception(f"Generation failed: {status_data.get('error', 'Unknown error')}")
            
            generation_status[task_id]['progress'] = min(95, attempt * 2)
        
        raise Exception('Video generation timeout')
        
    except Exception as e:
        generation_status[task_id]['status'] = 'failed'
        generation_status[task_id]['message'] = f'Error: {str(e)}'
        generation_status[task_id]['error'] = str(e)

def generate_video_fallback(prompt, duration, style, task_id):
    """Fallback method - generates a demo video with text overlay"""
    try:
        from moviepy.editor import ColorClip, TextClip, CompositeVideoClip
        import numpy as np
        
        generation_status[task_id]['status'] = 'processing'
        generation_status[task_id]['message'] = 'Generating video locally...'
        
        # Create base video
        width, height = 1280, 720
        fps = 30
        video_duration = max(3, min(duration, 60))  # 3-60 seconds
        
        # Create animated background
        def make_frame(t):
            # Animated gradient
            hue = (t * 30) % 360
            r = int(127.5 * (1 + np.sin(hue * np.pi / 180)))
            g = int(127.5 * (1 + np.sin((hue + 120) * np.pi / 180)))
            b = int(127.5 * (1 + np.sin((hue + 240) * np.pi / 180)))
            return np.full((height, width, 3), [r, g, b], dtype=np.uint8)
        
        from moviepy.editor import VideoClip
        background = VideoClip(make_frame, duration=video_duration)
        
        generation_status[task_id]['progress'] = 50
        
        # Add text overlay
        txt_clip = TextClip(
            prompt[:100],
            fontsize=50,
            color='white',
            size=(width-100, None),
            method='caption',
            align='center'
        ).set_position('center').set_duration(video_duration)
        
        generation_status[task_id]['progress'] = 75
        
        # Composite
        video = CompositeVideoClip([background, txt_clip])
        
        # Save
        filename = f"{task_id}.mp4"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        generation_status[task_id]['message'] = 'Rendering video...'
        video.write_videofile(
            filepath,
            fps=fps,
            codec='libx264',
            audio=False,
            logger=None
        )
        
        generation_status[task_id]['status'] = 'completed'
        generation_status[task_id]['video_url'] = f'/download/{filename}'
        generation_status[task_id]['message'] = 'Video generated successfully!'
        generation_status[task_id]['progress'] = 100
        
    except Exception as e:
        generation_status[task_id]['status'] = 'failed'
        generation_status[task_id]['message'] = f'Error: {str(e)}'
        generation_status[task_id]['error'] = str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_video():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        duration = float(data.get('duration', 5))
        style = data.get('style', 'default')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Initialize status
        generation_status[task_id] = {
            'status': 'pending',
            'progress': 0,
            'message': 'Starting video generation...',
            'prompt': prompt,
            'duration': duration,
            'style': style,
            'created_at': datetime.now().isoformat()
        }
        
        # Start generation in background thread
        if REPLICATE_API_TOKEN:
            thread = threading.Thread(
                target=generate_video_with_replicate,
                args=(prompt, duration, style, task_id)
            )
        else:
            thread = threading.Thread(
                target=generate_video_fallback,
                args=(prompt, duration, style, task_id)
            )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'task_id': task_id,
            'message': 'Video generation started',
            'status': 'pending'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status/<task_id>', methods=['GET'])
def get_status(task_id):
    if task_id not in generation_status:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify(generation_status[task_id])

@app.route('/download/<filename>')
def download_video(filename):
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_file(
                filepath,
                as_attachment=True,
                download_name=filename,
                mimetype='video/mp4'
            )
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    # Return all completed generations
    completed = [
        {
            'task_id': task_id,
            'prompt': data['prompt'],
            'status': data['status'],
            'video_url': data.get('video_url'),
            'created_at': data['created_at']
        }
        for task_id, data in generation_status.items()
        if data['status'] == 'completed'
    ]
    return jsonify(completed)

if __name__ == '__main__':
    print("🎬 Animated Video Generator Server Starting...")
    print("=" * 60)
    
    if REPLICATE_API_TOKEN:
        print("✅ Replicate API configured - Using AI video generation")
    else:
        print("⚠️  No API keys found - Using fallback video generation")
        print("   To enable AI generation, set REPLICATE_API_TOKEN")
    
    print("=" * 60)
    print("🚀 Server running on http://localhost:5000")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
