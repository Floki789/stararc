import React, { useState } from 'react';
import { Home, Building } from 'lucide-react';

interface Mortgage {
  bank: string;
  balance: number;
  interestRate: number;
  type: string;
  termUntil: string;
  annualInterestCosts: number;
}

const RealEstateShowcase: React.FC = () => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Static data from screenshot
  const propertyName = "Cobblestone Way";
  const propertyType = "Self-Occupied";
  const financingType = "Financing";
  const totalValue = 1200000.00;
  const equity = 650000.00;
  const netWorth = 650000.00;

  const mortgages: Mortgage[] = [
    {
      bank: "UBS Switzerland",
      balance: 200000.00,
      interestRate: 1.03,
      type: "Fixed-Rate Mortgage",
      termUntil: "19.3.2030",
      annualInterestCosts: 2060.00
    },
    {
      bank: "UBS Switzerland",
      balance: 200000.00,
      interestRate: 1.09,
      type: "Fixed-Rate Mortgage",
      termUntil: "23.6.2028",
      annualInterestCosts: 2180.00
    },
    {
      bank: "UBS Switzerland",
      balance: 150000.00,
      interestRate: 2.37,
      type: "Fixed-Rate Mortgage",
      termUntil: "21.6.2028",
      annualInterestCosts: 3555.00
    }
  ];

  const financingBreakdown = [
    { name: 'Equity', value: equity, percentage: 54.2, color: '#10B981' },
    { name: 'Mortgage 1', value: 200000.00, percentage: 16.7, color: '#F97316' },
    { name: 'Mortgage 2', value: 200000.00, percentage: 16.7, color: '#FBBF24' },
    { name: 'Mortgage 3', value: 150000.00, percentage: 12.5, color: '#10B981' }
  ];

  // Pie slice creator (similar to spaceship CockpitWealth)
  const createPieSlice = (percentage: number, startAngle: number) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Immobilien-Portfolio Management
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Verwalten Sie Ihre Immobilien mit detaillierten Finanzierungsübersichten und automatischer Hypotheken-Verwaltung
          </p>
        </div>

        {/* Property Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          
          {/* Property Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{propertyName}</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <span>🏠 {propertyType}</span>
                  <span>•</span>
                  <span>{financingType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Left: Pie Chart */}
              <div className="flex flex-col items-center justify-center">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {financingBreakdown.map((item, index) => {
                    const startAngle = financingBreakdown
                      .slice(0, index)
                      .reduce((acc, curr) => acc + (curr.percentage / 100) * 360, 0) - 90; // Start from top
                    
                    const path = createPieSlice(item.percentage, startAngle);
                    const isHovered = hoveredSegment === item.name;
                    
                    return (
                      <path
                        key={index}
                        d={path}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="2"
                        style={{
                          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                          transformOrigin: '100px 100px',
                          transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out, opacity 0.3s ease-in-out',
                          filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1)' : 'none',
                          opacity: hoveredSegment && !isHovered ? 0.3 : 1,
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredSegment(item.name)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    );
                  })}
                </svg>
                {/* Chart Labels Below */}
                <div className="text-center mt-4">
                  <div className="text-sm text-slate-400 mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</div>
                  <div className="text-sm text-slate-400 mt-2">Net Worth: <span className="text-green-400 font-semibold">{formatCurrency(netWorth)}</span></div>
                </div>
              </div>

              {/* Right: Breakdown Legend */}
              <div className="flex flex-col justify-center space-y-4">
                {financingBreakdown.map((item, index) => {
                  const isHovered = hoveredSegment === item.name;
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all duration-300 cursor-pointer"
                      style={{
                        opacity: hoveredSegment && !isHovered ? 0.4 : 1,
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredSegment(item.name)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{item.percentage}%</div>
                        <div className="text-sm text-slate-400">{formatCurrency(item.value)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mortgage Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mortgages.map((mortgage, index) => {
                const mortgageName = `Mortgage ${index + 1}`;
                const isHovered = hoveredSegment === mortgageName;
                
                return (
                  <div 
                    key={index} 
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: isHovered ? 'rgba(51, 65, 85, 0.8)' : 'rgba(51, 65, 85, 0.5)',
                      borderColor: isHovered ? financingBreakdown.find(item => item.name === mortgageName)?.color : 'rgb(51, 65, 85)',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.3)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredSegment(mortgageName)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">{mortgage.bank}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Balance</div>
                        <div className="text-base font-semibold text-white">{formatCurrency(mortgage.balance)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Interest Rate</div>
                        <div className="text-base font-semibold text-white">{mortgage.interestRate}% p.a.</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Type</div>
                        <div className="text-sm text-white">{mortgage.type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Term Until</div>
                        <div className="text-sm text-white">{mortgage.termUntil}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Annual Interest Costs</div>
                      <div className="text-lg font-bold text-orange-400">{formatCurrency(mortgage.annualInterestCosts)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Immobilien-Portfolio</h3>
            <p className="text-sm text-slate-400">
              Verwalten Sie mehrere Immobilien mit detaillierten Finanzierungsstrukturen und Equity-Tracking
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hypotheken-Management</h3>
            <p className="text-sm text-slate-400">
              Übersicht über alle Hypotheken mit Zinssätzen, Laufzeiten und automatischer Kostenberechnung
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Equity Tracking</h3>
            <p className="text-sm text-slate-400">
              Visualisierung des Eigenkapitalanteils und automatische Berechnung des Nettovermögens
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RealEstateShowcase;
