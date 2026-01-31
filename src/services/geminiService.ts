import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAIInstance: any = null;

export const getGenAI = () => {
  if (!genAIInstance && API_KEY) {
    genAIInstance = new GoogleGenerativeAI(API_KEY);
  }
  return genAIInstance;
};

export const getGeminiResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  try {
    const ai = getGenAI();
    if (!ai) return "ERREUR_SYSTEME : Clé API non configurée.";

    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: { maxOutputTokens: 1000, temperature: 0.8 },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return `ERREUR_IA : ${error.message || "Problème de connexion"}`;
  }
};

// --- CETTE FONCTION MANQUAIT ET BLOQUAIT LE BUILD ---
export const generateCommunityNews = async () => {
  const prompt = "Génère 3 actualités technologiques futuristes et brèves pour la communauté Zenith OS.";
  return getGeminiResponse(prompt);
};

export default { getGeminiResponse, getGenAI, generateCommunityNews };
