import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Vault,
  Shield,
  Database
} from 'lucide-react';

interface VaultManagementProps {
  className?: string;
  isActive?: boolean;
}

const VaultManagement: React.FC<VaultManagementProps> = ({ className = "", isActive = true }) => {
  const [animationPhase, setAnimationPhase] = useState(0); // Start with phase 0 to prevent flicker
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isActive) {
      setAnimationPhase(1);
    } else {
      setAnimationPhase(0); // Reset to hidden state when not active
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
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
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
          {t('animations.vaultManagement.headline.part1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {t('animations.vaultManagement.headline.part2')}
          </span>
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
          {t('animations.vaultManagement.subtext')}
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
            <Vault className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.vaultManagement.features.physical')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Database className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.vaultManagement.features.digital')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 text-green-400 mb-2" />
            <span className="text-sm text-gray-400">{t('animations.vaultManagement.features.secure')}</span>
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
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
          >
            {t('animations.vaultManagement.cta')}
          </motion.button>
        </motion.div>

        </div>
      )}
    </div>
  );
};

export default VaultManagement;