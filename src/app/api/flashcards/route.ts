import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { QuestionAnswer, DualPathSimulationData, FlashcardSet, TimelinePhase } from '@/lib/types';
import { z } from 'zod';

const RequestSchema = z.object({
  decision: z.string().min(5).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  })),
  simulations: z.object({
    pathA: z.object({
      pathType: z.string(),
      pathTitle: z.string(),
      phases: z.array(z.any())
    }),
    pathB: z.object({
      pathType: z.string(),
      pathTitle: z.string(),
      phases: z.array(z.any())
    })
  })
});

const SYSTEM_PROMPT = `You are a regret simulation engine. Generate highly specific, scenario-based regrets that might haunt someone after making (or not making) a major life decision.

For each path (Path A = Go, Path B = Stay), generate 4-5 flashcards. 

Each flashcard must have:
- content: A specific "what if" scenario or realization. "What if I'm 40 and broke?"
- category: One of "financial", "relationships", "emotional", "time", "identity", "general"
- likelihood: "high", "medium", or "low" (how probable is this regret?)
- emojiBefore: An emoji representing the fear (e.g., 💸)
- emojiAfter: An emoji representing the aftermath or reaction (e.g., 😰)

Return a JSON object with this exact structure:
{
  "goFlashcards": [
    {
      "content": "You see your friends getting promoted while you're still struggling to make rent in a new city.",
      "pathType": "go",
      "category": "financial",
      "likelihood": "high",
      "emojiBefore": "📉",
      "emojiAfter": "🙈"
    }
  ],
  "stayFlashcards": [
    {
      "content": "Five years pass and you realize you never left your hometown.",
      "pathType": "stay",
      "category": "time",
      "likelihood": "high",
      "emojiBefore": "⏳",
      "emojiAfter": "🕸️"
    }
  ]
}

Rules:
- Be visceral and specific. "You wake up at 3am..."
- Use their context to make it hurt (constructively).
- Return ONLY valid JSON.`;

function formatContextForPrompt(
  decision: string, 
  answers: QuestionAnswer[], 
  simulations: DualPathSimulationData
): string {
  const answersText = answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n');
  
  // Safe cast for phases as they come from simplified Zod schema
  const goPhases = (simulations.pathA.phases as TimelinePhase[]).map(p => 
    `${p.title}: ${p.feeling}\n${p.shortSummary}`
  ).join('\n\n');
  
  const stayPhases = (simulations.pathB.phases as TimelinePhase[]).map(p => 
    `${p.title}: ${p.feeling}\n${p.shortSummary}`
  ).join('\n\n');
  
  return `Decision: "${decision}"
\nUser's answers:
${answersText}
\nPath A (Go) simulation summary:
${goPhases}
\nPath B (Stay) simulation summary:
${stayPhases}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision, answers, simulations } = result.data;

    let flashcards: FlashcardSet;

    // Mock fallback if no API key
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_api_key_here") {
      flashcards = {
        goFlashcards: [
          {
            content: "You run out of savings in month 4 and have to ask your parents for a loan.",
            pathType: "go",
            category: "financial",
            likelihood: "medium",
            emojiBefore: "💸",
            emojiAfter: "😖"
          },
          {
            content: "You realize you miss the routine you used to complain about every day.",
            pathType: "go",
            category: "emotional",
            likelihood: "high",
            emojiBefore: "🏠",
            emojiAfter: "😢"
          },
          {
            content: "Your old friends stop inviting you out because you're 'too busy' or 'too different'.",
            pathType: "go",
            category: "relationships",
            likelihood: "medium",
            emojiBefore: "📱",
            emojiAfter: "🔕"
          }
        ],
        stayFlashcards: [
          {
            content: "You see a LinkedIn update that someone else launched your idea.",
            pathType: "stay",
            category: "identity",
            likelihood: "low",
            emojiBefore: "👀",
            emojiAfter: "💔"
          },
          {
            content: "Ten years pass and you realize you never left your hometown.",
            pathType: "stay",
            category: "time",
            likelihood: "high",
            emojiBefore: "⏳",
            emojiAfter: "🕸️"
          },
          {
            content: "You become bitter towards people who took risks, calling them 'lucky'.",
            pathType: "stay",
            category: "emotional",
            likelihood: "medium",
            emojiBefore: "😒",
            emojiAfter: "😠"
          }
        ]
      };
    } else {
      try {
        const context = formatContextForPrompt(decision, answers, simulations as DualPathSimulationData);
        const prompt = `${SYSTEM_PROMPT}\n\nContext:\n${context}`;
        
        const geminiResult = await gemini.generateContent(prompt);
        const response = await geminiResult.response;
        const content = response.text();

        if (!content) throw new Error("No content from AI");

        // Extract JSON from the response
        let jsonString = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }

        flashcards = JSON.parse(jsonString) as FlashcardSet;
        
        // Validate structure
        if (!Array.isArray(flashcards.goFlashcards) || !Array.isArray(flashcards.stayFlashcards)) {
          throw new Error("Invalid flashcards format");
        }
      } catch (geminiError: unknown) {
        console.error("Gemini API Error:", geminiError);
        throw geminiError;
      }
    }

    return NextResponse.json(flashcards);

  } catch (error: any) {
    console.error("Flashcards API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}
