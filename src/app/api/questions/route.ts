import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { GeneratedQuestion } from '@/lib/types';
import { z } from 'zod';

const RequestSchema = z.object({
  decision: z.string().min(5).max(500),
});

const SYSTEM_PROMPT = `You are a decision clarity coach. Given a life decision, generate exactly 4-5 pointed, interactive questions to help the user gain clarity.

Your goal is to get to the emotional core and practical reality of the decision.

Generate a mix of these question types:
- "multiple_choice" (2-3 questions): Use this for categorical factors (e.g., primary driver, time pressure, emotional state). Provide 4-5 short, punchy options.
- "text" (1-2 questions): Use this for specific fears or scenarios.
- "scale" (1 question): Use this for gut feeling or confidence (1-10).

Return a JSON array with this structure:
[
  {
    "question": "What's the main emotion driving this decision?",
    "type": "multiple_choice",
    "options": ["Fear of missing out", "Boredom", "Financial pressure", "Excitement", "Anxiety"]
  },
  {
    "question": "What is the worst-case scenario if you do this?",
    "type": "text"
  },
  {
    "question": "On a scale of 1-10, how much do you trust your gut on this?",
    "type": "scale"
  }
]

Rules:
- Keep questions short (max 15 words).
- Keep options short (max 5 words).
- For "scale" type, the UI handles the 1-10 slider, so just return type "scale".
- Return ONLY valid JSON.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision } = result.data;

    let questions: GeneratedQuestion[];

    // Mock fallback if no API key
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_api_key_here") {
      questions = [
        {
          question: "What is the primary driver for this decision?",
          type: "multiple_choice",
          options: ["Financial Freedom", "Passion/Purpose", "Escaping current situation", "External Pressure", "Curiosity"]
        },
        {
          question: "What is your biggest fear about saying YES?",
          type: "text"
        },
        {
          question: "How confident do you feel right now? (1 = Terrified, 10 = Ready)",
          type: "scale"
        },
        {
          question: "What would you regret more in 10 years?",
          type: "multiple_choice",
          options: ["Doing it and failing", "Never trying at all", "Burning bridges", "Losing money"]
        }
      ];
    } else {
      try {
        const prompt = `${SYSTEM_PROMPT}\n\nDecision being contemplated: "${decision}"`;
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

        questions = JSON.parse(jsonString) as GeneratedQuestion[];
        
        // Validate structure
        if (!Array.isArray(questions) || questions.length < 3) {
          throw new Error("Invalid questions format");
        }
      } catch (geminiError: unknown) {
        console.error("Gemini API Error:", geminiError);
        throw geminiError;
      }
    }

    return NextResponse.json({ questions });

  } catch (error: any) {
    console.error("Questions API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions." },
      { status: 500 }
    );
  }
}
