import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield,
  Lock,
  Building2,
  Vault,
  Smartphone,
  Key,
  Users,
  Database,
  Eye,
  ShieldCheck
} from 'lucide-react';

const SecurityShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleDemoLogin = async () => {
    // Set demo credentials and navigate to login page with auto-login
    navigate('/login?demo=true');
  };
  const securityFeatures = [];

  const privacyPrinciples = [
    {
      icon: Eye,
      titleKey: "homepage.securityShowcase.privacy.principles.noSales.title",
      descriptionKey: "homepage.securityShowcase.privacy.principles.noSales.description"
    },
    {
      icon: Lock,
      titleKey: "homepage.securityShowcase.privacy.principles.encryption.title",
      descriptionKey: "homepage.securityShowcase.privacy.principles.encryption.description"
    },
    {
      icon: Database,
      titleKey: "homepage.securityShowcase.privacy.principles.local.title",
      descriptionKey: "homepage.securityShowcase.privacy.principles.local.description"
    },
    {
      icon: Shield,
      titleKey: "homepage.securityShowcase.privacy.principles.compliance.title",
      descriptionKey: "homepage.securityShowcase.privacy.principles.compliance.description"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-green-500/5 to-blue-500/5 blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-r from-orange-500/5 to-red-500/5 blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t('homepage.securityShowcase.title.part1')}
            </span>
            <span className="block mt-2">
              {t('homepage.securityShowcase.title.part2')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('homepage.securityShowcase.subtitle')}
          </p>
        </div>

        {/* Privacy Principles Section */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-700/30 mb-16 sm:mb-20 md:mb-24">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-4">
              {t('homepage.securityShowcase.privacy.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="bg-blue-500/20 p-3 sm:p-4 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                    {t(principle.titleKey)}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {t(principle.descriptionKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            {t('homepage.securityShowcase.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.securityShowcase.cta.start')}
            </button>
            <button 
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-blue-500 text-blue-400 text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              {t('homepage.securityShowcase.cta.demo')}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SecurityShowcase;