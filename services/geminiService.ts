import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "../constants";

export interface StylistResponse {
  text: string;
  image?: string;
  sources?: { title: string; uri: string }[];
}

export async function getStylingAdvice(userPrompt: string): Promise<StylistResponse> {
  // 1. Setup the connection using your secret key from the .env vault
  const AI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  
  // 2. Use the "1.5-flash" model - it is the most stable and fastest for Lagos internet
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash"
  });

  const productContext = PRODUCTS.map(p => 
    `${p.name} ($${p.price}) in category ${p.category}: ${p.description}`
  ).join('\n');

  try {
    const prompt = `You are an expert personal stylist for Culture Closet, a high-end cultural fashion brand.
      Our current inventory:
      ${productContext}
      
      User request: "${userPrompt}"
      
      Task: 
      1. Suggest specific items from our inventory.
      2. Keep it high-end, luxury, and helpful.`;

    // 3. Ask the AI for the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { text };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "I'm having a moment to reflect on my style database. Please try again in a second!" 
    };
  }
}