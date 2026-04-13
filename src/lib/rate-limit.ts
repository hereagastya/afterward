import { prisma } from './db'

export interface RateLimitResult {
  allowed: boolean
  message?: string
  remaining?: number
}

// Developer bypass
const BYPASS_EMAILS = ['sharmaagastya72@gmail.com']

async function getOrCreateUser(userId: string) {
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
    // If user doesn't exist, create them
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@placeholder.com`, // We'll update this if they save a decision with real email
        simulationsUsed: 0,
        simulationCredits: 1, // 1 free credit
      }
    })
    
    return newUser
  }

  return user
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  // === LOCAL DEV BYPASS: DB IS DOWN ===
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true }
  }

  try {
    const user = await getOrCreateUser(userId)

    // Bypass for developer
    if (BYPASS_EMAILS.includes(user.email)) {
      return { allowed: true }
    }

    if (user.simulationCredits > 0) {
      return {
        allowed: true,
        remaining: user.simulationCredits - 1 // After they use this one
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

export async function consumeCredit(userId: string): Promise<void> {
  // === LOCAL DEV BYPASS: DB IS DOWN ===
  if (process.env.NODE_ENV === 'development') {
    return
  }

  try {
    const user = await getOrCreateUser(userId)

    // Don't decrement for developer
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
