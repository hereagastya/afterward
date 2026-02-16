import { prisma } from '@/lib/db';

const DAILY_LIMIT = 2;
const MONTHLY_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;

export interface RateLimitResult {
  allowed: boolean;
  limitType?: 'daily' | 'monthly';
  remainingDaily: number;
  remainingMonthly: number;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return { allowed: false, limitType: 'daily', remainingDaily: 0, remainingMonthly: 0 };
  }

  // Pro users have unlimited access
  if (user.isPro) {
    return { allowed: true, remainingDaily: Infinity, remainingMonthly: Infinity };
  }

  const now = new Date();
  let dailyCount = user.dailyDecisionCount;
  let monthlyCount = user.monthlyDecisionCount;

  // Reset daily counter if 24 hours have passed
  if (now.getTime() - user.lastDailyReset.getTime() >= DAY_MS) {
    dailyCount = 0;
    await prisma.user.update({
      where: { id: userId },
      data: { dailyDecisionCount: 0, lastDailyReset: now },
    });
  }

  // Reset monthly counter if 30 days have passed
  if (now.getTime() - user.lastMonthlyReset.getTime() >= MONTH_MS) {
    monthlyCount = 0;
    await prisma.user.update({
      where: { id: userId },
      data: { monthlyDecisionCount: 0, lastMonthlyReset: now },
    });
  }

  const remainingDaily = Math.max(0, DAILY_LIMIT - dailyCount);
  const remainingMonthly = Math.max(0, MONTHLY_LIMIT - monthlyCount);

  if (dailyCount >= DAILY_LIMIT) {
    return { allowed: false, limitType: 'daily', remainingDaily: 0, remainingMonthly };
  }

  if (monthlyCount >= MONTHLY_LIMIT) {
    return { allowed: false, limitType: 'monthly', remainingDaily, remainingMonthly: 0 };
  }

  return { allowed: true, remainingDaily, remainingMonthly };
}

export async function incrementDecisionCount(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyDecisionCount: { increment: 1 },
      monthlyDecisionCount: { increment: 1 },
    },
  });
}
