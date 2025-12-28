import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  TrendingUp,
  Bitcoin,
  Gem,
  Home,
  Shield,
  PieChart,
  Zap,
  Globe,
  LockKeyhole
} from 'lucide-react';

const AssetShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleDemoLogin = async () => {
    // Set demo credentials and navigate to login page with auto-login
    navigate('/login?demo=true');
  };
  const assets = [
    {
      icon: TrendingUp,
      title: "Alle Asset-Klassen",
      description: "Liquidität, Aktien, ETFs, Bitcoin, Edelmetalle, Liegenschaften, Vorsorgekonten, Krypto, Obligationen, Darlehen, Schulden",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Bitcoin,
      title: "Bitcoin Self-Custody Wizard",
      description: "Vollständiger Wizard für SingleSig und MultiSig Setup mit Hardware Wallets",
      gradient: "from-orange-500 to-yellow-500",
      bgGradient: "from-orange-500/10 to-yellow-500/10"
    },
    {
      icon: Home,
      title: "Immobilien",
      description: "Verwaltung von Immobilien inklusive Hypotheken, Bewertungen und Rendite-Tracking",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: PieChart,
      title: "Portfolio Cockpit",
      description: "Gesamtportfolio-Übersicht mit detaillierten Asset-Breakdowns und Visualisierungen",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-500/10 to-indigo-500/10"
    },
    {
      icon: Zap,
      title: "Live & Tagesaktuelle Kurse",
      description: "Live Kurse für Wertschriften, Aktien, ETFs, Bitcoin, Krypto. Tagesaktuelle Kurse für Edelmetalle",
      gradient: "from-yellow-400 to-amber-500",
      bgGradient: "from-yellow-400/10 to-amber-500/10"
    },
    {
      icon: Globe,
      title: "Multi-Währungs-Support",
      description: "Assets in 11 Währungen erfassbar mit separater Währung für Portfolio-Berechnung",
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "from-cyan-500/10 to-teal-500/10"
    },
    {
      icon: LockKeyhole,
      title: "Fremd- & Selbstverwahrung",
      description: "Klare Unterscheidung zwischen fremdverwahrten Assets (Banken) und selbstverwahrten Assets (Self-Custody)",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-500/10 to-purple-500/10"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-500/5 to-yellow-500/5 blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
              {t('homepage.assetShowcase.title.part1')}
            </span>
            <span className="block mt-2">
              {t('homepage.assetShowcase.title.part2')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('homepage.assetShowcase.subtitle')}
          </p>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {assets.map((asset, index) => {
            const Icon = asset.icon;
            return (
              <div
                key={index}
                className={`relative group bg-gradient-to-br ${asset.bgGradient} backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-r ${asset.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {asset.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            {t('homepage.assetShowcase.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.assetShowcase.cta.start')}
            </button>
            <button 
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-amber-500 text-amber-400 text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.assetShowcase.cta.demo')}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AssetShowcase;