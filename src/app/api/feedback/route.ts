import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FeedbackSchema = z.object({
  decisionId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional()
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const result = FeedbackSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { decisionId, rating, feedback } = result.data

    // Send email
    await resend.emails.send({
      from: 'feedback@resend.dev', // Resend's test domain (change later)
      to: 'sharmaagastya72@gmail.com',
      subject: `⭐ New Feedback: ${rating}/5 stars`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B6FD4;">New Feedback Received</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
            
            ${feedback ? `
              <p><strong>Feedback:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #8B6FD4;">
                ${feedback}
              </p>
            ` : '<p><em>No additional feedback provided</em></p>'}
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">
              <strong>Decision ID:</strong> ${decisionId}<br>
              <strong>User ID:</strong> ${userId}<br>
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Received from <strong>Afterward.</strong>
          </p>
        </div>
      `
    })

    console.log(`Feedback sent via email: ${rating} stars from ${userId}`)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Feedback Error:", error)
    return NextResponse.json({ 
      error: "Failed to submit feedback",
      details: error.message 
    }, { status: 500 })
  }
}