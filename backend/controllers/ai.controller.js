import NodeCache from 'node-cache';
import { generateJSON, generateText } from '../services/gemini.service.js';
import axios from 'axios';

const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours cache
// ... (existing code)

// FEATURE 3: SMART CROP PLANNING (OpenRouter / Llama 3.3)
export const getSmartCropRecommendations = async (req, res) => {
  try {
    const { state, district, season, soilType, landArea, irrigationSource, budget, lastCrop } = req.body;

    const prompt = `
You are an expert agricultural planner and crop advisory assistant for Indian farmers.

Using ONLY the information provided below, generate smart and practical crop recommendations.

FARM DETAILS:
- State: ${state}
- District: ${district}
- Season: ${season}
- Soil Type: ${soilType}
- Land Area: ${landArea}
- Irrigation Source: ${irrigationSource}
- Budget: ${budget}
- Last Season Crop (if provided): ${lastCrop || 'Not specified'}

TASK:
Based on the above inputs, recommend the most suitable crops for farming.

Your response MUST include:

1. Suitable Crop Recommendations (Top 3–5 crops)
   - Why each crop is suitable for this location and season

2. Expected Benefits
   - Yield potential
   - Market demand
   - Profit potential (low / medium / high)

3. Basic Farming Guidance
   - Sowing time
   - Water requirement
   - General care tips

4. Crop Rotation Advice
   - Especially if last season crop is provided

5. Risk Factors
   - Weather risk
   - Pest or disease risk
   - Budget-related limitations

6. Final Farmer-Friendly Advice
   - Simple actionable suggestion

RULES:
- Do NOT ask questions.
- Do NOT assume missing data.
- Use simple, clear language suitable for farmers.
- Focus on Indian farming conditions.
- Keep explanations practical, not theoretical.

OUTPUT FORMAT:
Use clear headings and bullet points.
`;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Server misconfiguration: API Key missing' });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          {
            role: "user",
            content: prompt
          }
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

    res.json({
      success: true,
      data: {
        text: fullText
      }
    });

  } catch (error) {
    console.error('Smart Crop Planning API Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      details: error.response?.data || error.message
    });
  }
};


const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to detect season
const getSeason = (monthIndex) => {
  if (monthIndex >= 10 || monthIndex <= 2) return "Rabi"; // Nov, Dec, Jan, Feb, Mar (Winter)
  if (monthIndex >= 5 && monthIndex <= 8) return "Kharif"; // Jun, Jul, Aug, Sep (Monsoon)
  return "Zaid"; // Apr, May (Summer)
};

// FEATURE 1: CURRENT MONTH API
export const getCurrentMonthData = async (req, res) => {
  try {
    // Default to current month, but allow override for calendar navigation
    const now = new Date();
    let monthIndex = now.getMonth();
    let month = MONTHS[monthIndex];

    // Check if month is provided in query (e.g. ?month=February)
    if (req.query.month) {
      const requestedMonth = req.query.month;
      const foundIndex = MONTHS.findIndex(m => m.toLowerCase() === requestedMonth.toLowerCase());
      if (foundIndex !== -1) {
        month = MONTHS[foundIndex];
        monthIndex = foundIndex;
      }
    }

    const season = getSeason(monthIndex);

    const cacheKey = `month_data_${month}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, ...cachedData });
    }

    // AI Prompt for Month's Crops
    const prompt = `
      Context: Agricultural Expert System for India.
      Month: ${month}
      Season: ${season}
      Task: List top 5 most suitable crops to grow in this month.
      Output strictly JSON format:
      {
        "month": "${month}",
        "season": "${season}",
        "recommendedCrops": ["Crop 1", "Crop 2", "Crop 3", "Crop 4", "Crop 5"]
      }
    `;

    const aiResponse = await generateJSON(prompt);

    // Validate structure slightly or just trust AI for speed
    const finalData = {
      month,
      season,
      recommendedCrops: aiResponse.recommendedCrops || []
    };

    cache.set(cacheKey, finalData);
    res.json({ success: true, cached: false, ...finalData });

  } catch (error) {
    console.error("Current Month API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// FEATURE 2: CROP SUGGESTION API
export const getCropSuggestion = async (req, res) => {
  try {
    const { crop, month } = req.body;

    if (!crop || !month) {
      return res.status(400).json({ success: false, message: "Crop and Month are required" });
    }

    const cacheKey = `suggestion_${crop}_${month}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, ...cachedData });
    }

    // AI Prompt as specified
    const prompt = `
      Crop: ${crop}
      Month: ${month}

      Tell:
      • diseases
      • pests
      • virus
      • simple prevention
      • simple solution

      Respond in JSON only.
      Format:
      {
        "crop": "${crop}",
        "month": "${month}",
        "problems": [
          {
            "name": "problem name",
            "type": "Disease | Virus | Pest | Nutrient | Climate",
            "riskLevel": "Low | Medium | High",
            "symptoms": "simple symptoms",
            "prevention": "easy prevention steps",
            "solution": "practical treatment"
          }
        ],
        "generalAdvice": "short, farmer-friendly advice"
      }
    `;

    const aiResponse = await generateJSON(prompt);

    cache.set(cacheKey, aiResponse);
    res.json({ success: true, cached: false, ...aiResponse });

  } catch (error) {
    console.error("Crop Suggestion API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// FEATURE 4: AI FARMING CHATBOT (OpenRouter / Llama 3.2 3B)
export const getFarmingChat = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    const systemPrompt = `
You are an expert Indian farming assistant and agricultural advisor.

Your role:
- Help farmers solve farming problems in a simple, practical way.
- Continue the conversation until the farmer fully understands the solution.

Language rule (VERY IMPORTANT):
- Detect the language used by the farmer.
- Reply ONLY in the same language (Hindi, English, or Hinglish).
- Do not change the language unless the farmer changes it.

Response rules:
- Use very simple words suitable for farmers.
- Give step-by-step solutions.
- Prefer practical advice over theory.
- If the problem is unclear, politely ask a follow-up question.
- If chemicals are suggested, include basic safety advice.

Scope of help:
- Crop problems
- Diseases and pests
- Fertilizer usage
- Irrigation issues
- Seasonal crop advice
- General farming guidance

Do NOT:
- Use complex scientific terms
- Give unsafe or extreme advice
- Change the farmer’s language

Always behave like a patient, helpful farming expert.
`;

    // Construct prompt for Gemini
    let conversation = systemPrompt + "\n\nConversation History:\n";
    (chatHistory || []).forEach(msg => {
      conversation += `${msg.sender === 'user' ? 'Farmer' : 'Assistant'}: ${msg.text}\n`;
    });
    conversation += `Farmer: ${message}\nAssistant:`;

    // Use Gemini for text generation
    const responseText = await generateText(conversation);

    res.json({
      success: true,
      data: {
        text: responseText
      }
    });

  } catch (error) {
    console.error('AI Chatbot API Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get chatbot response",
      details: error.message
    });
  }
};


// FEATURE 5: CROP ADDITIONAL INFO (Weather, Market, Soil, Pest)
// Called by Scanner page for weather, market, soil, pest information
export const getCropAdditionalInfo = async (req, res) => {
  try {
    const { cropName, infoType, language = 'en' } = req.body;

    if (!cropName || !infoType) {
      return res.status(400).json({ 
        success: false, 
        message: "cropName and infoType are required" 
      });
    }

    // Map language code to full name
    const langName = { 'en': 'English', 'hi': 'Hindi', 'gu': 'Gujarati' }[language] || 'English';

    // Map infoType to prompt
    const prompts = {
      'weather': `Provide a weather forecast suitable for growing "${cropName}" in India. Focus on temperature, rainfall, and humidity requirements.`,
      'market': `What are the current market price trends for "${cropName}" in major Indian mandis? Use ₹ symbol.`,
      'soil': `What is the ideal soil health report for "${cropName}"? Include pH, NPK levels, and texture.`,
      'pest': `List common pests for "${cropName}" in India and their quick control methods.`
    };

    if (!prompts[infoType]) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid infoType. Allowed: weather, market, soil, pest" 
      });
    }

    const basePrompt = prompts[infoType];
    const finalPrompt = `Act as an agricultural expert. Respond in ${langName}. ${basePrompt}`;

    // Use existing Gemini service
    const responseText = await generateText(finalPrompt);

    res.json({
      success: true,
      data: {
        text: responseText,
        cropName,
        infoType
      }
    });

  } catch (error) {
    console.error('Crop Additional Info API Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch information",
      details: error.message
    });
  }
};
