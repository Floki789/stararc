import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ViewportAlertProps {
  /**
   * Show only on specific breakpoints
   * 'mobile' - Show only on mobile (< 768px)
   * 'tablet' - Show on mobile and tablet (< 1024px)
   */
  showOn?: 'mobile' | 'tablet';
  /**
   * Custom message key or text
   */
  message?: string;
  /**
   * Type of alert
   */
  variant?: 'info' | 'warning';
  className?: string;
}

/**
 * Alert component that shows viewport-specific messages
 * Typically used to inform users that content is better viewed on larger screens
 */
const ViewportAlert: React.FC<ViewportAlertProps> = ({
  showOn = 'mobile',
  message,
  variant = 'info',
  className = ''
}) => {
  const { t } = useLanguage();

  // Default messages from translation files
  const defaultMessage = message || t('common.viewOnLargerScreen', 'For the best experience, view this content on a larger screen.');

  // Breakpoint classes
  const breakpointClass = showOn === 'mobile' ? 'md:hidden' : 'lg:hidden';

  // Variant styles
  const variantStyles = {
    info: 'bg-blue-900/30 border-blue-700/50 text-blue-300',
    warning: 'bg-orange-900/30 border-orange-700/50 text-orange-300'
  };

  const iconStyles = {
    info: 'text-blue-400',
    warning: 'text-orange-400'
  };

  return (
    <div className={`${breakpointClass} ${className}`}>
      <div className={`rounded-xl border p-4 backdrop-blur-sm ${variantStyles[variant]}`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${iconStyles[variant]}`}>
            <Monitor className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">
              {t('common.betterOnDesktop', 'Better on Desktop')}
            </p>
            <p className="text-xs opacity-90">
              {defaultMessage}
            </p>
          </div>
          <Smartphone className={`w-5 h-5 opacity-50 ${iconStyles[variant]}`} />
        </div>
      </div>
    </div>
  );
};

export default ViewportAlert;
