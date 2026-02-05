import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, TrendingDown, Home, Banknote, Wallet, Target } from 'lucide-react';

const RetirementShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activePhase, setActivePhase] = useState<'accumulation' | 'transition' | 'retirement'>('retirement');

  return (
    <div className="relative py-20 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent)`,
          backgroundSize: '200px 200px, 250px 250px, 150px 150px, 180px 180px, 220px 220px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 20px 180px',
          opacity: 0.3
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('homepage.retirementShowcase.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('homepage.retirementShowcase.subtitle')}
          </p>
        </div>

        {/* Life Phase Timeline */}
        <div className="mb-16">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {t('homepage.retirementShowcase.timeline.title')}
            </h3>
            
            {/* Phase Selector - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row justify-center mb-8 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                { key: 'accumulation', icon: TrendingDown, color: 'from-green-600 to-emerald-600' },
                { key: 'transition', icon: Calendar, color: 'from-yellow-600 to-orange-600' },
                { key: 'retirement', icon: Wallet, color: 'from-purple-600 to-pink-600' }
              ].map((phase) => (
                <button
                  key={phase.key}
                  onClick={() => setActivePhase(phase.key as any)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto ${
                    activePhase === phase.key
                      ? `bg-gradient-to-r ${phase.color} text-white shadow-lg transform scale-105`
                      : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <phase.icon className="w-5 h-5" />
                  {t(`homepage.retirementShowcase.timeline.phases.${phase.key}`)}
                </button>
              ))}
            </div>

            {/* Timeline Visualization */}
            <div className="relative h-32 bg-slate-800/50 rounded-xl mb-8">
              <div className="absolute inset-0 flex items-center px-8">
                {/* Timeline bars */}
                <div className="flex-1 flex gap-2 h-16">
                  <div className={`flex-1 rounded-lg transition-all ${
                    activePhase === 'accumulation' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg' 
                      : 'bg-green-600/30'
                  }`}></div>
                  <div className={`flex-1 rounded-lg transition-all ${
                    activePhase === 'transition' 
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 shadow-lg' 
                      : 'bg-yellow-600/30'
                  }`}></div>
                  <div className={`flex-1 rounded-lg transition-all ${
                    activePhase === 'retirement' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                      : 'bg-purple-600/30'
                  }`}></div>
                </div>
              </div>
              
              {/* Age markers */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-around px-8 text-sm text-gray-400">
                <span>25</span>
                <span>45</span>
                <span className="font-bold text-orange-400">58 - 65</span>
                <span>85+</span>
              </div>
            </div>

            {/* Phase Description */}
            <div className="text-center text-gray-300">
              {t(`homepage.retirementShowcase.timeline.descriptions.${activePhase}`)}
            </div>
          </div>
        </div>

        {/* Capital Withdrawals Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Withdrawal Events */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t('homepage.retirementShowcase.withdrawals.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {t('homepage.retirementShowcase.withdrawals.subtitle')}
                </p>
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-3">
              {[
                { age: 58, type: 'pillar3', amount: '180\'000', color: 'purple' },
                { age: 60, type: 'pillar2_partial', amount: '250\'000', color: 'violet' },
                { age: 63, type: 'pillar2_full', amount: '520\'000', color: 'indigo' },
                { age: 65, type: 'ahv_start', amount: '2\'400/mo', color: 'blue' }
              ].map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-12 rounded-full bg-${event.color}-500`}></div>
                    <div>
                      <div className="text-white font-semibold">
                        {t(`homepage.retirementShowcase.withdrawals.events.${event.type}`)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t('homepage.retirementShowcase.withdrawals.atAge', { age: event.age })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">CHF {event.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Allocation After Withdrawal */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t('homepage.retirementShowcase.allocation.title')}
                </h3>
                <p className="text-sm text-gray-400">
                  {t('homepage.retirementShowcase.allocation.subtitle')}
                </p>
              </div>
            </div>

            {/* Allocation Bars */}
            <div className="space-y-4 mb-6">
              {[
                { label: 'Liquidity', value: 35, color: 'bg-blue-500' },
                { label: 'Securities', value: 30, color: 'bg-cyan-500' },
                { label: 'Real Estate', value: 25, color: 'bg-slate-400' },
                { label: 'Bitcoin', value: 10, color: 'bg-orange-500' }
              ].map((asset, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{asset.label}</span>
                    <span className="text-white font-semibold">{asset.value}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${asset.color} transition-all duration-1000`}
                      style={{ width: `${asset.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-400 bg-slate-800/50 p-4 rounded-lg">
              {t('homepage.retirementShowcase.allocation.description')}
            </div>
          </div>
        </div>

        {/* Special Events */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {t('homepage.retirementShowcase.events.title')}
              </h3>
              <p className="text-gray-400">
                {t('homepage.retirementShowcase.events.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: Home, 
                titleKey: 'mortgagePayoff',
                age: 65,
                amount: '450\'000',
                color: 'from-orange-500 to-red-500'
              },
              { 
                icon: Banknote, 
                titleKey: 'loanRepayment',
                age: 62,
                amount: '80\'000',
                color: 'from-yellow-500 to-orange-500'
              },
              { 
                icon: Home, 
                titleKey: 'propertyPurchase',
                age: 68,
                amount: '750\'000',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((event, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${event.color} mb-4`}>
                  <event.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {t(`homepage.retirementShowcase.events.types.${event.titleKey}`)}
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">CHF {event.amount}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {t('homepage.retirementShowcase.events.plannedAge', { age: event.age })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Calendar,
              title: t('homepage.retirementShowcase.features.phaseBasedPlanning.title'),
              description: t('homepage.retirementShowcase.features.phaseBasedPlanning.description'),
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: Banknote,
              title: t('homepage.retirementShowcase.features.capitalWithdrawals.title'),
              description: t('homepage.retirementShowcase.features.capitalWithdrawals.description'),
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Target,
              title: t('homepage.retirementShowcase.features.allocationSimulation.title'),
              description: t('homepage.retirementShowcase.features.allocationSimulation.description'),
              gradient: 'from-cyan-500 to-teal-500'
            },
            {
              icon: Home,
              title: t('homepage.retirementShowcase.features.eventPlanning.title'),
              description: t('homepage.retirementShowcase.features.eventPlanning.description'),
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: TrendingDown,
              title: t('homepage.retirementShowcase.features.drawdownStrategy.title'),
              description: t('homepage.retirementShowcase.features.drawdownStrategy.description'),
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: Wallet,
              title: t('homepage.retirementShowcase.features.sustainabilityAnalysis.title'),
              description: t('homepage.retirementShowcase.features.sustainabilityAnalysis.description'),
              gradient: 'from-indigo-500 to-purple-500'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-300 text-lg mb-6">
            {t('homepage.retirementShowcase.cta.message')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {t('homepage.retirementShowcase.cta.startButton')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#plans"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
            >
              {t('homepage.retirementShowcase.cta.plansButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementShowcase;
