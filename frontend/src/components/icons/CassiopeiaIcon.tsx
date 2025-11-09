import React from 'react';

interface CassiopeiaIconProps {
  className?: string;
  size?: number;
}

const CassiopeiaIcon: React.FC<CassiopeiaIconProps> = ({ 
  className = "w-6 h-6", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size * 0.5} // Make it twice as wide as high
      viewBox="0 0 48 24" // Changed viewBox to be 2:1 aspect ratio
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      transform="rotate(-15)" // Slight sideways tilt only, no horizontal flip
    >
      {/* Cassiopeia constellation - W shape horizontally mirrored */}
      <defs>
        {/* Gradient for constellation lines */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* blue-400 */}
          <stop offset="100%" stopColor="#A78BFA" /> {/* purple-400 */}
        </linearGradient>
        
        {/* Whitish gradient for stars */}
        <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" /> {/* pure white center */}
          <stop offset="40%" stopColor="#F1F5F9" /> {/* very light blue-gray */}
          <stop offset="100%" stopColor="#CBD5E1" /> {/* light blue-gray edge */}
        </radialGradient>
        
        {/* Light glow effect for everything */}
        <filter id="lightGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Stronger glow for stars */}
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="3" result="starBlur"/>
          <feMerge> 
            <feMergeNode in="starBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background constellation lines - with blue gradient and light glow */}
      <path
        d="M6 16 L14 8 L24 18 L34 6 L42 14"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
        filter="url(#lightGlow)"
      />
      
      {/* Main Cassiopeia stars - W shape, whitish with stronger glow */}
      <circle cx="6" cy="16" r="2.8" fill="url(#starGradient)" filter="url(#starGlow)" />
      <circle cx="14" cy="8" r="3" fill="url(#starGradient)" filter="url(#starGlow)" />
      <circle cx="24" cy="18" r="2.9" fill="url(#starGradient)" filter="url(#starGlow)" />
      <circle cx="34" cy="6" r="2.8" fill="url(#starGradient)" filter="url(#starGlow)" />
      <circle cx="42" cy="14" r="2.7" fill="url(#starGradient)" filter="url(#starGlow)" />
    </svg>
  );
};

export default CassiopeiaIcon;