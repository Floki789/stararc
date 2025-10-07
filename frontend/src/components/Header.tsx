import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">Stararc</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Startseite
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/#plans" className="text-gray-300 hover:text-white transition-colors">
                  Preise
                </Link>
                <a href="#privacy" className="text-gray-300 hover:text-white transition-colors">
                  Datenschutz
                </a>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
                  <UserCircleIcon className="w-6 h-6 text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm font-medium"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Anmelden
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrieren
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Startseite
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="w-8 h-8 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-300 hover:text-red-400 transition-colors font-medium"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/#plans"
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Preise
                  </Link>
                  <a
                    href="#privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Datenschutz
                  </a>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrieren
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;