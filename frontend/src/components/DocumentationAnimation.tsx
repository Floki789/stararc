import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimationTimer from './AnimationTimer';
import { 
  Bitcoin,
  Gem,
  Palette,
  Droplets,
  TrendingUp,
  Shield,
  Home,
  Vault,
  Building2,
  Banknote,
  University,
  Coins
} from 'lucide-react';

interface DocumentationAnimationProps {
  isActive?: boolean;
  className?: string;
}

const DocumentationAnimation: React.FC<DocumentationAnimationProps> = ({ 
  isActive = false, 
  className = "" 
}) => {
  const [animationPhase, setAnimationPhase] = useState(-1); // Start with -1 to ensure nothing renders initially

  useEffect(() => {
    if (!isActive) {
      setAnimationPhase(-1); // Reset to completely hidden state
      return;
    }

    // Initialize properly before starting animation
    setAnimationPhase(0); // Set to 0 first (everything hidden but initialized)

    // Animation sequence when active
    const timer0 = setTimeout(() => setAnimationPhase(1), 500);   // Self-custody elements
    const timer1 = setTimeout(() => setAnimationPhase(2), 2500);  // Custodial assets
    const timer2 = setTimeout(() => setAnimationPhase(3), 4500);  // Pension/Retirement
    const timer3 = setTimeout(() => setAnimationPhase(4), 6500);  // Real Estate
    const timer4 = setTimeout(() => setAnimationPhase(5), 8500);  // Vaults
    const timer5 = setTimeout(() => setAnimationPhase(6), 10500); // Custodians

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isActive]);

  // Asset categories with their items
  const assetCategories = {
    selfCustody: [
      { icon: Bitcoin, name: 'Bitcoin', color: 'text-orange-500' },
      { icon: Gem, name: 'Edelmetalle', color: 'text-yellow-500' },
      { icon: Palette, name: 'Kunst', color: 'text-purple-500' },
      { icon: Droplets, name: 'Sammlerstücke', color: 'text-blue-500' }
    ],
    custodialAssets: [
      { icon: TrendingUp, name: 'Aktien', color: 'text-blue-600' },
      { icon: Banknote, name: 'ETFs', color: 'text-indigo-500' },
      { icon: Coins, name: 'Bonds', color: 'text-gray-500' },
      { icon: Bitcoin, name: 'Krypto', color: 'text-orange-400' }
    ],
    pension: [
      { icon: Shield, name: 'Berufliche Vorsorge', color: 'text-cyan-500' },
      { icon: Vault, name: 'Private Vorsorge', color: 'text-teal-500' }
    ],
    realEstate: [
      { icon: Home, name: 'Immobilien', color: 'text-amber-600' }
    ],
    vaults: [
      { icon: Vault, name: 'Physical Vaults', color: 'text-gray-400' },
      { icon: Shield, name: 'Digital Vaults', color: 'text-blue-400' }
    ],
    custodians: [
      { icon: University, name: 'Banks', color: 'text-slate-500' },
      { icon: Building2, name: 'Exchanges', color: 'text-violet-500' }
    ]
  };

  // Get position for each category - structured in two rows layout
  const getCategoryBlockPosition = (categoryIndex: number) => {
    const categoriesPerRow = 3;
    const blockWidth = 320; // More space between blocks to prevent overlap
    const rowHeight = 200; // More vertical space between rows
    
    const row = Math.floor(categoryIndex / categoriesPerRow);
    const col = categoryIndex % categoriesPerRow;
    
    const startX = -320; // Adjust for new block width
    const x = startX + (col * blockWidth);
    const y = -180 + (row * rowHeight); // Keep current vertical position
    
    return { x, y };
  };

  // Get position for items within a category block
  const getItemPositionInBlock = (itemIndex: number, totalItems: number) => {
    const itemsPerRow = 2;
    const itemSize = 60;
    const row = Math.floor(itemIndex / itemsPerRow);
    const col = itemIndex % itemsPerRow;
    
    // Center the items in the block better
    const startX = totalItems <= 2 ? (totalItems === 1 ? 0 : -30) : -30;
    const x = startX + (col * itemSize);
    const y = -30 + (row * itemSize); // Adjust vertical position
    
    return { x, y };
  };

  const renderAssetCategory = (categoryKey: keyof typeof assetCategories, categoryIndex: number, phaseToShow: number, title: string) => {
    // Don't render anything if not properly initialized or before the phase
    if (animationPhase < 0 || animationPhase < phaseToShow) return null;
    
    const category = assetCategories[categoryKey];
    const blockPosition = getCategoryBlockPosition(categoryIndex);
    
    return (
      <motion.div
        key={categoryKey}
        className="absolute z-10 flex flex-col items-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{
          opacity: 1,
          x: blockPosition.x,
          y: blockPosition.y
        }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          type: "spring",
          stiffness: 80
        }}
      >
        
        {/* Category Title - exactly centered over 2x2 icon grid */}
        <div className="text-sm font-bold text-white text-center bg-gray-800/90 px-3 py-1 rounded-lg shadow-lg border border-gray-600/50 whitespace-nowrap mb-4" 
             style={{ width: '130px', marginLeft: '-5px' }}>
          {title}
        </div>

        {/* Category Items */}
        <div className="relative flex justify-center items-center">
          <div className="relative">
          {category.map((asset, index) => {
            const Icon = asset.icon;
            const itemPosition = getItemPositionInBlock(index, category.length);
            
            return (
              <motion.div
                key={`${categoryKey}-${index}`}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: itemPosition.x,
                  y: itemPosition.y
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + (index * 0.1),
                  type: "spring",
                  stiffness: 120
                }}
              >
                <div className="w-14 h-14 bg-gray-800/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-xl border border-gray-600/50">
                  <Icon className={`w-6 h-6 ${asset.color}`} />
                </div>
                <div className="text-xs text-center mt-1 text-gray-300 font-medium max-w-[60px] truncate">
                  {asset.name}
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </motion.div>
    );
  };



  return (
    <div className={`relative h-[540px] overflow-visible py-4 border border-gray-600/30 ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={15} isActive={isActive} />
      
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Only render content when animation phase is 0 or higher (properly initialized) */}
        {animationPhase >= 0 && (
          <>
            {/* Phase 1: Self-Custody Elements */}
            {renderAssetCategory('selfCustody', 0, 1, 'Self-Custody')}

            {/* Phase 2: Custodial Assets */}
            {renderAssetCategory('custodialAssets', 1, 2, 'Custodial Assets')}

            {/* Phase 3: Pension/Retirement */}
            {renderAssetCategory('pension', 2, 3, 'Vorsorge')}

            {/* Phase 4: Real Estate */}
            {renderAssetCategory('realEstate', 3, 4, 'Real Estate')}

            {/* Phase 5: Vaults */}
            {renderAssetCategory('vaults', 4, 5, 'Vaults')}

            {/* Phase 6: Custodians */}
            {renderAssetCategory('custodians', 5, 6, 'Custodians')}

            {/* Final Phase: Complete Overview Container */}
            {animationPhase === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute z-0 flex items-center justify-center"
                style={{ x: 50, y: -150 }}
              >
                <div className="w-[1100px] h-[320px] bg-gray-800/20 backdrop-blur-sm border border-gray-600/30 rounded-2xl shadow-2xl">
                  {/* Background container for two-row layout with better spacing */}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentationAnimation;