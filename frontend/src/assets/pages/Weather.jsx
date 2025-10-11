import React from 'react';

const Weather = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Weather Updates</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Today", "Tomorrow", "This Week"].map(label => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-fade-in-up">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{label}</h3>
              <p className="text-gray-600 dark:text-gray-300">Temperature, rainfall prediction, humidity, and wind.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Weather;





