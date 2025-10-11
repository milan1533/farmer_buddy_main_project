import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher.jsx';


// Stable language names constant at module scope to avoid hook dependency warnings
const LANGUAGE_NAMES = { en: 'English', hi: 'Hindi', gu: 'Gujarati' };

function ARProductScanner() {
  const { t, i18n } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isCareLoading, setIsCareLoading] = useState(false);

  const [suggestions, setSuggestions] = useState({
    cropName: 'Upload an image to get a name.',
    diseaseStatus: '...',
    suggestedMedicine: '...',
    suggestedFertiliser: '...',
  });
  const [careInfo, setCareInfo] = useState({
    title: t('results.careAndPrevention'),
    info: t('upload.label'),
  });
  const [currentCropName, setCurrentCropName] = useState('');

  // Topics: canonical English key for AI prompts + translation key for UI
  const TOPICS = [
    { key: 'Weather Forecast', tKey: 'actions.weather' },
    { key: 'Market Prices', tKey: 'actions.market' },
    { key: 'Soil Health Report', tKey: 'actions.soil' },
    { key: 'Pest Control Guide', tKey: 'actions.pest' },
  ];

  const fetchWithRetry = useCallback(async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        if (response.status === 429 || response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
        throw new Error(`API request failed with status ${response.status}`);
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Failed to fetch after multiple retries.');
  }, []);

  const getAiSuggestions = useCallback(async (base64ImageData) => {
    const langCode = i18n.language?.split('-')[0] || 'en';
    const langName = LANGUAGE_NAMES[langCode] || 'English';
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAq5iHBW9DAdCsFL1NwxQIdNSnUt-2ThPc';
    if (!apiKey) {
      throw new Error('Missing VITE_GEMINI_API_KEY in frontend/.env');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `Analyze this image of a crop or soil. Respond in ${langName}.

Return STRICT JSON only (no prose) with the following KEYS IN ENGLISH exactly, but with VALUES translated into ${langName}:
{
  "cropName": string,
  "diseaseStatus": string,
  "suggestedMedicine": string,
  "suggestedFertiliser": string,
  "careAndPrevention": string
}

Instructions:
1) Identify the crop name.
2) Determine disease status (e.g., "Healthy", or "Sick - Powdery Mildew").
3) If sick, suggest medicine/treatment; if healthy, use an appropriate equivalent of "Not Applicable" in ${langName}.
4) Suggest a suitable fertiliser for the crop.
5) Provide a concise paragraph of care and prevention tips.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: base64ImageData } }] }],
      generation_config: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'OBJECT',
          properties: {
            cropName: { type: 'STRING' },
            diseaseStatus: { type: 'STRING' },
            suggestedMedicine: { type: 'STRING' },
            suggestedFertiliser: { type: 'STRING' },
            careAndPrevention: { type: 'STRING' },
          },
          required: ['cropName', 'diseaseStatus', 'suggestedMedicine', 'suggestedFertiliser', 'careAndPrevention'],
        },
      },
    };

    const response = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      const newSuggestions = JSON.parse(candidate.content.parts[0].text);
      setSuggestions(newSuggestions);
      setCurrentCropName(newSuggestions.cropName);
      setCareInfo({ title: t('results.careAndPrevention'), info: newSuggestions.careAndPrevention });
    } else {
      throw new Error('Invalid response from AI.');
    }
  }, [fetchWithRetry, i18n.language, t]);

  const getAdditionalInfo = useCallback(async (option, crop) => {
    const langCode = i18n.language?.split('-')[0] || 'en';
    const langName = LANGUAGE_NAMES[langCode] || 'English';
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAq5iHBW9DAdCsFL1NwxQIdNSnUt-2ThPc';
    if (!apiKey) {
      throw new Error('Missing VITE_GEMINI_API_KEY in frontend/.env');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `Act as an agricultural assistant for India. Respond in ${langName}.

Provide a concise, helpful summary for a farmer about "${option}" specifically for growing "${crop}".

If the topic is "Weather Forecast", provide an ideal forecast for this crop's growth stages relevant to Indian climates.

If it's "Market Prices", ONLY use Indian Rupees — INR (₹). Give a brief overview of current market trends and price points for this crop in India. Do not use dollars or the $ symbol. Use the ₹ symbol and write prices like ₹52/kg. If you mention multiple regions, keep them to major Indian markets.

For "Soil Health Report", describe the ideal soil conditions (pH, nutrients, texture) for India.

For "Pest Control Guide", list 2-3 common pests for this crop in India and suggest an organic and a chemical control method for each.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      const raw = candidate.content.parts[0].text;
      // Prefer INR symbols in the output
      const cleaned = raw
        .replace(/\$/g, '₹')
        .replace(/\bUSD\b/gi, 'INR');
      return cleaned;
    } else {
      throw new Error('No content received from AI for additional info.');
    }
  }, [fetchWithRetry, i18n.language]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset UI
    setCurrentCropName('');
    setUploadError('');
    setImagePreview(null);
    setIsUploading(true);
    setIsSuggestionsLoading(true);
    setSuggestions({
      cropName: 'Analyzing...',
      diseaseStatus: '...',
      suggestedMedicine: '...',
      suggestedFertiliser: '...',
    });
    setCareInfo({ title: t('results.careAndPrevention'), info: 'Analyzing image...' });

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64ImageData = reader.result.split(',')[1];
      setImagePreview(reader.result);
      try {
        await getAiSuggestions(base64ImageData);
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
        setUploadError('Failed to get suggestions. Please try again.');
      } finally {
        setIsUploading(false);
        setIsSuggestionsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSwitchForClick = async (event) => {
    // Use canonical English key for AI prompts; show localized label in UI
    const key = event.currentTarget.dataset.key;
    const label = event.currentTarget.dataset.label;

    if (!currentCropName) {
      setCareInfo({
        title: t('actions.actionRequired'),
        info: t('actions.uploadFirst')
      });
      return;
    }

    setCareInfo({ title: label, info: t('actions.fetchingFor', { topic: label }) });
    setIsCareLoading(true);

    try {
      const info = await getAdditionalInfo(key, currentCropName);
      setCareInfo({ title: label, info });
    } catch (error) {
      console.error('Error fetching additional info:', error);
      setCareInfo({ title: label, info: t('actions.fetchFailed') });
    } finally {
      setIsCareLoading(false);
    }
  };

  return (
    <div className="App p-6">
      <header className="App-header text-center mb-8">
        <h1 className="text-3xl font-bold">{t('header.title')}</h1>
        <p className="text-gray-600">{t('header.subtitle')}</p>
        <LanguageSwitcher />
      </header>

      <main className="main-content grid gap-8 md:grid-cols-2">
        <section className="upload-section">
          <div className="upload-container">
            <label htmlFor="image-upload" className="upload-label block cursor-pointer">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview w-full rounded-md" />
              ) : (
                <div className="upload-placeholder flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md text-gray-500">
                  <span className="text-3xl">📷</span>
                  <p>{t('upload.label')}</p>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
            {uploadError && <p className="error-message text-red-600 mt-2">{uploadError}</p>}
          </div>
        </section>

        <section className="results-section space-y-6">
          <div className="suggestions-container">
            <h2 className="text-xl font-semibold mb-4">{t('results.sectionTitle')}</h2>
            <div className="suggestions-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="suggestion-card p-4 border rounded-md">
                <h3 className="font-medium">{t('results.cropName')}</h3>
                <p>{isSuggestionsLoading ? 'Analyzing...' : suggestions.cropName}</p>
              </div>
              <div className="suggestion-card p-4 border rounded-md">
                <h3 className="font-medium">{t('results.diseaseStatus')}</h3>
                <p>{isSuggestionsLoading ? 'Analyzing...' : suggestions.diseaseStatus}</p>
              </div>
              <div className="suggestion-card p-4 border rounded-md">
                <h3 className="font-medium">{t('results.suggestedMedicine')}</h3>
                <p>{isSuggestionsLoading ? 'Analyzing...' : suggestions.suggestedMedicine}</p>
              </div>
              <div className="suggestion-card p-4 border rounded-md">
                <h3 className="font-medium">{t('results.suggestedFertiliser')}</h3>
                <p>{isSuggestionsLoading ? 'Analyzing...' : suggestions.suggestedFertiliser}</p>
              </div>
            </div>
          </div>

          <div className="care-section">
            <h2 className="text-xl font-semibold mb-2">{careInfo.title}</h2>
            <div className="care-info p-4 border rounded-md min-h-[120px]">
              {isCareLoading ? <p>{t('results.loading')}</p> : <p>{careInfo.info}</p>}
            </div>
            <div className="switch-buttons mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.key}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSwitchForClick}
                  data-key={topic.key}
                  data-label={t(topic.tKey)}
                >
                  {t(topic.tKey)}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ARProductScanner;
