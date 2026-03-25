import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { QuestionAnswer, DualPathSimulation } from '@/lib/types';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, incrementDecisionCount } from '@/lib/rate-limit';

const RequestSchema = z.object({
  decision: z.string().min(2).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  }))
});

const SYSTEM_PROMPT = `Generate a realistic dual-path simulation with multiple scenarios.

CRITICAL: Keep each scenario CONCISE. 2-3 sentences per moment MAX.

For EACH path (GO and STAY), generate 3 scenarios:

1. BASE CASE (60% likely): Most realistic outcome
2. UPSIDE (20% likely): If things go better than expected  
3. DOWNSIDE (20% likely): If things go worse than expected

For each scenario, show 3 timeline moments only:
- 3 MONTHS
- 1 YEAR
- 3 YEARS

Each moment needs:
- title: 3-5 words max
- description: 2-3 sentences, brutally honest
- feeling: one word (e.g. "relieved", "anxious", "regretful")

After scenarios, analyze tradeoffs on 5 dimensions (score from -5 to +5):
- Money/Financial stability
- Stress/Anxiety levels
- Sleep quality (literal 3am thoughts)
- Personal growth
- Regret risk

Be HONEST. Don't sugarcoat. Show real emotional and practical costs.

Return JSON:
{
  "pathA": {
    "label": "If You GO",
    "baseCase": {
      "probability": "60%",
      "moments": [
        {
          "timeLabel": "3 Months",
          "title": "The Grind Begins",
          "description": "Savings dwindling. First client flaked. Doubt creeping in.",
          "feeling": "anxious"
        },
        { "timeLabel": "1 Year", "title": "...", "description": "...", "feeling": "..." },
        { "timeLabel": "3 Years", "title": "...", "description": "...", "feeling": "..." }
      ]
    },
    "upside": { "probability": "20%", "moments": [ ... ] },
    "downside": { "probability": "20%", "moments": [ ... ] },
    "tradeoffs": {
      "money": { "score": -2, "summary": "40% pay cut year one, break-even year two" },
      "stress": { "score": -3, "summary": "..." },
      "sleep": { "score": -2, "summary": "..." },
      "growth": { "score": 4, "summary": "..." },
      "regretRisk": { "score": 1, "summary": "..." }
    }
  },
  "pathB": {
    "label": "If You STAY",
    "baseCase": { ... },
    "upside": { ... },
    "downside": { ... },
    "tradeoffs": { ... }
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

    let simulations: DualPathSimulation;

    // Mock fallback if no API key
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_api_key_here") {
      simulations = {
        pathA: {
          label: "If You GO",
          baseCase: {
            probability: "60%",
            moments: [
              { timeLabel: "3 Months", title: "The Grind Begins", description: "Savings dwindling. First client flaked. Doubt creeping in hard.", feeling: "anxious" },
              { timeLabel: "1 Year", title: "Finding Your Feet", description: "Revenue is inconsistent but growing. You've learned more in 12 months than 5 years at the old job.", feeling: "determined" },
              { timeLabel: "3 Years", title: "The New Normal", description: "You can't imagine going back. The income finally matches what you left behind.", feeling: "proud" }
            ]
          },
          upside: {
            probability: "20%",
            moments: [
              { timeLabel: "3 Months", title: "Early Traction", description: "A lucky break lands you a big client. Momentum feels real for the first time.", feeling: "excited" },
              { timeLabel: "1 Year", title: "Scaling Fast", description: "You're hiring help and turning away work. The bet paid off sooner than expected.", feeling: "thriving" },
              { timeLabel: "3 Years", title: "Industry Leader", description: "You're the person people come to. Financial freedom and creative control.", feeling: "fulfilled" }
            ]
          },
          downside: {
            probability: "20%",
            moments: [
              { timeLabel: "3 Months", title: "The Freefall", description: "No clients, no income. Emergency fund evaporating. Partner getting nervous.", feeling: "terrified" },
              { timeLabel: "1 Year", title: "Crawling Back", description: "Had to take a worse job than what you left. Ego bruised. Lesson expensive.", feeling: "humiliated" },
              { timeLabel: "3 Years", title: "The Scar", description: "Financially recovered but the failure haunts you. You play it safe now.", feeling: "regretful" }
            ]
          },
          tradeoffs: {
            money: { score: -2, summary: "40% pay cut year one, break-even year two" },
            stress: { score: -3, summary: "Constant uncertainty, no safety net" },
            sleep: { score: -2, summary: "3am anxiety about making rent" },
            growth: { score: 4, summary: "Massive personal and professional growth" },
            regretRisk: { score: 1, summary: "Low regret—at least you tried" }
          }
        },
        pathB: {
          label: "If You STAY",
          baseCase: {
            probability: "60%",
            moments: [
              { timeLabel: "3 Months", title: "Same Old Routine", description: "Nothing changed. The relief of not quitting fades into familiar numbness.", feeling: "numb" },
              { timeLabel: "1 Year", title: "Golden Handcuffs", description: "Got a raise. Now it's even harder to leave. The dream feels further away.", feeling: "trapped" },
              { timeLabel: "3 Years", title: "The Quiet Ache", description: "Comfortable but hollow. You watch others take the leap you didn't.", feeling: "wistful" }
            ]
          },
          upside: {
            probability: "20%",
            moments: [
              { timeLabel: "3 Months", title: "Unexpected Pivot", description: "New project lands on your desk. It's actually interesting for once.", feeling: "surprised" },
              { timeLabel: "1 Year", title: "Internal Rise", description: "Promoted. More money, more autonomy. Maybe this path wasn't so bad.", feeling: "satisfied" },
              { timeLabel: "3 Years", title: "Rewritten Story", description: "You found meaning without the dramatic leap. Stability has its own rewards.", feeling: "content" }
            ]
          },
          downside: {
            probability: "20%",
            moments: [
              { timeLabel: "3 Months", title: "The Layoff", description: "They let you go anyway. You stayed for safety and got neither.", feeling: "shocked" },
              { timeLabel: "1 Year", title: "Starting Over", description: "Job market is brutal. You're competing with people 10 years younger.", feeling: "desperate" },
              { timeLabel: "3 Years", title: "Bitter Wisdom", description: "You should have left on your own terms. Now the story wrote itself.", feeling: "bitter" }
            ]
          },
          tradeoffs: {
            money: { score: 3, summary: "Steady paycheck, benefits, annual raises" },
            stress: { score: 1, summary: "Predictable stress, manageable anxiety" },
            sleep: { score: 2, summary: "Sleep fine, but morning dread is real" },
            growth: { score: -3, summary: "Skills plateauing, resume stagnating" },
            regretRisk: { score: -4, summary: "High regret—the 'what if' never goes away" }
          }
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

        simulations = JSON.parse(jsonString) as DualPathSimulation;
        
        // Validate structure
        if (!simulations.pathA || !simulations.pathB || !simulations.pathA.baseCase || !simulations.pathA.tradeoffs) {
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
