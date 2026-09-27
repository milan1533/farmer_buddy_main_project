import express from 'express';
import { getCurrentMonthData, getCropSuggestion, getSmartCropRecommendations, getFarmingChat, getCropAdditionalInfo } from '../controllers/ai.controller.js';

const router = express.Router();

// Feature 1: Get current month data (auto-detect month)
router.get('/calendar/current', getCurrentMonthData);

// Feature 2: Get crop suggestion (Gemini AI)
router.post('/ai/crop-suggestion', getCropSuggestion);

// Feature 3: Smart Crop Planning (Llama 3.3)
router.post('/smart-crop-planning', getSmartCropRecommendations);

// Feature 4: AI Farming Chatbot (Llama 3.2)
router.post('/farming-chat', getFarmingChat);

// Feature 5: Crop Additional Info (Weather, Market, Soil, Pest)
router.post('/crop-info', getCropAdditionalInfo);

export default router;
