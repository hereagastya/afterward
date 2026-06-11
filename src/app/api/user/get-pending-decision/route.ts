import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the DB user first
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query latest pending_payment decision
    const pendingDecision = await prisma.decision.findFirst({
      where: {
        userId: dbUser.id,
        status: "pending_payment"
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        questionAnswers: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!pendingDecision) {
      return NextResponse.json({ success: false, message: "No pending decision found" }, { status: 404 });
    }

    // Map questionAnswers to correct format for the frontend
    const answers = pendingDecision.questionAnswers.map(qa => ({
      question: qa.question,
      answer: qa.answer,
      order: qa.order
    }));

    return NextResponse.json({
      success: true,
      decisionId: pendingDecision.id,
      decision: pendingDecision.query,
      answers,
      analysis: pendingDecision.analysis
    });

  } catch (error: any) {
    console.error("Get Pending Decision API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve pending decision." },
      { status: 500 }
    );
  }
}
