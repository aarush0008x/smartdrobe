const fs = require('fs');
const path = require('path');

const srcImage = "C:\\Users\\aarushsingh\\.gemini\\antigravity\\brain\\83d60ee8-f64f-4a97-b852-cce3a7fa9ae6\\smartdrobe_pwa_logo_icon_1786126087773.jpg";
const publicDir = path.join(__dirname, '..', 'public');

if (fs.existsSync(srcImage)) {
  fs.copyFileSync(srcImage, path.join(publicDir, 'icon-192.png'));
  fs.copyFileSync(srcImage, path.join(publicDir, 'icon-512.png'));
  fs.copyFileSync(srcImage, path.join(publicDir, 'apple-touch-icon.png'));
  fs.copyFileSync(srcImage, path.join(publicDir, 'favicon.ico'));
  console.log('Successfully updated SmartDrobe branded PWA icons in public folder!');
} else {
  console.error('Source image file not found');
}
