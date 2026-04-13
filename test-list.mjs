import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
  const data = await res.json();
  const models = data.models.map(m => m.name);
  console.log("Available models:", models.join("\n"));
}
listModels();
