import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Building2,
  Coins,
  Home
} from 'lucide-react';

interface MarketAccessProps {
  className?: string;
  isActive?: boolean;
}

const MarketAccess: React.FC<MarketAccessProps> = ({ className = "", isActive = true }) => {
  const [animationPhase, setAnimationPhase] = useState(1);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isActive) {
      setAnimationPhase(1);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    const animationSequence = setTimeout(() => {
      if (animationPhase === 1) {
        setAnimationPhase(2);
      } else if (animationPhase === 2) {
        setAnimationPhase(3);
      } else if (animationPhase === 3) {
        setAnimationPhase(4);
      }
    }, 2000);

    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  return (
    <div className={`relative h-[540px] overflow-visible ${className}`}>
      <AnimationTimer duration={7} isActive={isActive} />
      
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
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-3xl" />
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
          {t('animations.marketAccess.headline.part1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
            {t('animations.marketAccess.headline.part2')}
          </span>{' '}
          {t('animations.marketAccess.headline.part3')}
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
          {t('animations.marketAccess.subtext')}
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
            <Coins className="w-8 h-8 text-orange-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.marketAccess.features.bitcoin')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Home className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.marketAccess.features.realEstate')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Building2 className="w-8 h-8 text-green-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.marketAccess.features.banking')}</span>
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
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
          >
            {t('animations.marketAccess.cta')}
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default MarketAccess;