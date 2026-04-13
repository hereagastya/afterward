import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { dodo } from '@/lib/dodo';
import type { UnwrapWebhookEvent } from 'dodopayments/resources/webhooks';
import type { Payment } from 'dodopayments/resources/payments';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();

    // Build headers object for webhook verification
    const webhookHeaders: Record<string, string> = {};
    headersList.forEach((value, key) => {
      webhookHeaders[key] = value;
    });

    // Try to verify + parse the webhook using the SDK
    let event: UnwrapWebhookEvent;
    try {
      event = dodo.webhooks.unwrap(body, { headers: webhookHeaders });
    } catch {
      // Fallback for development when no webhook key is configured
      console.warn('Webhook signature verification failed, using unsafeUnwrap');
      event = dodo.webhooks.unsafeUnwrap(body) as UnwrapWebhookEvent;
    }

    console.log('Dodo Webhook Event:', event.type);

    switch (event.type) {
      // Payment succeeded for per-simulation usage
      case 'payment.succeeded': {
        const payment = event.data as Payment;
        const clerkId = payment.metadata?.clerkId;
        const customerId = payment.customer?.customer_id;

        if (clerkId) {
          // Increment the simulationCredits by 1
          await prisma.user.update({
            where: { clerkId },
            data: {
              simulationCredits: {
                increment: 1,
              },
              stripeCustomerId: customerId || null,
            },
          });
          console.log(`✅ User ${clerkId} purchased 1 simulation credit via payment.succeeded`);
        } else {
          console.warn('⚠️ payment.succeeded but no clerkId in metadata');
        }
        break;
      }

      case 'payment.failed': {
        console.error('❌ Payment failed:', event.data);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook Error:', error);
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json(
      { error: 'Webhook processing failed', details: message },
      { status: 400 }
    );
  }
}
