import React from 'react';
import { 
  TrendingUp, 
  Bitcoin, 
  Building2, 
  Users, 
  ScanLine, 
  Coins, 
  Umbrella, 
  Package, 
  Shield, 
  Layers,
  Key
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FeatureItem {
  icon: React.ElementType;
  titleKey: string;
  sectionId: string;
  colorScheme: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo' | 'yellow' | 'pink' | 'teal' | 'cyan' | 'emerald';
}

const OverviewShowcase: React.FC = () => {
  const { t } = useLanguage();
  
  const features: FeatureItem[] = [
    {
      icon: TrendingUp,
      titleKey: 'overview.features.portfolioManagement',
      sectionId: 'portfolio',
      colorScheme: 'blue'
    },
    {
      icon: TrendingUp,
      titleKey: 'overview.features.planning',
      sectionId: 'planning',
      colorScheme: 'cyan'
    },
    {
      icon: Umbrella,
      titleKey: 'overview.features.retirement',
      sectionId: 'retirement',
      colorScheme: 'purple'
    },
    {
      icon: Package,
      titleKey: 'overview.features.securitiesManagement',
      sectionId: 'securities',
      colorScheme: 'green'
    },
    {
      icon: Bitcoin,
      titleKey: 'overview.features.bitcoinCrypto',
      sectionId: 'bitcoin',
      colorScheme: 'orange'
    },
    {
      icon: Building2,
      titleKey: 'overview.features.immobilien',
      sectionId: 'realestate',
      colorScheme: 'indigo'
    },
    {
      icon: Users,
      titleKey: 'overview.features.profileManagement',
      sectionId: 'profile',
      colorScheme: 'pink'
    },
    {
      icon: ScanLine,
      titleKey: 'overview.features.documentScanner',
      sectionId: 'scanner',
      colorScheme: 'teal'
    },
    {
      icon: Key,
      titleKey: 'overview.features.selfCustody',
      sectionId: 'selfcustody',
      colorScheme: 'purple'
    },
    {
      icon: Coins,
      titleKey: 'overview.features.multiCurrency',
      sectionId: 'currency',
      colorScheme: 'yellow'
    },
    {
      icon: Umbrella,
      titleKey: 'overview.features.pensionInsurance',
      sectionId: 'pension',
      colorScheme: 'yellow'
    },
    {
      icon: Shield,
      titleKey: 'overview.features.clientSideEncryption',
      sectionId: 'security',
      colorScheme: 'emerald'
    },
    {
      icon: Layers,
      titleKey: 'overview.features.twoLayerSecurity',
      sectionId: 'architecture',
      colorScheme: 'red'
    },
    {
      icon: TrendingUp,
      titleKey: 'overview.features.gettingStarted',
      sectionId: 'gettingstarted',
      colorScheme: 'indigo'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getColorClasses = (colorScheme: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/20 group-hover:bg-blue-500/30',
        icon: 'text-blue-400',
        border: 'hover:border-blue-500/50',
        shadow: 'hover:shadow-blue-500/10',
        text: 'group-hover:text-blue-400'
      },
      green: {
        bg: 'bg-green-500/20 group-hover:bg-green-500/30',
        icon: 'text-green-400',
        border: 'hover:border-green-500/50',
        shadow: 'hover:shadow-green-500/10',
        text: 'group-hover:text-green-400'
      },
      orange: {
        bg: 'bg-orange-500/20 group-hover:bg-orange-500/30',
        icon: 'text-orange-400',
        border: 'hover:border-orange-500/50',
        shadow: 'hover:shadow-orange-500/10',
        text: 'group-hover:text-orange-400'
      },
      purple: {
        bg: 'bg-purple-500/20 group-hover:bg-purple-500/30',
        icon: 'text-purple-400',
        border: 'hover:border-purple-500/50',
        shadow: 'hover:shadow-purple-500/10',
        text: 'group-hover:text-purple-400'
      },
      indigo: {
        bg: 'bg-indigo-500/20 group-hover:bg-indigo-500/30',
        icon: 'text-indigo-400',
        border: 'hover:border-indigo-500/50',
        shadow: 'hover:shadow-indigo-500/10',
        text: 'group-hover:text-indigo-400'
      },
      pink: {
        bg: 'bg-pink-500/20 group-hover:bg-pink-500/30',
        icon: 'text-pink-400',
        border: 'hover:border-pink-500/50',
        shadow: 'hover:shadow-pink-500/10',
        text: 'group-hover:text-pink-400'
      },
      teal: {
        bg: 'bg-teal-500/20 group-hover:bg-teal-500/30',
        icon: 'text-teal-400',
        border: 'hover:border-teal-500/50',
        shadow: 'hover:shadow-teal-500/10',
        text: 'group-hover:text-teal-400'
      },
      yellow: {
        bg: 'bg-yellow-500/20 group-hover:bg-yellow-500/30',
        icon: 'text-yellow-400',
        border: 'hover:border-yellow-500/50',
        shadow: 'hover:shadow-yellow-500/10',
        text: 'group-hover:text-yellow-400'
      },
      cyan: {
        bg: 'bg-cyan-500/20 group-hover:bg-cyan-500/30',
        icon: 'text-cyan-400',
        border: 'hover:border-cyan-500/50',
        shadow: 'hover:shadow-cyan-500/10',
        text: 'group-hover:text-cyan-400'
      },
      emerald: {
        bg: 'bg-emerald-500/20 group-hover:bg-emerald-500/30',
        icon: 'text-emerald-400',
        border: 'hover:border-emerald-500/50',
        shadow: 'hover:shadow-emerald-500/10',
        text: 'group-hover:text-emerald-400'
      },
      red: {
        bg: 'bg-red-500/20 group-hover:bg-red-500/30',
        icon: 'text-red-400',
        border: 'hover:border-red-500/50',
        shadow: 'hover:shadow-red-500/10',
        text: 'group-hover:text-red-400'
      }
    };
    return colors[colorScheme as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {/* Stars layer 1 - small and dim */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 85%, white, transparent),
                           radial-gradient(1px 1px at 15% 45%, white, transparent)`,
          backgroundSize: '200px 200px, 250px 250px, 150px 150px, 180px 180px, 220px 220px, 190px 190px, 160px 160px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 20px 180px, 110px 50px, 150px 220px',
          opacity: 0.3
        }} />
        
        {/* Stars layer 2 - medium */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 70% 80%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 40% 60%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 85% 35%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 25% 75%, rgba(147, 197, 253, 0.8), transparent)`,
          backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px, 290px 290px',
          backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px, 130px 300px',
          opacity: 0.4
        }} />
        
        {/* Stars layer 3 - bright accent stars */}
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(3px 3px at 30% 40%, rgba(96, 165, 250, 1), transparent),
                           radial-gradient(2px 2px at 75% 25%, rgba(96, 165, 250, 1), transparent),
                           radial-gradient(2px 2px at 45% 90%, rgba(96, 165, 250, 1), transparent)`,
          backgroundSize: '400px 400px, 350px 350px, 380px 380px',
          backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
          opacity: 0.6,
          animationDuration: '4s'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('overview.title')}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t('overview.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = getColorClasses(feature.colorScheme);
            return (
              <button
                key={index}
                onClick={() => scrollToSection(feature.sectionId)}
                className={`bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 ${colors.border} ${colors.shadow} transition-all duration-300 hover:scale-105 hover:shadow-lg text-center group h-32 flex flex-col items-center justify-between`}
              >
                <div className="flex justify-center items-center">
                  <div className={`p-3 ${colors.bg} rounded-lg transition-colors`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                </div>
                
                <div className="w-full">
                  <h3 className={`text-sm font-semibold text-white ${colors.text} transition-colors leading-tight`}>
                    {t(feature.titleKey)}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewShowcase;
