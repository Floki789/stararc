import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, LineChart } from 'lucide-react';
import ViewportAlert from './ViewportAlert';

const PlanningShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'withdrawals' | 'montecarlo'>('withdrawals');

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 70% 80%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 40% 60%, rgba(147, 197, 253, 0.8), transparent)`,
          backgroundSize: '300px 300px, 280px 280px, 320px 320px',
          backgroundPosition: '50px 50px, 180px 180px, 20px 200px',
          opacity: 0.4
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('homepage.planningShowcase.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('homepage.planningShowcase.subtitle')}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
            <button
              onClick={() => setActiveView('withdrawals')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeView === 'withdrawals'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              {t('homepage.planningShowcase.views.capitalWithdrawals')}
            </button>
            <button
              onClick={() => setActiveView('montecarlo')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeView === 'montecarlo'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LineChart className="w-5 h-5" />
              {t('homepage.planningShowcase.views.monteCarloSimulation')}
            </button>
          </div>
        </div>

        {/* Capital Withdrawals View */}
        {activeView === 'withdrawals' && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden mb-16">
            {/* Mobile Alert */}
            <div className="p-4 md:p-6">
              <ViewportAlert 
                showOn="tablet"
                message={t('common.chartsBetterOnDesktop', 'Financial charts are best viewed on larger screens for full detail.')}
              />
            </div>
            
            {/* Chart Header - Blue Theme */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t('homepage.planningShowcase.capitalWithdrawals.title')}
                  </h3>
                  <p className="text-blue-100">
                    {t('homepage.planningShowcase.capitalWithdrawals.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="bg-slate-800/80 p-4 border-b border-slate-700/50">
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{t('homepage.planningShowcase.capitalWithdrawals.controls.growthScenario')}:</span>
                  <span className="px-3 py-1 bg-slate-700 text-white rounded-lg">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{t('homepage.planningShowcase.capitalWithdrawals.controls.inflationScenario')}:</span>
                  <span className="px-3 py-1 bg-slate-700 text-white rounded-lg">2.00%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{t('homepage.planningShowcase.capitalWithdrawals.controls.timeframe')}:</span>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">45 Years</span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-8 bg-slate-900/80">
              <div className="relative h-96 bg-slate-800/50 rounded-xl p-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-gray-500 text-xs pr-2">
                  <span>3M</span>
                  <span>2.5M</span>
                  <span>2M</span>
                  <span>1.5M</span>
                  <span>750K</span>
                  <span>0</span>
                </div>

                {/* Chart content - Stacked Area visualization */}
                <div className="ml-12 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border-t border-slate-700/30"></div>
                    ))}
                  </div>

                  {/* Year markers */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-gray-500 text-xs pt-2">
                    <span>2026</span>
                    <span>2030</span>
                    <span>2034</span>
                    <span>2038</span>
                    <span>2042</span>
                    <span>2046</span>
                    <span>2050</span>
                    <span>2054</span>
                    <span>2058</span>
                    <span>2062</span>
                    <span>2066</span>
                    <span>2070</span>
                  </div>

                  {/* Stacked areas - smooth growth with gradual asset depletion */}
                  <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {/* Real Estate - Bottom layer (grey), steady growth */}
                    <path d="M 0 270 Q 250 265, 500 255 Q 750 245, 1000 235 L 1000 300 L 0 300 Z" 
                          fill="rgba(203, 213, 225, 0.4)" />
                    
                    {/* Bitcoin & Crypto - (orange), moderate growth */}
                    <path d="M 0 250 Q 250 240, 500 225 Q 750 210, 1000 195 L 1000 235 Q 750 245, 500 255 Q 250 265, 0 270 Z" 
                          fill="rgba(251, 146, 60, 0.4)" />
                    
                    {/* Pillar 2 - (purple), grows then depletes after withdrawals */}
                    <path d="M 0 225 Q 200 210, 400 185 Q 500 175, 600 185 Q 750 195, 850 200 L 1000 205 L 1000 195 Q 750 210, 500 225 Q 250 240, 0 250 Z" 
                          fill="rgba(168, 85, 247, 0.4)" />
                    
                    {/* Pillar 3 - (violet), grows then fully depleted */}
                    <path d="M 0 200 Q 200 180, 350 160 Q 450 155, 550 165 Q 650 175, 750 182 L 850 185 L 1000 185 L 1000 205 L 850 200 Q 750 195, 600 185 Q 500 175, 400 185 Q 200 210, 0 225 Z" 
                          fill="rgba(139, 92, 246, 0.4)" />
                    
                    {/* Securities 2 - (light blue), steady moderate growth */}
                    <path d="M 0 170 Q 250 155, 500 135 Q 750 120, 1000 110 L 1000 185 L 850 185 Q 750 182, 650 175 Q 550 165, 450 155 Q 350 160, 200 180 Q 0 200, 0 200 Z" 
                          fill="rgba(147, 197, 253, 0.4)" />
                    
                    {/* Securities 1 - (medium blue), good growth */}
                    <path d="M 0 135 Q 250 115, 500 90 Q 750 70, 1000 55 L 1000 110 Q 750 120, 500 135 Q 250 155, 0 170 Z" 
                          fill="rgba(96, 165, 250, 0.4)" />
                    
                    {/* Liquidity - Top layer (dark blue), moderate growth */}
                    <path d="M 0 110 Q 250 95, 500 75 Q 750 60, 1000 50 L 1000 55 Q 750 70, 500 90 Q 250 115, 0 135 Z" 
                          fill="rgba(59, 130, 246, 0.4)" />
                    
                    {/* Withdrawal events - vertical lines at key withdrawal moments */}
                    <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="350" y1="0" x2="350" y2="300" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="450" y1="0" x2="450" y2="300" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="550" y1="0" x2="550" y2="300" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="750" y1="0" x2="750" y2="300" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="2" strokeDasharray="4,4" />
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                {[
                  { color: 'bg-cyan-500', label: t('homepage.planningShowcase.capitalWithdrawals.legend.liquidity') },
                  { color: 'bg-blue-400', label: t('homepage.planningShowcase.capitalWithdrawals.legend.securities') },
                  { color: 'bg-sky-300', label: t('homepage.planningShowcase.capitalWithdrawals.legend.securities2') },
                  { color: 'bg-purple-500', label: t('homepage.planningShowcase.capitalWithdrawals.legend.pillar3') },
                  { color: 'bg-purple-400', label: t('homepage.planningShowcase.capitalWithdrawals.legend.pillar2') },
                  { color: 'bg-orange-400', label: t('homepage.planningShowcase.capitalWithdrawals.legend.bitcoin') },
                  { color: 'bg-slate-300', label: t('homepage.planningShowcase.capitalWithdrawals.legend.realEstate') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Transactions Count */}
              <div className="mt-6 text-center">
                <span className="text-orange-400 font-semibold">
                  {t('homepage.planningShowcase.capitalWithdrawals.transactions', { count: 417 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Monte Carlo Simulation View */}
        {activeView === 'montecarlo' && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden mb-16">
            {/* Chart Header - Cyan Theme */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <LineChart className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {t('homepage.planningShowcase.monteCarlo.title')}
                    </h3>
                    <p className="text-cyan-100">
                      {t('homepage.planningShowcase.monteCarlo.subtitle')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cyan-100 mb-1">
                    {t('homepage.planningShowcase.monteCarlo.probabilityOfSuccess')}
                  </div>
                  <div className="text-3xl font-bold text-green-400">95%</div>
                </div>
              </div>
            </div>

            {/* Simulation Status */}
            <div className="bg-slate-800/80 p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t('homepage.planningShowcase.monteCarlo.simulationsCompleted', { count: 1000 })}</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-8 bg-slate-900/80">
              <div className="relative h-96 bg-slate-800/50 rounded-xl p-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-gray-500 text-xs pr-2">
                  <span>$3,400k</span>
                  <span>$2,950k</span>
                  <span>$1,700k</span>
                  <span>$850k</span>
                  <span>$0</span>
                </div>

                {/* Chart content - Probability bands */}
                <div className="ml-12 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border-t border-slate-700/30 border-dashed"></div>
                    ))}
                  </div>

                  {/* Year markers */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-gray-500 text-xs pt-2">
                    <span>2026</span>
                    <span>2030</span>
                    <span>2034</span>
                    <span>2038</span>
                    <span>2042</span>
                    <span>2046</span>
                    <span>2050</span>
                    <span>2054</span>
                    <span>2058</span>
                    <span>2062</span>
                    <span>2066</span>
                    <span>2070</span>
                  </div>

                  {/* Monte Carlo bands - Dynamic curve with growth and withdrawal phases */}
                  <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {/* All paths start from a single point (x=0, y=180) representing current wealth */}
                    
                    {/* P95 upper band (optimistic scenario) - Growth then gradual decline */}
                    <path d="M 0 180 Q 100 155, 200 125 Q 300 100, 400 85 Q 450 78, 500 75 Q 600 80, 700 95 Q 800 115, 900 130 L 1000 140" 
                          fill="none" stroke="rgba(251, 146, 60, 0.6)" strokeWidth="2" strokeDasharray="6,4" />
                    
                    {/* P75-P95 band */}
                    <path d="M 0 180 Q 100 155, 200 125 Q 300 100, 400 85 Q 450 78, 500 75 Q 600 80, 700 95 Q 800 115, 900 130 L 1000 140 
                              L 1000 160 Q 900 155, 800 148 Q 700 135, 600 125 Q 500 118, 450 115 Q 400 118, 300 130 Q 200 145, 100 162 L 0 180 Z" 
                          fill="rgba(14, 165, 233, 0.15)" stroke="none" />
                    
                    {/* P75 line */}
                    <path d="M 0 180 Q 100 162, 200 145 Q 300 130, 400 118 Q 450 115, 500 118 Q 600 125, 700 135 Q 800 148, 900 155 L 1000 160" 
                          fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
                    
                    {/* P50-P75 band (upper confidence) */}
                    <path d="M 0 180 Q 100 162, 200 145 Q 300 130, 400 118 Q 450 115, 500 118 Q 600 125, 700 135 Q 800 148, 900 155 L 1000 160 
                              L 1000 185 Q 900 182, 800 178 Q 700 172, 600 168 Q 500 165, 450 165 Q 400 168, 300 175, 200 178 Q 100 180 L 0 180 Z" 
                          fill="rgba(34, 211, 238, 0.3)" stroke="none" />
                    
                    {/* P50 Median line (most likely scenario) - Rises then falls with withdrawals */}
                    <path d="M 0 180 Q 100 170, 200 158 Q 300 145, 400 135 Q 450 130, 500 132 Q 600 140, 700 152 Q 800 165, 900 175 L 1000 185" 
                          fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="3" />
                    
                    {/* P25-P50 band (lower confidence) */}
                    <path d="M 0 180 Q 100 180, 200 178 Q 300 175, 400 168 Q 450 165, 500 165 Q 600 168, 700 172 Q 800 178, 900 182 L 1000 185 
                              L 1000 215 Q 900 212, 800 208 Q 700 202, 600 198 Q 500 195, 450 195 Q 400 198, 300 205 Q 200 210, 100 215 L 0 180 Z" 
                          fill="rgba(34, 211, 238, 0.3)" stroke="none" />
                    
                    {/* P25 line */}
                    <path d="M 0 180 Q 100 188, 200 195 Q 300 200, 400 198 Q 450 195, 500 195 Q 600 198, 700 202 Q 800 208, 900 212 L 1000 215" 
                          fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
                    
                    {/* P5-P25 band */}
                    <path d="M 0 180 Q 100 188, 200 195 Q 300 200, 400 198 Q 450 195, 500 195 Q 600 198, 700 202 Q 800 208, 900 212 L 1000 215 
                              L 1000 242 Q 900 240, 800 238 Q 700 235, 600 232 Q 500 230, 450 230 Q 400 232, 300 238 Q 200 242, 100 245 L 0 180 Z" 
                          fill="rgba(14, 165, 233, 0.15)" stroke="none" />
                    
                    {/* P5 lower band (pessimistic scenario) - Slight rise then decline but stays above zero */}
                    <path d="M 0 180 Q 100 195, 200 205 Q 300 215, 400 218 Q 450 220, 500 222 Q 600 225, 700 230 Q 800 235, 900 238 L 1000 242" 
                          fill="none" stroke="rgba(251, 146, 60, 0.6)" strokeWidth="2" strokeDasharray="6,4" />
                    
                    {/* Starting point marker */}
                    <circle cx="0" cy="180" r="4" fill="rgba(6, 182, 212, 1)" />
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
                    <span className="text-gray-300">{t('homepage.planningShowcase.monteCarlo.legend.median')} (P50)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-3 bg-cyan-500/25 border border-cyan-500/40 rounded"></div>
                    <span className="text-gray-300">{t('homepage.planningShowcase.monteCarlo.legend.confidenceBand')} (P25-P75)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-2 bg-blue-500/15 border border-blue-500/30 rounded"></div>
                    <span className="text-gray-300">{t('homepage.planningShowcase.monteCarlo.legend.optimisticRange')} (P75-P95)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-1 border-t-2 border-dashed border-orange-400"></div>
                    <span className="text-gray-300">{t('homepage.planningShowcase.monteCarlo.legend.extremeScenarios')} (P5, P95)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: t('homepage.planningShowcase.features.scenarioPlanning.title'),
              description: t('homepage.planningShowcase.features.scenarioPlanning.description'),
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: LineChart,
              title: t('homepage.planningShowcase.features.monteCarloAnalysis.title'),
              description: t('homepage.planningShowcase.features.monteCarloAnalysis.description'),
              gradient: 'from-cyan-500 to-teal-500'
            },
            {
              icon: TrendingUp,
              title: t('homepage.planningShowcase.features.capitalWithdrawals.title'),
              description: t('homepage.planningShowcase.features.capitalWithdrawals.description'),
              gradient: 'from-teal-500 to-green-500'
            },
            {
              icon: LineChart,
              title: t('homepage.planningShowcase.features.inflationAdjustment.title'),
              description: t('homepage.planningShowcase.features.inflationAdjustment.description'),
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: TrendingUp,
              title: t('homepage.planningShowcase.features.eventTimeline.title'),
              description: t('homepage.planningShowcase.features.eventTimeline.description'),
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: LineChart,
              title: t('homepage.planningShowcase.features.volatilityAnalysis.title'),
              description: t('homepage.planningShowcase.features.volatilityAnalysis.description'),
              gradient: 'from-indigo-500 to-blue-500'
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
        <div className="text-center mt-16">
          <p className="text-gray-300 text-lg mb-6">
            {t('homepage.planningShowcase.cta.message')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {t('homepage.planningShowcase.cta.startButton')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#plans"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
            >
              {t('homepage.planningShowcase.cta.plansButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningShowcase;
