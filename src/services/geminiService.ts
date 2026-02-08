const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-1.5-flash'; // Ou 'gemini-1.5-pro' si flash échoue

export const generateContent = async (prompt: string) => {
  if (!API_KEY) {
    console.error('🔴 ERREUR: Clé API manquante');
    return 'Configuration IA manquante. Vérifiez les variables d\'environnement.';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('🔴 Erreur Gemini:', data.error);
      return `Erreur API: ${data.error.message}`;
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('🔴 Erreur réseau:', error);
    return 'Erreur de connexion à l\'IA';
  }
};

// --- COMPATIBILITÉ AVEC LES IMPORTS EXISTANTS ---
export const getGeminiResponse = generateContent;
export const generateCommunityNews = () => generateContent("Génère 3 news tech.");
export const askZenithAI = generateContent;
export const moderateContent = (content: string) => generateContent(`Réponds SAFE ou UNSAFE : ${content}`);
export const generateCreativeCaption = (topic: string) => generateContent(`Légende pour : ${topic}`);

export default { 
  generateContent, 
  getGeminiResponse, 
  generateCommunityNews, 
  askZenithAI, 
  moderateContent, 
  generateCreativeCaption 
};
