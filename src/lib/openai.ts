import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  // Warn but don't crash if key is missing during build time
  console.warn("OPENAI_API_KEY is missing in environment variables.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  dangerouslyAllowBrowser: false, // Server side only
});
