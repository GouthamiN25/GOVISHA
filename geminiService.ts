import { GoogleGenAI, Type } from "@google/genai";
import { TrendItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to ensure we don't crash if API key is missing
const checkApiKey = () => {
  if (!apiKey) throw new Error("API Key is missing. Please check your environment variables.");
};

export const generateStylistResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  checkApiKey();
  
  const systemInstruction = `You are Gouthami, the Founder and Lead Stylist of the fashion brand 'GOVISHA'.
  
  BRAND IDENTITY:
  - Name: GOVISHA.
  - Aesthetic: Elegant, Classy, Chic. A beautiful mix of Indian traditions and modern Western styles.
  - Vibe: Friendly, sophisticated, personal, and premium.

  YOUR PERSONA:
  - Name: Gouthami.
  - Tone: Warm, professional, and encouraging. Avoid overly complex words. Use clear, understandable English.
  - Role: You are helping a user find their perfect look from your personal design house.
  
  Keep responses concise, helpful, and focused on style advice.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history: history // Pass previous chat history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I am currently busy with another client. Please ask again in a moment.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I apologize, but our connection is momentarily interrupted.";
  }
};

export const generateOutfitVisual = async (prompt: string): Promise<string | null> => {
  checkApiKey();

  try {
    // Enhance the prompt for high-fashion editorial look but keep it understandable
    const enhancedPrompt = `High-fashion photography, 'GOVISHA' brand aesthetic. Full body shot. The outfit is a sophisticated Indo-Western fusion: ${prompt}. Lighting: Soft rose-tinted studio lighting. Background: Minimalist luxury space with pink accents. Style: Elegant, sharp details, rich fabrics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: enhancedPrompt,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const getTrendReport = async (): Promise<TrendItem[]> => {
  checkApiKey();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a list of 5 fashion trends (mixing Indian and Western styles) for the upcoming season. Score 1-100.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as TrendItem[];
  } catch (error) {
    console.error("Trend Error:", error);
    return [];
  }
};