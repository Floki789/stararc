import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gradient">Stararc.one</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Swiss privacy-by-design portfolio management with zero-knowledge authentication. 
              Your financial data stays encrypted and private.
            </p>
            <div className="privacy-badge">
              🇨🇭 Made in Switzerland
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/#plans" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Privacy</h3>
            <ul className="space-y-2">
              <li><a href="#privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#data-processing" className="text-gray-400 hover:text-white transition-colors">Data Processing</a></li>
              <li><a href="#zero-knowledge" className="text-gray-400 hover:text-white transition-colors">Zero-Knowledge</a></li>
              <li><a href="#swiss-compliance" className="text-gray-400 hover:text-white transition-colors">Swiss Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Stararc.one. All rights reserved. Swiss Privacy-by-Design.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-gray-500">🔐 Zero-Knowledge</span>
            <span className="text-xs text-gray-500">🗑️ No Data Retention</span>
            <span className="text-xs text-gray-500">🇨🇭 Swiss Hosted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;