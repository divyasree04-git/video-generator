// Simple test to verify the setup works
const express = require('express');
const path = require('path');

console.log('🎬 Testing Animated Video Generator Setup...\n');

// Test 1: Check if required modules can be loaded
console.log('1. Testing module imports...');
try {
  const ffmpeg = require('fluent-ffmpeg');
  console.log('   ✅ fluent-ffmpeg loaded');
} catch (error) {
  console.log('   ❌ fluent-ffmpeg failed:', error.message);
}

try {
  const { createCanvas } = require('canvas');
  console.log('   ✅ canvas loaded');
} catch (error) {
  console.log('   ❌ canvas failed:', error.message);
}

try {
  const sharp = require('sharp');
  console.log('   ✅ sharp loaded');
} catch (error) {
  console.log('   ❌ sharp failed:', error.message);
}

// Test 2: Check if directories exist
console.log('\n2. Testing directory structure...');
const fs = require('fs');

const dirs = [
  'client',
  'client/src',
  'client/src/components',
  'server',
  'server/generated'
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/ exists`);
  } else {
    console.log(`   ❌ ${dir}/ missing`);
  }
});

// Test 3: Check if key files exist
console.log('\n3. Testing key files...');
const files = [
  'package.json',
  'client/package.json',
  'server/index.js',
  'server/videoGenerator.js',
  'client/src/App.js',
  'client/src/index.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

console.log('\n🎉 Setup test completed!');
console.log('\nTo start the application:');
console.log('1. Run: npm install');
console.log('2. Run: cd client && npm install');
console.log('3. Run: npm run dev');
console.log('\nMake sure FFmpeg is installed on your system!');