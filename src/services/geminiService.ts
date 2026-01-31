import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// 1. On récupère la clé
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 2. LA LIGNE CRUCIALE : On vérifie si API_KEY existe AVANT de faire "new GoogleGenAI"
// Si API_KEY est vide, genAI sera "null" au lieu de faire planter tout le site.
export const genAI = API_KEY ? new GoogleGenAI(API_KEY) : null;

// Configuration de sécurité (souvent présent dans les versions longues)
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Cette fonction gère l'historique et l'envoi
 * C'est ici que tes 78 lignes se trouvaient probablement
 */
export const getGeminiResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  try {
    // Si pas de clé, on ne crash pas, on prévient.
    if (!genAI) {
      return "ERREUR_SYSTEME: Clé API non détectée. Vérifiez vos Secrets GitHub.";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      safetySettings,
    });

    // Gestion de la conversation (Chat)
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Détails de l'erreur Gemini:", error);
    return `ERREUR_IA: ${error.message || "Échec de la communication"}`;
  }
};

// Exportation par défaut pour la compatibilité
export default { getGeminiResponse, genAI };
