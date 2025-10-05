// Demo script to show video generation capabilities
const VideoGenerator = require('./server/videoGenerator');
const path = require('path');
const fs = require('fs');

console.log('🎬 Animated Video Generator Demo\n');

// Create demo directory
const demoDir = path.join(__dirname, 'demo-output');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

// Initialize video generator
const videoGenerator = new VideoGenerator();

// Demo configurations
const demos = [
  {
    name: 'Bouncing Text',
    prompt: 'Welcome to our amazing video generator!',
    style: 'animated',
    duration: 5,
    resolution: '1280x720',
    fps: 30
  },
  {
    name: '3D Rotation',
    prompt: 'Revolutionary 3D animation technology',
    style: '3d',
    duration: 8,
    resolution: '1920x1080',
    fps: 30
  },
  {
    name: 'Motion Graphics',
    prompt: 'Modern motion graphics design',
    style: 'motion-graphics',
    duration: 6,
    resolution: '1920x1080',
    fps: 30
  },
  {
    name: 'Whiteboard Drawing',
    prompt: 'Step by step tutorial guide',
    style: 'whiteboard',
    duration: 10,
    resolution: '1280x720',
    fps: 24
  }
];

async function runDemo() {
  console.log('Available animation styles:');
  console.log('1. Animated - Classic 2D animation with bouncing effects');
  console.log('2. 3D - Three-dimensional rotating text effects');
  console.log('3. Motion Graphics - Modern geometric motion graphics');
  console.log('4. Whiteboard - Hand-drawn whiteboard animation style');
  console.log('5. Infographic - Data visualization and chart animations');
  console.log('6. Cartoon - Bright, colorful cartoon-style animations');
  console.log('7. Realistic - Realistic text with depth and shadows');
  console.log('8. Abstract - Artistic abstract animations with flowing colors\n');

  console.log('Demo configurations:');
  demos.forEach((demo, index) => {
    console.log(`${index + 1}. ${demo.name}`);
    console.log(`   Prompt: "${demo.prompt}"`);
    console.log(`   Style: ${demo.style}`);
    console.log(`   Duration: ${demo.duration}s`);
    console.log(`   Resolution: ${demo.resolution}`);
    console.log(`   FPS: ${demo.fps}\n`);
  });

  console.log('🎥 To generate a video:');
  console.log('1. Start the server: npm run server');
  console.log('2. Start the client: npm run client');
  console.log('3. Open http://localhost:3000');
  console.log('4. Enter your prompt and generate!');
  console.log('\n📱 Features:');
  console.log('- Real-time progress tracking');
  console.log('- Multiple animation styles');
  console.log('- Customizable duration (5-60 seconds)');
  console.log('- High quality output (up to 4K)');
  console.log('- Instant download');
  console.log('- Share functionality');
  console.log('\n🚀 Ready to create amazing videos!');
}

runDemo().catch(console.error);