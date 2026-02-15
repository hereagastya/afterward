import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decisions = await prisma.decision.findMany({
      where: {
        user: {
          clerkId: userId
        }
      },
      select: {
        id: true,
        query: true,
        userChoice: true,
        status: true,
        createdAt: true,
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ decisions });

  } catch (error: any) {
    console.error("Fetch Decisions Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}
