import React, { useState } from 'react';
import { Shield, TrendingUp, Key, Lock, AlertTriangle, CheckCircle, BarChart3, PieChart, Wallet, Building } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import MobileOptimizedTable from './MobileOptimizedTable';
import ViewportAlert from './ViewportAlert';

const SelfCustodyShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'overview' | 'comparison' | 'benefits'>('overview');

  const formatCurrency = (value: number, currency: string = 'CHF') => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Asset distribution data from the screenshot
  const assetDistribution = {
    selfCustody: 311824.16,
    thirdPartyCustody: 431662.46,
    pension: 834000.00,
    realEstate: 1100000.00,
    totalAssets: 3477486.62,
    netWorth: 2452486.62,
    liabilities: 1025000.00
  };

  const custodyComparison = [
    {
      aspect: t('selfCustody.comparison.control.aspect'),
      selfCustody: t('selfCustody.comparison.control.self'),
      thirdParty: t('selfCustody.comparison.control.thirdParty'),
      advantage: 'self'
    },
    {
      aspect: t('selfCustody.comparison.privacy.aspect'),
      selfCustody: t('selfCustody.comparison.privacy.self'),
      thirdParty: t('selfCustody.comparison.privacy.thirdParty'),
      advantage: 'self'
    },
    {
      aspect: t('selfCustody.comparison.costs.aspect'),
      selfCustody: t('selfCustody.comparison.costs.self'),
      thirdParty: t('selfCustody.comparison.costs.thirdParty'),
      advantage: 'self'
    },
    {
      aspect: t('selfCustody.comparison.security.aspect'),
      selfCustody: t('selfCustody.comparison.security.self'),
      thirdParty: t('selfCustody.comparison.security.thirdParty'),
      advantage: 'depends'
    },
    {
      aspect: t('selfCustody.comparison.complexity.aspect'),
      selfCustody: t('selfCustody.comparison.complexity.self'),
      thirdParty: t('selfCustody.comparison.complexity.thirdParty'),
      advantage: 'thirdParty'
    },
    {
      aspect: t('selfCustody.comparison.censorship.aspect'),
      selfCustody: t('selfCustody.comparison.censorship.self'),
      thirdParty: t('selfCustody.comparison.censorship.thirdParty'),
      advantage: 'self'
    }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent)`,
          backgroundSize: '200px 200px, 250px 250px, 150px 150px, 180px 180px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px',
          opacity: 0.3
        }} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5 mr-2" />
            {t('selfCustody.badge')}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('selfCustody.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t('selfCustody.subtitle')}
          </p>
        </div>

        {/* View Toggle - Stacked on mobile, horizontal on tablet+ */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>{t('selfCustody.tabs.overview')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'comparison'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t('selfCustody.tabs.comparison')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('benefits')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'benefits'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t('selfCustody.tabs.benefits')}</span>
            </div>
          </button>
        </div>

        {/* Content Views */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Wealth Overview Replica */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">{t('selfCustody.wealthOverview.title')}</h3>
              </div>
              
              {/* Net Worth */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-white mr-2" />
                  <span className="text-white font-medium">{t('selfCustody.wealthOverview.netWorth')}</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(assetDistribution.netWorth)} Fr
                </div>
              </div>

              {/* Assets and Liabilities */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-400 font-medium">{t('selfCustody.wealthOverview.totalAssets')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(assetDistribution.totalAssets)} Fr
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-400 font-medium">{t('selfCustody.wealthOverview.totalLiabilities')}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">
                    {formatCurrency(assetDistribution.liabilities)} Fr
                  </div>
                </div>
              </div>

              {/* Asset Distribution */}
              <div>
                <h4 className="text-xl font-bold text-white mb-4">{t('selfCustody.wealthOverview.assetDistribution')}</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-xl p-6 relative">
                    <div className="absolute top-3 right-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-blue-400 font-semibold mb-2">{t('selfCustody.wealthOverview.selfCustody')}</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatCurrency(assetDistribution.selfCustody)} Fr
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 relative">
                    <div className="absolute top-3 right-3">
                      <Building className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-green-400 font-semibold mb-2">{t('selfCustody.wealthOverview.thirdPartyCustody')}</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(assetDistribution.thirdPartyCustody)} Fr
                    </div>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="text-purple-400 font-semibold mb-2">{t('selfCustody.wealthOverview.pension')}</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {formatCurrency(assetDistribution.pension)} Fr
                    </div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-6">
                    <div className="text-orange-400 font-semibold mb-2">{t('selfCustody.wealthOverview.realEstate')}</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {formatCurrency(assetDistribution.realEstate)} Fr
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'comparison' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">{t('selfCustody.comparison.title')}</h3>
            </div>
            
            {/* Mobile viewport alert */}
            <ViewportAlert 
              showOn="tablet" 
              message={t('common.comparisonTableBetterOnDesktop')}
              className="mb-6"
            />
            
            <MobileOptimizedTable
              columns={[
                {
                  header: t('selfCustody.comparison.headers.aspect'),
                  key: 'aspect',
                  mobileLabel: t('selfCustody.comparison.headers.aspect')
                },
                {
                  header: (
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {t('selfCustody.comparison.headers.selfCustody')}
                    </div>
                  ) as any,
                  key: 'selfCustody',
                  mobileLabel: t('selfCustody.comparison.headers.selfCustody'),
                  render: (value, row) => (
                    <span className={row.advantage === 'self' ? 'text-blue-300 font-semibold' : 'text-slate-400'}>
                      {value}
                      {row.advantage === 'self' && <CheckCircle className="w-4 h-4 ml-2 inline text-blue-400" />}
                    </span>
                  )
                },
                {
                  header: (
                    <div className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      {t('selfCustody.comparison.headers.thirdParty')}
                    </div>
                  ) as any,
                  key: 'thirdParty',
                  mobileLabel: t('selfCustody.comparison.headers.thirdParty'),
                  render: (value, row) => (
                    <span className={row.advantage === 'thirdParty' ? 'text-green-300 font-semibold' : 'text-slate-400'}>
                      {value}
                      {row.advantage === 'thirdParty' && <CheckCircle className="w-4 h-4 ml-2 inline text-green-400" />}
                    </span>
                  )
                }
              ]}
              data={custodyComparison}
            />
          </div>
        )}

        {activeView === 'benefits' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">{t('selfCustody.benefits.title')}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Shield className="w-6 h-6 text-blue-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.fullControl.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.fullControl.description')}</p>
                  </div>
                  
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Lock className="w-6 h-6 text-green-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.privacy.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.privacy.description')}</p>
                  </div>
                  
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="w-6 h-6 text-purple-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.noFees.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.noFees.description')}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Key className="w-6 h-6 text-orange-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.sovereignty.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.sovereignty.description')}</p>
                  </div>
                  
                  <div className="bg-slate-600/20 border border-slate-600/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.responsibility.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.responsibility.description')}</p>
                  </div>
                  
                  <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <Wallet className="w-6 h-6 text-indigo-400 mr-3" />
                      <h4 className="text-lg font-semibold text-white">{t('selfCustody.benefits.technology.title')}</h4>
                    </div>
                    <p className="text-slate-300">{t('selfCustody.benefits.technology.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfCustodyShowcase;