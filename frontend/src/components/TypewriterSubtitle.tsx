import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TypewriterSubtitleProps {
  className?: string;
}

export const TypewriterSubtitle: React.FC<TypewriterSubtitleProps> = ({ 
  className = 'text-3xl text-slate-400 max-w-2xl leading-relaxed min-h-[13.5rem] mb-6'
}) => {
  const { t } = useLanguage();
  const subtitles = useMemo(
    () => [
      t('animations.wealthManager.subtitles.0'),
      t('animations.wealthManager.subtitles.1'),
      t('animations.wealthManager.subtitles.2')
    ],
    [t]
  );

  const [displayedText, setDisplayedText] = useState('');
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentSubtitle = subtitles[currentSubtitleIndex];
    const typeSpeed = 50; // ms pro Zeichen
    const pauseBetweenTexts = 3000; // 3 Sekunden Pause zwischen Untertiteln

    let timer: NodeJS.Timeout;

    if (charIndex === currentSubtitle.length) {
      timer = setTimeout(() => {
        const isLastSubtitle = currentSubtitleIndex === subtitles.length - 1;
        setCurrentSubtitleIndex(isLastSubtitle ? 0 : currentSubtitleIndex + 1);
        setCharIndex(0);
        setDisplayedText('');
      }, pauseBetweenTexts);
      return () => clearTimeout(timer);
    }

    timer = setTimeout(() => {
      setDisplayedText(currentSubtitle.substring(0, charIndex + 1));
      setCharIndex(charIndex + 1);
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, currentSubtitleIndex, subtitles]);

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
