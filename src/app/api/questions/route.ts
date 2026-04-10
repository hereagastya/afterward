import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { GeneratedQuestion } from '@/lib/types';
import { z } from 'zod';

const RequestSchema = z.object({
  decision: z.string().min(5).max(1000),
});

const SYSTEM_PROMPT = `You are a decision clarity coach. Given a life decision, generate exactly 4-5 pointed, interactive questions to help the user gain clarity.

Your goal is to get to the emotional core and practical reality of the decision.

Generate a mix of these question types:
- "multiple_choice" (2-3 questions): Use this for categorical factors (e.g., primary driver, time pressure, emotional state). Provide exactly 3 short, punchy, and distinct options.
- "text" (1-2 questions): Use this for specific fears or scenarios.
- "scale" (1 question): Use this for gut feeling or confidence (1-10).

Return a JSON array with this structure:
[
  {
    "question": "What's the main emotion driving this decision?",
    "type": "multiple_choice",
    "options": ["Fear of missing out", "Financial pressure", "Excitement"]
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
          options: ["Financial Freedom", "Passion/Purpose", "External Pressure"]
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
          options: ["Doing it and failing", "Never trying at all", "Losing money"]
        }
      ];
    } else {
      const prompt = `You are a brutally honest therapist, not a supportive friend. Generate 5 UNCOMFORTABLE questions that will reveal what this person already knows but won't admit.

Decision: "${decision}"

PHILOSOPHY:
- Good therapy costs $150/hour because it makes you confront uncomfortable truths
- Your questions should do that in 5 minutes
- Don't ask what they think - ask what they're avoiding
- Don't be supportive - be confrontational (but not cruel)
- Surface the REAL reason, not the story they tell themselves

QUESTION ARCHETYPES:

1. PERMISSION-SEEKING DETECTOR
Bad: "What do you hope will happen?"
Good: "Are you asking for advice, or hoping someone gives you permission to do what you've already decided?"

2. SELF-DECEPTION REVEALER
Bad: "What concerns you?"
Good: "What story are you telling yourself about this that you know isn't completely true?"

3. FUTURE REGRET PROVOKER
Bad: "What might go wrong?"
Good: "It's 5 years from now and you chose wrong. What's the specific moment where you realized it?"

4. SOCIAL PRESSURE IDENTIFIER
Bad: "How do others feel about this?"
Good: "If nobody would ever know what you chose, would you still be asking this question?"

5. COMMITMENT TESTER
Bad: "How certain are you?"
Good: "What would have to happen for you to completely change your mind about this tomorrow?"

6. FEAR VS WISDOM SEPARATOR
Bad: "What scares you?"
Good: "Which of your fears are protecting you, and which are just keeping you small?"

7. HIDDEN MOTIVATION EXCAVATOR
Bad: "Why do you want this?"
Good: "What will this decision prove about you that you're trying to prove?"

8. RELATIONSHIP MIRROR
Bad: "What would your family think?"
Good: "If your best friend made this exact decision with your exact reasoning, what would you tell them?"

9. COST REVEALER
Bad: "What might you lose?"
Good: "What's the price of being wrong that you haven't said out loud yet?"

10. TIME-PRESSURE IDENTIFIER
Bad: "When do you need to decide?"
Good: "What are you afraid will happen if you wait another month to decide this?"

RULES:
- Generate EXACTLY 5 questions
- Mix types: 3 text (open-ended), 1 multiple_choice (4 options that are all uncomfortable), 1 scale (1-10)
- Each question must be under 25 words
- NO generic therapy-speak ("How does that make you feel?")
- NO supportive language ("What would make you happy?")
- NO markdown formatting (*bold*, _italic_) - plain text only
- Each question should make them pause and think "...shit, that's a good question"
- Questions should build on the decision context (use specific words from their decision)

MULTIPLE CHOICE FORMAT (if used):
Don't ask "What scares you?" with options like "Failure, Success, Unknown, Money"
Instead ask "What's really stopping you?" with options like:
- "I'm scared, but I'm calling it 'being realistic'"
- "I want someone else to make this choice for me"
- "I'm waiting for a sign that will never come"
- "I already decided, I just want validation"

Return JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": "Your confrontational question here"
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "question": "Your confrontational question here",
      "options": ["Uncomfortable option 1", "Uncomfortable option 2", "Uncomfortable option 3", "Uncomfortable option 4"]
    },
    {
      "id": "q3",
      "type": "text",
      "question": "Your confrontational question here"
    },
    {
      "id": "q4",
      "type": "scale",
      "question": "Your confrontational scale question (1=one extreme, 10=other)"
    },
    {
      "id": "q5",
      "type": "text",
      "question": "Your confrontational question here"
    }
  ]
}

Generate questions that will make them screenshot this and send it to their therapist.`

      try {
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

        const parsed = JSON.parse(jsonString);
        questions = parsed.questions || parsed;
        
        // Validate structure
        if (!Array.isArray(questions) || questions.length < 3) {
          throw new Error("Invalid questions format");
        }
      } catch (geminiError: unknown) {
        console.error("Gemini API Error (attempt 1), retrying...", geminiError);
        // Retry once before giving up
        try {
          const retryResult = await gemini.generateContent(prompt);
          const retryResponse = await retryResult.response;
          const retryContent = retryResponse.text();

          if (!retryContent) throw new Error("No content from AI on retry");

          let retryJsonString = retryContent;
          const retryJsonMatch = retryContent.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (retryJsonMatch) {
            retryJsonString = retryJsonMatch[1].trim();
          }

          const retryParsed = JSON.parse(retryJsonString);
          questions = retryParsed.questions || retryParsed;

          if (!Array.isArray(questions) || questions.length < 3) {
            throw new Error("Invalid questions format on retry");
          }
        } catch (retryError: unknown) {
          console.error("Gemini API Error (attempt 2, giving up):", retryError);
          throw retryError;
        }
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
