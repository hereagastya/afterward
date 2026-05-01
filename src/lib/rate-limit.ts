import { prisma } from './db'

export interface RateLimitResult {
  allowed: boolean
  message?: string
  remaining?: number
}

// Developer bypass — these emails get unlimited decisions, no rate limits
const BYPASS_EMAILS = ['sharmaagastya72@gmail.com']

async function getOrCreateUser(userId: string, realEmail?: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      email: true,
      simulationsUsed: true,
      simulationCredits: true,
    }
  })

  if (!user) {
    // New user — use real email if provided, otherwise placeholder
    const email = realEmail || `${userId}@placeholder.com`
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        simulationsUsed: 0,
        simulationCredits: 1, // 1 free credit
      }
    })
    return newUser
  }

  // If user exists with a placeholder email and we now have the real one, update it
  if (realEmail && user.email.endsWith('@placeholder.com')) {
    user = await prisma.user.update({
      where: { clerkId: userId },
      data: { email: realEmail },
      select: {
        id: true,
        email: true,
        simulationsUsed: true,
        simulationCredits: true,
      }
    })
  }

  return user
}

export async function checkRateLimit(userId: string, realEmail?: string): Promise<RateLimitResult> {
  // === LOCAL DEV BYPASS: DB IS DOWN ===
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true }
  }

  // Quick bypass check by email before hitting DB
  if (realEmail && BYPASS_EMAILS.includes(realEmail)) {
    return { allowed: true }
  }

  try {
    const user = await getOrCreateUser(userId, realEmail)

    // Bypass for developer email
    if (BYPASS_EMAILS.includes(user.email)) {
      return { allowed: true }
    }

    if (user.simulationCredits > 0) {
      return {
        allowed: true,
        remaining: user.simulationCredits - 1
      }
    } else {
      return {
        allowed: false,
        message: `You've used your free simulation. Get one more for $4.99`,
        remaining: 0
      }
    }
  } catch (error) {
    console.error("DB Error checking rate limit:", error)
    // If DB fails, allow the request to pass through so the user isn't blocked by infrastructure issues.
    return { allowed: true }
  }
}

export async function consumeCredit(userId: string, realEmail?: string): Promise<void> {
  // === LOCAL DEV BYPASS: DB IS DOWN ===
  if (process.env.NODE_ENV === 'development') {
    return
  }

  // Quick bypass check by email before hitting DB
  if (realEmail && BYPASS_EMAILS.includes(realEmail)) {
    return
  }

  try {
    const user = await getOrCreateUser(userId, realEmail)

    // Don't decrement for bypass emails
    if (BYPASS_EMAILS.includes(user.email)) {
      return
    }

    if (user.simulationCredits > 0) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          simulationCredits: user.simulationCredits - 1,
          simulationsUsed: user.simulationsUsed + 1
        }
      })
    }
  } catch (error) {
    console.error("DB Error consuming credit:", error)
  }
}
