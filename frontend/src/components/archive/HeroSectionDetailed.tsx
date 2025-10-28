import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Lock, 
  Crown,
  TrendingUp,
  Users,
  Banknote,
  Building,
  Gem,
  ChevronRight
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gray-950 min-h-screen">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black opacity-80"></div>
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left max-w-2xl"
          >
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Stararc
              </span>
              <br />
              <span className="text-white text-3xl lg:text-4xl font-medium">
                Unify Your Wealth | Embrace Bitcoin
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-slate-300 mb-8 leading-relaxed"
            >
              Holistic wealth and security management. Manage all your family's assets under one secure and privacy-sensitive platform.
            </motion.p>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 mb-10"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Centralized Oversight, Decentralized Control</h3>
                  <p className="text-slate-400 text-sm">Track self-custodied assets like Bitcoin or art, as well as custodian-held assets—all in one dashboard.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Privacy by Design</h3>
                  <p className="text-slate-400 text-sm">Choose standard login or privacy-first login where no personal information is attached to your account.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Gem className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Bitcoin-First Approach</h3>
                  <p className="text-slate-400 text-sm">Professional wallet setup wizard with singlesig/multisig configurations and robust backup strategies.</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800/50 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Features Overview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative space-y-6"
          >
            {/* Supported Assets */}
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Supported Assets
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Securities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-slate-300">Bitcoin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">Real Estate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Art & Collectibles</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-400" />
                Security & Privacy
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  No personal data stored
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  Anonymous portfolio tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  Swiss privacy standards
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  Legacy-ready documentation
                </li>
              </ul>
            </div>

            {/* Family Wealth */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Family Wealth Management
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Securely document your entire portfolio, optimize investments, and prepare to pass wealth to the next generation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 text-sm">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span>Secure & Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Legacy-Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-orange-400" />
                <span>Bitcoin-First</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;