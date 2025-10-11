import React from 'react';

const Prices = () => {
  const rows = [
    { crop: 'Wheat', unit: 'quintal', price: 2300, market: 'Ahmedabad' },
    { crop: 'Rice', unit: 'quintal', price: 2800, market: 'Surat' },
    { crop: 'Onion', unit: 'kg', price: 28, market: 'Rajkot' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Market Prices</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3">Crop</th>
                  <th className="py-3">Unit</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Market</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                    <td className="py-3">{r.crop}</td>
                    <td className="py-3">{r.unit}</td>
                    <td className="py-3">₹{r.price}</td>
                    <td className="py-3">{r.market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Prices;





