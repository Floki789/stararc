import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GettingStartedShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'started' | 'better'>('started');
  
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('homepage.gettingStartedShowcase.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('homepage.gettingStartedShowcase.subtitle')}
          </p>
          
          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50 mt-8">
            <button
              onClick={() => setActiveTab('started')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'started'
                  ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('homepage.gettingStartedShowcase.tabs.gettingStarted')}
            </button>
            <button
              onClick={() => setActiveTab('better')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'better'
                  ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('homepage.gettingStartedShowcase.tabs.gettingBetter')}
            </button>
          </div>
        </div>

        {/* Getting Started Interface Mockup */}
        {activeTab === 'started' && (
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-600 p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-2">
                {t('homepage.gettingStartedShowcase.header.title')}
              </h3>
              <p className="text-gray-100 text-lg">
                {t('homepage.gettingStartedShowcase.header.subtitle')}
              </p>
            </div>

            {/* Progress Section */}
            <div className="p-8 bg-gray-800/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-semibold text-lg">{t('homepage.gettingStartedShowcase.progress.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('homepage.gettingStartedShowcase.progress.completed')}</p>
                </div>
                <div className="text-orange-500 font-bold text-2xl">{t('homepage.gettingStartedShowcase.progress.percentComplete')}</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-orange-500 h-full rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>

            {/* Skip Button */}
            <div className="px-8 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t('homepage.gettingStartedShowcase.skipButton')}
              </button>
            </div>

            {/* Three Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              {/* Step 1: Create Profile */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.step1.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.step1.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.step1.completed')}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.step1.tasks.generalInfo')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.step1.tasks.familyMembers')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.step1.tasks.storageLocations')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.step1.tasks.financialInstitutions')}</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Create Budget */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.step2.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.step2.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.step2.completed')}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.step2.tasks.createBudget')}</span>
                  </div>
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="text-green-400 font-medium">{t('homepage.gettingStartedShowcase.step2.details.incomePositions')}</p>
                        <p className="text-green-400 font-medium">{t('homepage.gettingStartedShowcase.step2.details.expensePositions')}</p>
                        <p className="text-orange-400 font-medium">{t('homepage.gettingStartedShowcase.step2.details.forMembers')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Plan Budget */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.step3.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.step3.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.step3.completed')}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-gray-600 h-full rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.step3.tasks.recordIncome')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.step3.tasks.recordExpenses')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Getting Better Interface Mockup */}
        {activeTab === 'better' && (
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-600 p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-2">
                {t('homepage.gettingStartedShowcase.gettingBetter.header.title')}
              </h3>
              <p className="text-gray-100 text-lg">
                {t('homepage.gettingStartedShowcase.gettingBetter.header.subtitle')}
              </p>
            </div>

            {/* Progress Section */}
            <div className="p-8 bg-gray-800/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-semibold text-lg">{t('homepage.gettingStartedShowcase.gettingBetter.progress.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('homepage.gettingStartedShowcase.gettingBetter.progress.completed')}</p>
                </div>
                <div className="text-orange-500 font-bold text-2xl">{t('homepage.gettingStartedShowcase.gettingBetter.progress.percentComplete')}</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-orange-500 h-full rounded-full" style={{ width: '61%' }}></div>
              </div>
            </div>

            {/* Skip Button */}
            <div className="px-8 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t('homepage.gettingStartedShowcase.gettingBetter.skipButton')}
              </button>
            </div>

            {/* Steps Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              {/* Step 1: Optimize Profile */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 rounded-xl border border-purple-600/30 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.completed')}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.tasks.familyMembers')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.tasks.physicalStorage')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.tasks.digitalStorage')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.tasks.banksPension')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.optimizeProfile.tasks.budgetCurrency')}</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Plan Budget */}
              <div className="bg-gradient-to-br from-orange-900/40 to-amber-800/40 p-6 rounded-xl border border-orange-600/30 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.gettingBetter.planBudget.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.completed')}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.familyIncome')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.housingCosts')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.mobilityCosts')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.livingExpenses')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.insuranceTaxes')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.planBudget.tasks.leisureCosts')}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Build Portfolio */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-800/40 p-6 rounded-xl border border-green-600/30 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    {t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.button')}
                  </button>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.completed')}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.liquidity')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.securities')}</span>
                    <button className="ml-auto px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors">
                      {t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.scanButton')}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.bitcoin')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.preciousMetals')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.pension')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-400">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.realEstate')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('homepage.gettingStartedShowcase.gettingBetter.buildPortfolio.tasks.debtsLiabilities')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Getting Started Benefits */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-6 mx-auto md:mx-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('homepage.gettingStartedShowcase.benefits.quickSetup.title')}</h3>
            <p className="text-gray-300 leading-relaxed">
              {t('homepage.gettingStartedShowcase.benefits.quickSetup.description')}
            </p>
          </div>

          {/* Getting Better Benefits */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-6 mx-auto md:mx-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('homepage.gettingStartedShowcase.benefits.continuousImprovement.title')}</h3>
            <p className="text-gray-300 leading-relaxed">
              {t('homepage.gettingStartedShowcase.benefits.continuousImprovement.description')}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-300 text-lg mb-6">
            {t('homepage.gettingStartedShowcase.cta.message')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {t('homepage.gettingStartedShowcase.cta.startButton')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#plans"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700"
            >
              {t('homepage.gettingStartedShowcase.cta.plansButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStartedShowcase;
