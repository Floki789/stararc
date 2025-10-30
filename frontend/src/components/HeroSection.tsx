import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';
import AssetsOverview from './AssetsOverview';
import WholeEnchilada from './WholeEnchilada';
import DocumentationAnimation from './DocumentationAnimation';
import BitcoinSelfCustodyAnimation from './BitcoinSelfCustodyAnimation';
import StocksManagementAnimation from './StocksManagementAnimation';
import PrivacyAnimation from './PrivacyAnimation';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [currentAnimation, setCurrentAnimation] = useState(0); // 0: WholeEnchilada, 1: AssetOrganization, 2: AssetsOverview, 3: BitcoinSelfCustody, 4: StocksManagement, 5: Privacy

  // Content für verschiedene Animationen - WholeEnchilada zuerst für umfassendsten Ansatz
  const animationContent = [
    {
      title: t('heroSection.animations.wholeEnchilada.title'),
      subtitle: t('heroSection.animations.wholeEnchilada.subtitle')
    },
    {
      title: t('heroSection.animations.assetOrganization.title'),
      subtitle: t('heroSection.animations.assetOrganization.subtitle')
    },
    {
      title: t('heroSection.animations.assetsOverview.title'),
      subtitle: t('heroSection.animations.assetsOverview.subtitle')
    },
    {
      title: t('heroSection.animations.bitcoinCustody.title'), 
      subtitle: t('heroSection.animations.bitcoinCustody.subtitle')
    },
    {
      title: t('heroSection.animations.portfolioManagement.title'),
      subtitle: t('heroSection.animations.portfolioManagement.subtitle')
    },
    {
      title: t('heroSection.animations.privacy.title'), 
      subtitle: t('heroSection.animations.privacy.subtitle')
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
    // Animation sequence timing - 6 animations (WholeEnchilada first for comprehensive overview)
    const timer1 = setTimeout(() => {
      setCurrentAnimation(1); // Switch to AssetOrganization animation
    }, 15000); // 15 seconds for WholeEnchilada to complete fully with more time

    const timer2 = setTimeout(() => {
      setCurrentAnimation(2); // Switch to AssetsOverview animation
    }, 27000); // 27 seconds total (15s + 12s for AssetOrganization - longer to let it stand)

    const timer3 = setTimeout(() => {
      setCurrentAnimation(3); // Switch to Bitcoin animation
    }, 30000); // 30 seconds total (15s + 12s + 3s for AssetsOverview)

    const timer4 = setTimeout(() => {
      setCurrentAnimation(4); // Switch to Stocks animation
    }, 45000); // 45 seconds total (15s + 12s + 3s + 15s for Bitcoin)

    const timer5 = setTimeout(() => {
      setCurrentAnimation(5); // Switch to Privacy animation
    }, 60000); // 60 seconds total (15s + 12s + 3s + 15s + 15s for Stocks)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
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
              className="text-xl text-gray-300 leading-relaxed mb-8"
            >
              {animationContent[currentAnimation].subtitle}
            </motion.p>
            
            {/* Animation Slideshow */}
            <div className="relative mb-8 overflow-hidden mt-4">
              {/* Whole Enchilada Animation - FIRST (comprehensive overview) */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ 
                  x: currentAnimation === 0 ? 0 : -1200,
                  opacity: currentAnimation === 0 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <WholeEnchilada isActive={currentAnimation === 0} />
              </motion.div>

              {/* Asset Organization Animation - SECOND */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 1 ? 0 : currentAnimation < 1 ? 1200 : -1200,
                  opacity: currentAnimation === 1 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <AssetOrganizationAnimation isActive={currentAnimation === 1} />
              </motion.div>

              {/* Assets Overview Animation - THIRD */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 2 ? 0 : currentAnimation < 2 ? 1200 : -1200,
                  opacity: currentAnimation === 2 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <AssetsOverview isActive={currentAnimation === 2} />
              </motion.div>

              {/* Bitcoin Self-Custody Animation - FOURTH */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 3 ? 0 : currentAnimation < 3 ? 1200 : -1200,
                  opacity: currentAnimation === 3 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <BitcoinSelfCustodyAnimation isActive={currentAnimation === 3} />
              </motion.div>

              {/* Stocks Management Animation - FIFTH */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 4 ? 0 : currentAnimation < 4 ? 1200 : -1200,
                  opacity: currentAnimation === 4 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <StocksManagementAnimation isActive={currentAnimation === 4} />
              </motion.div>

              {/* Privacy Animation - SIXTH */}
              <motion.div
                initial={{ x: 1200 }}
                animate={{ 
                  x: currentAnimation === 5 ? 0 : 1200,
                  opacity: currentAnimation === 5 ? 1 : 0
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <PrivacyAnimation isActive={currentAnimation === 5} />
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