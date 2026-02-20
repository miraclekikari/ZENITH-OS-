
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const translations = {
  en: {
    translation: {
      "neuralFeed": "Neural Feed",
      "loadingTransmissions": "Loading Transmissions...",
      "publish": "Publish",
      "studio.title": "Creation Studio",
      "studio.grantAccess": "Grant Camera & Mic Access",
      "studio.grantAccessHint": "We need access to your camera and microphone to create content.",
      "studio.enableCamera": "Enable Camera",
      "studio.enableMicrophone": "Enable Microphone",
      "studio.flip": "Flip",
      "studio.flash": "Flash",
      "studio.upload": "Upload",
      "studio.effects": "Effects",
      "publish.title": "Secure Transmission",
      "publish.publishing": "Transmitting...",
      "publish.publish": "Publish",
      "publish.dragOrClick": "Drag & Drop or Click to Upload",
      "publish.mediaHint": "Video or Photo",
      "publish.captionPlaceholder": "Write a caption...",
      "publish.aiAssist": "AI Assistant",
      "publish.aiChatTitle": "Frequency Assistant",
      "ai.generating": "Generating with AI...",
      "upload.initializing": "Initializing...",
      "upload.uploadingMedia": "Uploading media...",
      "upload.saving": "Saving post...",
      "upload.complete": "Upload complete!",
      "upload.successAlert": "Post published successfully!",
      "upload.error": "An error occurred during upload."
    }
  },
  fr: {
    translation: {
      "neuralFeed": "Fil Neural",
      "loadingTransmissions": "Chargement des Transmissions...",
      "publish": "Publier",
      "studio.title": "Studio de Création",
      "studio.grantAccess": "Autoriser l'accès Caméra & Micro",
      "studio.grantAccessHint": "Nous avons besoin d'accéder à votre caméra et votre micro pour créer du contenu.",
      "studio.enableCamera": "Activer la Caméra",
      "studio.enableMicrophone": "Activer le Microphone",
      "studio.flip": "Retourner",
      "studio.flash": "Flash",
      "studio.upload": "Importer",
      "studio.effects": "Effets",
      "publish.title": "Transmission Sécurisée",
      "publish.publishing": "Transmission en cours...",
      "publish.publish": "Publier",
      "publish.dragOrClick": "Glissez-déposez ou cliquez pour importer",
      "publish.mediaHint": "Vidéo ou Photo",
      "publish.captionPlaceholder": "Écrivez une légende...",
      "publish.aiAssist": "Assistant IA",
      "publish.aiChatTitle": "Assistant de Fréquence",
      "ai.generating": "Génération par l'IA...",
      "upload.initializing": "Initialisation...",
      "upload.uploadingMedia": "Importation du média...",
      "upload.saving": "Sauvegarde de la publication...",
      "upload.complete": "Importation terminée !",
      "upload.successAlert": "Publication réussie !",
      "upload.error": "Une erreur est survenue lors de l'importation."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: translations,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
