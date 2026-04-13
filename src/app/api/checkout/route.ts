import { NextResponse } from 'next/server';
import { dodo, PRODUCT_ID_SIMULATION } from '@/lib/dodo';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since this is a single product now, we don't strictly need a 'tier' sent
    // but the payload might still send something. We ignore it.

    // Look up the user in the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const productId = PRODUCT_ID_SIMULATION;

    if (!productId) {
      console.error(`Missing DODO_PRODUCT_ID_SIMULATION`);
      return NextResponse.json(
        { error: 'Product configuration error' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afterward.fyi';

    // GET THE REAL EMAIL FROM CLERK (NOT DATABASE)
    const realEmail = clerkUser.emailAddresses[0]?.emailAddress || dbUser.email;

    // Create a Dodo checkout session
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: realEmail,
        name:
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          undefined,
      },
      metadata: {
        userId: dbUser.id,
        clerkId: clerkId,
      },
      return_url: `${appUrl}/?payment=success`, // Ensure we go back to the app home page
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