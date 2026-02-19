import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { QuestionAnswer, DualPathSimulationData } from '@/lib/types';
import { z } from 'zod';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

const RequestSchema = z.object({
  decision: z.string().min(5).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  }))
});

const SYSTEM_PROMPT = `You are a future-self simulator. Given a life decision and user context, generate two distinct timelines: one where they make the change (Path A), and one where they don't (Path B).

For each path, simulate 4 key moments:
1. "Immediate" (First month)
2. "Short Term" (3 months)
3. "Medium Term" (1 year)
4. "Long Term" (3 years)

For each moment, provide:
- title: A specific, evocative title for that phase (e.g., "The Honeymoon Crash", "The Quiet Resignation")
- emoji: A single emoji representing the dominant vibe
- timeLabel: "Now", "3 months", "1 year", "3 years"
- feeling: A 2-4 word emotional summary (lowercased)
- shortSummary: 2 concise sentences describing the reality. Focus on sensory details and internal monologue.
- details: 2 specific bullet points (concrete events, thoughts, or observations).

Return a JSON object with this exact structure:
{
  "pathA": {
    "pathType": "go",
    "pathTitle": "If You Go",
    "phases": [
      {
        "title": "The Leap",
        "emoji": "🚀",
        "timeLabel": "Now",
        "feeling": "terrified exhilaration",
        "shortSummary": "You sign the papers. Your hands are shaking but the air smells different.",
        "details": [" waking up at 4am wondering if you messed up", " a surprising text from an old friend"]
      },
      ... (3 more phases)
    ]
  },
  "pathB": {
    "pathType": "stay",
    "pathTitle": "If You Stay",
    "phases": [ ... 4 phases ... ]
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
    
    // 1. Rate Limiting Check (Only if user is logged in)
    // If not logged in, they can't save anyway, but let's restrict generation too or rely on client side?
    // The prompt implies "User" (likely logged in). If userId exists, we check limits.
    
    if (userId) {
      const user = await db.user.findUnique({
        where: { clerkId: userId }
      });

      if (user) {
        // Daily Limit Logic
        const now = new Date();
        const lastDaily = new Date(user.lastDailyReset);
        const isNewDay = now.getDate() !== lastDaily.getDate() || 
                         now.getMonth() !== lastDaily.getMonth() || 
                         now.getFullYear() !== lastDaily.getFullYear();
        
        // Monthly Limit Logic
        const lastMonthly = new Date(user.lastMonthlyReset);
        const isNewMonth = now.getMonth() !== lastMonthly.getMonth() || 
                           now.getFullYear() !== lastMonthly.getFullYear();

        let dailyCount = user.dailyDecisionCount;
        let monthlyCount = user.monthlyDecisionCount;

        // Reset if needed
        if (isNewDay) {
          dailyCount = 0;
          await db.user.update({
             where: { id: user.id },
             data: { dailyDecisionCount: 0, lastDailyReset: now }
          });
        }

        if (isNewMonth) {
          monthlyCount = 0;
          await db.user.update({
             where: { id: user.id },
             data: { monthlyDecisionCount: 0, lastMonthlyReset: now }
          });
        }

        // Check Limits (2 per day, 10 per month)
        // Note: isPro check could be added here later
        if (!user.isPro) {
            if (dailyCount >= 2) {
            return NextResponse.json(
                { error: "Daily limit reached", code: "RATE_LIMIT_DAILY" },
                { status: 429 }
            );
            }
            if (monthlyCount >= 10) {
            return NextResponse.json(
                { error: "Monthly limit reached", code: "RATE_LIMIT_MONTHLY" },
                { status: 429 }
            );
            }
        }
        
        // Increment counts
        await db.user.update({
            where: { id: user.id },
            data: {
                dailyDecisionCount: dailyCount + 1,
                monthlyDecisionCount: monthlyCount + 1
            }
        });
      }
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision, answers } = result.data;

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

    return NextResponse.json(simulations);

  } catch (error: any) {
    console.error("Simulate Paths API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate simulations." },
      { status: 500 }
    );
  }
}

