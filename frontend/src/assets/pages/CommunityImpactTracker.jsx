import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiDroplet, 
  FiThermometer, 
  FiUsers, 
  FiMapPin,
  FiAward,
  FiStar,
  FiHeart,
  FiTarget,
  FiBarChart,
  FiCalendar,
  FiShare2,
  FiDownload,
  FiGift,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiGlobe,
  FiSun
} from 'react-icons/fi';

const CommunityImpactTracker = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showBadgeDetails, setShowBadgeDetails] = useState(null);

  const timeframes = [
    { id: 'week', name: 'This Week', days: 7 },
    { id: 'month', name: 'This Month', days: 30 },
    { id: 'quarter', name: 'This Quarter', days: 90 },
    { id: 'year', name: 'This Year', days: 365 }
  ];

  const regions = [
    { id: 'all', name: 'All Regions', color: 'bg-blue-500' },
    { id: 'gujarat', name: 'Gujarat', color: 'bg-green-500' },
    { id: 'maharashtra', name: 'Maharashtra', color: 'bg-purple-500' },
    { id: 'karnataka', name: 'Karnataka', color: 'bg-yellow-500' },
    { id: 'tamilnadu', name: 'Tamil Nadu', color: 'bg-red-500' }
  ];

  // Mock impact data - in real app, this would come from your backend
  const mockImpactData = {
    week: {
      carbonSaved: 1250,
      waterSaved: 8500,
      localEconomy: 45000,
      farmersSupported: 45,
      productsDelivered: 1200,
      communityMembers: 89
    },
    month: {
      carbonSaved: 5200,
      waterSaved: 35000,
      localEconomy: 185000,
      farmersSupported: 180,
      productsDelivered: 5200,
      communityMembers: 320
    },
    quarter: {
      carbonSaved: 15800,
      waterSaved: 105000,
      localEconomy: 560000,
      farmersSupported: 520,
      productsDelivered: 15800,
      communityMembers: 950
    },
    year: {
      carbonSaved: 65000,
      waterSaved: 425000,
      localEconomy: 2250000,
      farmersSupported: 2100,
      productsDelivered: 65000,
      communityMembers: 3800
    }
  };

  // Sustainability badges system
  const sustainabilityBadges = [
    {
      id: 'carbon-warrior',
      name: 'Carbon Warrior',
      description: 'Saved 1000+ kg of CO2 emissions',
      icon: '🌱',
      color: 'bg-green-500',
      unlocked: true,
      progress: 100,
      date: '2024-01-15'
    },
    {
      id: 'water-guardian',
      name: 'Water Guardian',
      description: 'Conserved 5000+ liters of water',
      icon: '💧',
      color: 'bg-blue-500',
      unlocked: true,
      progress: 100,
      date: '2024-01-20'
    },
    {
      id: 'local-champion',
      name: 'Local Champion',
      description: 'Supported 50+ local farmers',
      icon: '🏆',
      color: 'bg-yellow-500',
      unlocked: true,
      progress: 100,
      date: '2024-01-25'
    },
    {
      id: 'eco-pioneer',
      name: 'Eco Pioneer',
      description: 'Completed 100+ sustainable purchases',
      icon: '⭐',
      color: 'bg-purple-500',
      unlocked: false,
      progress: 75,
      date: null
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Referred 10+ new members',
      icon: '🤝',
      color: 'bg-pink-500',
      unlocked: false,
      progress: 40,
      date: null
    },
    {
      id: 'sustainability-master',
      name: 'Sustainability Master',
      description: 'Unlocked all basic badges',
      icon: '👑',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      unlocked: false,
      progress: 50,
      date: null
    }
  ];

  // Environmental impact comparisons
  const environmentalComparisons = [
    {
      metric: 'Carbon Footprint Saved',
      value: mockImpactData[selectedTimeframe].carbonSaved,
      unit: 'kg CO2',
      comparison: 'Equivalent to planting',
      trees: Math.round(mockImpactData[selectedTimeframe].carbonSaved / 22),
      icon: '🌳'
    },
    {
      metric: 'Water Conservation',
      value: mockImpactData[selectedTimeframe].waterSaved,
      unit: 'liters',
      comparison: 'Equivalent to',
      trees: Math.round(mockImpactData[selectedTimeframe].waterSaved / 1000),
      icon: '💧'
    },
    {
      metric: 'Local Economy Boost',
      value: mockImpactData[selectedTimeframe].localEconomy,
      unit: '₹',
      comparison: 'Supporting',
      trees: Math.round(mockImpactData[selectedTimeframe].localEconomy / 5000),
      icon: '💰'
    }
  ];

  const currentData = mockImpactData[selectedTimeframe];

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeColor = (badge) => {
    if (badge.unlocked) return badge.color;
    return 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🌍 Community Impact Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your environmental impact, support local farmers, and earn sustainability badges
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Timeframe Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Timeframe
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.id}
                    onClick={() => setSelectedTimeframe(timeframe.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedTimeframe === timeframe.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {timeframe.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Region
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedRegion === region.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {region.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiSun className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Carbon Saved</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentData.carbonSaved.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">kg CO2 equivalent</div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-700 dark:text-green-300">
                🌳 Equivalent to planting {Math.round(currentData.carbonSaved / 22)} trees
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FiDroplet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Water Saved</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentData.waterSaved.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">liters</div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                💧 Equivalent to {Math.round(currentData.waterSaved / 1000)} showers
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Farmers Supported</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentData.farmersSupported}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">local farmers</div>
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-purple-700 dark:text-purple-300">
                🏆 Supporting local communities
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Impact Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Environmental Impact Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiBarChart className="mr-2 text-green-500" />
              Environmental Impact
            </h2>
            
            <div className="space-y-6">
              {environmentalComparisons.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.metric}
                    </span>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {item.value.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((item.value / 1000) * 10, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.comparison} {item.trees} {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-blue-500" />
              Community Growth
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {currentData.communityMembers}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Active Members</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {currentData.productsDelivered}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Products Delivered</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiZap className="text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Community Milestone
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  🎉 Congratulations! Your community has saved enough carbon to offset a small car's annual emissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiAward className="mr-2 text-yellow-500" />
            Sustainability Badges
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sustainabilityBadges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  badge.unlocked 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
                onClick={() => setShowBadgeDetails(badge)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${getBadgeColor(badge)} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                    {badge.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    badge.unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {badge.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    badge.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {badge.description}
                  </p>
                  
                  {badge.unlocked ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                      <FiCheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Unlocked</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {badge.progress}% Complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FiTarget className="mr-2 text-green-500" />
            Take Action
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-3">
              <FiShare2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Share Impact</span>
            </button>
            
            <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-3">
              <FiDownload className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Download Report</span>
            </button>
            
            <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-3">
              <FiGift className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Invite Friends</span>
            </button>
          </div>
        </div>

        {/* Badge Details Modal */}
        {showBadgeDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className={`w-20 h-20 ${getBadgeColor(showBadgeDetails)} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                  {showBadgeDetails.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {showBadgeDetails.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {showBadgeDetails.description}
                </p>
                
                {showBadgeDetails.unlocked ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                      <FiCheckCircle className="w-5 h-5" />
                      <span className="font-medium">Badge Unlocked!</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Earned on {new Date(showBadgeDetails.date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Progress: {showBadgeDetails.progress}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${showBadgeDetails.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setShowBadgeDetails(null)}
                  className="mt-6 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityImpactTracker;
