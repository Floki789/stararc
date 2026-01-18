import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Shield, 
  Key, 
  Lock, 
  Trash2, 
  LogIn, 
  EyeOff,
  Server,
  Monitor,
  Rocket,
  CreditCard,
  Mail,
  UserCheck
} from 'lucide-react';

interface PrivacyAnimationProps {
  className?: string;
  isActive?: boolean;
}

const PrivacyAnimation: React.FC<PrivacyAnimationProps> = ({ className = "", isActive = false }) => {
  const { t } = useLanguage();
  const [animationPhase, setAnimationPhase] = useState(0); 
  // 0: start, 1: registration, 2: email/password stored, 3: key generation, 4: encryption, 
  // 5: secure transfer, 6: deletion, 7: login, 8: user data encrypted, 9: no connection, 10: nobody can read

  // Reset animation when it becomes active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    const animationSequence = setTimeout(() => {
      if (animationPhase < 10) {
        setAnimationPhase(prev => prev + 1);
      }
    }, animationPhase === 0 ? 1000 : animationPhase === 8 ? 5000 : 2500); // First phase 1s, 5s wait after step 8, then 2.5s each
    
    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  return (
    <div className={`relative h-[540px] overflow-visible py-4 ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={31} isActive={isActive} />
      
      <div className="absolute inset-0 flex items-start justify-center pt-8">
        {/* Main Visualization Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 0 ? 1 : 0,
            scale: animationPhase >= 0 ? 1 : 0.9
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-6xl"
        >
          <div className={`relative grid grid-cols-2 gap-12 ${animationPhase >= 9 ? 'h-[200px]' : 'h-[320px]'} min-h-[200px]`}>
            {/* Left Side - StarArc Launchpad */}
            <div className={`flex flex-col items-center transition-opacity duration-800 ${animationPhase >= 9 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-full h-full border border-blue-400/30 backdrop-blur-sm p-6 min-h-[200px]">
                <div className="flex items-center gap-3 mb-6">
                  <Rocket className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">StarArc Launchpad</h3>
                </div>                {/* Frontend Section */}
                <div className="bg-blue-500/10 rounded-lg p-4 mb-4 border border-blue-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-300 font-medium">Frontend</span>
                  </div>
                  
                  {/* Dynamic Steps Container */}
                  <div className="space-y-2 h-[240px]">
                    {/* Registration Process - Phase 1 */}
                    {animationPhase >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">1</span>
                          <UserCheck className="w-4 h-4 text-green-400" />
                          <span className="text-white">Registration Process</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-300 ml-7">
                          <Mail className="w-3 h-3" />
                          <CreditCard className="w-3 h-3" />
                          <span>Email, Password, Subscription</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Private Key Generation - Phase 3 */}
                    {animationPhase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">3</span>
                          <Key className="w-4 h-4 text-purple-400" />
                          <span className="text-white">Private Key Generated</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Encryption - Phase 4 */}
                    {animationPhase >= 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">4</span>
                          <Lock className="w-4 h-4 text-red-400" />
                          <span className="text-white">Key Encryption</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Deletion - Phase 6 */}
                    {animationPhase >= 6 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-red-500/10 rounded border border-red-400/30"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">6</span>
                          <Trash2 className="w-4 h-4 text-red-400" />
                          <span className="text-white">{t('privacy.allKeysDeleted')}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Backend Section */}
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-purple-300" />
                    <span className="text-purple-300 font-medium">Backend</span>
                  </div>

                  <div className="min-h-[60px]">
                    {/* Email & Hashed Password Storage - Phase 2 */}
                  {animationPhase >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="p-2 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">2</span>
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span className="text-white">Email & Hashed Password</span>
                      </div>
                    </motion.div>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - StarArc Spaceship */}
            <div className={`flex flex-col items-center transition-opacity duration-800 ${animationPhase >= 9 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl w-full h-full border border-green-400/30 backdrop-blur-sm p-6 min-h-[200px]">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">StarArc Spaceship</h3>
                </div>

                {/* Frontend Section */}
                <div className="bg-green-500/10 rounded-lg p-4 mb-4 border border-green-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-green-300" />
                    <span className="text-green-300 font-medium">Frontend</span>
                  </div>

                  <div className="min-h-[60px]">{/* Fixed height for stable container */}
                    {/* Login - Phase 7 */}
                    {animationPhase >= 7 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">7</span>
                          <LogIn className="w-4 h-4 text-green-400" />
                          <span className="text-white">Private Key Login</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Backend Section */}
                <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-teal-300" />
                    <span className="text-teal-300 font-medium">Backend</span>
                  </div>

                  <div className="space-y-2 h-[160px]">{/* Fixed height for stable container */}
                    {/* Encrypted Key Storage - Phase 5 */}
                    {animationPhase >= 5 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10 mb-2"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">5</span>
                          <Key className="w-4 h-4 text-teal-400" />
                          <span className="text-white">Encrypted Key</span>
                        </div>
                      </motion.div>
                    )}

                    {/* User Data (Encrypted) - Phase 8 */}
                    {animationPhase >= 8 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-2 bg-white/5 rounded border border-white/10"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">8</span>
                          <Shield className="w-4 h-4 text-indigo-400" />
                          <span className="text-white">User Data (Encrypted)</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
            </div>
          </div>


        </div> {/* Close grid div */}

          {/* Enhanced Privacy Messages - Phase 9 & 10 */}
          {animationPhase >= 9 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl px-8">
                
                {/* No Connection - Phase 9 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-8 mb-6 border border-blue-400/30 backdrop-blur-lg shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-blue-500 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[40px] h-10 flex items-center justify-center shadow-lg">9</div>
                    <EyeOff className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center mb-3">{t('heroSection.animations.privacy.step9.title')}</h3>
                  <p className="text-blue-100 text-center text-lg leading-relaxed">
                    {t('heroSection.animations.privacy.step9.description')}
                  </p>
                </motion.div>

                {/* Nobody Can Read - Phase 10 (Always reserve space) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: animationPhase >= 10 ? 1 : 0, 
                    scale: animationPhase >= 10 ? 1 : 0.9, 
                    y: 0 
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: animationPhase >= 10 ? 0.3 : 0 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-8 border border-green-400/30 backdrop-blur-lg shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-green-500 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[40px] h-10 flex items-center justify-center shadow-lg">10</div>
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center mb-3">{t('heroSection.animations.privacy.step10.title')}</h3>
                  <p className="text-green-100 text-center text-lg leading-relaxed mb-3">
                    <strong>{t('heroSection.animations.privacy.step10.description')}</strong>
                  </p>
                  <p className="text-green-200/80 text-center text-sm">
                    {t('heroSection.animations.privacy.step10.subtitle')}
                  </p>
                </motion.div>
                
              </div>
            </div>
          )}
        </motion.div> {/* Close main container motion.div */}
      </div>
    </div>
  );
};

export default PrivacyAnimation;