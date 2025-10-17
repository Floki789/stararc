import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  FileText, 
  Coins, 
  Gem, 
  Building2, 
  Eye, 
  X, 
  Lock, 
  Crown
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
      {/* Intensiver Sternenhimmel mit Sternbildern und Asteroiden */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotierender Sternenhimmel Container */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '300s', transformOrigin: 'center center' }}>
        {/* Hintergrundsterne - Kleine Punkte */}
        {[...Array(200)].map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className={`absolute rounded-full ${
              ['bg-white', 'bg-blue-200'][i % 2]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              opacity: Math.random() * 0.6 + 0.3
            }}
          />
        ))}

        {/* Helle Hauptsterne */}
        {[...Array(80)].map((_, i) => (
          <div
            key={`main-star-${i}`}
            className={`absolute ${
              ['text-white', 'text-blue-100'][i % 2]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 3 + 1.5}px`,
              filter: `brightness(${Math.random() * 0.3 + 0.7})`,
              textShadow: '0 0 4px currentColor'
            }}
          >
            ✦
          </div>
        ))}

        {/* Sternbild Großer Wagen (Big Dipper) */}
        <div className="absolute" style={{ left: '15%', top: '20%' }}>
          {/* Verbindungslinien */}
          <svg width="200" height="120" className="absolute opacity-30">
            <defs>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <path d="M20,100 L50,80 L80,85 L110,70 L140,75 L170,60 L190,45" 
                  stroke="url(#starGradient)" strokeWidth="1" fill="none"/>
          </svg>

        </div>

        {/* Sternbild Orion */}
        <div className="absolute" style={{ right: '10%', top: '30%' }}>
          {/* Orion Verbindungslinien */}
          <svg width="150" height="180" className="absolute opacity-25">
            <path d="M75,20 L60,60 L90,60 L75,100 L45,140 L105,140 L75,100 L30,80 L120,80" 
                  stroke="url(#starGradient)" strokeWidth="1" fill="none"/>
          </svg>

        </div>

        {/* Kassiopeia (W-Form) */}
        <div className="absolute" style={{ right: '25%', top: '15%' }}>
          <svg width="120" height="60" className="absolute opacity-30">
            <path d="M10,45 L30,15 L50,35 L70,10 L90,40" 
                  stroke="url(#starGradient)" strokeWidth="1" fill="none"/>
          </svg>

        </div>



        {/* Asteroiden - Sehr subtile bewegende Punkte */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`asteroid-${i}`}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${20 + Math.random() * 30}s linear infinite`,
              animationDelay: `${Math.random() * 15}s`
            }}
          />
        ))}

        {/* Nebel-Effekt */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 800px 600px at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse 600px 400px at 70% 60%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Milchstraße-Effekt */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.05) 40%, rgba(167, 139, 250, 0.08) 50%, rgba(59, 130, 246, 0.05) 60%, transparent 70%)',
            transform: 'rotate(-20deg) scale(1.5)',
          }}
        />
        </div>
      </div>



      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Stararc
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold text-blue-200 mb-8">
              Ihr ganzes Anlageuniversum unter einem Dach
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Ganzheitliches Asset Management mit maximaler Privatsphäre und Kontrolle
            </p>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
          >
            {/* Ganzheitliches Asset Management */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 text-left">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Ganzheitliches Asset Management</h3>
              </div>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Wertschriften (Aktien, ETFs, Obligationen)</span>
                </div>
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Bitcoin Self-Custody</span>
                </div>
                <div className="flex items-center">
                  <Gem className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Alternative Assets (Krypto, Edelmetalle, Kunst)</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Immobilien & REITs</span>
                </div>
              </div>
            </div>

            {/* Privacy Focus */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 text-left">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Privacy-by-Design</h3>
              </div>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Zero-Knowledge Architektur</span>
                </div>
                <div className="flex items-center">
                  <X className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Keine Datenspeicherung oder Verkauf</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Client-seitige Verschlüsselung</span>
                </div>
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-slate-400 mr-2" />
                  <span>Maximale digitale Souveränität</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 max-w-3xl mx-auto"
          >
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/40 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-base">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Free Version mit Basis-Features</span>
                </div>
                <div className="hidden sm:block text-slate-500">•</div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-purple-400 text-lg">⭐</span>
                  <span>Premium für alle Asset-Klassen</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl border border-blue-400/20 hover:border-blue-300/40 transition-all duration-300"
            >
              Jetzt Registrieren
            </motion.button>
          </motion.div>


        </div>
      </div>
    </div>
  );
};

export default HeroSection;