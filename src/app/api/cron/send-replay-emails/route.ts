import { prisma } from "@/lib/db"
import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
  try {
    // Verify cron secret (security - prevents random people from triggering this)
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1) // Start of tomorrow
    
    // Find decisions scheduled for today
    const decisionsToCheckIn = await prisma.decision.findMany({
      where: {
        replayEnabled: true,
        replayCompleted: false,
        replayScheduled: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    console.log(`Found ${decisionsToCheckIn.length} decisions to check in on`)

    let sent = 0

    for (const decision of decisionsToCheckIn) {
      try {
        const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://afterward.fyi'}/dashboard/${decision.id}`
        
        await resend.emails.send({
          from: "Afterward <noreply@afterward.fyi>",
          to: decision.replayEmail!,
          subject: `Remember when you chose to ${decision.userChoice}? 🔮`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c5cbf;">Remember This Decision?</h2>
              
              <p>Hey there,</p>
              
              <p>A few months ago, you used Afterward to decide:</p>
              
              <div style="background: #1a1a1a; color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: 600;">${decision.query}</p>
                <p style="margin: 12px 0 0 0; color: #9d7de8; font-weight: 600;">You chose to: ${decision.userChoice?.toUpperCase()}</p>
              </div>
              
              <p>How'd it actually turn out?</p>
              
              <p>Take our 2-minute check-in and we'll show you how accurate our prediction was.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${checkInUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #7c5cbf, #9d7de8); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Take Check-in →
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 40px;">
                See both futures before you choose.<br>
                — Afterward
              </p>
            </div>
          `
        })

        sent++
        console.log(`Sent reminder to ${decision.replayEmail}`)
        
      } catch (emailError) {
        console.error(`Failed to send to ${decision.replayEmail}:`, emailError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      found: decisionsToCheckIn.length,
      sent 
    })

  } catch (error: any) {
    console.error("Cron error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
