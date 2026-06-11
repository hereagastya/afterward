import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const RequestSchema = z.object({
  decision: z.string().min(5).max(500),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number()
  })),
  analysis: z.any().optional()
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      console.error("Pending decision validation error:", result.error);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { decision, answers, analysis } = result.data;

    // Find or create user
    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.com`;
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
        }
      });
    }

    // Save pending decision
    const savedDecision = await prisma.decision.create({
      data: {
        userId: dbUser.id,
        query: decision,
        status: "pending_payment",
        analysis: analysis || null,
        clarityScore: analysis?.clarityScore || null,
        fearLevel: analysis?.fearLevel || null,
        logicLevel: analysis?.logicLevel || null,
        questionAnswers: {
          create: answers.map((a) => ({
            question: a.question,
            answer: a.answer,
            order: a.order
          }))
        }
      }
    });

    return NextResponse.json({
      success: true,
      decisionId: savedDecision.id
    });

  } catch (error: any) {
    console.error("Save Pending Decision API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save pending decision." },
      { status: 500 }
    );
  }
}
