import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAIInstance: any = null;

export const getGenAI = () => {
  // Garde le nom correct GoogleGenerativeAI pour éviter l'erreur d'export (Page Blanche)
  if (!genAIInstance && API_KEY) {
    genAIInstance = new GoogleGenerativeAI(API_KEY);
  }
  return genAIInstance;
};

export const getGeminiResponse = async (prompt: string, history: any[] = []): Promise<string> => {
  try {
    const ai = getGenAI();
    if (!ai) return "ERREUR_SYSTEME : Clé API non configurée.";

    // Test du modèle 1.5-flash qui est le plus compatible avec les clés gratuites
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: { 
        maxOutputTokens: 1000, 
        temperature: 0.8 
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    // Si l'erreur 404 persiste, on renvoie un message clair au terminal de l'OS
    return `ERREUR_IA : ${error.message}`;
  }
};

// --- GARDE TOUS LES EXPORTS POUR ÉVITER LES ERREURS DE BUILD ---
export const generateCommunityNews = async () => getGeminiResponse("Génère 3 news tech.");
export const askZenithAI = async (prompt: string) => getGeminiResponse(prompt);
export const moderateContent = async (content: string) => {
  const res = await getGeminiResponse(`Réponds SAFE ou UNSAFE : ${content}`);
  return res.includes('SAFE');
};
export const generateCreativeCaption = async (topic: string) => getGeminiResponse(`Légende pour : ${topic}`);

export default { getGeminiResponse, getGenAI, generateCommunityNews, askZenithAI, moderateContent, generateCreativeCaption };
