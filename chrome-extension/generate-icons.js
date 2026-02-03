/**
 * Icon Generator for Final Boss Chrome Extension
 *
 * This script generates PNG icons from the SVG source.
 * Run with: node generate-icons.js
 *
 * Requires: sharp (npm install sharp)
 * Or use an online tool like https://cloudconvert.com/svg-to-png
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Creating placeholder icons...');
  console.log('For production, convert icons/icon.svg to PNG using:');
  console.log('  - https://cloudconvert.com/svg-to-png');
  console.log('  - Or install sharp: npm install sharp');
  console.log('');
  createPlaceholderIcons();
  process.exit(0);
}

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, 'icons', 'icon.svg');

async function generateIcons() {
  const svg = fs.readFileSync(svgPath);

  for (const size of sizes) {
    const outputPath = path.join(__dirname, 'icons', `icon${size}.png`);

    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: icon${size}.png`);
  }

  console.log('Done! Icons generated successfully.');
}

function createPlaceholderIcons() {
  // Create minimal valid PNG files as placeholders
  // These are 1x1 purple pixels that will work but should be replaced
  const sizes = [16, 48, 128];

  // Minimal PNG header + IHDR + IDAT + IEND for a 1x1 purple pixel
  // This is a hack - for production, use proper icon generation
  const purplePng = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0xD8, 0xAB, 0xF9, 0x1F,
    0x00, 0x03, 0x58, 0x01, 0x35, 0x44, 0x2C, 0xF4,
    0x67, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  for (const size of sizes) {
    const outputPath = path.join(__dirname, 'icons', `icon${size}.png`);
    fs.writeFileSync(outputPath, purplePng);
    console.log(`Created placeholder: icon${size}.png (replace with proper ${size}x${size} icon)`);
  }
}

generateIcons().catch(console.error);
