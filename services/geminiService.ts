import { GoogleGenAI } from "@google/genai";

// Initialize the client securely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askZenithAI = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Zenith, a helpful, futuristic AI assistant embedded in an educational OS. Keep answers concise, technical, and encouraging."
      }
    });
    return response.text || "I am offline. Please check your connection.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Zenith Core Systems are currently unreachable. (Check API Key)";
  }
};

export const generateCommunityNews = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, breaking news headline and a 1-sentence summary for a futuristic tech community focused on: ${topic}. Make it sound like a cyberpunk news ticker. E.g., "QUANTUM BREAKTHROUGH: New silicon photonics chip shatters speed records."`,
    });
    return response.text || "SYSTEM UPDATE: Neural connection stable.";
  } catch (error) {
    return "NEWS FEED OFFLINE: Reconnecting to satellite...";
  }
};

export const moderateContent = async (text: string, imageBase64?: string): Promise<{ safe: boolean; reason?: string }> => {
  try {
    const parts: any[] = [{ text: "Analyze this content. If it contains nudity, violence, hate speech, or illegal acts, reply with 'UNSAFE: [Reason]'. If it is safe, reply 'SAFE'." }];
    
    if (text) parts.push({ text: `Text content: ${text}` });
    
    if (imageBase64) {
      // Remove data URL prefix if present for the API
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Capable of multimodal analysis
      contents: { parts },
    });

    const result = response.text?.trim() || "SAFE";
    
    if (result.startsWith("UNSAFE")) {
      return { safe: false, reason: result.replace("UNSAFE:", "").trim() };
    }
    return { safe: true };

  } catch (error) {
    console.error("Moderation Error:", error);
    // Fail safe: block if moderation fails
    return { safe: false, reason: "AI Verification Failed. Try again." };
  }
};