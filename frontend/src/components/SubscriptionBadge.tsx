import React from 'react';
import { Shield, Star, Crown, Flame, Sparkles, Globe } from 'lucide-react';

interface SubscriptionBadgeProps {
  plan?: string | null;
  className?: string;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  plan, 
  className = '' 
}) => {
  if (!plan || plan.toLowerCase() === 'free') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 ${className}`}>
        <Shield className="w-3 h-3 mr-1" />
        Free
      </div>
    );
  }

  const getPlanConfig = (planName: string) => {
    const normalizedPlan = planName.toLowerCase();
    
    switch (normalizedPlan) {
      case 'spark':
        return {
          icon: Star,
          label: 'Spark',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
        };
      case 'nova':
        return {
          icon: Flame,
          label: 'Nova',
          color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
        };
      case 'galaxy':
        return {
          icon: Sparkles,
          label: 'Galaxy',
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
        };
      case 'apex':
        return {
          icon: Crown,
          label: 'Apex',
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        };
      case 'core':
        return {
          icon: Globe,
          label: 'Core',
          color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        };
      default:
        return {
          icon: Shield,
          label: planName,
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        };
    }
  };

  const config = getPlanConfig(plan);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </div>
  );
};

export default SubscriptionBadge;