
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationRU from './locales/ru/translation.json';
import translationZH from './locales/zh/translation.json';
import translationES from './locales/es/translation.json';
import translationJA from './locales/ja/translation.json';

// Define language directions
const languageDirections = {
  ar: 'rtl',
  en: 'ltr',
  fr: 'ltr',
  de: 'ltr',
  ru: 'ltr',
  zh: 'ltr',
  es: 'ltr',
  ja: 'ltr'
};

// Resources object with all translations
const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  ru: {
    translation: translationRU
  },
  zh: {
    translation: translationZH
  },
  es: {
    translation: translationES
  },
  ja: {
    translation: translationJA
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safely escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Set initial document direction
if (typeof window !== 'undefined') {
  const currentLang = i18n.language || 'en';
  document.documentElement.dir = languageDirections[currentLang as keyof typeof languageDirections] || 'ltr';
  document.documentElement.lang = currentLang;
}

export default i18n;
