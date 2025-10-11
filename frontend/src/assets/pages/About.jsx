import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">About Us</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">We connect farmers and consumers through a modern platform that promotes fresh, sustainable agriculture with the help of AI.</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-slide-in-left">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">Empower farmers, delight consumers, and build resilient food systems.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-fade-in-up">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">A world where nutritious food is accessible and fairly sourced.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-slide-in-right">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Our Values</h3>
            <p className="text-gray-600 dark:text-gray-300">Sustainability, transparency, community, and innovation.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;





