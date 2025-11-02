/**
 * Spaceship Access Button
 * Provides seamless access to the Spaceship app with automatic user creation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, CogIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { spaceshipService } from '../services/spaceshipService';

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
      if (hasAccess) {
        // User already has access - just redirect
        setIsLoading(false); // Reset loading before redirect
        await spaceshipService.loginToSpaceship();
      } else {
        // Create access and redirect
        await spaceshipService.createSpaceshipAccess();
        setHasAccess(true); // Update access status
        setIsLoading(false); // Reset loading before redirect
        await spaceshipService.loginToSpaceship();
      }
    } catch (error: any) {
      setError(error.message || 'Fehler beim Zugriff auf die Spaceship App');
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
          Wird geladen...
        </>
      );
    }

    if (hasAccess) {
      return (
        <>
          {showIcon && <CheckCircleIcon className={`${iconSizes[size]} mr-2 text-green-300`} />}
          Zur Spaceship App
        </>
      );
    }

    return (
      <>
        {showIcon && <RocketLaunchIcon className={`${iconSizes[size]} mr-2`} />}
        App freischalten
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

      {/* Access status indicator */}
      {hasAccess !== null && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-400 text-center"
        >
          {hasAccess ? (
            <span className="text-green-400">✓ Spaceship Zugang aktiv</span>
          ) : (
            <span>Spaceship Zugang wird beim ersten Klick erstellt</span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SpaceshipAccessButton;