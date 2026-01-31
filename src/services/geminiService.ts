import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAIInstance: any = null;

export const getGenAI = () => {
  if (!genAIInstance && API_KEY) {
    genAIInstance = new GoogleGenerativeAI(API_KEY);
  }
  return genAIInstance;
};

// Fonction de base
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

// --- EXPORTS REQUIS PAR TES DIFFÉRENTES PAGES ---

// Pour Community.tsx
export const generateCommunityNews = async () => {
  return getGeminiResponse("Génère 3 actualités technologiques futuristes et brèves.");
};

// Pour Tools.tsx
export const askZenithAI = async (prompt: string) => {
  return getGeminiResponse(prompt);
};

// Pour Publish.tsx (Erreurs build #47)
export const moderateContent = async (content: string) => {
  const prompt = `Analyse le texte suivant et réponds uniquement par 'SAFE' ou 'UNSAFE' : ${content}`;
  const response = await getGeminiResponse(prompt);
  return response.includes('SAFE') && !response.includes('UNSAFE');
};

export const generateCreativeCaption = async (topic: string) => {
  const prompt = `Génère une légende créative et futuriste pour une publication sur : ${topic}`;
  return getGeminiResponse(prompt);
};

// Export par défaut
export default { 
  getGeminiResponse, 
  getGenAI, 
  generateCommunityNews, 
  askZenithAI,
  moderateContent,
  generateCreativeCaption
};
