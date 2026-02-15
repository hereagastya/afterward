import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const decision = await prisma.decision.findFirst({
      where: {
        id: id,
        user: {
          clerkId: userId
        }
      },
      include: {
        simulations: true,
        flashcards: true,
        questionAnswers: {
            orderBy: { order: 'asc' }
        },
        checkIns: {
            orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json(decision);

  } catch (error: any) {
    console.error("Fetch Decision Details Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decision details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership before delete
    const decision = await prisma.decision.findFirst({
        where: {
            id: id,
            user: { clerkId: userId }
        }
    });

    if (!decision) {
        return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    await prisma.decision.delete({
        where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Delete Decision Error:", error);
    return NextResponse.json(
      { error: "Failed to delete decision" },
      { status: 500 }
    );
  }
}
