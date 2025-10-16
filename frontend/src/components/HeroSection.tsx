import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Coins, 
  Vault,
  TrendingUp,
  Users
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: '#020617' }}>
      {/* Subtiler Sternenhimmel im Company Website Stil */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Overlays wie in der Company Website */}
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        }}></div>
      </div>
      
      {/* Stars Background wie in der Company Website */}
      <div className="absolute inset-0">
        {/* Subtile Sterne wie in der Company Website */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 90%, white, transparent)
            `,
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 0%',
            animation: 'stars 60s linear infinite',
            opacity: 0.5
          }}
        />
        
        {/* Zusätzliche animierte Sterne */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>



      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Stararc Sovereignty
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold text-blue-200 mb-8">
              Ihr ganzes Anlageuniversum unter einem Dach
            </h2>
            
          </motion.div>

          {/* Feature Categories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-6xl mx-auto mb-12"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Asset Management */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-7 h-7 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Asset Management</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    <span>Übersicht aller Vermögensklassen</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    <span>Wertschriftendepots</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    <span>Echtzeit-Kurse & Performance</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    <span>Datenimport Depots (BETA)</span>
                  </div>
                </div>
              </div>

              {/* Bitcoin Custody */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Coins className="w-7 h-7 text-orange-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Bitcoin Custody</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-orange-400 mr-2 mt-1">•</span>
                    <span>Professionelles Key-Management</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-400 mr-2 mt-1">•</span>
                    <span>SingleSig & MultiSig Setups</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-400 mr-2 mt-1">•</span>
                    <span>Backup-Strategien für Seeds</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-400 mr-2 mt-1">•</span>
                    <span>Sicherheitsüberprüfungen</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-7 h-7 text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Security Features</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-1">•</span>
                    <span>Anonymes Login mit Private Key</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-1">•</span>
                    <span>Verschlüsselte Daten</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-1">•</span>
                    <span>Anonymisierte Daten</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-1">•</span>
                    <span>Zero-Knowledge Architektur</span>
                  </div>
                </div>
              </div>

              {/* Verwahrungsstrategie */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Vault className="w-7 h-7 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Verwahrungsstrategie</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">•</span>
                    <span>Verwaltung physischer/digitaler Vaults</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">•</span>
                    <span>Sicherheitsbewertung der Vaults</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">•</span>
                    <span>Selbst- vs. Fremdverwahrung</span>
                  </div>
                </div>
              </div>

              {/* Dienstleistungen */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-7 h-7 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Dienstleistungen</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>Persönliche Vermögensberatung</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>Bitcoin Advisory</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>Individuelle Strategien</span>
                  </div>
                </div>
              </div>

              {/* Investment Trends */}
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-7 h-7 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Investment Trends</h3>
                </div>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                    <span>AI & Machine Learning</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                    <span>Robotics & Automation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                    <span>Space Technology</span>
                  </div>
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

// Add CSS for stars animation
const style = document.createElement('style');
style.textContent = `
  @keyframes stars {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
`;
if (!document.head.querySelector('style[data-stars]')) {
  style.setAttribute('data-stars', 'true');
  document.head.appendChild(style);
}