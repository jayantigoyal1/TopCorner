import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Define a primary blue color for consistency with the rest of the app's dark theme accent
  const PRIMARY_BLUE = "text-blue-500"; 

  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl text-yellow-500">⚽</span>
              <span className={`text-xl font-bold ${PRIMARY_BLUE}`}>TopCorner</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md text-sm">
              The ultimate football prediction platform. Challenge your friends, 
              test your knowledge, and prove you're the ultimate football expert.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                📘 Facebook
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                🐦 Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                📷 Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-slate-400 hover:text-white transition-colors">
                  Fixtures
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Leaderboards
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 TopCorner. All rights reserved. Made with <span className="text-yellow-500">⚽</span> for football fans.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
