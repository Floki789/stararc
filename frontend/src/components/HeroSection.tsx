import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  TrendingUp,
  Target,
  Crown
} from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Background decorative elements - responsive */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl" />
      </div>

      {/* Main Content - responsive padding and spacing */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-center min-h-screen py-12 sm:py-16 md:py-20">
        <div className="text-center w-full">
          
          {/* Main Headline - responsive text sizes */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 md:mb-10 leading-normal" style={{ paddingBottom: '4px' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 block mb-3 sm:mb-4 md:mb-5 pb-1">
              {t('animations.wealthManager.headline.part1')}
            </span>
            <span className="block pb-1">
              {t('animations.wealthManager.headline.part2')}
            </span>
          </h1>

          {/* Subtext - responsive text sizes and spacing */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            {t('animations.wealthManager.subtext')}
          </p>

          {/* Feature Icons - responsive layout and sizes */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
            <div className="flex flex-col items-center group w-full sm:w-auto">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 sm:p-4 md:p-5 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-300 text-center px-2">{t('animations.wealthManager.features.control')}</span>
            </div>
            <div className="flex flex-col items-center group w-full sm:w-auto">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 sm:p-4 md:p-5 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-300 text-center px-2">{t('animations.wealthManager.features.strategy')}</span>
            </div>
            <div className="flex flex-col items-center group w-full sm:w-auto">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 sm:p-4 md:p-5 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-300 text-center px-2">{t('animations.wealthManager.features.independence')}</span>
            </div>
          </div>

          {/* Call to Action Buttons - responsive sizes */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              {t('animations.wealthManager.cta')}
            </button>
            
            <button
              onClick={() => navigate('/demo')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 bg-transparent border-2 border-amber-500 text-amber-400 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold rounded-lg transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Demo Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
