import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <>
      {/* About Section Above Footer */}
      <section className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Learn More About Us</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                Discover our mission, vision, and values that drive sustainable agriculture.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Farmer Buddy
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md leading-relaxed">
              Connecting communities with fresh, sustainable produce through AI-powered recommendations and direct farm-to-consumer relationships.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 transform hover:scale-110">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 transform hover:scale-110">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/marketplace" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/farmer-assistance" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Farmer Assistance
                </a>
              </li>
              <li>
                <a href="/order" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Order
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            © 2024 Farmer Buddy. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Made with</span>
            <FiHeart className="w-4 h-4 text-red-500 animate-pulse-slow" />
            <span>for sustainable farming</span>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;