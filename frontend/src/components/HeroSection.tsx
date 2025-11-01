import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AssetOrganizationAnimation from './AssetOrganizationAnimation';
import WholeEnchilada from './WholeEnchilada';
import PlansAnimation from './PlansAnimation';

// Animation configuration - easily add, remove, or reorder animations here
const animationsConfig = [
  { 
    component: WholeEnchilada, 
    key: 'wholeEnchilada',
    name: 'WholeEnchilada'
  },
  { 
    component: AssetOrganizationAnimation, 
    key: 'assetOrganization',
    name: 'AssetOrganization'
  },
  { 
    component: PlansAnimation, 
    key: 'plans',
    name: 'Plans'
  }
];

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [currentAnimation, setCurrentAnimation] = useState(0);

  // Animation durations for auto-advance
  const getAnimationDuration = (animationIndex: number) => {
    const durations = [10000, 15000, 10000]; // WholeEnchilada, AssetOrg, Plans
    return durations[animationIndex] || 10000;
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
            <div className="relative mb-8 overflow-hidden mt-4 w-full min-w-[1000px]">
              {/* Dynamic Animation Rendering */}
              {animationsConfig.map((animation, index) => {
                const AnimationComponent = animation.component;
                return (
                  <motion.div
                    key={animation.key}
                    initial={{ x: index === 0 ? 0 : 1200 }}
                    animate={{ 
                      x: currentAnimation === index ? 0 : currentAnimation < index ? 1200 : -1200,
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

            {/* Call-to-Action Button */}
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