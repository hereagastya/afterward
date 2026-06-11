import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

import { QuestionAnswer, UserChoice } from '@/lib/types';
import { z } from 'zod';

// We can relax the validation here since we trust the generation API somewhat, 
// or keep it strict. Let's keep it structurally valid but flexible for JSON.
const RequestSchema = z.object({
  decisionId: z.string().optional(),
  decision: z.string().min(5).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  })),
  simulations: z.object({
    pathA: z.any(),
    pathB: z.any()
  }),
  userChoice: z.enum(["go", "stay", "undecided"]),
  analysis: z.any().optional() // Make analysis optional to avoid breaking existing requests
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();
    
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

    const { decisionId, decision, answers, simulations, userChoice, analysis } = result.data;

    // Find or create user
    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@placeholder.com`, // Temporary
        }
      });
    }

    // If decisionId is passed, update the existing pending decision record
    if (decisionId) {
      const existing = await prisma.decision.findUnique({
        where: { id: decisionId }
      });
      
      if (existing) {
        // Clear old relations to prevent duplicates
        await prisma.questionAnswer.deleteMany({ where: { decisionId } });
        await prisma.simulation.deleteMany({ where: { decisionId } });

        const updatedDecision = await prisma.decision.update({
          where: { id: decisionId },
          data: {
            userChoice: userChoice,
            status: "active",
            analysis: analysis || null,
            clarityScore: analysis?.clarityScore || null,
            fearLevel: analysis?.fearLevel || null,
            logicLevel: analysis?.logicLevel || null,
            predictionCorrect: analysis && userChoice !== "undecided" ? 
              (analysis.prediction === userChoice) : null,
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
                  phases: simulations.pathA as any
                },
                {
                  pathType: "stay",
                  phases: simulations.pathB as any
                }
              ]
            },
          }
        });

        return NextResponse.json({
          success: true,
          decisionId: updatedDecision.id,
          message: "Decision saved successfully (updated)"
        });
      }
    }

    // Create decision with all related data (fallback/new)
    const savedDecision = await prisma.decision.create({
      data: {
        userId: dbUser.id,
        query: decision,
        userChoice: userChoice,
        status: "active",
        analysis: analysis || null,
        clarityScore: analysis?.clarityScore || null,
        fearLevel: analysis?.fearLevel || null,
        logicLevel: analysis?.logicLevel || null,
        predictionCorrect: analysis && userChoice !== "undecided" ? 
          (analysis.prediction === userChoice) : null,
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
              phases: simulations.pathA as any // Saved as JSON (supports both old and new format)
            },
            {
              pathType: "stay",
              phases: simulations.pathB as any // Saved as JSON (supports both old and new format)
            }
          ]
        },
      },
      include: {
        questionAnswers: true,
        simulations: true
      }
    });

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
