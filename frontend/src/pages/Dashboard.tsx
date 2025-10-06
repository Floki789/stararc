import React from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 Starship Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Welcome to your privacy-focused portfolio management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Portfolios</h3>
              <p className="text-3xl font-bold text-primary-400 mb-2">0</p>
              <p className="text-gray-400">Active portfolios</p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Total Value</h3>
              <p className="text-3xl font-bold text-green-400 mb-2">CHF 0</p>
              <p className="text-gray-400">Encrypted balance</p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Privacy Score</h3>
              <p className="text-3xl font-bold text-accent-400 mb-2">100%</p>
              <p className="text-gray-400">Zero-knowledge secure</p>
            </div>
          </div>

          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your Starship Access is Ready
            </h2>
            <p className="text-gray-300 mb-6">
              This dashboard will integrate with the Starship app once your subscription is active.
            </p>
            <div className="privacy-badge">
              🇨🇭 Swiss Privacy Standards Active
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;