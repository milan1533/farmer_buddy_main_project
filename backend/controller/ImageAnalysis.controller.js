import multer from 'multer';
import SimpleImageAnalysisService from '../services/simpleImageAnalysis.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export const analyzeImage = async (req, res) => {
  try {
    console.log('Image analysis request received');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    console.log('Analyzing image:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Analyze the uploaded image
    const analysisResult = await SimpleImageAnalysisService.analyzeImage(req.file.buffer);

    console.log('Analysis completed:', analysisResult);

    res.json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString(),
      message: 'Image analysis completed successfully'
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export const getAvailableProducts = (req, res) => {
  try {
    const products = SimpleImageAnalysisService.getAvailableProducts();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get available products',
      details: error.message
    });
  }
};

export const analyzeCropDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OpenRouter API Key missing");
      return res.status(500).json({ success: false, error: 'Server misconfiguration: API Key missing' });
    }

    const prompt = `
You are an expert agricultural scientist, plant pathologist, and farmer advisor.

Analyze the given crop image carefully and provide a complete farming diagnosis.

Your response must include:

1. Crop name (common name used in India)
2. Growth stage (if visible)
3. Disease or problem detected (if any)
4. Type of issue (fungal, viral, bacterial, pest, nutrient deficiency, or healthy)
5. Visible symptoms observed in the image
6. Possible causes of the problem
7. Step-by-step treatment:
   a) Organic / natural treatment
   b) Chemical treatment (commonly used pesticides or fungicides in India)
8. Prevention tips for future crops
9. Safety precautions for farmers while using chemicals
10. Confidence level of diagnosis (High / Medium / Low)

Important rules:
- Base your analysis only on the visible image.
- If the image is unclear, mention low confidence.
- Use simple language suitable for Indian farmers.
- Do NOT assume information that is not visible.
- Add a short disclaimer at the end.

Output format:
Use clear headings and bullet points.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen-2.5-vl-7b-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "Farmer Buddy AI Tool",
        },
      }
    );

    const fullText = response.data.choices[0].message.content;

    // Attempt to extract crop name for further features
    let cropName = "Unknown Crop";
    const cropNameMatch = fullText.match(/Crop name[:\s\-]+([^\n\r]+)/i);
    if (cropNameMatch && cropNameMatch[1]) {
      cropName = cropNameMatch[1].trim();
    }

    res.json({
      success: true,
      data: {
        text: fullText,
        cropName: cropName
      }
    });

  } catch (error) {
    console.error('Crop analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze crop',
      details: error.response?.data || error.message
    });
  }
};

export { upload };
