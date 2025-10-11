import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiTrendingUp, 
  FiMapPin, 
  FiThermometer, 
  FiDroplet, 
  FiSun,
  FiBarChart,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const SmartCropPlanning = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedRegion, setSelectedRegion] = useState('northeast');
  const [soilType, setSoilType] = useState('loamy');
  const [weatherData, setWeatherData] = useState(null);
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const seasons = [
    { id: 'spring', name: 'Spring', icon: '🌸' },
    { id: 'summer', name: 'Summer', icon: '☀️' },
    { id: 'fall', name: 'Fall', icon: '🍂' },
    { id: 'winter', name: 'Winter', icon: '❄️' }
  ];

  const regions = [
    { id: 'northeast', name: 'Northeast', climate: 'Humid Continental' },
    { id: 'southeast', name: 'Southeast', climate: 'Humid Subtropical' },
    { id: 'midwest', name: 'Midwest', climate: 'Humid Continental' },
    { id: 'southwest', name: 'Southwest', climate: 'Semi-arid' },
    { id: 'west', name: 'West Coast', climate: 'Mediterranean' }
  ];

  const soilTypes = [
    { id: 'loamy', name: 'Loamy', description: 'Well-balanced, ideal for most crops' },
    { id: 'clay', name: 'Clay', description: 'Heavy, good water retention' },
    { id: 'sandy', name: 'Sandy', description: 'Light, good drainage' },
    { id: 'silty', name: 'Silty', description: 'Fertile, good moisture retention' }
  ];

  // Mock weather data - in real app, this would come from weather API
  const mockWeatherData = {
    temperature: { current: 72, forecast: [68, 75, 80, 72] },
    humidity: { current: 65, forecast: [60, 70, 75, 68] },
    rainfall: { current: 0.1, forecast: [0, 0.3, 0.8, 0.2] },
    sunlight: { current: 8.5, forecast: [9, 8, 7, 8.5] }
  };

  // Mock crop recommendations - in real app, this would come from AI analysis
  const mockCropRecommendations = [
    {
      name: 'Tomatoes',
      variety: 'Early Girl',
      confidence: 95,
      profitPotential: 'High',
      plantingTime: 'Early Spring',
      harvestTime: 'Mid Summer',
      estimatedYield: '15-20 lbs per plant',
      marketDemand: 'Very High',
      riskLevel: 'Low',
      specialNotes: 'Excellent for early market advantage'
    },
    {
      name: 'Bell Peppers',
      variety: 'California Wonder',
      confidence: 88,
      profitPotential: 'Medium-High',
      plantingTime: 'Mid Spring',
      harvestTime: 'Late Summer',
      estimatedYield: '8-12 peppers per plant',
      marketDemand: 'High',
      riskLevel: 'Low',
      specialNotes: 'Good disease resistance, consistent yields'
    },
    {
      name: 'Cucumbers',
      variety: 'Marketmore 76',
      confidence: 82,
      profitPotential: 'Medium',
      plantingTime: 'Late Spring',
      harvestTime: 'Mid Summer',
      estimatedYield: '10-15 cucumbers per plant',
      marketDemand: 'Medium-High',
      riskLevel: 'Medium',
      specialNotes: 'Watch for cucumber beetles'
    }
  ];

  useEffect(() => {
    setWeatherData(mockWeatherData);
    setCropRecommendations(mockCropRecommendations);
  }, []);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProfitColor = (profit) => {
    if (profit === 'High') return 'text-green-600 bg-green-100';
    if (profit === 'Medium-High') return 'text-blue-600 bg-blue-100';
    if (profit === 'Medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-600 bg-green-100';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🌱 Smart Crop Planning Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered recommendations for optimal crop selection, seasonal planning, and profit maximization
          </p>
        </div>

        {/* Input Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Configure Your Growing Conditions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Season Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Growing Season
              </label>
              <div className="grid grid-cols-2 gap-2">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedSeason === season.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{season.icon}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {season.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Geographic Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.climate})
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {soilTypes.map((soil) => (
                  <option key={soil.id} value={soil.id}>
                    {soil.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setLoading(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Analyzing...' : 'Get AI Recommendations'}
            </button>
          </div>
        </div>

        {/* Weather Dashboard */}
        {weatherData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiThermometer className="mr-2 text-blue-500" />
              Current Weather Conditions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FiThermometer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{weatherData.temperature.current}°F</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <FiDroplet className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{weatherData.humidity.current}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <FiDroplet className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{weatherData.rainfall.current}"</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rainfall</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <FiSun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{weatherData.sunlight.current}h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sunlight</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Crop Recommendations */}
        {cropRecommendations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-green-500" />
              AI-Powered Crop Recommendations
            </h2>
            
            <div className="space-y-6">
              {cropRecommendations.map((crop, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {crop.name} - {crop.variety}
                      </h3>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(crop.confidence)}`}>
                          {crop.confidence}% Confidence
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProfitColor(crop.profitPotential)}`}>
                          {crop.profitPotential} Profit
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(crop.riskLevel)}`}>
                          {crop.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                    
                    <div className="lg:text-right">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {crop.confidence}%
                      </div>
                      <div className="text-sm text-gray-500">AI Confidence</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">Planting</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{crop.plantingTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">Harvest</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{crop.harvestTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiBarChart className="text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">Yield</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{crop.estimatedYield}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiTrendingUp className="text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-500">Demand</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{crop.marketDemand}</div>
                      </div>
                    </div>
                  </div>
                  
                  {crop.specialNotes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <FiCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{crop.specialNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Planning Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiCalendar className="mr-2 text-purple-500" />
            Seasonal Planting Calendar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasons.map((season) => (
              <div key={season.id} className="text-center">
                <div className="text-4xl mb-2">{season.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {season.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="font-medium text-green-800 dark:text-green-200">Plant</div>
                    <div className="text-green-600 dark:text-green-300">Tomatoes, Peppers</div>
                  </div>
                  
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-medium text-blue-800 dark:text-blue-200">Harvest</div>
                    <div className="text-blue-600 dark:text-blue-300">Lettuce, Herbs</div>
                  </div>
                  
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <div className="font-medium text-purple-800 dark:text-purple-200">Market</div>
                    <div className="text-purple-600 dark:text-purple-300">High Demand</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Prediction Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiDollarSign className="mr-2 text-green-500" />
            Profit Prediction & Market Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">$2,400</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Revenue</div>
              <div className="text-xs text-green-600">+15% vs last season</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">$1,680</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Profit</div>
              <div className="text-xs text-blue-600">+22% vs last season</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Profit Margin</div>
              <div className="text-xs text-purple-600">+7% vs last season</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Market Opportunity Alert
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Early tomatoes are showing 25% higher demand this season. Consider extending your early planting window for maximum profit potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCropPlanning;
