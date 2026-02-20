const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-pro';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

console.log('🔧 Gemini config:', {
  modèle: MODEL,
  cléPrésente: !!API_KEY,
  mode: import.meta.env.MODE
});

export const askZenithAI = async (prompt: string): Promise<string> => {
  console.log('📤 Envoi à IA:', prompt.substring(0, 80));
  
  if (!API_KEY) {
    return '⚠️ ZENITH_AI: Configuration manquante. Contactez l\'administrateur.';
  }

  if (prompt.length > 2000) {
    return '⚠️ Message trop long (max 2000 caractères).';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

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

// Fonctions pour la modération et génération de contenu
export const moderateContent = async (content: string): Promise<boolean> => {
  if (!API_KEY) return true; // Pas de vérification si pas de clé
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Modère ce contenu et réponds seulement par true ou false: "${content}"` }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      })
    });
    
    const data = await response.json();
    if (data.error) {
      console.error('❌ Erreur modération:', data.error);
      return true; // Par défaut, on autorise si erreur
    }
    
    const result = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    return result === 'true';
    
  } catch (error) {
    console.error('❌ Erreur réseau modération:', error);
    return true; // Par défaut, on autorise si erreur
  }
};

export const generateCreativeCaption = async (context: string): Promise<{ caption: string; success: boolean }> => {
  if (!API_KEY) {
    return { caption: 'Configuration IA manquante', success: false };
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Génère une légende créative et courte pour: ${context}. Réponds au format JSON: {"caption": "ta légende"}` }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 100,
        }
      })
    });
    
    const data = await response.json();
    if (data.error) {
      console.error('❌ Erreur génération légende:', data.error);
      return { caption: `ERREUR_: ${data.error.message || 'Service indisponible'}`, success: false };
    }
    
    const result = data.candidates[0].content.parts[0].text;
    console.log('✅ Légende générée:', result);
    
    try {
      const parsed = JSON.parse(result);
      return { caption: parsed.caption || result, success: true };
    } catch {
      return { caption: result, success: true };
    }
    
  } catch (error) {
    console.error('❌ Erreur réseau génération:', error);
    return { caption: `ERREUR_: ${error.message || 'Service indisponible'}`, success: false };
  }
};

// Compatibilité avec les imports existants
export const generateContent = askZenithAI;
export const getGeminiResponse = askZenithAI;
export const generateCommunityNews = async (topic?: string): Promise<string> => {
  const topicPrompt = topic ? ` pour le thème: ${topic}` : '';
  return askZenithAI(`Génère 3 news tech${topicPrompt}.`);
};
export default { 
  askZenithAI, 
  generateContent, 
  getGeminiResponse, 
  generateCommunityNews, 
  moderateContent, 
  generateCreativeCaption 
};
