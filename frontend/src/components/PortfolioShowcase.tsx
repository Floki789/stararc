import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BreakdownSource {
  source: string;
  value: number;
  percentage: number;
  color: string;
}

interface AssetClass {
  name: string;
  value: number;
  percentage: number;
  breakdown: BreakdownSource[];
}

const PortfolioShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredBreakdownSource, setHoveredBreakdownSource] = useState<{ assetClass: string; source: string } | null>(null);
  const [hoveredOverviewClass, setHoveredOverviewClass] = useState<string | null>(null);

  // Asset class colors for overview
  const assetClassColors: Record<string, string> = {
    'Real Estate': '#14B8A6',
    'Bitcoin': '#F97316',
    'Precious Metals': '#FBBF24',
    'Bonds': '#A855F7',
    'Equity': '#3B82F6',
    'Liquidity': '#06B6D4',
    'Altcoins': '#10B981'
  };

  // Static data from screenshot
  const assetClasses: AssetClass[] = [
    {
      name: 'Real Estate',
      value: 974226.95,
      percentage: 36.5,
      breakdown: [
        { source: 'ETFs', value: 0, percentage: 0, color: '#10B981' },
        { source: 'Immobilien', value: 974226.95, percentage: 100, color: '#14B8A6' }
      ]
    },
    {
      name: 'Bitcoin',
      value: 580267.64,
      percentage: 21.7,
      breakdown: [
        { source: 'Krypto', value: 197365.80, percentage: 34, color: '#EF4444' },
        { source: 'Bitcoin', value: 382901.84, percentage: 66, color: '#F97316' }
      ]
    },
    {
      name: 'Precious Metals',
      value: 580066.26,
      percentage: 21.7,
      breakdown: [
        { source: 'ETFs', value: 168219.80, percentage: 29, color: '#10B981' },
        { source: 'Edelmetalle', value: 411846.46, percentage: 71, color: '#FBBF24' }
      ]
    },
    {
      name: 'Bonds',
      value: 319993.74,
      percentage: 12.0,
      breakdown: [
        { source: 'ETFs', value: 19193.62, percentage: 6, color: '#10B981' },
        { source: 'Fonds', value: 25591.50, percentage: 8, color: '#F59E0B' },
        { source: 'Pension', value: 275208.62, percentage: 86, color: '#EC4899' }
      ]
    },
    {
      name: 'Equity',
      value: 177148.68,
      percentage: 6.6,
      breakdown: [
        { source: 'Aktien', value: 81528.39, percentage: 46, color: '#3B82F6' },
        { source: 'ETFs', value: 40764.20, percentage: 23, color: '#10B981' },
        { source: 'Fonds', value: 5314.85, percentage: 3, color: '#F59E0B' },
        { source: 'Pension', value: 47858.04, percentage: 27, color: '#EC4899' }
      ]
    },
    {
      name: 'Liquidity',
      value: 40000.00,
      percentage: 1.5,
      breakdown: [
        { source: 'Liquidität', value: 40000.00, percentage: 100, color: '#06B6D4' }
      ]
    },
    {
      name: 'Altcoins',
      value: 456.18,
      percentage: 0.0,
      breakdown: [
        { source: 'Krypto', value: 456.18, percentage: 100, color: '#EF4444' }
      ]
    }
  ];

  const totalValue = 2672159.44;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Portfolio Asset Classes Overview Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {t('portfolio.assetClassesOverview')}
            </h3>
          </div>

          {/* Main Overview Bar */}
          <div className="h-16 bg-slate-800 rounded-2xl overflow-hidden flex mb-6">
            {assetClasses.map((assetClass) => {
              const isHovered = hoveredOverviewClass === assetClass.name;
              
              return (
                <div
                  key={assetClass.name}
                  className="relative transition-all duration-300 cursor-pointer"
                  style={{
                    width: `${assetClass.percentage}%`,
                    backgroundColor: assetClassColors[assetClass.name],
                    opacity: hoveredOverviewClass && !isHovered ? 0.4 : 1,
                    transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                    filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                  }}
                  onMouseEnter={() => setHoveredOverviewClass(assetClass.name)}
                  onMouseLeave={() => setHoveredOverviewClass(null)}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {assetClasses.map((assetClass) => {
              const isHovered = hoveredOverviewClass === assetClass.name;
              
              return (
                <div
                  key={assetClass.name}
                  className="flex items-start space-x-2 cursor-pointer transition-all duration-200"
                  style={{
                    opacity: hoveredOverviewClass && !isHovered ? 0.4 : 1,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredOverviewClass(assetClass.name)}
                  onMouseLeave={() => setHoveredOverviewClass(null)}
                >
                  <div
                    className="w-4 h-4 rounded flex-shrink-0 mt-0.5"
                    style={{ 
                      backgroundColor: assetClassColors[assetClass.name],
                      boxShadow: isHovered ? '0 0 12px rgba(0,0,0,0.4)' : 'none',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {assetClass.name}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {formatCurrency(assetClass.value)}
                    </div>
                    <div className="text-xs text-slate-400">
                      ({assetClass.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Value */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-lg font-bold text-white">{t('portfolio.totalValue')}</span>
            <span className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</span>
          </div>
        </div>

        {/* Portfolio Breakdown Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {t('portfolio.assetClassesOverview')}
            </h3>
          </div>

          <div className="space-y-6">
            {assetClasses.map((assetClass) => (
              <div key={assetClass.name} className="space-y-2">
                {/* Asset Class Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">
                      {assetClass.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({assetClass.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatCurrency(assetClass.value)}
                  </span>
                </div>
                
                {/* Stacked Bar */}
                <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden flex">
                  {assetClass.breakdown.map((source, idx) => {
                    const isHovered = hoveredBreakdownSource?.assetClass === assetClass.name && 
                                     hoveredBreakdownSource?.source === source.source;
                    
                    if (source.percentage === 0) return null;
                    
                    return (
                      <div
                        key={`${assetClass.name}-${source.source}-${idx}`}
                        className="group relative transition-all duration-300 cursor-pointer"
                        style={{
                          width: `${source.percentage}%`,
                          backgroundColor: source.color,
                          opacity: hoveredBreakdownSource && !isHovered ? 0.4 : 1,
                          transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                        }}
                        onMouseEnter={() => setHoveredBreakdownSource({ assetClass: assetClass.name, source: source.source })}
                        onMouseLeave={() => setHoveredBreakdownSource(null)}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-slate-700">
                          <div className="font-semibold">{source.source}</div>
                          <div>{formatCurrency(source.value)}</div>
                          <div className="text-slate-400">{source.percentage.toFixed(0)}%</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-slate-950"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Source Legend */}
                <div className="flex flex-wrap gap-3 mt-2">
                  {assetClass.breakdown.filter(s => s.percentage > 0).map((source, idx) => {
                    const isHovered = hoveredBreakdownSource?.assetClass === assetClass.name && 
                                     hoveredBreakdownSource?.source === source.source;
                    
                    return (
                      <div 
                        key={`${assetClass.name}-legend-${idx}`} 
                        className="flex items-center space-x-1.5 cursor-pointer transition-all duration-200"
                        style={{
                          opacity: hoveredBreakdownSource && !isHovered ? 0.4 : 1,
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredBreakdownSource({ assetClass: assetClass.name, source: source.source })}
                        onMouseLeave={() => setHoveredBreakdownSource(null)}
                      >
                        <div
                          className="w-3 h-3 rounded-sm transition-all duration-200"
                          style={{ 
                            backgroundColor: source.color,
                            boxShadow: isHovered ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                          }}
                        />
                        <span 
                          className="text-xs text-slate-400 transition-all duration-200"
                          style={{
                            fontWeight: isHovered ? 600 : 400,
                          }}
                        >
                          {source.source} ({source.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioShowcase;
