import React, { useState, useEffect } from 'react';

interface TypewriterSubtitleProps {
  className?: string;
}

export const TypewriterSubtitle: React.FC<TypewriterSubtitleProps> = ({ 
  className = 'text-3xl text-slate-400 max-w-2xl leading-relaxed min-h-[10.5rem] mb-6'
}) => {
  const subtitles = [
    "Your personal Wealth Management Hub, with a strong focus on privacy and self-custody.",
    "Take control of your wealth and budget. Design future scenarios. Store decentrally, manage centrally."
  ];

  const [displayedText, setDisplayedText] = useState('');
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentSubtitle = subtitles[currentSubtitleIndex];
    const typeSpeed = 50; // ms pro Zeichen
    const pauseBetweenTexts = 10000; // 10 Sekunden Pause zwischen Untertiteln

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
