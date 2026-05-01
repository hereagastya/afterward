import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the real email from Clerk so the bypass works correctly
    const user = await currentUser();
    const realEmail = user?.emailAddresses?.[0]?.emailAddress;

    const result = await checkRateLimit(userId, realEmail);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Check Limit API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check rate limits." },
      { status: 500 }
    );
  }
}
