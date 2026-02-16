import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { checkRateLimit, incrementDecisionCount } from '@/lib/rate-limit';
import { QuestionAnswer, DualPathSimulationData, FlashcardSet, UserChoice } from '@/lib/types';
import { z } from 'zod';

// We can relax the validation here since we trust the generation API somewhat, 
// or keep it strict. Let's keep it structurally valid but flexible for JSON.
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
  }),
  flashcards: z.object({
    goFlashcards: z.array(z.any()),
    stayFlashcards: z.array(z.any())
  }),
  userChoice: z.enum(["go", "stay", "undecided"])
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to save decision" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation error:", result.error);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision, answers, simulations, flashcards, userChoice } = result.data;

    // Find or create user
    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      // In a real app we'd get email from Clerk token, but for now placeholder or handle better
      // Try to find by email if possible? No, Clerk ID is source of truth.
      // We'll create with a placeholder that will need updating or just ignore email unique constraint issues if they arise (unlikely for new users)
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@placeholder.com`, // Temporary
        }
      });
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(dbUser.id);
    if (!rateLimit.allowed) {
      const message = rateLimit.limitType === 'daily'
        ? "You've reached your daily limit of 2 decisions. Try again tomorrow or upgrade to Pro for unlimited access."
        : "You've reached your monthly limit of 5 decisions. Upgrade to Pro for unlimited access.";
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          limitType: rateLimit.limitType,
          message,
          remainingDaily: rateLimit.remainingDaily,
          remainingMonthly: rateLimit.remainingMonthly,
        },
        { status: 429 }
      );
    }

    // Create decision with all related data
    const savedDecision = await prisma.decision.create({
      data: {
        userId: dbUser.id,
        query: decision,
        userChoice: userChoice,
        status: "active",
        questionAnswers: {
          create: answers.map((a) => ({
            question: a.question,
            answer: a.answer,
            order: a.order
          }))
        },
        simulations: {
          create: [
            {
              pathType: "go",
              phases: simulations.pathA.phases // Saved as JSON
            },
            {
              pathType: "stay",
              phases: simulations.pathB.phases // Saved as JSON
            }
          ]
        },
        flashcards: {
          create: [
            ...flashcards.goFlashcards.map((card, i) => ({
              pathType: "go",
              data: card, // Saved as JSON
              order: i + 1
            })),
            ...flashcards.stayFlashcards.map((card, i) => ({
              pathType: "stay",
              data: card, // Saved as JSON
              order: i + 1
            }))
          ]
        }
      },
      include: {
        questionAnswers: true,
        simulations: true,
        flashcards: true
      }
    });

    // Increment rate limit counters after successful save
    await incrementDecisionCount(dbUser.id);

    return NextResponse.json({
      success: true,
      decisionId: savedDecision.id,
      message: "Decision saved successfully"
    });

  } catch (error: any) {
    console.error("Save Decision API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save decision." },
      { status: 500 }
    );
  }
}
