import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const AIFarmingCalendar = () => {
  const [searchParams] = useSearchParams();
  const activeMonth = searchParams.get('month') || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">AI Farming Calendar</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Plan your season month by month with AI-guided tasks and tips.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {months.map((month) => {
              const slug = month.toLowerCase();
              const isActive = activeMonth === slug;

              return (
                <Link
                  key={month}
                  to={`/ai-farming-calendar?month=${encodeURIComponent(slug)}`}
                  className={`bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-2 ${
                    isActive
                      ? 'border-green-400 dark:border-green-500'
                      : 'border-transparent'
                  }`}
                >
                  <div className="h-32 bg-gradient-to-br from-green-400/80 to-green-600/80 dark:from-green-500/70 dark:to-emerald-600/70 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📅</div>
                      <div className="text-lg font-semibold uppercase tracking-wide">{month}</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{month} Plan</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">View tasks & tips</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIFarmingCalendar;

