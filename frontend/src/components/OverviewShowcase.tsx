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
  Layers
} from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  sectionId: string;
}

const OverviewShowcase: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: TrendingUp,
      title: 'Portfolio Management',
      sectionId: 'portfolio'
    },
    {
      icon: Package,
      title: 'Securities Management',
      sectionId: 'securities'
    },
    {
      icon: Bitcoin,
      title: 'Bitcoin & Crypto',
      sectionId: 'bitcoin'
    },
    {
      icon: Building2,
      title: 'Immobilien',
      sectionId: 'realestate'
    },
    {
      icon: Users,
      title: 'Profile & Management',
      sectionId: 'profile'
    },
    {
      icon: ScanLine,
      title: 'Document Scanner',
      sectionId: 'scanner'
    },
    {
      icon: Coins,
      title: 'Multi-Currency',
      sectionId: 'currency'
    },
    {
      icon: Umbrella,
      title: 'Pension & Insurance',
      sectionId: 'pension'
    },
    {
      icon: Shield,
      title: 'Client-Side Encryption',
      sectionId: 'security'
    },
    {
      icon: Layers,
      title: 'Two-Layer Security',
      sectionId: 'architecture'
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
            Entdecken Sie alle Features
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Klicken Sie auf ein Feature, um direkt zur detaillierten Ansicht zu springen
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => scrollToSection(feature.sectionId)}
                className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewShowcase;
