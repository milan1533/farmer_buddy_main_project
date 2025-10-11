import React from 'react';

const posts = [
  { id: 1, title: 'Organic Farming Basics', excerpt: 'Start your organic journey with soil health, composting, and natural pest control.' },
  { id: 2, title: 'Drip Irrigation Tips', excerpt: 'Save water and increase yields with efficient irrigation practices.' },
  { id: 3, title: 'Pest Management 101', excerpt: 'Integrated pest management strategies for sustainable farming.' },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Blog & Articles</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-fade-in-up">
              <div className="h-36 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{p.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{p.excerpt}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Blog;





