import React, { useState } from 'react';
import { Coins, DollarSign, TrendingUp, Sparkles, Check } from 'lucide-react';

const CurrencyShowcase: React.FC = () => {
  const [budgetCurrency, setBudgetCurrency] = useState('CHF - Schweizer Franken');
  const [portfolioCurrency, setPortfolioCurrency] = useState('CHF - Schweizer Franken');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CHF', name: 'Schweizer Franken' },
    { code: 'GBP', name: 'Britisches Pfund' },
    { code: 'JPY', name: 'Japanischer Yen' },
    { code: 'CAD', name: 'Kanadischer Dollar' },
    { code: 'AUD', name: 'Australischer Dollar' },
    { code: 'CNY', name: 'Chinesischer Yuan' },
    { code: 'INR', name: 'Indische Rupie' },
    { code: 'KRW', name: 'Südkoreanischer Won' },
    { code: 'BTC', name: 'Bitcoin' }
  ];

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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Multi-Currency Support</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Separate Währungen für Portfolio & Budget
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Verwalten Sie Ihr Portfolio in einer Währung und Ihr Budget in einer anderen. 
            Automatische Umrechnung mit aktuellen Wechselkursen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Currency Settings Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-500 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Currency Settings</h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-slate-400 text-sm mb-6">
                Choose the currencies for your budget and portfolio planning.
              </p>

              {/* Budget Currency */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-3">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget Currency *</span>
                </label>
                <div className="relative">
                  <select 
                    value={budgetCurrency}
                    onChange={(e) => setBudgetCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <option disabled>Please select a currency...</option>
                    {currencies.map((curr) => (
                      <option key={curr.code} value={`${curr.code} - ${curr.name}`}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Currency for budgets, expenses and income</p>
              </div>

              {/* Portfolio Currency */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Portfolio Currency *</span>
                </label>
                <div className="relative">
                  <select 
                    value={portfolioCurrency}
                    onChange={(e) => setPortfolioCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <option disabled>Please select a currency...</option>
                    {currencies.map((curr) => (
                      <option key={curr.code} value={`${curr.code} - ${curr.name}`}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Currency for portfolios, investments and assets</p>
              </div>
            </div>
          </div>

          {/* Available Currencies Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Verfügbare Währungen</h3>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-2">
                {currencies.map((curr, index) => (
                  <div 
                    key={curr.code}
                    className="flex items-center space-x-3 p-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      curr.code === 'BTC' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    }`}>
                      {curr.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white text-sm truncate">{curr.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">11+ Währungen</h3>
            <p className="text-sm text-slate-400">
              Unterstützung für USD, EUR, CHF, GBP, JPY und mehr - inklusive Bitcoin
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Live Wechselkurse</h3>
            <p className="text-sm text-slate-400">
              Automatische Umrechnung mit aktuellen Wechselkursen in Echtzeit
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Separate Budgets</h3>
            <p className="text-sm text-slate-400">
              Verwalten Sie Portfolio und Budget in unterschiedlichen Währungen
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CurrencyShowcase;
