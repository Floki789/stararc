import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimationTimer from './AnimationTimer';
import { useLanguage } from '../contexts/LanguageContext';
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

interface AssetsOverviewProps {
  className?: string;
  isActive?: boolean;
}

const AssetsOverview: React.FC<AssetsOverviewProps> = ({ className = "", isActive = true }) => {
  const { t } = useLanguage();

  // Reset and start animation when becoming active
  useEffect(() => {
    // No additional logic needed - animations are handled by framer-motion
  }, [isActive]);

  // Asset definitions with icons and colors
  const wealthAssets = [
    { icon: Bitcoin, name: t('assetOrganization.wealthAssets.bitcoin'), color: 'text-orange-500' },
    { icon: Gem, name: t('assetOrganization.wealthAssets.preciousMetals'), color: 'text-yellow-500' },
    { icon: Palette, name: t('assetOrganization.wealthAssets.art'), color: 'text-purple-500' },
    { icon: Droplets, name: t('assetOrganization.wealthAssets.liquidity'), color: 'text-blue-500' },
    { icon: TrendingUp, name: t('assetOrganization.wealthAssets.securities'), color: 'text-green-500' },
    { icon: Shield, name: t('assetOrganization.wealthAssets.retirement'), color: 'text-indigo-500' },
    { icon: Home, name: t('assetOrganization.wealthAssets.realEstate'), color: 'text-emerald-500' },
    { icon: Umbrella, name: t('assetOrganization.wealthAssets.insurance'), color: 'text-cyan-500' }
  ];

  const securityAssets = [
    { icon: Building2, name: t('assetOrganization.securityAssets.financialInstitutes'), color: 'text-slate-400' },
    { icon: Vault, name: t('assetOrganization.securityAssets.physicalVaults'), color: 'text-gray-400' },
    { icon: HardDrive, name: t('assetOrganization.securityAssets.digitalVaults'), color: 'text-blue-400' },
    { icon: FileText, name: t('assetOrganization.securityAssets.seeds'), color: 'text-green-400' },
    { icon: FileText, name: t('assetOrganization.securityAssets.descriptors'), color: 'text-purple-400' },
    { icon: Lock, name: t('assetOrganization.securityAssets.passwordManager'), color: 'text-red-400' },
    { icon: Key, name: t('assetOrganization.securityAssets.encryptionKeys'), color: 'text-yellow-400' },
    { icon: MessageSquare, name: t('assetOrganization.securityAssets.passphrases'), color: 'text-pink-400' }
  ];

  return (
    <div className={`relative h-[600px] overflow-visible py-12 border border-gray-600/30 ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={3} isActive={isActive} />
      
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Main Container with subtle background */}
        <motion.div
          className="w-[900px] h-[500px] bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-2xl relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1,
            scale: 1
          }}
          transition={{ duration: 1.0, delay: 0.2, ease: "easeInOut" }}
        >
          
          {/* Wealth Assets Section */}
          <div className="absolute left-8 top-8 w-[380px] h-[450px]">
            
            {/* Wealth Assets Title */}
            <motion.h2
              className="text-2xl font-bold text-orange-400 mb-8 text-center"
              initial={{ opacity: 0, y: -15 }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
            >
              {t('assetOrganization.wealthAssetsTitle')}
            </motion.h2>
            
            {/* Wealth Assets Grid */}
            <div className="grid grid-cols-2 gap-6">
              {wealthAssets.map((asset, index) => {
                const Icon = asset.icon;
                return (
                  <motion.div
                    key={`wealth-${index}`}
                    className="flex items-center gap-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:bg-gray-700/40 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1,
                      x: 0
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.8 + index * 0.08,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className={`w-6 h-6 ${asset.color}`} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">{asset.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Security Assets Section */}
          <div className="absolute right-8 top-8 w-[380px] h-[450px]">
            
            {/* Security Assets Title */}
            <motion.h2
              className="text-2xl font-bold text-gray-400 mb-8 text-center"
              initial={{ opacity: 0, y: -15 }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
            >
              {t('assetOrganization.securityElementsTitle')}
            </motion.h2>
            
            {/* Security Assets Grid */}
            <div className="grid grid-cols-2 gap-6">
              {securityAssets.map((asset, index) => {
                const Icon = asset.icon;
                return (
                  <motion.div
                    key={`security-${index}`}
                    className="flex items-center gap-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:bg-gray-700/40 transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: 1,
                      x: 0
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.0 + index * 0.08,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className={`w-6 h-6 ${asset.color}`} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">{asset.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Dividing Line */}
          <motion.div
            className="absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-gray-600/50 via-gray-500/30 to-gray-600/50 transform -translate-x-1/2"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: 1,
              scaleY: 1
            }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
          />
          
        </motion.div>
        
      </div>
    </div>
  );
};

export default AssetsOverview;