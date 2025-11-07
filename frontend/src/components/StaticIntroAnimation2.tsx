import React from 'react';
import { motion } from 'framer-motion';

interface StaticIntroAnimation2Props {
  className?: string;
}

const StaticIntroAnimation2: React.FC<StaticIntroAnimation2Props> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Main heading - appears with fade in */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          <span className="text-white">
            One secure dashboard,{' '}
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            to overview, document and harden{' '}
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
            the security of your entire portfolio.
          </span>
        </motion.h1>

        {/* Subtle background decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 2, duration: 5, ease: "linear" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
        />
        
      </div>
    </div>
  );
};

export default StaticIntroAnimation2;