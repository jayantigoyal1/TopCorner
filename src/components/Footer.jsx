import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const BRAND_COLOR = "text-blue-600 dark:text-blue-500"; 

  return (
    <footer className="
      mt-20 border-t transition-colors duration-300
      bg-white border-slate-200 
      dark:bg-slate-800 dark:border-slate-700
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl text-yellow-500">⚽</span>
              <span className={`text-xl font-bold ${BRAND_COLOR}`}>TopCorner</span>
            </div>
            <p className="mb-4 max-w-md text-sm text-slate-600 dark:text-slate-400">
              The ultimate football prediction platform. Challenge your friends, 
              test your knowledge, and prove you're the ultimate football expert.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm transition-colors text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                📘 Facebook
              </a>
              <a href="#" className="text-sm transition-colors text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                🐦 Twitter
              </a>
              <a href="#" className="text-sm transition-colors text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                📷 Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Fixtures
                </Link>
              </li>
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Leaderboards
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-slate-900 dark:text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <p>&copy; 2025 TopCorner. All rights reserved. Made with <span className="text-yellow-500">⚽</span> for football fans.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;