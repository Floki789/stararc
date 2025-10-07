import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Users, Shield, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Subscription Plans */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Wählen Sie Ihren Plan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card p-8 text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <Shield className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-3xl font-bold text-green-400 mb-2">CHF 0</p>
                <p className="text-gray-400 mb-6">pro Monat 😊</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Basis Portfolio-Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Bitcoin Self-Custody</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">1 Portfolio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">5 Assets pro Kategorie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Zero-Knowledge Sicherheit</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open('http://localhost:3000/', '_blank')}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Free Plan wählen
                </button>
              </motion.div>

              {/* Basic Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-8 text-center relative border-2 border-blue-500"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Empfohlen
                  </span>
                </div>
                
                <div className="flex justify-center mb-4">
                  <Star className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <p className="text-3xl font-bold text-blue-400 mb-2">CHF 12</p>
                <p className="text-gray-400 mb-6">pro Monat</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">Alle Free Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">Alle Asset-Klassen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">Erweiterte Analysen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">5 Portfolios</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">Monatliche Reports</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open('http://localhost:3000/', '_blank')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Upgrade auf Basic
                </button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card p-8 text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <Crown className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-lg text-purple-400 mb-2 font-semibold">Coming Soon</p>
                <p className="text-gray-400 mb-6">für Family Offices</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Alle Basic Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Unbegrenzte Familien Accounts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Unbegrenzte Portfolios</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">White-Label Option</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Dedicated Support</span>
                  </div>
                </div>
                
                                <button className="w-full py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
                  Bald verfügbar
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;