import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiLinkedin, FiMail, FiInstagram, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-earth-50 dark:bg-dark-bg border-t border-earth-200 dark:border-white/10 transition-colors duration-300">
      {/* Newsletter / CTA Section */}
      <div className="container mx-auto px-6 py-12 border-b border-earth-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-primary-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-50" />

          <div className="relative z-10 md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Cultivating a Better Future
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed">
              Join our community of sustainable farmers and health-conscious consumers today.
            </p>
          </div>
          <div className="relative z-10 flex gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-900 rounded-xl font-bold hover:bg-primary-50 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-800 text-white rounded-xl font-bold hover:bg-primary-700 transition-all border border-primary-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-display font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Farmer Buddy
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Empowering farmers with AI technology and connecting communities with fresh, sustainable local produce.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<FiTwitter />} href="#" />
              <SocialLink icon={<FiFacebook />} href="#" />
              <SocialLink icon={<FiInstagram />} href="#" />
              <SocialLink icon={<FiLinkedin />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <FooterLink to="/marketplace" label="Marketplace" />
              <FooterLink to="/smart-crop-planning" label="Smart Crop Plan" />
              <FooterLink to="/ai-farming-chatbot" label="AI Assistant" />
              <FooterLink to="/weather" label="Weather Forecast" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              <FooterLink to="/blog" label="Farming Blog" />
              <FooterLink to="/farming-calendar" label="Crop Calendar" />
              <FooterLink to="/prices" label="Market Prices" />
              <FooterLink to="/community-impact-tracker" label="Impact Tracker" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <FiMail className="w-5 h-5 mt-1 text-primary-600" />
                <span>support@farmerbuddy.com</span>
              </li>
              <li>123 Farming Lane, Green Valley, India</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-earth-200 dark:border-white/10 bg-white/50 dark:bg-black/20">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Farmer Buddy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 transition-all duration-300 shadow-sm hover:shadow-glow transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2 group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      {label}
    </Link>
  </li>
);

export default Footer;