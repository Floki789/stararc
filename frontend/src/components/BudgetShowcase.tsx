import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Users,
  Calculator,
  TrendingUp,
  Target,
  PieChart,
  Calendar,
  Smartphone,
  Star
} from 'lucide-react';

const BudgetShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleDemoLogin = async () => {
    // Set demo credentials and navigate to login page with auto-login
    navigate('/login?demo=true');
  };

  const budgetFeatures = [
    {
      icon: Users,
      titleKey: "homepage.budgetShowcase.features.family.title",
      descriptionKey: "homepage.budgetShowcase.features.family.description",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10"
    },
    {
      icon: Calculator,
      titleKey: "homepage.budgetShowcase.features.automated.title",
      descriptionKey: "homepage.budgetShowcase.features.automated.description",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      icon: TrendingUp,
      titleKey: "homepage.budgetShowcase.features.analytics.title",
      descriptionKey: "homepage.budgetShowcase.features.analytics.description",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Target,
      titleKey: "homepage.budgetShowcase.features.goals.title",
      descriptionKey: "homepage.budgetShowcase.features.goals.description",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      icon: PieChart,
      titleKey: "homepage.budgetShowcase.features.categories.title", 
      descriptionKey: "homepage.budgetShowcase.features.categories.description",
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "from-cyan-500/10 to-teal-500/10"
    },
    {
      icon: Calendar,
      titleKey: "homepage.budgetShowcase.features.planning.title",
      descriptionKey: "homepage.budgetShowcase.features.planning.description",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-pink-500/5 to-rose-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t('homepage.budgetShowcase.title.part1')}
            </span>
            <span className="block mt-2">
              {t('homepage.budgetShowcase.title.part2')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('homepage.budgetShowcase.subtitle')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16 md:mb-20">
          {budgetFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`relative group bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Key Benefits Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 sm:p-12 md:p-16 border border-gray-700/50">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              {t('homepage.budgetShowcase.benefits.title')}
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {t('homepage.budgetShowcase.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {t('homepage.budgetShowcase.benefits.feature1.title')}
              </h4>
              <p className="text-gray-400">
                {t('homepage.budgetShowcase.benefits.feature1.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {t('homepage.budgetShowcase.benefits.feature2.title')}
              </h4>
              <p className="text-gray-400">
                {t('homepage.budgetShowcase.benefits.feature2.description')}
              </p>
            </div>
            
            <div className="text-center md:col-span-2 lg:col-span-1">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {t('homepage.budgetShowcase.benefits.feature3.title')}
              </h4>
              <p className="text-gray-400">
                {t('homepage.budgetShowcase.benefits.feature3.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            {t('homepage.budgetShowcase.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.budgetShowcase.cta.start')}
            </button>
            <button 
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-blue-500 text-blue-400 text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.budgetShowcase.cta.demo')}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BudgetShowcase;