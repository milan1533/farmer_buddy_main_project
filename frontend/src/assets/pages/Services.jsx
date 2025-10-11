import React from 'react';

const services = [
  { title: 'Farming Guidance', desc: 'Seasonal advice, soil testing, pest control and best practices.' },
  { title: 'E-Marketplace', desc: 'List your produce and reach buyers directly.' },
  { title: 'Consultancy', desc: 'One-on-one expert assistance for farm planning and growth.' },
  { title: 'Equipment Rental', desc: 'Rent tractors, sprayers, and tools on demand.' },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-10 text-center">Services</h1>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-fade-in-up">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Services;




