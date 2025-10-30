import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Shield,
  Eye,
  Building2,
  Home,
  FileText,
  Target
} from 'lucide-react';

interface WholeEnchiladaProps {
  className?: string;
  isActive?: boolean;
}

const WholeEnchilada: React.FC<WholeEnchiladaProps> = ({ className = "", isActive = true }) => {
  const { t } = useLanguage();
  const [animationPhase, setAnimationPhase] = useState(0); // 0-5: individual categories appearing, 6: all visible, 7: complete

  // Reset and start animation when becoming active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    const animationSequence = setTimeout(() => {
      if (animationPhase < 6) {
        setAnimationPhase(prev => prev + 1); // Phases 0-5: Each category appears individually
      } else if (animationPhase === 6) {
        setAnimationPhase(7); // Animation complete - hold final state
      }
    }, animationPhase < 6 ? 1500 : 4000);
    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  // Main concept categories - arranged in circle (6 categories)
  const conceptCategories = [
    {
      id: 'self-managed',
      title: t('wholeEnchilada.categories.selfManaged.title'),
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      position: { x: 0, y: -180 }, // Top (12 o'clock)
    },
    {
      id: 'third-party',
      title: t('wholeEnchilada.categories.thirdParty.title'),
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      position: { x: 156, y: -90 }, // Top right (2 o'clock)
    },
    {
      id: 'retirement',
      title: t('wholeEnchilada.categories.retirement.title'),
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      position: { x: 156, y: 90 }, // Bottom right (4 o'clock)
    },
    {
      id: 'real-estate',
      title: t('wholeEnchilada.categories.realEstate.title'),
      icon: Home,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
      position: { x: 0, y: 180 }, // Bottom (6 o'clock)
    },
    {
      id: 'security-privacy',
      title: t('wholeEnchilada.categories.securityPrivacy.title'),
      icon: Eye,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      position: { x: -156, y: 90 }, // Bottom left (8 o'clock)
    },
    {
      id: 'documentation',
      title: t('wholeEnchilada.categories.documentation.title'),
      icon: FileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/50',
      position: { x: -156, y: -90 }, // Top left (10 o'clock)
    }
  ];

  return (
    <div className={`relative h-[540px] overflow-visible py-4 ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={10} isActive={isActive} />
      
      {/* Concentric Rings Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Dynamic Concentric Rings Background System */}
        <div className="absolute z-10 flex items-center justify-center">
          
          {/* Static concentric rings structure */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((ringIndex) => (
            <motion.div
              key={`ring-${ringIndex}`}
              className="absolute border rounded-full"
              style={{ 
                width: `${40 + ringIndex * 30}px`, 
                height: `${40 + ringIndex * 30}px`,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.3,
              }}
              animate={{ 
                opacity: animationPhase >= 0 ? 0.2 : 0,
                scale: animationPhase >= 0 ? 1 : 0.3,
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: '1px'
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.2 + ringIndex * 0.05,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Pulsing wave effect moving from inside to outside */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((waveIndex) => (
            <motion.div
              key={`wave-${waveIndex}`}
              className="absolute border-2 rounded-full"
              style={{ 
                width: `${40 + waveIndex * 30}px`, 
                height: `${40 + waveIndex * 30}px`,
              }}
              animate={{ 
                opacity: animationPhase >= 0 ? [0, 0.6, 0] : 0,
                scale: animationPhase >= 0 ? [0.95, 1.05, 0.95] : 1,
                borderColor: [
                  'rgba(34, 211, 238, 0.4)',
                  'rgba(168, 85, 247, 0.6)', 
                  'rgba(59, 130, 246, 0.4)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: waveIndex * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Rotating energy waves */}
          {[1, 2].map((wave) => (
            <motion.div
              key={`wave-${wave}`}
              className="absolute"
              style={{ 
                width: `${180 + wave * 60}px`, 
                height: `${180 + wave * 60}px`,
              }}
              animate={{ 
                rotate: animationPhase >= 0 ? 360 : 0,
                opacity: animationPhase >= 0 ? 0.6 : 0
              }}
              transition={{ 
                rotate: { duration: 15 + wave * 5, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, ease: "easeOut" }
              }}
            >
              <div className="w-full h-full border border-dashed border-cyan-400/30 rounded-full" 
                   style={{
                     background: `conic-gradient(from ${wave * 45}deg, transparent 0deg, rgba(34, 211, 238, 0.1) 60deg, transparent 120deg)`
                   }}
              />
            </motion.div>
          ))}

        </div>

        {/* Category Cards */}
        {conceptCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.id}
              className={`absolute w-48 h-20 ${category.bgColor} backdrop-blur-sm border ${category.borderColor} rounded-xl shadow-xl p-4 flex items-center justify-center`}
              initial={{ 
                opacity: 0, 
                scale: 0.3, 
                x: 0, 
                y: 0 
              }}
              animate={{ 
                opacity: animationPhase >= 0 ? 1 : 0,
                scale: animationPhase >= 0 ? 1 : 0.3,
                x: animationPhase >= 0 ? category.position.x : 0,
                y: animationPhase >= 0 ? category.position.y : 0
              }}
              transition={{ 
                duration: 0.8, 
                delay: categoryIndex * 0.1,
                ease: "easeOut"
              }}
            >
              {/* Category Header - Only Title */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center border ${category.borderColor}`}>
                  <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                </div>
                <h3 className={`text-sm font-bold ${category.color} leading-tight`}>{category.title}</h3>
              </div>


            </motion.div>
          );
        })}







      </div>
    </div>
  );
};

export default WholeEnchilada;