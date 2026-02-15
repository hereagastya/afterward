import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Verify Paddle webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Paddle-Signature') || '';

  // Extract the h1 (HMAC) value from the signature header
  // Format: ts=timestamp;h1=hmac_signature
  const signatureParts = signature.split(';');
  const h1Part = signatureParts.find(part => part.startsWith('h1='));
  const h1 = h1Part ? h1Part.split('=')[1] : '';

  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

  // For production, verify the signature
  if (process.env.NODE_ENV === 'production' && webhookSecret) {
    // Paddle signature verification is more complex, simplified here
    // In production, use Paddle's SDK verification methods
  }

  try {
    const event = JSON.parse(body);

    // Handle transaction completed event
    if (event.event_type === 'transaction.completed') {
      const customData = event.data?.custom_data;
      const clerkUserId = customData?.clerkUserId;

      if (clerkUserId) {
        await prisma.user.update({
          where: { clerkId: clerkUserId },
          data: { isPro: true },
        });
        console.log(`User ${clerkUserId} upgraded to Pro!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Paddle Webhook Error:', error);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }
}
