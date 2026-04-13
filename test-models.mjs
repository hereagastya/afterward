import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy");

async function checkModel(modelName) {
  try {
    console.log("Testing:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("hello");
    console.log("Success:", modelName);
  } catch(e) {
    console.error("Failed:", modelName, e.message);
  }
}

async function run() {
  await checkModel("gemini-1.5-flash");
  await checkModel("gemini-1.5-flash-latest");
  await checkModel("gemini-1.5-pro");
  await checkModel("gemini-1.5-flash-8b");
}
run();
