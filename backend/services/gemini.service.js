import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const TEXT_MODEL = 'meta-llama/llama-3.1-8b-instruct';

const callOpenRouter = async (messages, { jsonMode = false } = {}) => {
  try {
    const payload = {
      model: TEXT_MODEL,
      messages,
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'Farmer Buddy AI Tool',
      },
      timeout: 120000,
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter');
    }
    return content;
  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error('OpenRouter API Error:', msg);
    throw new Error(`Failed to generate content from OpenRouter. ${typeof msg === 'string' ? msg : ''}`);
  }
};

export const generateJSON = async (prompt) => {
  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful assistant for Indian farmers. Always respond strictly as valid JSON with no markdown, no code fences, no explanations outside the JSON object. Use the keys requested.',
    },
    { role: 'user', content: prompt },
  ];

  const rawText = await callOpenRouter(messages, { jsonMode: true });

  const cleanText = String(rawText)
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (parseErr) {
    const startIdx = cleanText.indexOf('{');
    const endIdx = cleanText.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        return JSON.parse(cleanText.slice(startIdx, endIdx + 1));
      } catch (_) {}
    }
    console.error('JSON parse failed. Raw text:', cleanText);
    throw new Error('Failed to parse JSON response from AI');
  }
};

export const generateText = async (prompt) => {
  const messages = [{ role: 'user', content: prompt }];
  const text = await callOpenRouter(messages);
  return text;
};
