
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const key = process.env.GOOGLE_API_KEY;
  console.log("Testing Key:", key ? key.substring(0, 10) + "..." : "No key found");
  
  if (!key) {
    console.error("No GOOGLE_API_KEY found in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // There isn't a direct listModels method on the client instance in this version of the SDK usually,
    // but let's try a simple generation to see specific error or if we can hit the models endpoint.
    // Actually, the SDK doesn't expose listModels easily in the node wrapper sometimes. 
    // Let's try to just hit the API with a simple fetch to be raw and sure.
    
    console.log("Fetching models via raw REST API...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    
    if (!response.ok) {
        console.error("API Error Status:", response.status, response.statusText);
        const data = await response.json();
        console.error("API Error Body:", JSON.stringify(data, null, 2));
        return;
    }

    const data = await response.json();
    console.log("----------------------------------------");
    console.log("AVAILABLE MODELS FOR THIS KEY:");
    console.log("----------------------------------------");
    if (data.models) {
        data.models.forEach((m: any) => {
            console.log(`- ${m.name}`);
            if (m.supportedGenerationMethods) {
               console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
            }
        });
    } else {
        console.log("No models returned.");
    }

  } catch (error) {
    console.error("Test Script Error:", error);
  }
}

listModels();
