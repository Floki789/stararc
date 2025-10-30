import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimationTimerProps {
  duration: number; // Duration in seconds
  isActive: boolean;
  className?: string;
}

const AnimationTimer: React.FC<AnimationTimerProps> = ({ 
  duration, 
  isActive, 
  className = "" 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(duration);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const progress = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute bottom-4 right-4 z-50 ${className}`}
    >
      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/30">
        <div className="flex items-center gap-2 text-xs">
          {/* Progress bar */}
          <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          
          {/* Time display */}
          <span className="text-gray-300 font-mono text-xs min-w-[24px]">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimationTimer;