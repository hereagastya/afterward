import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.warn("GOOGLE_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy");

export const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const geminiFallback = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateContentWithFallback(request: any) {
  try {
    return await gemini.generateContent(request);
  } catch (error: any) {
    if (
      error?.status === 503 ||
      error?.message?.includes('503') ||
      error?.message?.includes('high demand') ||
      error?.status === 429
    ) {
      console.warn('Google API returned 503/429. Falling back to gemini-2.5-flash-lite.');
      return await geminiFallback.generateContent(request);
    }
    throw error;
  }
}
