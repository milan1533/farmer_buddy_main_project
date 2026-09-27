import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiMessageSquare, FiSmartphone, FiMap, FiSun, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-earth-50 dark:bg-dark-bg transition-colors duration-300">
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image with Parallax-like feel */}
          <div className="absolute inset-0 z-0 select-none bg-primary-900">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2600&auto=format&fit=crop"
              alt="Modern Farming Landscape"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide uppercase">The Future of Agriculture</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight animate-fade-in-up">
                Smart Farming for a <br />
                <span className="text-primary-400">Sustainable Future</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl animate-fade-in-up delay-100">
                Empowering farmers with AI-driven insights, direct market access, and advanced crop planning tools.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-glow"
                >
                  Get Started Free <FiArrowRight />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-bold border border-white/20 transition-all flex items-center gap-2"
                >
                  Explore Services
                </Link>
              </div>


            </div>
          </div>
        </section>

        {/* Features Grid (Bento Style) */}
        <section className="py-24 px-6 bg-earth-50 dark:bg-dark-bg">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to grow
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Integrated tools designed to maximize yield and minimize waste.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 min-h-[600px]">
              {/* Main Feature - Smart Crop */}
              <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-3xl shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2000&auto=format&fit=crop"
                  alt="Smart Crop"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl shadow-lg">
                    <FiTrendingUp />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-4">Smart Crop Planning</h3>
                  <p className="text-gray-200 mb-6 max-w-md">
                    Leverage AI to analyze soil, weather, and market trends to choose the perfect crop for your land.
                  </p>
                  <Link
                    to="/smart-crop-planning"
                    className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-primary-500 pb-1 hover:text-primary-400 transition-colors"
                  >
                    Start Planning <FiArrowRight />
                  </Link>
                </div>
              </div>

              {/* Secondary Feature - Marketplace */}
              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl bg-secondary-500 shadow-soft">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <FiActivity size={120} />
                </div>
                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl">
                    <FiUsers />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Community</h3>
                    <p className="text-white/90 text-sm mb-4">Connect with other farmers worldwide.</p>
                    <Link to="/community" className="text-white text-sm font-bold hover:underline">Join Now &rarr;</Link>
                  </div>
                </div>
              </div>

              {/* Third Feature - AI Chat */}
              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl bg-dark-card border border-white/5 shadow-soft">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-dark-bg" />
                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 text-2xl">
                      <FiMessageSquare />
                    </div>
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-xs font-bold uppercase">New</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">AI Assistant</h3>
                    <p className="text-gray-400 text-sm mb-4">24/7 expert farming advice.</p>
                    <Link to="/ai-farming-chatbot" className="text-primary-400 text-sm font-bold hover:underline">Chat Now &rarr;</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-24 bg-white dark:bg-dark-card border-t border-earth-100 dark:border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <InfoCard
                icon={<FiSun className="text-orange-500" />}
                title="Real-time Weather"
                desc="Precise weather forecasts tailored to your location to help you plan irrigation and harvest."
                link="/weather"
              />
              <InfoCard
                icon={<FiSmartphone className="text-indigo-500" />}
                title="AR Scanner"
                desc="Identify pests and diseases instantly using your phone's camera with our AR tools."
                link="/ar-product-scanner"
              />
              <InfoCard
                icon={<FiMap className="text-emerald-500" />}
                title="Farmer Assistance"
                desc="Get government scheme updates and expert consultation for your specific needs."
                link="/farmer-assistance"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-earth-50 dark:bg-dark-bg">
          <div className="container mx-auto overflow-hidden rounded-[3rem] bg-primary-900 relative">
            <div className="absolute top-0 right-0 w-full h-full opacity-30">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" alt="background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent" />

            <div className="relative z-10 p-12 md:p-24 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Ready to transform your harvest?
              </h2>
              <p className="text-xl text-primary-100 mb-10 leading-relaxed">
                Join thousands of modern farmers who are using Farmer Buddy to increase yields and sustainable practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-primary-900 rounded-xl font-bold text-center hover:bg-earth-50 transition-all shadow-xl"
                >
                  Join Now — It's Free
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-center hover:bg-white/10 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

const InfoCard = ({ icon, title, desc, link }) => (
  <Link to={link} className="group p-8 rounded-3xl bg-earth-50 dark:bg-dark-bg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-earth-100 dark:hover:border-white/5">
    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
      {desc}
    </p>
    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm group-hover:gap-3 transition-all">
      View Details <FiArrowRight />
    </div>
  </Link>
);

export default HomePage;
