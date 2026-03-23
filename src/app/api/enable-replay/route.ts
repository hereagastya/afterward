import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { decisionId, email, checkInMonths } = await req.json()

    // Default to 3 months if not specified
    const months = checkInMonths || 3
    const replayDate = new Date()
    replayDate.setMonth(replayDate.getMonth() + months)

    // Update decision with replay info
    const decision = await prisma.decision.update({
      where: { id: decisionId },
      data: {
        replayEnabled: true,
        replayEmail: email,
        replayScheduled: replayDate
      }
    })

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Afterward <noreply@afterward.fyi>",
        to: email,
        subject: "Reminder scheduled: We'll check in on your decision 🔮",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7c5cbf;">Reminder Scheduled ✓</h2>
            
            <p>We'll check in with you on <strong>${replayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong> to see how your decision played out.</p>
            
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your decision:</strong></p>
              <p style="margin: 8px 0 0 0;">${decision.query}</p>
              <p style="margin: 8px 0 0 0;"><strong>You chose:</strong> ${decision.userChoice?.toUpperCase()}</p>
            </div>
            
            <p>On that date, we'll send you a quick 2-minute survey to see:</p>
            <ul>
              <li>How things actually turned out</li>
              <li>If you'd make the same choice again</li>
              <li>How accurate our prediction was</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              — Afterward<br>
              See both futures before you choose.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error("Email send failed (non-fatal):", emailError)
      // Don't fail the whole request if email fails — the DB update already went through
    }

    return NextResponse.json({ 
      success: true,
      scheduledFor: replayDate 
    })

  } catch (error: any) {
    console.error("Enable replay error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to enable replay" },
      { status: 500 }
    )
  }
}
