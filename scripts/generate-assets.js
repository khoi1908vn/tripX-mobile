#!/usr/bin/env node

/**
 * Generate placeholder assets for Expo app
 * Creates icon.png, splash.png, adaptive-icon.png, and favicon.png
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function generateIcon() {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, '#6366f1'); // indigo-500
  gradient.addColorStop(1, '#8b5cf6'); // violet-500
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw "X" symbol
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 80;
  ctx.lineCap = 'round';

  // X shape
  ctx.beginPath();
  ctx.moveTo(300, 300);
  ctx.lineTo(724, 724);
  ctx.moveTo(724, 300);
  ctx.lineTo(300, 724);
  ctx.stroke();

  // Add "tripX" text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('tripX', 512, 860);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), buffer);
  console.log('✅ Generated icon.png (1024x1024)');
}

function generateSplash() {
  const canvas = createCanvas(1284, 2778); // iPhone 14 Pro Max resolution
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1284, 2778);

  // Center logo area
  const gradient = ctx.createLinearGradient(342, 1089, 942, 1689);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = gradient;
  ctx.fillRect(342, 1089, 600, 600);

  // Draw "X" on splash
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 50;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(492, 1239);
  ctx.lineTo(792, 1539);
  ctx.moveTo(792, 1239);
  ctx.lineTo(492, 1539);
  ctx.stroke();

  // Add text
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 100px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('tripX', 642, 1850);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), buffer);
  console.log('✅ Generated splash.png (1284x2778)');
}

function generateAdaptiveIcon() {
  // For Android adaptive icon, use same design as icon but transparent background
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Transparent background (will use backgroundColor from app.json)
  ctx.clearRect(0, 0, 1024, 1024);

  // Draw foreground "X" symbol - larger for adaptive icon safe zone
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 100;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(250, 250);
  ctx.lineTo(774, 774);
  ctx.moveTo(774, 250);
  ctx.lineTo(250, 774);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), buffer);
  console.log('✅ Generated adaptive-icon.png (1024x1024)');
}

function generateFavicon() {
  const canvas = createCanvas(48, 48);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 48, 48);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 48, 48);

  // Draw mini "X"
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(14, 14);
  ctx.lineTo(34, 34);
  ctx.moveTo(34, 14);
  ctx.lineTo(14, 34);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), buffer);
  console.log('✅ Generated favicon.png (48x48)');
}

// Generate all assets
try {
  console.log('🎨 Generating placeholder assets...\n');
  generateIcon();
  generateSplash();
  generateAdaptiveIcon();
  generateFavicon();
  console.log('\n✅ All assets generated successfully!');
  console.log('📁 Assets saved to:', ASSETS_DIR);
} catch (error) {
  console.error('❌ Error generating assets:', error.message);
  process.exit(1);
}
