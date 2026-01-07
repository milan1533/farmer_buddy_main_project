import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaFileUpload, FaSpinner, FaNotesMedical, FaCheckCircle, FaExclamationTriangle, FaSeedling, FaCloudSun, FaRupeeSign, FaFlask, FaBug, FaSyringe, FaShieldAlt } from 'react-icons/fa';

// Stable language names constant
const LANGUAGE_NAMES = { en: 'English', hi: 'Hindi', gu: 'Gujarati' };

const HelperButton = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
      ${isActive
        ? 'bg-green-600 text-white shadow-green-200 ring-2 ring-green-300'
        : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
      }`}
  >
    <Icon className={isActive ? 'text-white' : 'text-green-600'} />
    {label}
  </button>
);

function ARProductScanner() {
  const { t, i18n } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [diagnosisReport, setDiagnosisReport] = useState('');
  const [currentCropName, setCurrentCropName] = useState('');

  // Extra features state
  const [activeTab, setActiveTab] = useState('diagnosis'); // diagnosis, weather, market, soil, pest
  const [extraInfo, setExtraInfo] = useState({ loading: false, data: null, error: null });

  // Refs for scrolling
  const resultsRef = useRef(null);

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
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Failed to fetch after multiple retries.');
  }, []);

  const getAiSuggestions = useCallback(async (file) => {
    const apiUrl = 'http://localhost:5000/api/analyze-crop-disease';

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetchWithRetry(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to analyze image');
    }
  }, [fetchWithRetry]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset UI
    setCurrentCropName('');
    setUploadError('');
    setImagePreview(null);
    setDiagnosisReport('');
    setExtraInfo({ loading: false, data: null, error: null });
    setActiveTab('diagnosis');

    setIsUploading(true);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const data = await getAiSuggestions(file);
      setDiagnosisReport(data.text);
      setCurrentCropName(data.cropName || 'Unknown Crop');

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setUploadError('Unable to analyze image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const parseDiagnosis = (text) => {
    if (!text) return [];

    // Split by common markdown headers or numbered lists
    const sections = text.split(/(?=\n(?:#+\s|\d+\.\s|\*\*\s*))/g).filter(s => s.trim().length > 0);

    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^[#*0-9.\s]+/, '').replace(/[:*]+$/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      // Assign icons based on keywords in title
      let Icon = FaLeaf;
      if (/disease|problem|issue/i.test(title)) Icon = FaExclamationTriangle;
      if (/symptom/i.test(title)) Icon = FaBug;
      if (/treatment|cure|medicine/i.test(title)) Icon = FaSyringe;
      if (/prevention|safety/i.test(title)) Icon = FaShieldAlt;
      if (/cause/i.test(title)) Icon = FaFlask;

      return { title, content, Icon, id: index };
    });
  };

  const getAdditionalInfo = async (topic) => {
    if (!currentCropName) return;

    setActiveTab(topic.key);
    setExtraInfo({ loading: true, data: null, error: null });

    try {
      const langCode = i18n.language?.split('-')[0] || 'en';
      const langName = LANGUAGE_NAMES[langCode] || 'English';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDfoSjOncOEC9zfJEsLP2iQPJySLUwRPDw';

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Map internal keys to user-friendly prompts
      const prompts = {
        'weather': `Provide a weather forecast suitable for growing "${currentCropName}" in India. Focus on temperature, rainfall, and humidity requirements.`,
        'market': `What are the current market price trends for "${currentCropName}" in major Indian mandis? Use ₹ symbol.`,
        'soil': `What is the ideal soil health report for "${currentCropName}"? Include pH, NPK levels, and texture.`,
        'pest': `List common pests for "${currentCropName}" in India and their quick control methods.`
      };

      const prompt = `Act as an agricultural expert. Respond in ${langName}. ${prompts[topic.key]}`;

      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setExtraInfo({ loading: false, data: text, error: null });
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      setExtraInfo({ loading: false, data: null, error: 'Failed to fetch info.' });
    }
  };

  const diagnosisCards = parseDiagnosis(diagnosisReport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 font-sans text-gray-800">

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4 shadow-inner">
            <FaLeaf className="text-3xl text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 mb-3">
            {t('header.title') || 'Smart Crop Doctor'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            {t('header.subtitle') || 'Upload a photo of your crop to instantly identify diseases and get expert treatment advice.'}
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Upload */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-green-400 to-emerald-500" />
              <div className="p-8">
                <div className="upload-container relative group">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`
                        block w-full aspect-[4/3] rounded-2xl border-3 border-dashed transition-all duration-300 cursor-pointer overflow-hidden relative
                        ${imagePreview ? 'border-green-400 bg-gray-50' : 'border-gray-300 hover:border-green-500 hover:bg-green-50 group-hover:shadow-inner'}
                      `}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-semibold flex items-center gap-2">
                            <FaFileUpload /> Change Photo
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FaFileUpload className="text-3xl text-green-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-600">Click to Upload</p>
                        <p className="text-sm">or drag and drop crop image here</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 text-center h-12">
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-3 text-green-700 font-semibold animate-pulse">
                      <FaSpinner className="animate-spin text-xl" />
                      <span>Analyzing crop health...</span>
                    </div>
                  ) : uploadError ? (
                    <p className="text-red-500 font-medium bg-red-50 py-2 rounded-lg">{uploadError}</p>
                  ) : imagePreview && !diagnosisReport ? (
                    <p className="text-gray-500 italic">Ready for analysis...</p>
                  ) : diagnosisReport ? (
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold bg-green-100 py-2 rounded-lg">
                      <FaCheckCircle /> Analysis Complete
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Buttons (Only show when crop identified) */}
            {currentCropName && !isUploading && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">More Insights for {currentCropName}</h3>
                <div className="flex flex-wrap gap-3">
                  <HelperButton icon={FaCloudSun} label="Weather" isActive={activeTab === 'weather'} onClick={() => getAdditionalInfo({ key: 'weather' })} />
                  <HelperButton icon={FaRupeeSign} label="Market" isActive={activeTab === 'market'} onClick={() => getAdditionalInfo({ key: 'market' })} />
                  <HelperButton icon={FaLeaf} label="Soil" isActive={activeTab === 'soil'} onClick={() => getAdditionalInfo({ key: 'soil' })} />
                  <HelperButton icon={FaBug} label="Pests" isActive={activeTab === 'pest'} onClick={() => getAdditionalInfo({ key: 'pest' })} />
                  <HelperButton icon={FaNotesMedical} label="Diagnosis" isActive={activeTab === 'diagnosis'} onClick={() => { setActiveTab('diagnosis'); setExtraInfo({ loading: false, data: null }); }} />
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Results */}
          <section className="lg:col-span-7" ref={resultsRef}>
            {activeTab === 'diagnosis' ? (
              diagnosisReport ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <FaNotesMedical className="text-green-600" /> Diagnosis Report
                    </h2>
                    <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border">AI-Powered</span>
                  </div>

                  <div className="grid gap-5">
                    {diagnosisCards.map((card, idx) => (
                      <div key={idx} className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow overflow-hidden group">
                        <div className="bg-gray-50 px-6 py-3 border-b flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm text-green-600 group-hover:text-green-700 group-hover:bg-green-50 transition-colors">
                            <card.Icon />
                          </div>
                          <h3 className="font-bold text-gray-700 text-lg group-hover:text-green-800 transition-colors">
                            {card.title || 'Info'}
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="prose prose-green prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {card.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Empty State for results
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 text-gray-400 p-8">
                  <FaSeedling className="text-6xl mb-4 opacity-20" />
                  <p className="text-lg">Upload an image to see the diagnosis results here.</p>
                </div>
              )
            ) : (
              // Extra Info Tab Content
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[400px]">
                <div className="bg-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3 capitalize">
                    {activeTab === 'weather' && <FaCloudSun />}
                    {activeTab === 'market' && <FaRupeeSign />}
                    {activeTab === 'soil' && <FaLeaf />}
                    {activeTab === 'pest' && <FaBug />}
                    {activeTab} Report
                  </h2>
                </div>
                <div className="p-8">
                  {extraInfo.loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-blue-600">
                      <FaSpinner className="animate-spin text-4xl mb-4" />
                      <p className="font-medium">Fetching latest insights...</p>
                    </div>
                  ) : extraInfo.error ? (
                    <div className="text-center py-12 text-red-500">
                      <FaExclamationTriangle className="text-4xl mb-4 mx-auto" />
                      <p>{extraInfo.error}</p>
                    </div>
                  ) : extraInfo.data ? (
                    <div className="prose prose-blue max-w-none text-gray-700 leading-loose whitespace-pre-wrap">
                      {extraInfo.data}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default ARProductScanner;
