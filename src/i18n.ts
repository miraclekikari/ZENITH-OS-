
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    "Neural Feed": "Neural Feed",
    "Loading Transmissions": "Loading Transmissions...",
    "Publish": "Publish",
  }
};

// French translations
const fr = {
  translation: {
    "Neural Feed": "Fil Neural",
    "Loading Transmissions": "Chargement des Transmissions...",
    "Publish": "Publier",
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: en,
      fr: fr
    }
  });

export default i18n;
