import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  translations, 
  getNestedValue, 
  DEFAULT_LANGUAGE, 
  LANGUAGE_STORAGE_KEY 
} from '../locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // Priority: 1. Saved preference > 2. Browser language > 3. Default (de)
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      // User has manually selected a language before
      setLanguage(savedLanguage);
      console.log('🌐 Using saved language preference:', savedLanguage);
    } else {
      // First visit - detect browser language
      const browserLanguage = navigator.language.toLowerCase();
      const detectedLanguage: Language = browserLanguage.startsWith('de') ? 'de' : 'en';
      
      setLanguage(detectedLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage);
      console.log('🌐 Browser language detected:', browserLanguage, '→ Using:', detectedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    console.log('🌐 Language change requested:', lang);
    console.log('🌐 Current language before change:', language);
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Force re-render of all components
    forceUpdate(prev => prev + 1);
    console.log('🌐 Language changed to:', lang);
    console.log('🌐 LocalStorage updated with:', localStorage.getItem(LANGUAGE_STORAGE_KEY));
  };

  const t = (key: string): string => {
    console.log('🔤 Translation requested for key:', key, 'in language:', language);
    const currentTranslations = translations[language];
    console.log('🔤 Available translations:', Object.keys(currentTranslations));
    const result = getNestedValue(currentTranslations, key);
    console.log('🔤 Translation result:', result);
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export type { Language };
