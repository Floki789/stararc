import React from 'react';
import { Shield, Users, TrendingUp, Sparkles, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ViewportAlert from './ViewportAlert';

const PensionShowcase: React.FC = () => {
  const { t } = useLanguage();
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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">{t('pension.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('pension.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('pension.subtitle')}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Header with totals */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('pension.pensionSection')}</h3>
                  <p className="text-sm text-slate-400">Retirement provisions, insurance & security</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-1">
                  <span className="inline-block mr-4">{t('pension.privateVorsorge')}: <span className="text-white font-semibold">34,000.00 {t('pension.totalAmount')}</span></span>
                  <span className="inline-block">{t('pension.beruflicheVorsorge')}: <span className="text-white font-semibold">800,000.00 {t('pension.totalAmount')}</span></span>
                </div>
                <ChevronDown className="w-5 h-5 text-emerald-400 ml-auto" />
              </div>
            </div>
          </div>

          {/* Pension Section */}
          <div className="bg-slate-800/30 border-b border-slate-700">
            <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Pension</h4>
                  <p className="text-xs text-slate-400">Individual securities, stocks, ETFs, etc.</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl md:text-2xl font-bold text-white">834,000.00 {t('pension.totalAmount')}</div>
                <div className="text-xs text-slate-400">4 {t('pension.accountsCount')}</div>
              </div>
            </div>
          </div>

          {/* Mobile Alert */}
          <div className="p-4 lg:hidden">
            <ViewportAlert 
              showOn="tablet"
              message="common.securitiesTableBetterOnDesktop"
            />
          </div>

          {/* Desktop Table */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-8 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>{t('pension.tableHeaders.planName')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>{t('pension.tableHeaders.provider')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>{t('pension.tableHeaders.pensionType')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center justify-end space-x-2">
                      <span>{t('pension.tableHeaders.currentBalance')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-center py-4 px-8 text-xs font-semibold text-slate-400 uppercase">{t('pension.tableHeaders.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { name: t('pension.accounts.wilmaPilar3'), provider: t('pension.providers.luzerner'), type: t('pension.pensionTypes.privateVorsorge'), balance: '12,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: t('pension.accounts.fredPilar3'), provider: t('pension.providers.luzerner'), type: t('pension.pensionTypes.privateVorsorge'), balance: '22,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: t('pension.accounts.wilmaPilar2'), provider: t('pension.providers.pensionWilma'), type: t('pension.pensionTypes.beruflicheVorsorge'), balance: '500,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: t('pension.accounts.fredPilar2'), provider: t('pension.providers.pensionFred'), type: t('pension.pensionTypes.beruflicheVorsorge'), balance: '300,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' }
                ].map((account, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-8">
                      <div className="font-semibold text-white">{account.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{account.provider}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${account.typeColor}`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-mono text-lg font-semibold text-blue-400">{account.balance}</div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {[
              { name: t('pension.accounts.wilmaPilar3'), provider: t('pension.providers.luzerner'), type: t('pension.pensionTypes.privateVorsorge'), balance: '12,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
              { name: t('pension.accounts.fredPilar3'), provider: t('pension.providers.luzerner'), type: t('pension.pensionTypes.privateVorsorge'), balance: '22,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
              { name: t('pension.accounts.wilmaPilar2'), provider: t('pension.providers.pensionWilma'), type: t('pension.pensionTypes.beruflicheVorsorge'), balance: '500,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
              { name: t('pension.accounts.fredPilar2'), provider: t('pension.providers.pensionFred'), type: t('pension.pensionTypes.beruflicheVorsorge'), balance: '300,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' }
            ].map((account, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-3 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg mb-1">{account.name}</div>
                    <div className="text-sm text-slate-300">{account.provider}</div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${account.typeColor}`}>
                    {account.type}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-sm text-slate-400">Current Balance:</span>
                  <span className="font-mono text-lg font-semibold text-blue-400">{account.balance}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Account Button */}
          <div className="border-t border-dashed border-slate-700 p-6">
            <button className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center justify-center space-x-2 text-slate-300 hover:text-white">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">{t('pension.addAccount')}</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('pension.highlights.saeulenSystem')}</h3>
            <p className="text-sm text-slate-400">
              Überblick über Pilar 1 (AHV), Pilar 2 (beruflich) und Pilar 3 (privat)
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('pension.highlights.mehrereKonten')}</h3>
            <p className="text-sm text-slate-400">
              Verwalten Sie verschiedene Pensionskassen und 3a-Konten zentral
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('pension.highlights.familiePartner')}</h3>
            <p className="text-sm text-slate-400">
              Gemeinsame Übersicht über alle Altersvorsorge-Konten der Familie
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PensionShowcase;
