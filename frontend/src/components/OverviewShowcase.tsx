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
  Wallet, 
  Shield, 
  Layers,
  User,
  Landmark,
  ChevronRight
} from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  items: string[];
  sectionId?: string;
}

const OverviewShowcase: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: TrendingUp,
      title: 'Portfolio Management',
      items: ['Wertschriften-Übersicht', 'Performance-Tracking', 'Diversifikation'],
      sectionId: 'portfolio'
    },
    {
      icon: Package,
      title: 'Securities Management',
      items: ['ETFs & Aktien', 'Bonds', 'Precious Metals'],
      sectionId: 'securities'
    },
    {
      icon: Bitcoin,
      title: 'Bitcoin & Crypto',
      items: ['Bitcoin Wizard', 'Altcoins', 'Cold Storage'],
      sectionId: 'bitcoin'
    },
    {
      icon: Building2,
      title: 'Immobilien',
      items: ['Eigenschaften', 'Hypotheken', 'Liabilities'],
      sectionId: 'realestate'
    },
    {
      icon: Users,
      title: 'Profile & Management',
      items: ['Family Members', 'Financial Institutions', 'Multi-User'],
      sectionId: 'profile'
    },
    {
      icon: ScanLine,
      title: 'Document Scanner',
      items: ['OCR Recognition', 'Auto-Import', 'Privacy-First'],
      sectionId: 'scanner'
    },
    {
      icon: Coins,
      title: 'Multi-Currency',
      items: ['11+ Währungen', 'Live Wechselkurse', 'Separate Budgets'],
      sectionId: 'currency'
    },
    {
      icon: Umbrella,
      title: 'Pension & Insurance',
      items: ['3-Säulen-System', 'Mehrere Konten', 'Familie & Partner'],
      sectionId: 'pension'
    },
    {
      icon: Package,
      title: 'Asset Management',
      items: ['Kategorien', 'Tracking', 'Reporting'],
      sectionId: 'assets'
    },
    {
      icon: Wallet,
      title: 'Budget Management',
      items: ['Income & Expenses', 'Kategorien', 'Analytics'],
      sectionId: 'budget'
    },
    {
      icon: Shield,
      title: 'Client-Side Encryption',
      items: ['AES-256-GCM', 'Zero-Knowledge', 'Privacy First'],
      sectionId: 'security'
    },
    {
      icon: Layers,
      title: 'Two-Layer Security',
      items: ['Admin-Verschlüsselung', 'User-Verschlüsselung', 'Cross-App Auth'],
      sectionId: 'architecture'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Offset for fixed header if any
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 overflow-hidden">
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
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Alles für Ihre Finanzen
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eine umfassende Plattform für Portfolio Management, Budgetierung, und sichere Datenverwaltung. 
            Klicken Sie auf ein Feature, um mehr zu erfahren.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => feature.sectionId && scrollToSection(feature.sectionId)}
                className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-lg">
            Entdecken Sie alle Features im Detail, indem Sie durch die Seite scrollen oder auf ein Feature klicken.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewShowcase;
