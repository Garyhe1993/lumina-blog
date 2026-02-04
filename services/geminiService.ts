
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogDraft = async (topic: string) => {
  const ai = getAI();
  // Using gemini-3-pro-preview for complex text generation tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a high-quality, engaging blog post about: "${topic}". 
    Format the response as a JSON object with: 
    "title", "excerpt" (short summary), and "content" (the full post in Markdown).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ["title", "excerpt", "content"]
      }
    }
  });

  // accessing .text property directly (not as a method).
  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr.trim());
};

export const generateSummary = async (content: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following blog content into a single concise paragraph suitable for a meta description: \n\n${content}`,
  });
  // accessing .text property directly (not as a method).
  return response.text || "";
};
