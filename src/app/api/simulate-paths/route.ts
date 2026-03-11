import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { QuestionAnswer, DualPathSimulationData } from '@/lib/types';
import { z } from 'zod';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkRateLimit, incrementDecisionCount } from '@/lib/rate-limit';
import { prisma } from '@/lib/db';

const RequestSchema = z.object({
  decision: z.string().min(5).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  }))
});

const SYSTEM_PROMPT = `Generate a dual-path timeline simulation.

CRITICAL: Keep ALL text extremely short and punchy.

For each timeline moment:
- title: Maximum 5 words
- emoji: A single emoji representing the dominant vibe
- timeLabel: "Now", "3 months", "1 year", "3 years"
- feeling: One word (e.g. "dread", "hope", "regret") (lowercased)
- shortSummary: EXACTLY 3 short sentences (max 7 words each)
- details: 2-3 bullet points (max 10 words each)

Example moment:
{
  "title": "The Leap",
  "emoji": "🚀",  
  "timeLabel": "Now",
  "feeling": "terror",
  "shortSummary": "You quit today. Heart racing. No safety net.",
  "details": [
    "Handed in resignation this morning",
    "Savings cover 6 months max"
  ]
}

NO long paragraphs. Keep it cinematic and punchy.

Return a JSON object with this exact structure:
{
  "pathA": {
    "pathType": "go",
    "pathTitle": "If You Go",
    "phases": [ ... ]
  },
  "pathB": {
    "pathType": "stay",
    "pathTitle": "If You Stay",
    "phases": [ ... ]
  }
}

Rules:
- Be realistic, not idealistic.
- Path A should show the struggle of change.
- Path B should show the subtle decay of stagnation (or the comfort of safety, depending on context).
- Use the user's answers to personalize details.
- Return ONLY valid JSON.`;

function formatAnswersForPrompt(answers: QuestionAnswer[]): string {
  return answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n');
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision, answers } = result.data;

    // CHECK RATE LIMIT FIRST (before expensive API call)
    const rateLimitResult = await checkRateLimit(userId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "rate_limit_exceeded",
          message: rateLimitResult.message || "You've reached your limit. Upgrade to continue."
        },
        { status: 429 }
      );
    }



    let simulations: DualPathSimulationData;

    // Mock fallback if no API key
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_api_key_here") {
      simulations = {
        pathA: {
          pathType: "go",
          pathTitle: "If You Go",
          phases: [
            {
              title: "The Plunge",
              emoji: "🌊",
              timeLabel: "Now",
              feeling: "shock and awe",
              shortSummary: "The water is colder than you thought. You gasp, but you're swimming.",
              details: ["Deleting the old apps from your phone", "That first awkward dinner conversation"]
            },
            {
              title: "The Grind",
              emoji: "🧗",
              timeLabel: "3 months",
              feeling: "exhausted determination",
              shortSummary: "The novelty has worn off. Now it's just work. You miss your old comfort zone.",
              details: ["Checking your bank account nervously", "Questioning if you have what it takes"]
            },
            {
              title: "The Breakthrough",
              emoji: "💡",
              timeLabel: "1 year",
              feeling: "steady competence",
              shortSummary: "You aren't the new person anymore. You have scars, but you have skills.",
              details: ["Teaching someone else how to do it", "Sleeping soundly for the first time"]
            },
            {
              title: "The Transformation",
              emoji: "🦋",
              timeLabel: "3 years",
              feeling: "integrated wholeness",
              shortSummary: "You can't imagine fitting into your old life. It feels like a skin you shed.",
              details: ["Laughing at your old fears", "Planning the next big leap"]
            }
          ]
        },
        pathB: {
          pathType: "stay",
          pathTitle: "If You Stay",
          phases: [
            {
              title: "The Relief",
              emoji: "🛋️",
              timeLabel: "Now",
              feeling: "safe but heavy",
              shortSummary: "You close the door on the opportunity. It's safe here. Warm.",
              details: ["Ordering the usual take-out", "Ignoring the nagging voice in your head"]
            },
            {
              title: "The Itch",
              emoji: "🐜",
              timeLabel: "3 months",
              feeling: "restless irritation",
              shortSummary: "Everything is fine. Just fine. Why does that make you want to scream?",
              details: ["Snapping at a coworker for no reason", "Doomscrolling until 2am"]
            },
            {
              title: "The Resignation",
              emoji: "😐",
              timeLabel: "1 year",
              feeling: "numb acceptance",
              shortSummary: "You've convinced yourself it was for the best. The dream feels childish now.",
              details: ["Deleting the bookmark folder", "Focusing entirely on the weekend"]
            },
            {
              title: "The Hollow",
              emoji: "🕳️",
              timeLabel: "3 years",
              feeling: "quiet regret",
              shortSummary: "You see someone else take that leap. You feel a pang in your chest that doesn't go away.",
              details: ["Wondering 'what if' during your commute", "Feeling older than you are"]
            }
          ]
        }
      };
    } else {
      try {
        const answersFormatted = formatAnswersForPrompt(answers);
        const prompt = `${SYSTEM_PROMPT}\n\nDecision: "${decision}"\n\nUser's answers to probing questions:\n${answersFormatted}`;
        
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

        simulations = JSON.parse(jsonString) as DualPathSimulationData;
        
        // Validate structure
        if (!simulations.pathA || !simulations.pathB || !simulations.pathA.phases || simulations.pathA.phases.length < 3) {
          throw new Error("Invalid simulation format");
        }
      } catch (geminiError: unknown) {
        console.error("Gemini API Error:", geminiError);
        throw geminiError;
      }
    }

    // Increment counter AFTER successful generation
    await incrementDecisionCount(userId);

    return NextResponse.json(simulations);

  } catch (error: any) {
    console.error("Simulate Paths API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate simulations." },
      { status: 500 }
    );
  }
}

