import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Your translations object
const translations = {
  en: {
    translation: {
      "neuralFeed": "Neural Feed",
      "loadingTransmissions": "Loading Transmissions...",
      "publish": "Publish",
      // ... other English translations
    }
  },
  fr: {
    translation: {
      "neuralFeed": "Fil Neural",
      "loadingTransmissions": "Chargement des Transmissions...",
      "publish": "Publier",
      // ... other French translations
    }
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next) 
  // init i18next
  .init({
    resources: translations,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // Add this to ensure translations are loaded
    react: {
      useSuspense: false,
    },
  });

export default i18n;
