import express from 'express';
import { analyzeImage, getAvailableProducts, analyzeCropDisease, upload } from '../controller/ImageAnalysis.controller.js';

const router = express.Router();

// POST /api/analyze-image - Analyze uploaded image
router.post('/analyze-image', upload.single('image'), analyzeImage);

// POST /api/analyze-crop-disease - Deep analysis using OpenRouter/Qwen
router.post('/analyze-crop-disease', upload.single('image'), analyzeCropDisease);

// GET /api/available-products - Get list of detectable products
router.get('/available-products', getAvailableProducts);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Image Analysis API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
