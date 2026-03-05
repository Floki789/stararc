/**
 * Spaceship Access Button
 * Provides seamless access to the Spaceship app with automatic user creation
 * Supports both standard (stararc_key) and Zero-Knowledge (password_zk) auth methods
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, CogIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { spaceshipService } from '../services/spaceshipService';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

interface SpaceshipAccessButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const SpaceshipAccessButton: React.FC<SpaceshipAccessButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Check if user is using Zero-Knowledge encryption
  const isZKUser = user?.loginMethodSelected === 'password_zk';

  // Check access status on component mount
  React.useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const access = await spaceshipService.checkSpaceshipAccess();
      setHasAccess(access.hasAccess);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    }
  };

  const handleSpaceshipAccess = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      if (!hasAccess) {
        // Create access first
        await spaceshipService.createSpaceshipAccess();
        setHasAccess(true);
      }

      setIsLoading(false);

      // Start Spaceship login — this sets window.location.href which queues 
      // a full page navigation. We must NOT call logout() afterward because
      // window.location.href is asynchronous: JS continues executing, React 
      // re-renders with isAuthenticated=false, and the login form flashes 
      // briefly before the browser actually navigates away.
      // Instead we clear localStorage directly (no React re-render) so the 
      // StarArc session is cleaned up for when the user returns.
      await spaceshipService.loginToSpaceship();

      // Silently clear session data without triggering React state updates
      console.log('🚪 Clearing StarArc session after Spaceship redirect...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error: any) {
      setError(error.message || t('spaceshipAccess.error'));
      setIsLoading(false);
    }
  };

  // Button styling based on variant and size
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <CogIcon className={`${iconSizes[size]} mr-2 animate-spin`} />
          {t('spaceshipAccess.loading')}
        </>
      );
    }

    if (hasAccess) {
      // Show different UI for ZK users vs standard users
      if (isZKUser) {
        return (
          <>
            {showIcon && <ShieldCheckIcon className={`${iconSizes[size]} mr-2 text-emerald-300`} />}
            {t('spaceshipAccess.goToPortfolioZK')}
          </>
        );
      }
      return (
        <>
          {showIcon && <CheckCircleIcon className={`${iconSizes[size]} mr-2 text-green-300`} />}
          {t('spaceshipAccess.goToPortfolio')}
        </>
      );
    }

    return (
      <>
        {showIcon && <RocketLaunchIcon className={`${iconSizes[size]} mr-2`} />}
        {t('spaceshipAccess.unlockApp')}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.button
        onClick={handleSpaceshipAccess}
        disabled={isLoading}
        className={buttonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {getButtonContent()}
      </motion.button>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center max-w-xs"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default SpaceshipAccessButton;