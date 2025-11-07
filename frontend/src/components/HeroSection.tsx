import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Animation1 from './Animation1';
import OneDashboard from './OneDashboard';
import BigPicture from './BigPicture';
import SecuritySetup from './SecuritySetup';
import SingleMulti from './SingleMulti';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';
import VaultManagement from './VaultManagement';
import GenerationalWealth from './GenerationalWealth';
import MarketAccess from './MarketAccess';
import BootstrappingAnimation2 from './BootstrappingAnimation2';

// Animation configuration - easily add, remove, or reorder animations here
const animationsConfig = [
  { 
    component: AssetOrganizationAnimation, 
    key: 'assetOrganization',
    name: 'AssetOrganization'
  },
  { 
    component: OneDashboard, 
    key: 'oneDashboard',
    name: 'OneDashboard'
  },
  { 
    component: Animation1, 
    key: 'animation1',
    name: 'Animation1'
  },
  { 
    component: BigPicture, 
    key: 'bigPicture',
    name: 'BigPicture'
  },
  { 
    component: SecuritySetup, 
    key: 'securitySetup',
    name: 'SecuritySetup'
  },
  { 
    component: SingleMulti, 
    key: 'singleMulti',
    name: 'SingleMulti'
  },
  { 
    component: VaultManagement, 
    key: 'vaultManagement',
    name: 'VaultManagement'
  },
  { 
    component: GenerationalWealth, 
    key: 'generationalWealth',
    name: 'GenerationalWealth'
  },
  { 
    component: MarketAccess, 
    key: 'marketAccess',
    name: 'MarketAccess'
  },
  { 
    component: BootstrappingAnimation2, 
    key: 'bootstrapping2',
    name: 'Bootstrapping2'
  }
];

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [currentAnimation, setCurrentAnimation] = useState(0);

  // Animation durations for auto-advance
  const getAnimationDuration = (animationIndex: number) => {
    const durations = [15000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000]; // AssetOrg, Animation1, OneDashboard, BigPicture, SecuritySetup, SingleMulti, VaultManagement, GenerationalWealth, MarketAccess, Bootstrapping2
    return durations[animationIndex] || 7000;
  };

  // Generate animation content dynamically from config
  const animationContent = animationsConfig.map(animation => ({
    title: t(`heroSection.animations.${animation.key}.title`),
    subtitle: t(`heroSection.animations.${animation.key}.subtitle`)
  }));

  // Navigation functions
  const goToPrevAnimation = () => {
    setCurrentAnimation(prev => prev > 0 ? prev - 1 : animationContent.length - 1);
  };

  const goToNextAnimation = () => {
    setCurrentAnimation(prev => prev < animationContent.length - 1 ? prev + 1 : 0);
  };

  // Auto-advance to next animation after current animation duration
  useEffect(() => {
    const currentDuration = getAnimationDuration(currentAnimation);
    
    const timer = setTimeout(() => {
      setCurrentAnimation(prev => prev < animationContent.length - 1 ? prev + 1 : 0);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentAnimation, animationContent.length]);

  // Function to get animation-specific color class for title
  const getAnimationColorClass = (animationIndex: number) => {
    const animationKey = animationsConfig[animationIndex]?.key;
    
    switch (animationKey) {
      case 'assetOrganization':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400';
      case 'animation1':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500';
      case 'oneDashboard':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500';
      case 'bigPicture':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500';
      case 'securitySetup':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500';
      case 'singleMulti':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500';
      case 'vaultManagement':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500';
      case 'generationalWealth':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500';
      case 'marketAccess':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500';
      case 'bootstrapping':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500';
      case 'bootstrapping2':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500';
      default:
        return 'text-white';
    }
  };

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
            className="mb-4 pt-32"
          >
            <motion.h1 
              key={currentAnimation} // Key für Re-Animation bei Wechsel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`text-5xl md:text-6xl font-bold mb-3 leading-tight`}
            >
              {/* Hide titles for the three new animations */}
              {!['vaultManagement', 'generationalWealth', 'marketAccess'].includes(animationsConfig[currentAnimation]?.key) && (
                <>
                  {/* Special handling for AssetOrganization title to match Animation1 style */}
                  {animationsConfig[currentAnimation]?.key === 'assetOrganization' ? (
                    <span className="text-white">
                      {t('heroSection.animations.assetOrganization.titlePart1')}{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400">
                        {t('heroSection.animations.assetOrganization.titlePart2')}
                      </span>
                    </span>
                  ) : (
                    <span className={getAnimationColorClass(currentAnimation)}>
                      {animationContent[currentAnimation].title}
                    </span>
                  )}
                </>
              )}
            </motion.h1>
            <motion.p 
              key={`subtitle-${currentAnimation}`} // Key für Re-Animation bei Wechsel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className={`text-xl text-gray-300 leading-relaxed ${animationContent[currentAnimation].subtitle ? 'mb-8' : 'mb-2'}`}
            >
              {/* Hide subtitles for the three new animations */}
              {!['vaultManagement', 'generationalWealth', 'marketAccess'].includes(animationsConfig[currentAnimation]?.key) && 
                animationContent[currentAnimation].subtitle
              }
            </motion.p>
            
            {/* Animation Slideshow */}
            <div className="relative mb-8 overflow-hidden mt-2 w-full min-w-[1000px]">
              {/* Dynamic Animation Rendering */}
              {animationsConfig.map((animation, index) => {
                const AnimationComponent = animation.component;
                
                // Calculate animation position with proper wrap-around handling
                let xPosition;
                if (currentAnimation === index) {
                  // Current animation stays in center
                  xPosition = 0;
                } else if (currentAnimation === 0 && index === animationsConfig.length - 1) {
                  // Special case: when looping from last to first, last animation slides left
                  xPosition = -1200;
                } else if (currentAnimation < index) {
                  // Future animations slide to the right
                  xPosition = 1200;
                } else {
                  // Past animations slide to the left
                  xPosition = -1200;
                }
                
                return (
                  <motion.div
                    key={animation.key}
                    initial={{ x: index === 0 ? 0 : 1200 }}
                    animate={{ 
                      x: xPosition,
                      opacity: currentAnimation === index ? 1 : 0
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <AnimationComponent isActive={currentAnimation === index} />
                  </motion.div>
                );
              })}

              {/* Spacer for proper height */}
              <div className="h-[600px] w-full min-w-[1000px]"></div>
            </div>

            {/* Call-to-Action Button - REMOVED */}
            {/* 
            <div className="absolute left-1/2 transform -translate-x-1/2 ml-4" style={{bottom: '90px'}}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                onClick={() => window.location.href = '/register'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-blue-400/30"
              >
                {t('hero.cta')}
              </motion.button>
            </div>
            */}

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