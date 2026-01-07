import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
 

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-all duration-300">
      <main className="w-full">
        {/* Hero Section - Full-bleed background image matching reference */}
        <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop)'
            }}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
          </div>

          {/* Content Overlay - Left aligned like reference */}
          <div className="relative z-10 h-full w-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-2xl">
                {/* Navigation arrows (like reference) */}
                <div className="flex items-center gap-2 mb-6">
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all">
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all">
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Welcome hero copy */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Welcome to Farmer Buddy
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-2 leading-relaxed max-w-3xl">
                  Connect with local farmers, enjoy fresh produce, and discover Al-personalized subscription boxes fresh from the farm, straight to your door.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services Section - Matching reference layout */}
        <section className="bg-gray-100 dark:bg-gray-800 py-12 md:py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Farmer Help Card */}
              <Link 
                to="/farmer-assistance"
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src="data:image/jpeg;base64,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"
                    alt="Support Our Farmers"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Farmer Help</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Get Assistance</p>
                </div>
              </Link>

              {/* Farmer Community Card */}
              <Link 
                to="/community"
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop"
                    alt="Farmer Community"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Farmer Community Page</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Connect & Share</p>
                </div>
              </Link>

              {/* Smart Crop Planning Card */}
              <Link 
                to="/smart-crop-planning"
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop"
                    alt="Smart Crop Planning"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Smart Crop Planning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">AI-Powered Planning</p>
                </div>
              </Link>

              {/* AR Product Scanner Card */}
              <Link 
                to="/ar-product-scanner"
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&h=400&fit=crop"
                    alt="AR Product Scanner"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">AR Product Scanner</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Scan & Discover</p>
                </div>
              </Link>

              {/* AI Farming Chatbot Card */}
              <Link 
                to="/ai-farming-chatbot"
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop"
                    alt="AI Farming Chatbot"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI Farming Chatbot</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">24/7 AI Assistant</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
