import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateFashionSketch = async (prompt: string, style: string, base64Image?: string): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env file.");
  }
  const ai = getGeminiClient();

  // Using Gemini 2.0 Flash to generate SVG illustration for reliability
  // const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }); // Error: getGenerativeModel not on GoogleGenAI (v0.x maybe?)

  let imagePart: any = null;
  if (base64Image) {
    const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const mimeType = base64Image.match(/data:([^;]+);/)?.[1] || 'image/png';
    imagePart = { inlineData: { data, mimeType } };
  }

  const systemPrompt = `You are an expert fashion illustrator. Create a detailed, professional SVG vector illustration for a high-fashion runway look.
  Style: ${style}
  Subject: ${prompt}
  Requirements:
  - Return ONLY a valid JSON object.
  - The JSON must have a single key "svg_code" containing the complete SVG string.
  - The SVG should be scalable, artistic, and use appropriate colors to match the '${style}' aesthetic.
  - Do NOT include markdown formatting. Just the raw JSON string.`;

  try {
    const parts: any[] = [{ text: systemPrompt }];
    if (imagePart) {
      parts.push(imagePart);
      parts.push({ text: "Use the attached image as visual reference for the pose and silhouette." });
    }

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        role: 'user',
        parts
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const response = result as any; // Cast to any to avoid strict typing issues for now
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from model");
    }

    const json = JSON.parse(text);
    const svgCode = json.svg_code;

    if (!svgCode) {
      throw new Error("No SVG code generated");
    }

    // Convert SVG to Base64 Data URL
    const base64Svg = btoa(unescape(encodeURIComponent(svgCode)));
    return `data:image/svg+xml;base64,${base64Svg}`;

  } catch (error: any) {
    console.error("Govisha: SVG Generation failed", error);
    throw new Error(error.message || "Failed to generate sketch");
  }
};

export const searchFashionTrends = async (query: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Search for current fashion trends and news about: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No trend insights were generated.";
    const candidate = (response as any).candidates?.[0];
    const sources = candidate?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fashion Source',
      url: chunk.web?.uri || '#'
    })) || [];

    return { text, sources };
  } catch (error) {
    console.error("Govisha: Trend search failed", error);
    return { text: "Unable to retrieve real-time trends at this moment.", sources: [] };
  }
};

export const getDesignConsultation = async (_history: any[], currentMessage: string) => {
  const ai = getGeminiClient();

  const systemInstruction = `You are a world-class fashion design consultant named Govisha. 
  Help users brainstorm silhouettes, fabrics, and color palettes. 
  When you provide a specific design idea, format the output as a JSON object containing silhouette, fabrics (array), colors (array), details (array), and inspiration (string).`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash-exp',
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "Your conversational response" },
            specs: {
              type: Type.OBJECT,
              properties: {
                silhouette: { type: Type.STRING },
                fabrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                details: { type: Type.ARRAY, items: { type: Type.STRING } },
                inspiration: { type: Type.STRING }
              }
            }
          },
          required: ["message"]
        }
      }
    });

    const response = await chat.sendMessage({ message: currentMessage });
    const textContent = response.text || '{}';

    try {
      return JSON.parse(textContent);
    } catch (parseError) {
      console.error("Govisha: Failed to parse consultant JSON", parseError);
      return { message: textContent };
    }
  } catch (error) {
    console.error("Govisha: Consultation failed", error);
    return { message: "I apologize, the design studio is experiencing high traffic. Please try again in a moment." };
  }
};
