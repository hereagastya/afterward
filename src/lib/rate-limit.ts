import { prisma } from './db'

export interface RateLimitResult {
  allowed: boolean
  message?: string
  dailyRemaining?: number
  monthlyRemaining?: number
}

const DAILY_LIMIT = 2
const MONTHLY_LIMIT = 10

// Developer bypass
const BYPASS_EMAILS = ['sharmaagastya72@gmail.com']

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      email: true,
      isPro: true,
      dailyDecisionCount: true,
      monthlyDecisionCount: true,
      lastDailyReset: true,
      lastMonthlyReset: true
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Bypass for Pro users and developer
  if (user.isPro || BYPASS_EMAILS.includes(user.email)) {
    return { allowed: true }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let dailyCount = user.dailyDecisionCount
  let monthlyCount = user.monthlyDecisionCount

  // Reset daily counter if it's a new day
  if (!user.lastDailyReset || user.lastDailyReset < today) {
    dailyCount = 0
  }

  // Reset monthly counter if it's a new month
  if (!user.lastMonthlyReset || user.lastMonthlyReset < thisMonth) {
    monthlyCount = 0
  }

  // Check limits
  if (dailyCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      message: `You've reached your daily limit of ${DAILY_LIMIT} decisions. Upgrade to Pro for 50/month or Premium for unlimited.`,
      dailyRemaining: 0,
      monthlyRemaining: MONTHLY_LIMIT - monthlyCount
    }
  }

  if (monthlyCount >= MONTHLY_LIMIT) {
    return {
      allowed: false,
      message: `You've reached your monthly limit of ${MONTHLY_LIMIT} decisions. Upgrade to Pro for 50/month or Premium for unlimited.`,
      dailyRemaining: DAILY_LIMIT - dailyCount,
      monthlyRemaining: 0
    }
  }

  return {
    allowed: true,
    dailyRemaining: DAILY_LIMIT - dailyCount - 1,
    monthlyRemaining: MONTHLY_LIMIT - monthlyCount - 1
  }
}

export async function incrementDecisionCount(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      email: true,
      isPro: true,
      dailyDecisionCount: true,
      monthlyDecisionCount: true,
      lastDailyReset: true,
      lastMonthlyReset: true
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Don't increment for Pro users or developer
  if (user.isPro || BYPASS_EMAILS.includes(user.email)) {
    return
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let dailyCount = user.dailyDecisionCount
  let monthlyCount = user.monthlyDecisionCount

  // Reset counters if needed
  if (!user.lastDailyReset || user.lastDailyReset < today) {
    dailyCount = 0
  }

  if (!user.lastMonthlyReset || user.lastMonthlyReset < thisMonth) {
    monthlyCount = 0
  }

  // Increment both counters
  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      dailyDecisionCount: dailyCount + 1,
      monthlyDecisionCount: monthlyCount + 1,
      lastDailyReset: today,
      lastMonthlyReset: thisMonth
    }
  })
}
