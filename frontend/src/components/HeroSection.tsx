import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';
import AssetsOverview from './AssetsOverview';
import DocumentationAnimation from './DocumentationAnimation';
import BitcoinSelfCustodyAnimation from './BitcoinSelfCustodyAnimation';
import StocksManagementAnimation from './StocksManagementAnimation';
import PrivacyAnimation from './PrivacyAnimation';

const HeroSection: React.FC = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0); // 0: AssetOrganization, 1: AssetsOverview, 2: BitcoinSelfCustody, 3: StocksManagement, 4: Privacy

  // Content für verschiedene Animationen
  const animationContent = [
    {
      title: "Holistic Wealth and Security Management",
      subtitle: "From scattered assets and missing documentation to a perfectly organized portfolio with a privacy-first approach."
    },
    {
      title: "Complete Assets Overview",
      subtitle: "Comprehensive view of all your wealth assets and security elements in one organized interface."
    },
    {
      title: "Make your Self-Custody Setup bulletproof", 
      subtitle: "Your private keys stay in your secured dezentralized vaults"
    },
    {
      title: "Professional Portfolio Management",
      subtitle: "Track and manage your stocks, ETFs, bonds, and crypto assets with institutional-grade tools."
    },
    {
      title: "Privacy-First Architecture", 
      subtitle: "All your data is encrypted and kept anonymous. Complete privacy by design."
    }
  ];

  // Navigation functions
  const goToPrevAnimation = () => {
    setCurrentAnimation(prev => prev > 0 ? prev - 1 : animationContent.length - 1);
  };

  const goToNextAnimation = () => {
    setCurrentAnimation(prev => prev < animationContent.length - 1 ? prev + 1 : 0);
  };

  useEffect(() => {
    // Animation sequence timing - 5 animations
    const timer1 = setTimeout(() => {
      setCurrentAnimation(1); // Switch to AssetsOverview animation
    }, 12000); // 12 seconds for Asset Organization (extended from 8s)

    const timer2 = setTimeout(() => {
      setCurrentAnimation(2); // Switch to Bitcoin animation
    }, 22000); // 22 seconds total (12s + 10s for AssetsOverview)

    const timer3 = setTimeout(() => {
      setCurrentAnimation(3); // Switch to Stocks animation
    }, 39000); // 39 seconds total (12s + 10s + 17s for Bitcoin animation)

    const timer4 = setTimeout(() => {
      setCurrentAnimation(4); // Switch to Privacy animation
    }, 54000); // 54 seconds total (12s + 10s + 17s + 15s for Stocks animation)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
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
              {/* Asset Organization Animation - FIRST */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ 
                  x: currentAnimation === 0 ? 0 : -1200,
                  opacity: currentAnimation === 0 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <AssetOrganizationAnimation isActive={currentAnimation === 0} />
              </motion.div>

              {/* Assets Overview Animation - SECOND */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 1 ? 0 : currentAnimation < 1 ? 1200 : -1200,
                  opacity: currentAnimation === 1 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <AssetsOverview isActive={currentAnimation === 1} />
              </motion.div>

              {/* Bitcoin Self-Custody Animation - THIRD */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 2 ? 0 : currentAnimation < 2 ? 1200 : -1200,
                  opacity: currentAnimation === 2 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <BitcoinSelfCustodyAnimation isActive={currentAnimation === 2} />
              </motion.div>

              {/* Stocks Management Animation - FOURTH */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 3 ? 0 : currentAnimation < 3 ? 1200 : -1200,
                  opacity: currentAnimation === 3 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <StocksManagementAnimation isActive={currentAnimation === 3} />
              </motion.div>

              {/* Privacy Animation - FIFTH */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 4 ? 0 : 1200,
                  opacity: currentAnimation === 4 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <PrivacyAnimation isActive={currentAnimation === 4} />
              </motion.div>

              {/* Spacer for proper height */}
              <div className="h-[600px] w-full"></div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={goToPrevAnimation}
                className="ml-4 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Previous animation"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={goToNextAnimation}
                className="mr-4 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200 backdrop-blur-sm"
                aria-label="Next animation"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;