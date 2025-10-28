import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Lock, 
  ArrowRight, 
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
    <div className={`relative h-[580px] overflow-visible py-8 ${className}`}>
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
          <div className={`relative grid grid-cols-2 gap-12 ${animationPhase >= 9 ? 'h-[200px]' : 'h-[320px]'}`}>
            
            {/* Privacy Wall - Phase 9 */}
            {animationPhase >= 9 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-1/2 top-0 w-3 bg-gradient-to-b from-yellow-500/90 to-orange-500/90 transform -translate-x-1/2 shadow-lg rounded-sm"
                style={{
                  height: '100%',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.7), inset 0 0 15px rgba(251, 191, 36, 0.4)'
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-sm font-bold rotate-90 whitespace-nowrap tracking-widest">
                  PRIVACY WALL
                </div>
              </motion.div>
            )}

            {/* Left Side - StarArc Launchpad */}
            <div className="flex flex-col items-center">
                <div className={`bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-full h-full border border-blue-400/30 backdrop-blur-sm ${animationPhase >= 9 ? 'p-4' : 'p-6'}`}>
                <div className={`flex items-center gap-3 ${animationPhase >= 9 ? 'mb-3' : 'mb-6'}`}>
                  <Rocket className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">StarArc Launchpad</h3>
                </div>                {/* Frontend Section */}
                <div className="bg-blue-500/10 rounded-lg p-4 mb-4 border border-blue-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-300 font-medium">Frontend</span>
                  </div>
                  
                  {/* Registration Process - Phase 1 */}
                                    {/* User Registration - Phase 1 */}
                  {animationPhase >= 1 && animationPhase < 9 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mb-3 p-2 bg-white/5 rounded border border-white/10"
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
                  {animationPhase >= 3 && animationPhase < 9 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mb-3 p-2 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">3</span>
                        <Key className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">Private Key Generation</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Encryption - Phase 4 */}
                  {animationPhase >= 4 && animationPhase < 9 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mb-3 p-2 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">4</span>
                        <Lock className="w-4 h-4 text-red-400" />
                        <span className="text-white">Key Encryption</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Deletion - Phase 6 */}
                  {animationPhase >= 6 && animationPhase < 9 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="p-2 bg-red-500/10 rounded border border-red-400/30"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">6</span>
                        <Trash2 className="w-4 h-4 text-red-400" />
                        <span className="text-white">All Keys Deleted</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Backend Section */}
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-purple-300" />
                    <span className="text-purple-300 font-medium">Backend</span>
                  </div>

                  {/* Email & Hashed Password Storage - Phase 2 */}
                  {animationPhase >= 2 && animationPhase < 9 && (
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

            {/* Right Side - StarArc Spaceship */}
            <div className="flex flex-col items-center">
              <div className={`bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl w-full h-full border border-green-400/30 backdrop-blur-sm ${animationPhase >= 9 ? 'p-4' : 'p-6'}`}>
                <div className={`flex items-center gap-3 ${animationPhase >= 9 ? 'mb-3' : 'mb-6'}`}>
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">StarArc Spaceship</h3>
                </div>

                {/* Frontend Section */}
                <div className="bg-green-500/10 rounded-lg p-4 mb-4 border border-green-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-green-300" />
                    <span className="text-green-300 font-medium">Frontend</span>
                  </div>

                  {/* Login - Phase 7 */}
                  {animationPhase >= 7 && animationPhase < 9 && (
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

                {/* Backend Section */}
                <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-teal-300" />
                    <span className="text-teal-300 font-medium">Backend</span>
                  </div>

                  {/* Secure Storage - Phase 5 */}
                  {animationPhase >= 5 && animationPhase < 9 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="p-2 bg-white/5 rounded border border-white/10 mb-3"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">5</span>
                        <Shield className="w-4 h-4 text-teal-400" />
                        <span className="text-white">Encrypted Key Storage</span>
                      </div>
                    </motion.div>
                  )}

                  {/* User Data (Encrypted) - Phase 8 */}
                  {animationPhase >= 8 && animationPhase < 9 && (
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

          {/* Secure Transfer Arrow - Phase 5 */}
          {animationPhase >= 5 && animationPhase < 9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 backdrop-blur-sm">
                <ArrowRight className="w-6 h-6 text-yellow-400" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Privacy Messages */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          {/* No Connection - Phase 9 */}
          {animationPhase >= 9 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/60 text-gray-200 p-4 rounded-lg mb-3 border border-gray-600/50 backdrop-blur-sm text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">9</span>
                <EyeOff className="w-5 h-5 text-blue-400" />
                <span className="font-medium">No connection between your personal login data and your data in the stararc spaceshipo app</span>
              </div>
            </motion.div>
          )}

          {/* Nobody Can Read - Phase 10 */}
          {animationPhase >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-green-500/20 text-green-100 p-4 rounded-lg border border-green-400/40 backdrop-blur-sm text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">10</span>
                <Shield className="w-5 h-5 text-green-400" />
                <span className="font-bold">Nobody can read your data, not even us</span>
              </div>
              <div className="text-sm text-green-200">
                Securely store your private key for login. We cannot restore your password.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyAnimation;