import multer from 'multer';
import SimpleImageAnalysisService from '../services/simpleImageAnalysis.js';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import supabase from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';

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

    // User authentication is optional (if logged-in, we save to history; otherwise still analyze)
    const userId = req.id || null;

    // Step 1: Generate SHA-256 hash of image bytes
    const imageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

    // Step 2: If user logged in, check history cache
    if (userId) {
      const { data: existingAnalysis } = await supabase
        .from('ai_suggestions')
        .select('id, analysis_result')
        .eq('user_id', userId)
        .eq('analysis_result->>imageHash', imageHash)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingAnalysis) {
        const { imageHash: _hash, ...cachedResult } = existingAnalysis.analysis_result || {};
        return res.json({
          success: true,
          data: cachedResult,
          cached: true,
          analysisId: existingAnalysis.id,
          message: 'Result from analysis history'
        });
      }
    }

    // Step 3: Call AI
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
        model: "qwen/qwen3-vl-8b-instruct",
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
        timeout: 180000,
      }
    );

    const fullText = response.data.choices[0].message.content;

    // Extract crop name (handles "Crop name: X" and markdown headings with the value on the next line)
    let cropName = "Unknown Crop";
    const headingMatch = fullText.match(/crop\s*name[^\n:]*:(.*)/i);
    if (headingMatch) {
      let value = headingMatch[1].replace(/\*/g, '').trim();
      if (!value) {
        const rest = fullText.slice(headingMatch.index + headingMatch[0].length);
        value = rest.split('\n').map(l => l.replace(/\*/g, '').trim()).find(l => l.length > 0) || '';
      }
      if (value) cropName = value;
    }

    // Step 5a: Upload image to Cloudinary
    let imageUrl = null;

    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const cloudinaryResult = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${base64Image}`,
          {
            folder: 'farmer-buddy/scanner',
            resource_type: 'auto',
            use_filename: true,
            unique_filename: false,
          }
        );
        imageUrl = cloudinaryResult.secure_url;
      }
    } catch (cloudinaryErr) {
      console.warn('Cloudinary upload failed, continuing without image storage:', cloudinaryErr?.message);
    }

    const analysisData = {
      text: fullText,
      cropName: cropName
    };

    let analysisId = null;

    // Step 5b: Save history only if user is logged in (never fail the analysis for this)
    if (userId) {
      try {
        const { data: savedRow, error: saveError } = await supabase
          .from('ai_suggestions')
          .insert({
            user_id: userId,
            image_url: imageUrl || '',
            analysis_result: { ...analysisData, imageHash },
            suggestions: [],
          })
          .select('id')
          .single();

        if (saveError) throw saveError;
        analysisId = savedRow?.id || null;
      } catch (saveErr) {
        console.warn('Scan history save skipped:', saveErr?.message);
      }
    }

    // Step 6: Return result
    res.json({
      success: true,
      data: analysisData,
      cached: false,
      analysisId,
      message: userId ? 'Analysis completed and saved' : 'Analysis completed'
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

// Get scan history for authenticated user
export const getScanHistory = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
    const offset = parseInt(req.query.offset) || 0;

    const { data: history, error } = await supabase
      .from('ai_suggestions')
      .select('id, image_url, analysis_result, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const { count } = await supabase
      .from('ai_suggestions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const total = count || 0;
    const data = (history || []).map((row) => {
      const { imageHash, ...analysisResult } = row.analysis_result || {};
      return {
        _id: row.id,
        imageHash,
        imageUrl: row.image_url,
        analysisResult,
        createdAt: row.created_at,
      };
    });

    res.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Scan history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan history',
      details: error.message
    });
  }
};

// Get a specific scan result by ID
export const getScanResult = async (req, res) => {
  try {
    const userId = req.id;
    const { analysisId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Verify ownership
    const { data: analysis, error } = await supabase
      .from('ai_suggestions')
      .select('id, image_url, analysis_result, created_at')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    const { imageHash, ...analysisResult } = analysis.analysis_result || {};

    res.json({
      success: true,
      data: {
        _id: analysis.id,
        imageHash,
        imageUrl: analysis.image_url,
        analysisResult,
        createdAt: analysis.created_at,
        cached: true  // Indicate this is from history
      }
    });

  } catch (error) {
    console.error('Scan result error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan result',
      details: error.message
    });
  }
};

export { upload };
