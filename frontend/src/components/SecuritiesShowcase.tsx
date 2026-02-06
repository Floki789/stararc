import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ViewportAlert from './ViewportAlert';
import MobileOptimizedTable from './MobileOptimizedTable';

interface Security {
  name: string;
  symbol: string;
  isin?: string;
  type: string;
  quantity: number;
  rate: number;
  currency: string;
  custodianBank: string;
  sum: number;
  sumCHF: number;
}

const SecuritiesShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'stocks' | 'etfs' | 'funds'>('stocks');

  const formatCurrency = (value: number, currency: string = 'CHF') => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Static data from screenshots
  const stocks: Security[] = [
    { name: 'Apple Inc', symbol: 'AAPL.US', type: 'Equity', quantity: 70, rate: 255.53, currency: 'USD', custodianBank: 'Swissquote', sum: 17887.10, sumCHF: 14130.81 },
    { name: 'MSTR', symbol: 'MSTR.US', type: 'Equity', quantity: 18, rate: 173.71, currency: 'USD', custodianBank: 'Swissquote', sum: 2920.14, sumCHF: 2306.91 },
    { name: 'ZURICH INSURANCE N', symbol: 'ZURN.SW', isin: 'CH0011075394', type: 'Equity', quantity: 10, rate: 577.20, currency: 'CHF', custodianBank: 'Swissquote', sum: 5728.00, sumCHF: 5728.00 },
    { name: 'TESLA ORD', symbol: 'TSLA.US', isin: 'US88160R1014', type: 'Equity', quantity: 30, rate: 437.50, currency: 'USD', custodianBank: 'Swissquote', sum: 13468.80, sumCHF: 10640.35 },
    { name: 'TAIWAN SEMICONDUCTOR', symbol: 'TSM.US', isin: 'US8740391003', type: 'Equity', quantity: 20, rate: 342.40, currency: 'USD', custodianBank: 'Swissquote', sum: 6848.00, sumCHF: 5409.92 },
    { name: 'AIR LIQUIDE ORD', symbol: 'AIL.XETRA', isin: 'FR0000120073', type: 'Equity', quantity: 50, rate: 159.18, currency: 'EUR', custodianBank: 'Swissquote', sum: 7959.00, sumCHF: 7401.87 }
  ];

  const etfs: Security[] = [
    { name: 'Swisscanto (CH) Gold ETF AA CHF DIS', symbol: 'ZGLD.SW', isin: 'CH0139101593', type: 'P-Metals', quantity: 30, rate: 1092.80, currency: 'CHF', custodianBank: 'Swissquote', sum: 32784.00, sumCHF: 32784.00 },
    { name: 'Swisscanto (CH) Silver ETF AA CHF DIS', symbol: 'ZSIL.SW', isin: 'CH0183135976', type: 'P-Metals', quantity: 100, rate: 203.05, currency: 'CHF', custodianBank: 'Swissquote', sum: 20305.00, sumCHF: 20305.00 },
    { name: 'ARK Space & Defense Innovation ETF', symbol: 'ARKX.US', isin: 'US00214Q8078', type: 'Other', quantity: 477, rate: 35.17, currency: 'USD', custodianBank: 'Swissquote', sum: 16776.09, sumCHF: 13253.11 },
    { name: 'UBS Core MSCI World UCITS ETF USD acc', symbol: 'WRDUSW.SW', isin: 'IE00BD4TXV59', type: 'Equity', quantity: 410, rate: 33.23, currency: 'USD', custodianBank: 'Swissquote', sum: 13624.30, sumCHF: 10763.20 },
    { name: 'WisdomTree Issuer ICAV-us Equity Income', symbol: 'DHSA.LSE', isin: 'IE00BD6RZT93', type: 'Equity', quantity: 326, rate: 35.24, currency: 'USD', custodianBank: 'Swissquote', sum: 11488.24, sumCHF: 9075.71 }
  ];

  const funds: Security[] = [
    { name: 'Strategie LUKB Balanced', symbol: 'CH0002773411', type: 'Moderate', quantity: 100, rate: 234.50, currency: 'CHF', custodianBank: 'Luzerner Kantonalbank', sum: 23450.00, sumCHF: 23450.00 }
  ];

  const getActiveData = () => {
    switch (activeTab) {
      case 'stocks': return { data: stocks, total: 45449.91, count: 6 };
      case 'etfs': return { data: etfs, total: 199216.77, count: 23 };
      case 'funds': return { data: funds, total: 23450.00, count: 1 };
    }
  };

  const activeData = getActiveData();

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('portfolio.securities.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t('portfolio.securities.subtitle')}
          </p>
        </div>

        {/* Tabs - Stacked on mobile, horizontal on tablet+ */}
        <div className="flex flex-col md:flex-row justify-center mb-8 gap-3 md:gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'stocks'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>{t('portfolio.securities.stocks')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('etfs')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'etfs'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t('portfolio.securities.etfs')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('funds')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'funds'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>{t('portfolio.securities.funds')}</span>
            </div>
          </button>
        </div>

        {/* Securities Table Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Mobile Alert */}
          <div className="p-4 lg:hidden">
            <ViewportAlert 
              showOn="tablet"
              message="common.securitiesTableBetterOnDesktop"
            />
          </div>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 md:px-8 py-4 md:py-6 border-b border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeTab === 'stocks' ? 'bg-gradient-to-br from-blue-600 to-blue-500' :
                  activeTab === 'etfs' ? 'bg-gradient-to-br from-purple-600 to-purple-500' :
                  'bg-gradient-to-br from-green-600 to-green-500'
                }`}>
                  {activeTab === 'stocks' && <TrendingUp className="w-5 h-5 text-white" />}
                  {activeTab === 'etfs' && <BarChart3 className="w-5 h-5 text-white" />}
                  {activeTab === 'funds' && <PieChart className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeTab === 'stocks' && 'Stocks'}
                    {activeTab === 'etfs' && 'ETFs'}
                    {activeTab === 'funds' && 'Funds'}
                  </h3>
                  <p className="text-sm text-slate-400">{activeData.count} {activeData.count === 1 ? 'title' : 'titles'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">{t('portfolio.securities.totalValue')}</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(activeData.total, 'CHF')}
                </div>
              </div>
            </div>
          </div>

          {/* Table - Desktop table, Mobile cards */}
          <MobileOptimizedTable
            columns={[
              {
                header: t('tableHeaders.nameSymbol'),
                key: 'name',
                mobileLabel: 'Security',
                render: (_value, row) => (
                  <div>
                    <div className="font-semibold text-white text-sm">{row.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{row.symbol}</div>
                    {row.isin && (
                      <div className="text-xs text-slate-600 font-mono mt-0.5">{row.isin}</div>
                    )}
                  </div>
                )
              },
              {
                header: t('portfolio.securities.tableHeaders.type'),
                key: 'type',
                render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    value === 'Equity' ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' :
                    value === 'P-Metals' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50' :
                    value === 'Moderate' ? 'bg-green-900/30 text-green-300 border border-green-800/50' :
                    'bg-slate-800/50 text-slate-300 border border-slate-700/50'
                  }`}>
                    {value}
                  </span>
                )
              },
              {
                header: t('portfolio.securities.tableHeaders.quantity'),
                key: 'quantity',
                render: (value) => <span className="font-mono">{value}</span>
              },
              {
                header: t('portfolio.securities.tableHeaders.rate'),
                key: 'rate',
                render: (value, row) => (
                  <div>
                    <div className="font-mono">{value.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{row.currency}</div>
                  </div>
                )
              },
              {
                header: t('portfolio.securities.tableHeaders.custodianBank'),
                key: 'custodianBank'
              },
              {
                header: t('portfolio.securities.tableHeaders.sumCHF'),
                key: 'sumCHF',
                render: (value) => (
                  <span className="font-semibold">{formatCurrency(value, 'CHF')}</span>
                )
              }
            ]}
            data={activeData.data}
            className="px-4 md:px-0"
          />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('securities.features.livePricing.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('securities.features.livePricing.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('securities.features.multiCurrency.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('securities.features.multiCurrency.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('portfolio.securities.performanceTracking')}</h3>
            <p className="text-sm text-slate-400">
              {t('securities.features.performanceTracking.description')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecuritiesShowcase;
