import React, { useState } from 'react';

const tabs = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'grains', label: 'Grains' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'fertilizers', label: 'Fertilizers' },
  { id: 'equipment', label: 'Equipment' },
];

const Products = () => {
  const [active, setActive] = useState('vegetables');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Products & Crops</h1>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
                active === t.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="h-36 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{active} item {i + 1}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">High quality, farm-tested and trusted by growers.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Products;





