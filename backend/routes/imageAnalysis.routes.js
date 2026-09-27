import express from 'express';
import { analyzeImage, getAvailableProducts, analyzeCropDisease, upload, getScanHistory, getScanResult } from '../controller/ImageAnalysis.controller.js';
import isAuthenticated, { optionalAuth } from '../middleware/isAutheticated.js';

const router = express.Router();

// POST /api/analyze-image - Analyze uploaded image
router.post('/analyze-image', upload.single('image'), analyzeImage);

// POST /api/analyze-crop-disease - Deep analysis using OpenRouter/Qwen (auth optional, used if available)
router.post('/analyze-crop-disease', upload.single('image'), optionalAuth, analyzeCropDisease);

// GET /api/available-products - Get list of detectable products
router.get('/available-products', getAvailableProducts);

// GET /api/scan-history - Get user's scan history (authenticated)
router.get('/scan-history', isAuthenticated, getScanHistory);

// GET /api/scan-history/:analysisId - Get specific scan result (authenticated, ownership verified)
router.get('/scan-history/:analysisId', isAuthenticated, getScanResult);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Image Analysis API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
