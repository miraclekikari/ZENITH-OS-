import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Confirmer le chargement de la clé au démarrage
if (import.meta.env.DEV) {
  console.log('🔑 Gemini API Key:', API_KEY ? '✅ Chargée' : '❌ Manquante');
}

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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (import.meta.env.DEV) console.warn("Gemini:", msg);
    return `ERREUR_IA : ${msg}`;
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
