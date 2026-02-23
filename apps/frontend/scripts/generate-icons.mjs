#!/usr/bin/env node
/**
 * Generates PWA icons from icon.svg using sharp.
 * Run: node apps/frontend/scripts/generate-icons.mjs
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('../../landing/node_modules/sharp');
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'src', 'assets', 'icons');
const svgPath = join(iconsDir, 'icon.svg');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

// Maskable: same icon with safe-zone padding (10% inset)
const maskSize = 512;
const padding = Math.round(maskSize * 0.1);
const inner = maskSize - padding * 2;
const innerBuf = await sharp(svgPath).resize(inner, inner).png().toBuffer();
await sharp({
  create: { width: maskSize, height: maskSize, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } },
})
  .composite([{ input: innerBuf, left: padding, top: padding }])
  .png()
  .toFile(join(iconsDir, `icon-maskable-${maskSize}x${maskSize}.png`));
console.log(`Generated icon-maskable-${maskSize}x${maskSize}.png`);

// Apple touch icon (180x180)
await sharp(svgPath)
  .resize(180, 180)
  .png()
  .toFile(join(iconsDir, `apple-touch-icon.png`));
console.log('Generated apple-touch-icon.png');

// Favicon 32x32
await sharp(svgPath)
  .resize(32, 32)
  .png()
  .toFile(join(iconsDir, `favicon-32x32.png`));
console.log('Generated favicon-32x32.png');

// Favicon 16x16
await sharp(svgPath)
  .resize(16, 16)
  .png()
  .toFile(join(iconsDir, `favicon-16x16.png`));
console.log('Generated favicon-16x16.png');
