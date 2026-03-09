import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ClaimsSubtitleProps {
  className?: string;
}

export const ClaimsSubtitle: React.FC<ClaimsSubtitleProps> = ({ 
  className = 'text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 max-w-3xl leading-relaxed min-h-[8rem] mb-8 font-semibold'
}) => {
  const { t } = useLanguage();
  const claims = useMemo(
    () => [
      t('animations.wealthManager.claims.0'),
      t('animations.wealthManager.claims.1'),
      t('animations.wealthManager.claims.2'),
      t('animations.wealthManager.claims.3'),
      t('animations.wealthManager.claims.4'),
      t('animations.wealthManager.claims.5'),
      t('animations.wealthManager.claims.6'),
      t('animations.wealthManager.claims.7'),
      t('animations.wealthManager.claims.8')
    ],
    [t]
  );

  const [displayedText, setDisplayedText] = useState('');
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentClaim = claims[currentClaimIndex];
    const typeSpeed = 50; // ms pro Zeichen
    const pauseBetweenTexts = 3500; // 3.5 Sekunden Pause zwischen Claims

    let timer: NodeJS.Timeout;

    if (charIndex === currentClaim.length) {
      timer = setTimeout(() => {
        const isLastClaim = currentClaimIndex === claims.length - 1;
        setCurrentClaimIndex(isLastClaim ? 0 : currentClaimIndex + 1);
        setCharIndex(0);
        setDisplayedText('');
      }, pauseBetweenTexts);
      return () => clearTimeout(timer);
    }

    timer = setTimeout(() => {
      setDisplayedText(currentClaim.substring(0, charIndex + 1));
      setCharIndex(charIndex + 1);
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, currentClaimIndex]);

  const lastChar = displayedText.slice(-1);
  const prefixText = displayedText.slice(0, -1);

  return (
    <p className={className}>
      {prefixText}
      {lastChar && (
        <span key={charIndex} className="typewriter-glow inline-block">
          {lastChar}
        </span>
      )}
      <span className="animate-pulse">|</span>
    </p>
  );
};
