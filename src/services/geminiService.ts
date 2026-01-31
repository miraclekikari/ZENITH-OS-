import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// On déplace l'initialisation à l'intérieur d'une fonction 
// pour éviter qu'elle ne s'exécute immédiatement au chargement du fichier
let genAIInstance: any = null;

export const getGenAI = () => {
  if (!genAIInstance && API_KEY) {
    genAIInstance = new GoogleGenAI(API_KEY);
  }
  return genAIInstance;
};

export const getGeminiResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  try {
    const ai = getGenAI(); // On appelle l'instance ici
    if (!ai) {
      return "ERREUR : Clé API non configurée.";
    }
    // ... reste du code utilisant 'ai' au lieu de 'genAI'
  } catch (e) { 
    return "Erreur"; 
  }
};
