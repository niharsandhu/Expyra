const fs = require('fs');
const path = require('path');
const { extractProductDetailsFromImage } = require('./utils/geminiUtils'); // replace with your actual module filename without .js

// Read image as base64 from local file
function getImageBase64(imagePath) {
  const absPath = path.resolve(__dirname, imagePath);
  const imageBuffer = fs.readFileSync(absPath);
  return imageBuffer.toString('base64');
}

async function testOCR() {
  try {
    const base64Image = getImageBase64('image.png'); // replace with your image file name
    console.log('Running OCR & product extraction...');

    const details = await extractProductDetailsFromImage(base64Image);
    console.log('Extracted product details:', details);
  } catch (error) {
    console.error('Error during OCR test:', error);
  }
}

testOCR();

