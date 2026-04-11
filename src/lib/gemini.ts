import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.warn("GOOGLE_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy");

export const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
