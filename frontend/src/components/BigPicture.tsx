import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Eye,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface BigPictureProps {
  className?: string;
  isActive?: boolean;
}

const BigPicture: React.FC<BigPictureProps> = ({ className = "", isActive = true }) => {
  const [animationPhase, setAnimationPhase] = useState(0); // Start with phase 0 to prevent flicker
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Reset and start animation when becoming active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(1); // Start immediately with headline
    } else {
      setAnimationPhase(0); // Reset to hidden state when not active
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    const animationSequence = setTimeout(() => {
      if (animationPhase === 1) {
        setAnimationPhase(2); // Show subtext
      } else if (animationPhase === 2) {
        setAnimationPhase(3); // Show call-to-action
      } else if (animationPhase === 3) {
        setAnimationPhase(4); // Hold final state for 5 more seconds
      }
    }, 2000); // 2 seconds between phases

    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  return (
    <div className={`relative h-[540px] overflow-visible ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={9} isActive={isActive} />
      
      {/* Only render content when active to prevent flicker */}
      {isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          
          {/* Background decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: animationPhase >= 1 ? 0.1 : 0,
              scale: animationPhase >= 1 ? 1 : 0.8
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 blur-3xl" />
          </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: animationPhase >= 1 ? 1 : 0,
            y: animationPhase >= 1 ? 0 : 30
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl"
        >
          {t('animations.bigPicture.headline.part1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
            {t('animations.bigPicture.headline.part2')}
          </span>
          {' '}{t('animations.bigPicture.headline.part3')}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: animationPhase >= 2 ? 1 : 0,
            y: animationPhase >= 2 ? 0 : 20
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl text-gray-300 mb-8 max-w-3xl"
        >
          {t('animations.bigPicture.subtext')}
        </motion.p>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 3 ? 1 : 0,
            scale: animationPhase >= 3 ? 1 : 0.9
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex gap-8 mb-8"
        >
          <div className="flex flex-col items-center">
            <Eye className="w-8 h-8 text-violet-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.bigPicture.features.analyze')}</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-8 h-8 text-pink-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.bigPicture.features.learn')}</span>
          </div>
          <div className="flex flex-col items-center">
            <ArrowRight className="w-8 h-8 text-violet-500 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.bigPicture.features.improve')}</span>
          </div>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 3 ? 1 : 0,
            scale: animationPhase >= 3 ? 1 : 0.9
          }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
          >
            {t('animations.bigPicture.cta')}
          </motion.button>
        </motion.div>

        </div>
      )}
    </div>
  );
};

export default BigPicture;