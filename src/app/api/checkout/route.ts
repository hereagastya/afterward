import { NextResponse } from 'next/server';
import { dodo, PRODUCT_ID_PRO, PRODUCT_ID_PREMIUM } from '@/lib/dodo';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await req.json();

    if (!tier || !['pro', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "pro" or "premium".' },
        { status: 400 }
      );
    }

    // Look up the user in the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Select the correct product ID based on tier
    const productId = tier === 'pro' ? PRODUCT_ID_PRO : PRODUCT_ID_PREMIUM;

    if (!productId) {
      console.error(`Missing DODO_PRODUCT_ID for tier: ${tier}`);
      return NextResponse.json(
        { error: 'Product configuration error' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Dodo checkout session
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: dbUser.email,
        name:
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          undefined,
      },
      metadata: {
        userId: dbUser.id,
        clerkId: clerkId,
        tier: tier,
      },
      return_url: `${appUrl}/dashboard?success=true`,
    });

    if (!session.checkout_url) {
      console.error('Dodo checkout session created but no checkout_url returned:', session);
      return NextResponse.json(
        { error: 'Failed to create checkout URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.checkout_url });
  } catch (error: unknown) {
    console.error('Dodo Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
