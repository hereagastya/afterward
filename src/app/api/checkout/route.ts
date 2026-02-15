import { NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a Paddle transaction for checkout
    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId: process.env.PADDLE_PRICE_ID || '',
          quantity: 1,
        },
      ],
      customData: {
        clerkUserId: userId,
      },
      checkout: {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    });

    // Return the checkout URL for the client to redirect to
    return NextResponse.json({ 
      transactionId: transaction.id,
      // For Paddle Billing, we typically use the client-side Paddle.js for checkout
      // The transaction ID can be used to open the checkout overlay
    });
  } catch (error) {
    console.error('Paddle Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
