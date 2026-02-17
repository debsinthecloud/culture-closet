
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

export interface StylistResponse {
  text: string;
  image?: string;
  sources?: { title: string; uri: string }[];
}

export async function getStylingAdvice(userPrompt: string): Promise<StylistResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const productContext = PRODUCTS.map(p => 
    `${p.name} ($${p.price}) in category ${p.category}: ${p.description}`
  ).join('\n');

  try {
    // 1. Get Text & Search Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert personal stylist for Culture Closet, a high-end cultural fashion brand.
      Our current inventory:
      ${productContext}
      
      User request: "${userPrompt}"
      
      Task: 
      1. Use Google Search to find current cultural fashion trends related to their request.
      2. Suggest specific items from our inventory.
      3. If they ask to "see" or "visualize" an outfit, or if a visual would help, let them know you are generating a concept.
      
      Keep it high-end and helpful.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "I'm inspired by your request! Let me help you find the perfect look.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter(c => c.web)
      .map(c => ({ title: c.web!.title, uri: c.web!.uri }));

    // 2. Conditionally Generate Image
    let generatedImage: string | undefined;
    if (userPrompt.toLowerCase().includes('see') || 
        userPrompt.toLowerCase().includes('visualize') || 
        userPrompt.toLowerCase().includes('show') ||
        text.toLowerCase().includes('generating')) {
      
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `A high-fashion editorial photo of a model wearing a ${userPrompt} in the style of Culture Closet. High-end lighting, cultural luxury aesthetic, 8k resolution.`,
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of imgResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return { text, image: generatedImage, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "I'm having a moment to reflect on my style database. Please try again in a second!" };
  }
}
