
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const key = process.env.GOOGLE_API_KEY;
  console.log("Testing Key:", key ? key.substring(0, 10) + "..." : "No key found");
  
  if (!key) {
    console.error("No GOOGLE_API_KEY found in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    
    // Test generation to confirm key works
    console.log("Testing generation with gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("Generation Response:", response.text());
    
    // Also try listing models via REST if needed, but generation test is better proof.
    console.log("----------------------------------------");
    console.log("API Connection Successful!");

  } catch (error) {
    console.error("Test Script Error:", error);
  }
}

listModels();
