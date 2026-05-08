import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  // Language-specific routes
  const termsRoute = language === 'de' ? '/agb' : '/terms';
  const privacyRoute = language === 'de' ? '/datenschutz' : '/privacy';
  const securityRoute = language === 'de' ? '/sicherheit' : '/security';

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-sky-400">Stararc</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://www.stararc.one"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              www.stararc.one
            </a>
            <Link to={termsRoute} className="text-gray-400 hover:text-white transition-colors text-sm">{t('nav.terms')}</Link>
            <Link to={privacyRoute} className="text-gray-400 hover:text-white transition-colors text-sm">{t('nav.privacy')}</Link>
            <Link to="/genesis-members" className="text-gray-400 hover:text-white transition-colors text-sm">{t('nav.genesisMembers')}</Link>
            <Link to={securityRoute} className="text-gray-400 hover:text-white transition-colors text-sm">{t('nav.security')}</Link>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Stararc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;