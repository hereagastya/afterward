import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { QuestionAnswer, DualPathSimulation } from '@/lib/types';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, consumeCredit } from '@/lib/rate-limit';

const RequestSchema = z.object({
  decision: z.string().min(2).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  }))
});

function formatAnswersForPrompt(decision: string, answers: QuestionAnswer[]): string {
  return `You are writing a psychological thriller about a REAL PERSON'S future, not a business case study.

Decision: "${decision}"

Context from their answers:
${answers.map((a, i) => `
Q${i + 1}: ${a.question}
A${i + 1}: ${a.answer}
`).join('\n')}

CRITICAL WRITING RULES:

1. USE THEIR EXACT WORDS
- If they said "terrified" - use "terrified", not "concerned"
- If they mentioned "my 3 year old daughter" - reference her specifically
- If they said "burnt out" - don't say "experiencing fatigue"
- Mirror their language intensity

2. SHOW, DON'T TELL
Bad: "You'll feel stressed about money"
Good: "You check your bank balance three times before buying the $4 coffee. You get it anyway, but the guilt sits there."

Bad: "The relationship will suffer"
Good: "They're talking about their day and you realize you stopped listening two minutes ago. You nod anyway."

Bad: "You'll have regrets"
Good: "You see their LinkedIn update and close the tab. You'll open it again in 20 minutes."

3. INCLUDE MICRO-MOMENTS THAT REVEAL TRUTH
- Specific times: "Tuesday at 3pm", "the Uber ride home", "right before you fall asleep"
- Small behaviors: "refreshing your email", "laughing too loud at their joke", "taking the long way home"
- Physical sensations: "your jaw is clenched", "you're holding your breath", "the coffee tastes like nothing"
- What they notice: "the noise level", "how often you check the time", "that you used to love this"

4. UNCOMFORTABLE SPECIFICITY
Bad: "Financial pressure increases"
Good: "The Venmo request from your roommate for utilities hits different now. You have the money. You just hate that you're counting it."

Bad: "Work-life balance improves"
Good: "You're reading to your kid and you're actually there. Not thinking about Slack. Not composing an email in your head. Just there."

Bad: "Uncertainty causes stress"
Good: "You're explaining your decision to someone at a party and you hear yourself say 'I think it'll work out' and you don't believe you."

5. REVEAL THE HIDDEN COST/BENEFIT
Every moment should include something they didn't expect:
- In GO path: Show the hidden costs of freedom
- In STAY path: Show the hidden costs of safety

6. EMOTIONAL PRECISION
Don't use generic emotions. Use the specific shade:
- Not "sad" → "hollow"
- Not "happy" → "quietly proud"
- Not "anxious" → "wired and exhausted at the same time"
- Not "regret" → "that specific ache of knowing you had the chance"

STRUCTURE FOR EACH SCENARIO:

Base Case (60% likely):
- Most realistic outcome based on their actual constraints
- Show the slow reveal of truth, not dramatic events
- Include both what they expected AND what they didn't

Upside (20% likely):
- Things go better than planned
- BUT still show the unexpected costs
- Success has downsides they didn't predict

Downside (20% likely):
- Things go worse than planned
- BUT don't make it catastrophic
- Show the slow erosion, not the explosion

EACH MOMENT NEEDS:
- timeLabel: "3 Months", "1 Year", "3 Years"
- title: 3-6 words, poetic but clear
- description: 3-4 sentences, hyper-specific, uncomfortably accurate
- feeling: ONE word emotion (the precise shade)

NOW GENERATE:

PathA (If You GO):
- baseCase: 3 moments
- upside: 3 moments
- downside: 3 moments

PathB (If You STAY):
- baseCase: 3 moments
- upside: 3 moments
- downside: 3 moments

Plus tradeoffs analysis on these dimensions (score -5 to +5 for each path):
- money: Real financial impact with specific numbers if possible
- stress: The specific type of stress (deadline stress vs existential stress)
- sleep: Literal sleep quality and 3am thoughts
- growth: What they're learning/becoming vs what they're losing
- regretRisk: The specific regret they'll feel

Each tradeoff needs a "summary" that's brutally honest, not corporate-speak.

Return JSON matching this structure:
{
  "pathA": {
    "label": "If You GO",
    "baseCase": { "probability": "60%", "moments": [{ "timeLabel": "3 Months", "title": "...", "description": "...", "feeling": "..." }, ...] },
    "upside": { "probability": "20%", "moments": [...] },
    "downside": { "probability": "20%", "moments": [...] },
    "tradeoffs": {
      "money": { "score": 0, "summary": "..." },
      "stress": { "score": 0, "summary": "..." },
      "sleep": { "score": 0, "summary": "..." },
      "growth": { "score": 0, "summary": "..." },
      "regretRisk": { "score": 0, "summary": "..." }
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

Return ONLY valid JSON. Make this feel so personal they wonder if you've been watching them.`;
}

function normalizeScenario(scenario: any, label: string): any {
  if (!scenario) {
    console.warn(`[AI Normalization] Missing scenario ${label}`);
    return {
      probability: "20%",
      moments: [
        { timeLabel: "3 Months", title: "Still Transitioning", description: "The details are still becoming clear. Momentum is building.", feeling: "quietly hopeful" },
        { timeLabel: "1 Year", title: "Settling In", description: "The path you chose is taking shape. One day at a time.", feeling: "steady" },
        { timeLabel: "3 Years", title: "The Result", description: "Looking back, the clarity you sought is finally yours.", feeling: "at peace" }
      ]
    };
  }

  const normalizedMoments = Array.isArray(scenario.moments) ? [...scenario.moments] : [];
  
  // Fill missing moments up to 3
  while (normalizedMoments.length < 3) {
    const idx = normalizedMoments.length;
    const labels = ["3 Months", "1 Year", "3 Years"];
    console.warn(`[AI Normalization] Missing moment ${idx + 1} in scenario ${label}`);
    normalizedMoments.push({
      timeLabel: labels[idx] || `${idx + 1} Years`,
      title: "The Vision Unfolds",
      description: "The AI didn't provide specific details for this moment, but the path continues forward.",
      feeling: "contemplative"
    });
  }

  return {
    probability: scenario.probability || "20%",
    moments: normalizedMoments.slice(0, 3).map((m: any) => ({
      timeLabel: m.timeLabel || "Future Moment",
      title: m.title || "The Vision Unfolds",
      description: m.description || "The path continues to reveal itself as you move forward.",
      feeling: m.feeling || "contemplative"
    }))
  };
}

function normalizePath(path: any, label: string): any {
  if (!path) {
    console.warn(`[AI Normalization] Missing path ${label}`);
    // Create a dummy path if it's completely missing
    return {
      label: label,
      baseCase: normalizeScenario(null, `${label}.baseCase`),
      upside: normalizeScenario(null, `${label}.upside`),
      downside: normalizeScenario(null, `${label}.downside`),
      tradeoffs: normalizeTradeoffs(null)
    };
  }

  return {
    label: path.label || label,
    baseCase: normalizeScenario(path.baseCase, `${label}.baseCase`),
    upside: normalizeScenario(path.upside, `${label}.upside`),
    downside: normalizeScenario(path.downside, `${label}.downside`),
    tradeoffs: normalizeTradeoffs(path.tradeoffs)
  };
}

function normalizeTradeoffs(tradeoffs: any): any {
  const dimensions = ['money', 'stress', 'sleep', 'growth', 'regretRisk'];
  const normalized: any = {};
  
  dimensions.forEach(dim => {
    if (tradeoffs && tradeoffs[dim]) {
      normalized[dim] = {
        score: typeof tradeoffs[dim].score === 'number' ? tradeoffs[dim].score : 0,
        summary: tradeoffs[dim].summary || "No specific details provided."
      };
    } else {
      normalized[dim] = {
        score: 0,
        summary: "No data provided."
      };
    }
  });
  
  return normalized;
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
        const prompt = formatAnswersForPrompt(decision, answers);
        
        const geminiResult = await generateContentWithFallback(prompt);
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
        
        // Robust normalization to prevent frontend crashes
        simulations.pathA = normalizePath(simulations.pathA, "If You GO");
        simulations.pathB = normalizePath(simulations.pathB, "If You STAY");
        
        // Final sanity check
        if (!simulations.pathA.baseCase || !simulations.pathB.baseCase) {
          throw new Error("Failed to produce a valid simulation structure");
        }
      } catch (geminiError: unknown) {
        console.error("Gemini API Error:", geminiError);
        throw geminiError;
      }
    }

    // Increment counter AFTER successful generation
    await consumeCredit(userId);

    return NextResponse.json(simulations);

  } catch (error: any) {
    console.error("Simulate Paths API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate simulations." },
      { status: 500 }
    );
  }
}
