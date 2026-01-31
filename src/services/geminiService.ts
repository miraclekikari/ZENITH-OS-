import { GoogleGenAI } from "@google/generative-ai";

// 1. Récupération de la clé API via Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Gestion de l'instance "Lazy" (évite le crash au démarrage)
let genAIInstance: any = null;

export const getGenAI = () => {
  if (!genAIInstance && API_KEY) {
    genAIInstance = new GoogleGenAI(API_KEY);
  }
  return genAIInstance;
};

// 3. Fonction principale d'envoi de message
export const getGeminiResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  try {
    const ai = getGenAI();
    
    if (!ai) {
      console.warn("Clé API manquante ou invalide.");
      return "ERREUR_SYSTEME : L'IA n'est pas configurée correctement (VITE_GEMINI_API_KEY).";
    }

    const model = ai.getGenerativeModel({ 
      model: "gemini-pro" 
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Erreur Gemini détectée :", error);
    return `ERREUR_IA : ${error.message || "Problème de connexion au réseau"}`;
  }
};

// 4. Exportations
export default { getGeminiResponse, getGenAI };
