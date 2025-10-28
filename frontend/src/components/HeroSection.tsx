import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gray-950 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "60px 60px"
        }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex items-center justify-center min-h-screen">
        
        <div className="text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 pt-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Holistic Wealth and Security Management
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-24">
              Manage your wealth and your security with a privacy-first approach.
            </p>
            
            {/* Asset Organization Animation */}
            <AssetOrganizationAnimation className="mb-8" />

            <button
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center mx-auto"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;