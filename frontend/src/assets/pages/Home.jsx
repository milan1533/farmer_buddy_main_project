import React from 'react';
import {  FiUsers, FiZap, FiArrowRight, FiStar } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-all duration-300">
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in-up">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 dark:from-green-600/10 dark:to-blue-600/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Farmer Buddy
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect with local farmers, enjoy fresh produce, and discover AI-personalized subscription boxes — fresh from the farm, straight to your door.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <a
                  href="/marketplace"
                  className="group bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span className="text-lg font-semibold">Discover Marketplace</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a
                  href="/subscription"
                  className="group bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span className="text-lg font-semibold">Get Your Subscription</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-left">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Support Local Farmers</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              List your produce, connect directly with buyers, and gain insights with our analytics dashboard.
            </p>
          </div>
          
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <p>icon</p>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Fresh for Consumers</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Shop local produce or subscribe for curated boxes tailored to your preferences.
            </p>
          </div>
          
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-right">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiZap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Powered by AI</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Enjoy personalized recommendations and smart planning for farmers and buyers alike.
            </p>
          </div>
        </section>

        {/* New Features Showcase */}
        <section className="space-y-8 mb-16">
          {/* Smart Crop Planning Feature Highlight */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Smart Crop Planning Assistant
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                AI-powered recommendations for optimal crop selection, seasonal planning, and profit maximization. 
                Get personalized advice based on your location, soil type, and market conditions.
              </p>
              <a
                href="/smart-crop-planning"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Try Smart Crop Planning</span>
                <FiArrowRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">AI Recommendations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get crop suggestions with confidence scores</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Seasonal Planning</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimal planting and harvest schedules</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Profit Predictions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Market demand and revenue forecasting</p>
              </div>
            </div>
          </div>

          {/* AI Farming Chatbot Feature */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                AI Farming Chatbot
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                24/7 AI-powered farming consultant that answers questions about pest control, soil health, 
                crop rotation, and more. Get instant expert advice anytime, anywhere.
              </p>
              <a
                href="/ai-farming-chatbot"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Chat with AI Expert</span>
                <FiArrowRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🐛</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Pest Control</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Natural solutions and prevention tips</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🌱</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Soil Health</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Testing and improvement strategies</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Crop Rotation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimal planting sequences</p>
              </div>
            </div>
          </div>

          {/* AR Product Scanner Feature */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                AR Product Scanner
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                Scan produce with your phone camera to get freshness rating, nutritional info, and farmer story. 
                Complete transparency from farm to phone.
              </p>
              <a
                href="/ar-product-scanner"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Try AR Scanner</span>
                <FiArrowRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Freshness Rating</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant quality assessment</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🥗</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Nutritional Info</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detailed health benefits</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">👨‍🌾</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Farmer Story</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with growers</p>
              </div>
            </div>
          </div>

          {/* Community Impact Tracker Feature */}
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-2xl p-8 shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Community Impact Tracker
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
                Track environmental impact, carbon footprint saved, water usage, and local economy boost. 
                Earn sustainability badges and gamify your eco-friendly choices.
              </p>
              <a
                href="/community-impact-tracker"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Track Your Impact</span>
                <FiArrowRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🌱</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Carbon Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor emissions saved</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Sustainability Badges</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gamified achievements</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Local Economy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Support local farmers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16 shadow-lg animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Local Farmers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Products Delivered</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                4.9
              </div>
              <div className="text-gray-600 dark:text-gray-300 flex items-center justify-center">
                <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                Rating
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="text-center animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Why Choose Farmer Buddy?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We're passionate about connecting communities with fresh, sustainable produce. Our AI makes it easy to find the best local options, while farmers benefit from direct sales and data-driven insights.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full">
               <p>icon</p>
                <span className="text-green-800 dark:text-green-200 font-medium">Fresh • Local • Sustainable</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
