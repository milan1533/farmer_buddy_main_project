import express from 'express';
import { getCurrentMonthData, getCropSuggestion, getSmartCropRecommendations, getFarmingChat } from '../controllers/ai.controller.js';

const router = express.Router();

// Feature 1: Get current month data (auto-detect month)
router.get('/calendar/current', getCurrentMonthData);

// Feature 2: Get crop suggestion (Gemini AI)
router.post('/ai/crop-suggestion', getCropSuggestion);

// Feature 3: Smart Crop Planning (Llama 3.3)
router.post('/smart-crop-planning', getSmartCropRecommendations);

// Feature 4: AI Farming Chatbot (Llama 3.2)
router.post('/farming-chat', getFarmingChat);

export default router;
