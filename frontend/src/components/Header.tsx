import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    // Always scroll to top when clicking home link
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 group">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stararc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {t('nav.home')}
            </Link>
            
            {!isAuthenticated && (
              <Link
                to="/#plans"
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                {t('nav.pricing')}
              </Link>
            )}

            <Link
              to={language === 'de' ? '/sicherheit' : '/security'}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {t('nav.security')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {t('nav.dashboard')}
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-600">
                  <UserCircleIcon className="w-6 h-6 text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {user?.email} · ID: {user?.id}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-red-400 transition-colors font-medium"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}

            {/* Desktop Language Switcher */}
            <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 border border-slate-600">
              <button
                onClick={() => setLanguage('de')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  language === 'de'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-slate-300 hover:text-white transition-colors"
                onClick={() => {
                  handleHomeClick();
                  setIsMenuOpen(false);
                }}
              >
                {t('nav.home')}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="w-8 h-8 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {user?.email} · ID: {user?.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left text-slate-300 hover:text-red-400 transition-colors font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/#plans"
                    className="text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.pricing')}
                  </Link>
                  <Link
                    to={language === 'de' ? '/sicherheit' : '/security'}
                    className="text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.security')}
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}

              {/* Mobile Language Switcher */}
              <div className="pt-4 border-t border-slate-600">
                <p className="text-slate-400 text-sm mb-2">Language</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      language === 'de'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
