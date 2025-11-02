import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PlanCards from '../components/PlanCards';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate('/register');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">      
      {/* Hero Section */}
      <HeroSection />

      {/* Subscription Plans */}
      <div id="plans" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Wählen Sie Ihren Plan
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12">
              Complete Suite oder Bitcoin Only - Sie entscheiden
            </p>
            
            {/* Main Plans */}
            <h3 className="text-2xl font-semibold text-white mb-6">Complete Suite</h3>
            <PlanCards 
              onPlanSelect={handleNavigateToRegister}
              className="mb-12"
            />

            {/* Bitcoin Only Plans */}
            <h3 className="text-2xl font-semibold text-white mb-6 mt-12">Bitcoin Only</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Sathosi Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="card p-6 text-center relative"
              >
                <div className="flex justify-center mb-3">
                  <Star className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sathosi</h3>
                <p className="text-2xl font-bold text-amber-400 mb-2">$5/mo</p>
                <p className="text-gray-400 text-sm mb-4">Bitcoin Only</p>
                
                <div className="space-y-2 mb-6 text-left text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">Bitcoin Only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">Pure Focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300 italic">No second best</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleNavigateToRegister}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Sathosi wählen
                </button>
              </motion.div>

              {/* Nakamoto Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="card p-6 text-center relative border-2 border-orange-500"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ₿ Unlimited
                  </span>
                </div>
                
                <div className="flex justify-center mb-3">
                  <Crown className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nakamoto</h3>
                <p className="text-2xl font-bold text-orange-400 mb-2">$21/mo</p>
                <p className="text-gray-400 text-sm mb-4">Unlimited Bitcoin</p>
                
                <div className="space-y-2 mb-6 text-left text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-gray-300">Unlimited Bitcoin Setups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-gray-300">Advanced Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-gray-300">₿ Pure Bitcoin Focus</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleNavigateToRegister}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Nakamoto wählen
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;