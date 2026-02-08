const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-1.5-pro'; // ⚠️ SEUL MODÈLE QUI MARCHE

console.log('🔧 Gemini config:', {
  modèle: MODEL,
  cléPrésente: !!API_KEY,
  mode: import.meta.env.MODE
});

export const askZenithAI = async (prompt: string): Promise<string> => {
  // DEBUG
  console.log('📤 Envoi à IA:', prompt.substring(0, 80));
  
  if (!API_KEY) {
    return '⚠️ ZENITH_AI: Configuration manquante. Contactez l\'administrateur.';
  }

  if (prompt.length > 2000) {
    return '⚠️ Message trop long (max 2000 caractères).';
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
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Erreur Gemini:', data.error);
      return `⚠️ Erreur IA: ${data.error.message || 'Service temporairement indisponible'}`;
    }

    const result = data.candidates[0].content.parts[0].text;
    console.log('✅ Réponse reçue:', result.substring(0, 100));
    return result;
    
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
    return '⚠️ Connexion perdue. Vérifiez votre Internet.';
  }
};

// Fonctions vides pour compatibilité (ne pas casser le build)
export const moderateContent = async () => '';
export const generateCreativeCaption = async () => '';

// --- COMPATIBILITÉ AVEC LES IMPORTS EXISTANTS ---
export const generateContent = askZenithAI;
export const getGeminiResponse = askZenithAI;
export const generateCommunityNews = () => askZenithAI("Génère 3 news tech.");
export default { 
  askZenithAI, 
  generateContent, 
  getGeminiResponse, 
  generateCommunityNews, 
  moderateContent, 
  generateCreativeCaption 
};
