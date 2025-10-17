// Central i18n configuration
import deTranslations from './de.json';
import enTranslations from './en.json';

export type Language = 'de' | 'en';

export type TranslationKey = keyof typeof deTranslations;

export const translations = {
  de: deTranslations,
  en: enTranslations,
} as const;

// Helper function to get nested translation value
export const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the key if path not found
    }
  }
  
  return typeof current === 'string' ? current : path;
};

// Available languages for the language switcher
export const availableLanguages: { code: Language; name: string }[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
];

// Default language
export const DEFAULT_LANGUAGE: Language = 'de';

// LocalStorage key for language preference
export const LANGUAGE_STORAGE_KEY = 'stararc-language';