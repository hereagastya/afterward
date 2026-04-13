import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy");
const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const geminiFallback = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function generateContentWithFallback(request) {
  try {
    return await gemini.generateContent(request);
  } catch (error) {
    if (
      error?.status === 503 ||
      error?.message?.includes('503') ||
      error?.message?.includes('high demand') ||
      error?.status === 429
    ) {
      console.log('Falling back to gemini-2.5-flash-lite.');
      return await geminiFallback.generateContent(request);
    }
    throw error;
  }
}

async function run() {
  try {
    const res = await generateContentWithFallback("hello");
    console.log(res.response.text());
  } catch(e) {
    console.error("error:", e);
  }
}
run();
