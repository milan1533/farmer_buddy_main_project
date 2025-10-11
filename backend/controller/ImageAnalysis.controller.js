import multer from 'multer';
import SimpleImageAnalysisService from '../services/simpleImageAnalysis.js';

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

export { upload };
