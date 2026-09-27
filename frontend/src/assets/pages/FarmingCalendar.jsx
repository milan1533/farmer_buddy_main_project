import React, { useEffect, useState } from "react";
import cropData from "../../data/cropData.json";

// Icons for Seasons
const SeasonIcon = ({ season }) => {
  if (season === "Kharif") return <span className="text-3xl">🌧️</span>;
  if (season === "Rabi") return <span className="text-3xl">❄️</span>;
  return <span className="text-3xl">☀️</span>;
};

// Color badge for Season
const getSeasonColor = (season) => {
  if (season === "Kharif") return "bg-green-100 text-green-800 border-green-200";
  if (season === "Rabi") return "bg-blue-100 text-blue-800 border-blue-200";
  return "bg-orange-100 text-orange-800 border-orange-200";
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Determine Season based on Month (India Rules)
const getSeason = (month) => {
  const m = month.toLowerCase();
  // Zaid: March – June
  if (["march", "april", "may", "june"].includes(m)) return "Zaid";
  // Kharif: July – October
  if (["july", "august", "september", "october"].includes(m)) return "Kharif";
  // Rabi: November – Feb
  return "Rabi";
};

const FarmingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);

  // 1. PAGE LOAD & MONTH DETECTION
  useEffect(() => {
    const now = new Date();
    const monthName = MONTHS[now.getMonth()];
    setCurrentMonth(monthName);
  }, []);

  // Recalculate season when month changes
  useEffect(() => {
    if (currentMonth) {
      const season = getSeason(currentMonth);
      setCurrentSeason(season);
      setSelectedCategory(null); // Reset selection
      setSelectedCrop(null);
      setCropDetails(null);
    }
  }, [currentMonth]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCrop(null);
    setCropDetails(null);
  };

  const handleCropClick = (cropName) => {
    setSelectedCrop(cropName);
    // Fetch details from JSON or fallback to generic structure if missing
    const detail = cropData.cropDetails[cropName] || {
      seed_name: `Standard ${cropName} Seed`,
      crop: cropName,
      season: currentSeason,
      soil_type: "Loamy / Sandy Loam",
      sowing_time: "Depends on region",
      maturity_days: "90–120 days",
      yield: "Average yield",
      water_requirement: "Medium",
      resistance: ["Common Pests"],
      price: "Check local market",
      description: `Suitable for ${currentSeason} season cultivation.`
    };
    setCropDetails(detail);
  };

  // Get categories for current season
  const seasonData = currentSeason ? cropData.seasons[currentSeason] : null;
  const categories = seasonData ? Object.keys(seasonData.categories) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-8 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            🌾 Smart Farming Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time advisory for Indian Agriculture
          </p>
        </div>

        {/* STEP 1: Month Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Current Month:</span>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="text-lg font-bold bg-transparent border-b-2 border-green-500 focus:outline-none text-gray-800 dark:text-gray-100"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m} className="dark:bg-gray-800">{m}</option>
                ))}
              </select>
            </div>

            {/* Season Badge */}
            {currentSeason && (
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${getSeasonColor(currentSeason)}`}>
                <SeasonIcon season={currentSeason} />
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold tracking-wider opacity-80">Current Season</span>
                  <span className="text-lg font-bold leading-none">{currentSeason}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: Season Categories */}
        {currentSeason && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              📂 Select Crop Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`p-4 rounded-xl border transition-all duration-200 text-left hover:shadow-md
                    ${selectedCategory === cat
                      ? "bg-green-600 text-white border-green-600 shadow-lg scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-green-400"
                    }`}
                >
                  <span className="font-semibold">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Crop List */}
        {selectedCategory && seasonData && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              🌱 Select Crop
            </h2>
            <div className="flex flex-wrap gap-3">
              {seasonData.categories[selectedCategory].map((crop) => (
                <button
                  key={crop}
                  onClick={() => handleCropClick(crop)}
                  className={`px-5 py-2 rounded-full border font-medium transition-colors
                    ${selectedCrop === crop
                      ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Crop Details */}
        {cropDetails && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
            <div className="bg-green-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">{cropDetails.crop}</h2>
                  <p className="opacity-90 mt-1">{cropDetails.seed_name}</p>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {cropDetails.season} Season
                </span>
              </div>
              <p className="mt-4 opacity-90 leading-relaxed max-w-3xl">
                {cropDetails.description}
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailItem label="Soil Type" value={cropDetails.soil_type} icon="🌍" />
              <DetailItem label="Sowing Time" value={cropDetails.sowing_time} icon="📅" />
              <DetailItem label="Maturity Period" value={cropDetails.maturity_days} icon="⏳" />
              <DetailItem label="Expected Yield" value={cropDetails.yield} icon="🌾" />
              <DetailItem label="Water Requirement" value={cropDetails.water_requirement} icon="💧" />
              <DetailItem label="Est. Price" value={cropDetails.price} icon="💰" />
            </div>

            <div className="px-6 pb-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
                <h4 className="text-red-800 dark:text-red-300 font-semibold mb-2 flex items-center gap-2">
                  🛡️ Disease Resistance / Risks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cropDetails.resistance.map((r, i) => (
                    <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-md text-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 shadow-sm">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">{value}</p>
    </div>
  </div>
);

export default FarmingCalendar;
