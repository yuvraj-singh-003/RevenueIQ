import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const chatSession = genAI.chats.create({
  model: "gemini-3-flash-preview",
  config: {
    systemInstruction: `You are an expert financial analyst assistant for 'RevenueIQ', a business dashboard. 
    You help users understand their revenue, expenses, and profit data. 
    Be professional, concise, and helpful. 
    If the user asks about specific data, explain that you can help them interpret the trends they see on the dashboard.
    The current user is Yuvraj Singh, the Administrator.`,
  },
});

export const sendMessage = async (message: string) => {
  try {
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for quota exceeded error (429)
    if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota')) {
      throw new Error("QUOTA_EXCEEDED");
    }
    
    throw new Error("Failed to get response from AI assistant.");
  }
};