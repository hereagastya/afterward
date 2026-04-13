const { generateContentWithFallback } = require('./src/lib/gemini.ts');

async function test() {
  try {
    const res = await generateContentWithFallback("Say hello!");
    console.log("Success:", await res.response.text());
  } catch(e) {
    console.error("Failed:", e);
  }
}
test();
