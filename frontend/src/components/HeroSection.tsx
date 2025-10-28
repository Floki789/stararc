import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';
import BitcoinSelfCustodyAnimation from './BitcoinSelfCustodyAnimation';

const HeroSection: React.FC = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0); // 0: AssetOrganization, 1: BitcoinSelfCustody

  // Content für verschiedene Animationen
  const animationContent = [
    {
      title: "Holistic Wealth and Security Management",
      subtitle: "Manage your wealth and your security with a privacy-first approach."
    },
    {
      title: "Make your Self-Custody Setup bulletproof", 
      subtitle: "Your private Keys stay in your secure dezentralized vaults"
    }
  ];

  useEffect(() => {
    // Asset Organization Animation: Phase 4 startet bei ~6s, geben wir 3s mehr Zeit
    const timer = setTimeout(() => {
      setCurrentAnimation(1);
    }, 9000); // 9 Sekunden für ersten Wechsel - Phase 4 hat Zeit zu erscheinen

    return () => clearTimeout(timer);
  }, []);

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
            className="mb-8 pt-24"
          >
            <motion.h1 
              key={currentAnimation} // Key für Re-Animation bei Wechsel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {animationContent[currentAnimation].title}
            </motion.h1>
            <motion.p 
              key={`subtitle-${currentAnimation}`} // Key für Re-Animation bei Wechsel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-gray-300 leading-relaxed mb-24"
            >
              {animationContent[currentAnimation].subtitle}
            </motion.p>
            
            {/* Animation Slideshow */}
            <div className="relative mb-8 overflow-hidden mt-12">
              {/* Asset Organization Animation */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ 
                  x: currentAnimation === 0 ? 0 : -1200,
                  opacity: currentAnimation === 0 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <AssetOrganizationAnimation />
              </motion.div>

              {/* Bitcoin Self-Custody Animation */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 1 ? 0 : 1200,
                  opacity: currentAnimation === 1 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <BitcoinSelfCustodyAnimation isActive={currentAnimation === 1} />
              </motion.div>

              {/* Spacer for proper height */}
              <div className="h-[580px] w-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;