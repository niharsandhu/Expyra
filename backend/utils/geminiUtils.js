const Tesseract = require('tesseract.js');
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Extract JSON object safely from text output
function extractJSONFromText(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in text");
  }
  return JSON.parse(jsonMatch[0]);
}

// Local OCR using Tesseract.js
async function extractTextFromImageBase64(imageBase64) {
  try {
    const dataUri = `data:image/png;base64,${imageBase64}`;

    const { data: { text } } = await Tesseract.recognize(dataUri, 'eng', {
      logger: m => console.log(m),
    });

    if (!text || text.trim().length === 0) {
      throw new Error('No text detected by Tesseract');
    }

    return text.trim();
  } catch (error) {
    console.error("Tesseract OCR error:", error.message);
    throw error;
  }
}

// Parse product details from text using Gemini API
async function parseProductDetailsFromText(text) {
  try {
    const prompt = `Extract product name, product type ,brand, and expiry date  from this text. Return ONLY a JSON object with keys: name, productType, brand, expiryDate (YYYY-MM-DD) without any extra explanation.\nText: """${text}"""`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        params: { key: GEMINI_API_KEY }
      }
    );

    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const generatedText = response.data.candidates[0].content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error("No generated text found in Gemini response");
    }

    const details = extractJSONFromText(generatedText);
    return details;
  } catch (error) {
    console.error("Gemini parse error:", error.response?.data || error.message);
    throw error;
  }
}



// Generate expiry notification text using Gemini API
async function generateExpiryNotification(productName, expiryDate) {
  try {
    const prompt = `Write ONLY ONE short, friendly notification sentence with emojis telling the user their product "${productName}" will expire on ${expiryDate}. No options, no lists, just one sentence.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: GEMINI_API_KEY }
      }
    );

    const candidate = response?.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No notification text returned from Gemini");
    }

    return text.trim();
  } catch (error) {
    console.error("Error generating notification:", error);
    return "⚠️ Unable to generate expiry notification at the moment.";
  }
}


// Full flow: OCR -> Parse details
async function extractProductDetailsFromImage(imageBase64) {
  const ocrText = await extractTextFromImageBase64(imageBase64);
  const details = await parseProductDetailsFromText(ocrText);
  return details;
}

module.exports = {
  extractProductDetailsFromImage,
  parseProductDetailsFromText,
  generateExpiryNotification,
};
