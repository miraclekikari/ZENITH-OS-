import { GoogleGenAI } from "@google/genai";

// Initialize the client securely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const askZenithAI = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
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