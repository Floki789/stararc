import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimationTimer from './AnimationTimer';
import { Bitcoin, CheckCircle, Edit, Trash2 } from 'lucide-react';

interface BitcoinSelfCustodyAnimationProps {
  className?: string;
  isActive?: boolean;
}

const BitcoinSelfCustodyAnimation: React.FC<BitcoinSelfCustodyAnimationProps> = ({ className = "", isActive = false }) => {
  const [animationPhase, setAnimationPhase] = useState(0); // 0: start, 1: table visible, 2: setup highlight, 3: wallet highlight, 4: backup highlight

  // Reset animation when it becomes active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return; // Only run animation when active
    
    const animationSequence = setTimeout(() => {
      if (animationPhase < 4) {
        setAnimationPhase(prev => prev + 1);
      }
    }, animationPhase === 0 ? 1000 : animationPhase === 1 ? 2500 : animationPhase === 2 ? 2500 : 3000); // Phase timings: 1s, 2.5s, 2.5s, 3s
    
    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  // Wallet data from screenshot
  const walletData = [
    {
      setupName: "Cassiopeia",
      scriptType: "p2wpkh",
      type: "Single-Sig",
      passphrase: "None",
      hardwareWallet: true,
      backups: { seed: [1, 2], descriptor: [1, 2] },
      balance: "1.2000 BTC"
    },
    {
      setupName: "Archimedes",
      scriptType: "p2wpkh", 
      type: "Single-Sig",
      passphrase: "Multiple",
      hardwareWallet: true,
      backups: { seed: [1, 2], descriptor: [1, 2], passphrase: [1, 2] },
      balance: "1.0000 BTC"
    }
  ];

  const getColumnHighlight = (columnName: string) => {
    // Persistent highlighting with dedicated colors for each section
    if (animationPhase >= 2 && ['setupName', 'scriptType', 'type', 'passphrase'].includes(columnName)) {
      return 'bg-orange-500/15 border-orange-400/30';
    }
    if (animationPhase >= 3 && columnName === 'hardwareWallet') {
      return 'bg-green-500/15 border-green-400/30';
    }
    if (animationPhase >= 4 && columnName === 'backups') {
      return 'bg-blue-500/15 border-blue-400/30';
    }
    return 'border-gray-600';
  };

  return (
    <div className={`relative h-[540px] overflow-visible py-4 border border-gray-600/30 ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={15} isActive={isActive} />
      
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Phase 1+: Bitcoin Self-Custody Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 1 ? 1 : 0,
            scale: animationPhase >= 1 ? 1 : 0.9
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-7xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Bitcoin</h2>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">2 Wallets</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-8 bg-gray-900/50 border-b border-gray-600 text-sm font-medium text-gray-300">
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('setupName')}`}>Setup Name</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('scriptType')}`}>Script Type</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('type')}`}>Type</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('passphrase')}`}>Passphrase</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('hardwareWallet')}`}><span className="ml-2">Hardware Wallet</span></div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('backups')}`}><span className="ml-2">Backups</span></div>
              <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">Balance</div>
              <div className="p-3 border-gray-600 text-center flex items-center justify-center">Actions</div>
            </div>

            {/* Table Rows */}
            {walletData.map((wallet, index) => (
              <div key={index} className="grid grid-cols-8 border-b border-gray-700 last:border-b-0 text-sm">
                {/* Setup Name */}
                <div className={`p-3 border-r text-white text-center flex items-center justify-center ${getColumnHighlight('setupName')}`}>
                  {wallet.setupName}
                </div>
                
                {/* Script Type */}
                <div className={`p-3 border-r text-gray-300 text-center flex items-center justify-center ${getColumnHighlight('scriptType')}`}>
                  {wallet.scriptType}
                </div>
                
                {/* Type */}
                <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('type')}`}>
                  <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs">
                    {wallet.type}
                  </span>
                </div>
                
                {/* Passphrase */}
                <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('passphrase')}`}>
                  <span className={`px-2 py-1 rounded text-xs ${
                    wallet.passphrase === 'None' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    {wallet.passphrase}
                  </span>
                </div>
                
                {/* Hardware Wallet */}
                <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('hardwareWallet')}`}>
                  {wallet.hardwareWallet && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                {/* Backups */}
                <div className={`p-3 border-r flex items-center justify-center ${getColumnHighlight('backups')}`}>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-gray-400">Seed:</span>
                      <div className="flex gap-1">
                        {wallet.backups.seed.map((num) => (
                          <span key={num} className="text-green-400">✓</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-gray-400">Descriptor:</span>
                      <div className="flex gap-1">
                        {wallet.backups.descriptor.map((num) => (
                          <span key={num} className="text-green-400">✓</span>
                        ))}
                      </div>
                    </div>
                    {wallet.backups.passphrase && (
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-gray-400">Passphrase:</span>
                        <div className="flex gap-1">
                          {wallet.backups.passphrase.map((num) => (
                            <span key={num} className="text-green-400">✓</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Balance */}
                <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">
                  <div className="text-white font-medium">{wallet.balance}</div>
                </div>
                
                {/* Actions */}
                <div className="p-3 border-gray-600 flex gap-2 items-center justify-center">
                  <button className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Labels Container - gleichmäßig zentriert verteilt */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 z-20 w-full max-w-4xl px-8">
          {/* Phase 2+: Setup Highlight - stays visible once appeared */}
          {animationPhase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-orange-500/20 text-orange-100 px-4 py-2 rounded-md shadow-lg border border-orange-400/40 backdrop-blur-sm">
                <div className="text-sm font-medium">Manage Setup Metadata</div>
              </div>
            </motion.div>
          )}

          {/* Phase 3+: Hardware Wallet Highlight - stays visible once appeared */}
          {animationPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-green-500/20 text-green-100 px-4 py-2 rounded-md shadow-lg border border-green-400/40 backdrop-blur-sm">
                <div className="text-sm font-medium">Track Hardware Wallets</div>
              </div>
            </motion.div>
          )}

          {/* Phase 4+: Backups Highlight - stays visible once appeared */}
          {animationPhase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-blue-500/20 text-blue-100 px-4 py-2 rounded-md shadow-lg border border-blue-400/40 backdrop-blur-sm">
                <div className="text-sm font-medium">Track Backup Status</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BitcoinSelfCustodyAnimation;