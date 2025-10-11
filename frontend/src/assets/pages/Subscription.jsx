import React from 'react';
import { FiPackage, FiStar, FiCalendar, FiCheck } from 'react-icons/fi';

function Subscription() {
  const subscriptionPlans = [
    {
      name: 'Basic Box',
      price: '$29.99',
      period: 'per week',
      features: [
        'Fresh seasonal vegetables',
        'Local farm produce',
        'Weekly delivery',
        'Basic recipe suggestions'
      ],
      popular: false
    },
    {
      name: 'Premium Box',
      price: '$49.99',
      period: 'per week',
      features: [
        'All Basic features',
        'Organic fruits & vegetables',
        'Artisan bread & dairy',
        'AI-powered meal planning',
        'Priority delivery'
      ],
      popular: true
    },
    {
      name: 'Family Box',
      price: '$79.99',
      period: 'per week',
      features: [
        'All Premium features',
        'Larger portions',
        'Family meal kits',
        'Nutritional guidance',
        'Flexible delivery schedule'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Subscription
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get fresh, local produce delivered to your door with our AI-personalized subscription boxes.
          </p>
        </section>

        {/* Subscription Plans */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
              } ${
                index === 0 ? 'animate-slide-in-left' : 
                index === 1 ? 'animate-fade-in-up' : 'animate-slide-in-right'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FiStar className="w-4 h-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-green-600 dark:bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:scale-105 font-semibold">
                Choose Plan
              </button>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Why Choose Our Subscription?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Fresh & Local
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All produce comes directly from local farms within 24 hours of harvest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Flexible Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your delivery schedule and pause or cancel anytime.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                AI Personalization
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized recommendations based on your preferences and dietary needs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Subscription;