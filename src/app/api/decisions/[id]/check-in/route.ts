import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const CheckInSchema = z.object({
  status: z.string().optional(),
  reflection: z.string().min(1, "Reflection cannot be empty"),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    
    const result = CheckInSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { status, reflection } = result.data;

    // Verify ownership
    const decision = await prisma.decision.findFirst({
      where: {
        id: id,
        user: { clerkId: userId }
      }
    });

    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    // Create check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        decisionId: id,
        prompt: "Manual Check-in",
        response: reflection,
        scheduledFor: new Date(),
        completedAt: new Date(),
      }
    });

    // Update status if provided
    if (status && status !== decision.status) {
      await prisma.decision.update({
        where: { id },
        data: { status }
      });
    }

    return NextResponse.json({ success: true, checkIn });

  } catch (error: any) {
    console.error("Check-in Error:", error);
    return NextResponse.json(
      { error: "Failed to submit check-in" },
      { status: 500 }
    );
  }
}
