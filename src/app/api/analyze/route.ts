import { NextRequest, NextResponse } from "next/server"
import { generateContentWithFallback } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const { decision, answers } = await req.json()

    if (!decision || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing decision or answers" }, { status: 400 })
    }

    const prompt = `You are reading someone's actual answers about a real decision they're agonizing over. Your job is to analyze what's REALLY going on — not what they said, but what they revealed without meaning to.

DECISION: "${decision}"

THEIR ACTUAL ANSWERS:
${answers.map((a: { question: string; answer: string }, i: number) => `Q${i + 1}: ${a.question}\nA${i + 1}: "${a.answer}"`).join('\n\n')}

ANALYSIS INSTRUCTIONS:

1. FEAR vs LOGIC vs GUT FEELING breakdown:
- Read their actual words. If they keep mentioning money, judgment, failure — that's fear talking.
- If they list pros/cons, use words like "realistically", "strategically" — that's logic.
- If they say "I just feel like", "something tells me", "deep down" — that's gut.
- CRITICAL: These three numbers MUST add up to EXACTLY 100. Not 99, not 101. Exactly 100.
- Allocate based on which force is ACTUALLY driving their words, not what they claim.

2. CLARITY SCORE (0-100):
- How clear are they really? If they contradict themselves, score low.
- If their answers are short and evasive, score low.
- If they're articulate and consistent, score high.
- Most people are 30-65. Above 70 is rare. Below 20 means they're lost.

3. RED FLAGS (2-3 maximum):
- These must reference SPECIFIC things they actually wrote.
- BAD: "Seeking external validation" (generic)
- GOOD: "You said you 'need more time to think' but you've clearly been thinking about this for months. More time isn't what you need." (specific to their answer)
- BAD: "Fear of failure detected" (generic)
- GOOD: "You mentioned your partner three times but never once said what YOU actually want." (specific)
- Each red flag should make them think "how did it know that?"

4. PREDICTION (go or stay):
- Based on their language patterns, which way are they leaning?
- predictionConfidence: 50-95 range.

5. REASONING (one sentence):
- Sound like a brutally honest friend who read every word, not a therapist being careful.
- BAD: "Your responses indicate a fear-driven decision pattern."
- GOOD: "You already know you want to leave — you're just looking for someone to tell you it's okay."
- Reference something specific they said.

6. EMOTIONAL STATE (2-5 words):
- Not generic like "emotionally conflicted".
- Specific to the tension you see: "terrified but itching to jump", "guilt disguised as logic", "already grieving what you'll lose", "performing confidence you don't feel"

Return ONLY this JSON, no markdown, no explanation:
{
  "clarityScore": <number 0-100>,
  "fearLevel": <number, must sum to 100 with logic+gut>,
  "logicLevel": <number, must sum to 100 with fear+gut>,
  "gutLevel": <number, must sum to 100 with fear+logic>,
  "redFlags": ["specific flag 1", "specific flag 2"],
  "prediction": "go" or "stay",
  "predictionConfidence": <number 50-95>,
  "reasoning": "one brutally honest sentence",
  "emotionalState": "specific 2-5 word label"
}`

    const result = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.85,
      }
    })

    const response = await result.response
    const text = response.text()

    console.log('[Analyze API] Raw AI response length:', text?.length)

    if (!text || text.trim().length === 0) {
      console.error('[Analyze API] Empty response from AI')
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 })
    }

    // Parse JSON from response — try raw first, then extract block
    let rawJson: string | null = null
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonBlockMatch) {
      rawJson = jsonBlockMatch[1].trim()
    } else {
      const jsonObjectMatch = text.match(/\{[\s\S]*\}/)
      if (jsonObjectMatch) rawJson = jsonObjectMatch[0]
    }

    if (!rawJson) {
      console.error('[Analyze API] Could not extract JSON from response. Full text:', text.substring(0, 500))
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 })
    }

    let analysis: any
    try {
      analysis = JSON.parse(rawJson)
    } catch (parseErr) {
      console.error('[Analyze API] JSON parse error:', parseErr, 'Raw JSON was:', rawJson.substring(0, 300))
      return NextResponse.json({ error: "AI response was not valid JSON" }, { status: 500 })
    }

    // Validate required fields exist
    const requiredNumbers = ['clarityScore', 'fearLevel', 'logicLevel', 'gutLevel', 'predictionConfidence']
    for (const field of requiredNumbers) {
      if (typeof analysis[field] !== 'number') {
        console.error(`[Analyze API] Missing or non-numeric field: ${field}. Analysis:`, analysis)
        return NextResponse.json({ error: `AI returned invalid field: ${field}` }, { status: 500 })
      }
    }

    // Enforce percentages sum to 100
    const total = (analysis.fearLevel || 0) + (analysis.logicLevel || 0) + (analysis.gutLevel || 0)
    if (total === 0) {
      // Completely broken — assign reasonable defaults
      analysis.fearLevel = 34
      analysis.logicLevel = 33
      analysis.gutLevel = 33
    } else if (total !== 100) {
      const scale = 100 / total
      analysis.fearLevel = Math.round(analysis.fearLevel * scale)
      analysis.logicLevel = Math.round(analysis.logicLevel * scale)
      // Assign remainder to gut to guarantee exactly 100
      analysis.gutLevel = 100 - analysis.fearLevel - analysis.logicLevel
    }

    // Clamp values
    analysis.clarityScore = Math.max(0, Math.min(100, Math.round(analysis.clarityScore)))
    analysis.predictionConfidence = Math.max(50, Math.min(95, Math.round(analysis.predictionConfidence)))
    analysis.redFlags = (analysis.redFlags || []).slice(0, 3)
    
    // Ensure prediction is valid
    if (analysis.prediction !== 'go' && analysis.prediction !== 'stay') {
      analysis.prediction = analysis.predictionConfidence > 70 ? 'go' : 'stay'
    }

    // Ensure text fields exist
    analysis.reasoning = analysis.reasoning || "Your decision patterns reveal more than your words."
    analysis.emotionalState = analysis.emotionalState || "searching for clarity"

    console.log('[Analyze API] Successfully generated analysis. Clarity:', analysis.clarityScore, 'Fear/Logic/Gut:', analysis.fearLevel, analysis.logicLevel, analysis.gutLevel)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[Analyze API] Unhandled error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
