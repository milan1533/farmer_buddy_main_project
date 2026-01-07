import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    if (user && token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
          Welcome to Farmer Buddy
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          Connect with local farmers, enjoy fresh produce, and discover AI-personalized subscription boxes
          fresh from the farm, straight to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
