import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useDayMode } from '../contexts/DayModeContext';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { dayMode, toggleDayMode } = useDayMode();
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
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-700 ${
      dayMode
        ? 'bg-white/85 border-slate-200'
        : 'bg-slate-900/80 border-slate-700/50'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 group">
            <span className={`text-3xl font-bold bg-clip-text text-transparent ${
              dayMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}>
              Stararc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
            >
              {t('nav.home')}
            </Link>
            
            {!isAuthenticated && (
              <Link
                to="/#plans"
                className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
              >
                {t('nav.pricing')}
              </Link>
            )}

            <Link
              to={language === 'de' ? '/sicherheit' : '/security'}
              className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
            >
              {t('nav.security')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
                >
                  {t('nav.dashboard')}
                </Link>
                
                {/* User Profile Dropdown */}
                <div className={`flex items-center space-x-3 rounded-lg px-3 py-2 border ${dayMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/50 border-slate-600'}`}>
                  <UserCircleIcon className="w-6 h-6 text-blue-400" />
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${dayMode ? 'text-slate-800' : 'text-white'}`}>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className={`text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {user?.email} · ID: {user?.id}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-red-600' : 'text-slate-300 hover:text-red-400'}`}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
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

            {/* Day / Night Toggle */}
            <button
              onClick={toggleDayMode}
              aria-label={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
              title={dayMode ? 'Nachtmodus' : 'Tagmodus'}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                dayMode
                  ? 'bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-md'
                  : 'bg-slate-700/70 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {dayMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

          {/* Desktop Language Switcher */}
            <div className={`flex space-x-1 rounded-lg p-1 border ${
              dayMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/50 border-slate-600'
            }`}>
              <button
                onClick={() => setLanguage('de')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  language === 'de'
                    ? 'bg-blue-600 text-white'
                    : dayMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : dayMode ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg border transition-colors ${dayMode ? 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900' : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:text-white'}`}
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
          <div className={`md:hidden py-4 border-t ${dayMode ? 'border-slate-200' : 'border-slate-700'}`}>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`transition-colors ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
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
                    className={`transition-colors ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <div className={`rounded-lg p-3 border ${dayMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/50 border-slate-600'}`}>
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="w-8 h-8 text-blue-400" />
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${dayMode ? 'text-slate-800' : 'text-white'}`}>
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className={`text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {user?.email} · ID: {user?.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`text-left transition-colors font-medium ${dayMode ? 'text-slate-700 hover:text-red-600' : 'text-slate-300 hover:text-red-400'}`}
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/#plans"
                    className={`transition-colors ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.pricing')}
                  </Link>
                  <Link
                    to={language === 'de' ? '/sicherheit' : '/security'}
                    className={`transition-colors ${dayMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
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
              <div className={`pt-4 border-t ${dayMode ? 'border-slate-300' : 'border-slate-600'}`}>
                <p className={`text-sm mb-2 ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>Language</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      language === 'de'
                        ? 'bg-blue-600 text-white'
                        : dayMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      language === 'en'
                        ? 'bg-blue-600 text-white'
                        : dayMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
