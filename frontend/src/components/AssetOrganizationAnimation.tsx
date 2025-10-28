import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bitcoin,
  Gem,
  Palette,
  Droplets,
  TrendingUp,
  Shield,
  Home,
  Umbrella,
  Building2,
  Vault,
  HardDrive,
  FileText,
  Lock,
  Key,
  MessageSquare
} from 'lucide-react';

interface AssetOrganizationAnimationProps {
  className?: string;
  isActive?: boolean;
}

const AssetOrganizationAnimation: React.FC<AssetOrganizationAnimationProps> = ({ className = "", isActive = true }) => {
  const [animationPhase, setAnimationPhase] = useState(0); // 0: black screen, 1: assets appearing, 2: organizing1, 3: organizing2, 4: organized

  // Reset and start animation when becoming active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(0); // Start from beginning when activated
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return; // Only run animation when active
    // Animation sequence: black -> assets appearing -> organizing1 -> organizing2 -> organized (STOP)
    const animationSequence = setTimeout(() => {
      if (animationPhase === 0) {
        // Phase 0 (black screen) lasts 0.5 seconds
        setAnimationPhase(1);
      } else if (animationPhase === 1) {
        // Phase 1 (assets appearing) lasts 2.5 seconds
        setAnimationPhase(2);
      } else if (animationPhase < 4) {
        // Phases 2 and 3 cycle every 1.5 seconds until phase 4
        setAnimationPhase(prev => prev + 1);
      }
      // Phase 4: Animation stops here - no further transitions
    }, animationPhase === 0 ? 500 : animationPhase === 1 ? 2500 : 1500);
    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  // Asset definitions with icons and colors
  const wealthAssets = [
    { icon: Bitcoin, name: 'Bitcoin', color: 'text-orange-500' },
    { icon: Gem, name: 'Edelmetalle', color: 'text-yellow-500' },
    { icon: Palette, name: 'Kunst', color: 'text-purple-500' },
    { icon: Droplets, name: 'Liquidität', color: 'text-blue-500' },
    { icon: TrendingUp, name: 'Wertschriften', color: 'text-green-500' },
    { icon: Shield, name: 'Vorsorge', color: 'text-indigo-500' },
    { icon: Home, name: 'Immobilien', color: 'text-emerald-500' },
    { icon: Umbrella, name: 'Versicherungen', color: 'text-cyan-500' }
  ];

  const securityAssets = [
    { icon: Building2, name: 'Finanzinstitute', color: 'text-slate-400' },
    { icon: Vault, name: 'Physische Vaults', color: 'text-gray-400' },
    { icon: HardDrive, name: 'Digitale Vaults', color: 'text-blue-400' },
    { icon: FileText, name: 'Seeds', color: 'text-green-400' },
    { icon: FileText, name: 'Descriptoren', color: 'text-purple-400' },
    { icon: Lock, name: 'Passwortmanager', color: 'text-red-400' },
    { icon: Key, name: 'Encryption Keys', color: 'text-yellow-400' },
    { icon: MessageSquare, name: 'Passphrasen', color: 'text-pink-400' }
  ];

  // Generate random positions for chaotic state (using index as seed for consistent randomness)
  const generateRandomPosition = (index: number) => {
    // Use index as seed for consistent positioning across re-renders
    const seed = index * 12345 + 67890;
    const pseudoRandom1 = (seed % 1000) / 1000;
    const pseudoRandom2 = ((seed * 7) % 1000) / 1000;
    const pseudoRandom3 = ((seed * 13) % 1000) / 1000;
    
    return {
      x: pseudoRandom1 * 800 - 400, // Erweitert von 600 auf 800
      y: pseudoRandom2 * 400 - 200, // Erweitert von 300 auf 400
      rotate: pseudoRandom3 * 360
    };
  };

  // Generate organized positions for organizing state 1 (4x2 Grid like in screenshot)
  const generateOrganizedPosition = (index: number, isWealth: boolean) => {
    const baseX = isWealth ? -140 : 140; // Etwas mehr Abstand zwischen den Blöcken
    const row = Math.floor(index / 2); // 4 Reihen (0-3)
    const col = index % 2; // 2 Spalten (0-1)
    
    // Optimales Grid-Layout basierend auf Screenshot
    const x = baseX + col * 60; // 60px Abstand zwischen Spalten
    const y = -90 + row * 60; // 60px Abstand zwischen Reihen, Start bei -90
    
    return {
      x: x,
      y: y,
      rotate: 0
    };
  };

  return (
    <div className={`relative h-[580px] overflow-visible py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Phase 0: Black Screen - No assets visible */}
        {/* Phase 1: Assets appearing gradually with gradient effect */}
        {/* Wealth Assets */}
        {wealthAssets.map((asset, index) => {
          const Icon = asset.icon;
          const position = animationPhase <= 1 
            ? generateRandomPosition(index)
            : generateOrganizedPosition(index, true);
          
          return (
            <motion.div
              key={`wealth-${index}`}
              className={`absolute ${asset.color} z-20`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: animationPhase === 0 ? 0 : 1,
                scale: animationPhase === 0 ? 0 : 1,
                x: position.x,
                y: position.y,
                rotate: position.rotate
              }}
              transition={{ 
                opacity: { 
                  duration: animationPhase === 1 ? 1.5 : 0.8,
                  delay: animationPhase === 1 ? index * 0.3 : 0,
                  ease: "easeInOut"
                },
                scale: { 
                  duration: animationPhase === 1 ? 1.5 : 0.8,
                  delay: animationPhase === 1 ? index * 0.3 : 0,
                  type: "spring",
                  stiffness: 80
                },
                x: { 
                  duration: animationPhase === 2 ? 2.5 : 1.5, 
                  type: "spring", 
                  stiffness: animationPhase === 2 ? 50 : 80,
                  damping: animationPhase === 2 ? 15 : 10,
                  delay: animationPhase === 2 ? index * 0.15 : 0
                },
                y: { 
                  duration: animationPhase === 2 ? 2.5 : 1.5, 
                  type: "spring", 
                  stiffness: animationPhase === 2 ? 50 : 80,
                  damping: animationPhase === 2 ? 15 : 10,
                  delay: animationPhase === 2 ? index * 0.15 : 0
                },
                rotate: { 
                  duration: animationPhase === 2 ? 2.5 : 1.5,
                  ease: "easeInOut",
                  delay: animationPhase === 2 ? index * 0.1 : 0
                }
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-750/90 transition-all duration-300">
                  <Icon className={`w-5 h-5 ${asset.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Security Assets */}
        {securityAssets.map((asset, index) => {
          const Icon = asset.icon;
          const position = animationPhase <= 1 
            ? generateRandomPosition(index + wealthAssets.length)
            : generateOrganizedPosition(index, false);
          
          return (
            <motion.div
              key={`security-${index}`}
              className={`absolute ${asset.color} z-20`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: animationPhase === 0 ? 0 : 1, // Invisible in phase 0, visible from phase 1
                scale: animationPhase === 0 ? 0 : 1,
                x: position.x,
                y: position.y,
                rotate: position.rotate
              }}
              transition={{ 
                opacity: { 
                  duration: animationPhase === 1 ? 1.5 : 0.8,
                  delay: animationPhase === 1 ? (index + wealthAssets.length) * 0.3 : 0.2, // Staggered appearance after wealth assets
                  ease: "easeInOut"
                },
                scale: { 
                  duration: animationPhase === 1 ? 1.5 : 0.8,
                  delay: animationPhase === 1 ? (index + wealthAssets.length) * 0.3 : 0.2,
                  type: "spring",
                  stiffness: 80
                },
                x: { 
                  duration: animationPhase === 2 ? 2.8 : 1.5, 
                  type: "spring", 
                  stiffness: animationPhase === 2 ? 45 : 80,
                  damping: animationPhase === 2 ? 18 : 10,
                  delay: animationPhase === 2 ? (index + wealthAssets.length) * 0.15 : 0.2
                },
                y: { 
                  duration: animationPhase === 2 ? 2.8 : 1.5, 
                  type: "spring", 
                  stiffness: animationPhase === 2 ? 45 : 80,
                  damping: animationPhase === 2 ? 18 : 10,
                  delay: animationPhase === 2 ? (index + wealthAssets.length) * 0.15 : 0.2
                },
                rotate: { 
                  duration: animationPhase === 2 ? 2.8 : 1.5,
                  ease: "easeInOut",
                  delay: animationPhase === 2 ? (index + wealthAssets.length) * 0.1 : 0.2
                }
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-750/90 transition-all duration-300">
                  <Icon className={`w-5 h-5 ${asset.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Phase 3+: Wealth Assets Überschrift */}
        <motion.div
          className="absolute z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: animationPhase >= 3 ? 1 : 0,
            x: -110, // Zentriert über Wealth Icons: (-140 + -80) / 2 = -110
            y: -160 // Zurück zur ursprünglichen Position
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-orange-400 text-lg font-bold bg-gray-800/80 px-4 py-2 rounded-lg border border-orange-500/30 shadow-lg backdrop-blur-sm">
            Wealth Assets
          </h3>
        </motion.div>
        
        {/* Phase 3+: Security Assets Überschrift */}
        <motion.div
          className="absolute z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: animationPhase >= 3 ? 1 : 0,
            x: 170, // Zentriert über Security Icons: (140 + 200) / 2 = 170
            y: -160 // Zurück zur ursprünglichen Position
          }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h3 className="text-gray-400 text-lg font-bold bg-gray-800/80 px-4 py-2 rounded-lg border border-gray-500/30 shadow-lg backdrop-blur-sm">
            Security Elements
          </h3>
        </motion.div>

        {/* Phase 4: Shield Symbol in oberer rechter Ecke */}
        <motion.div
          className="absolute z-40"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: animationPhase === 4 ? 1 : 0,
            scale: animationPhase === 4 ? 1 : 0,
            rotate: animationPhase === 4 ? 0 : -180,
            x: 320, // Noch weiter nach rechts verschoben
            y: -235 // Zurück zur ursprünglichen Position
          }}
          transition={{ duration: 1.2, delay: 1.5, type: "spring", stiffness: 100 }}
        >
          <div className="w-16 h-16 bg-slate-800/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl border border-slate-600/50">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        {/* Phase 4: Final Organized State - StarArc Container */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: animationPhase >= 4 ? 1 : 0, 
            scale: animationPhase >= 4 ? 1 : 0.9,
            x: 20,
            y: -40
          }}
          transition={{ duration: 1.5, delay: animationPhase === 4 ? 1 : 0 }}
        >
          <div className="w-[580px] h-[380px] bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl relative z-0">
            {/* Card-Stil wie in SubscriptionPlans */}
          </div>
        </motion.div>



      </div>
    </div>
  );
};

export default AssetOrganizationAnimation;