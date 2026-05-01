import { NextRequest, NextResponse } from "next/server"
import { generateContentWithFallback } from "@/lib/gemini"

// Heuristic fallback: compute a rough analysis from raw answer text without AI
function computeHeuristicAnalysis(answers: { question: string; answer: string }[], decision: string) {
  const allText = answers.map(a => a.answer).join(" ").toLowerCase()

  const fearWords = ["scared", "fear", "afraid", "terrified", "nervous", "worried", "anxious", "risk", "fail", "wrong", "regret", "lose", "lost", "unsafe", "danger"]
  const logicWords = ["think", "because", "reason", "plan", "strategy", "realistically", "objectively", "data", "fact", "pros", "cons", "consider", "analyze", "financial", "career", "money"]
  const gutWords = ["feel", "feeling", "gut", "heart", "deep down", "something tells", "instinct", "sense", "just know", "believe", "soul", "passion"]

  const fearCount = fearWords.filter(w => allText.includes(w)).length
  const logicCount = logicWords.filter(w => allText.includes(w)).length
  const gutCount = gutWords.filter(w => allText.includes(w)).length

  const total = fearCount + logicCount + gutCount || 3
  const fearLevel = Math.round((fearCount / total) * 100)
  const logicLevel = Math.round((logicCount / total) * 100)
  const gutLevel = 100 - fearLevel - logicLevel

  // Clarity based on answer length and variety
  const avgLength = allText.length / (answers.length || 1)
  const clarityScore = Math.min(75, Math.max(25, Math.round(avgLength / 4)))

  const predictionConfidence = 55 + Math.round(Math.random() * 20)
  const prediction = gutLevel > fearLevel ? "go" : "stay"

  return {
    clarityScore,
    fearLevel: Math.max(5, fearLevel),
    logicLevel: Math.max(5, logicLevel),
    gutLevel: Math.max(5, gutLevel),
    redFlags: [
      "Your answers reveal more uncertainty than certainty — that itself is data worth sitting with.",
      answers[0]?.answer?.length < 20
        ? "Your answers were brief. Short answers often mean the mind already knows but isn't ready to say it."
        : "You're articulate about the decision but guarded about the feeling underneath it."
    ],
    prediction,
    predictionConfidence,
    reasoning: "The pattern in your words points somewhere, even if you're not ready to admit it yet.",
    emotionalState: fearLevel > logicLevel ? "fear dressed as caution" : gutLevel > logicLevel ? "gut leading, mind resisting" : "logic fighting instinct"
  }
}

export async function POST(req: NextRequest) {
  let decision = ""
  let answers: { question: string; answer: string }[] = []

  try {
    const body = await req.json()
    decision = body.decision
    answers = body.answers

    if (!decision || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing decision or answers" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const prompt = `You are reading someone's actual answers about a real decision they're agonizing over. Your job is to analyze what's REALLY going on — not what they said, but what they revealed without meaning to.

DECISION: "${decision}"

THEIR ACTUAL ANSWERS:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: "${a.answer}"`).join('\n\n')}

ANALYSIS INSTRUCTIONS:

1. FEAR vs LOGIC vs GUT FEELING breakdown:
- Read their actual words. If they keep mentioning money, judgment, failure — that's fear talking.
- If they list pros/cons, use words like "realistically", "strategically" — that's logic.
- If they say "I just feel like", "something tells me", "deep down" — that's gut.
- CRITICAL: These three numbers MUST add up to EXACTLY 100. Not 99, not 101. Exactly 100.
- Allocate based on which force is ACTUALLY driving their words, not what they claim.

2. CLARITY SCORE (0-100): How clear are they really? Contradictions = low. Short evasive answers = low. Articulate + consistent = high. Most people: 30-65.

3. RED FLAGS (exactly 2): Reference SPECIFIC things they actually wrote. Make them think "how did it know that?"

4. PREDICTION (go or stay): Based on their language patterns. predictionConfidence: 50-95 range.

5. REASONING (one sentence): Brutally honest friend who read every word, not a therapist.

6. EMOTIONAL STATE (2-5 words): Specific tension, not generic. Examples: "terrified but itching to jump", "guilt disguised as logic"

Return ONLY valid JSON, no markdown, no explanation:
{"clarityScore":50,"fearLevel":40,"logicLevel":35,"gutLevel":25,"redFlags":["flag1","flag2"],"prediction":"go","predictionConfidence":65,"reasoning":"one sentence","emotionalState":"2-5 words"}`

  try {
    const result = await generateContentWithFallback(prompt)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      console.warn("[Analyze API] Empty AI response, using heuristic fallback")
      return NextResponse.json(computeHeuristicAnalysis(answers, decision))
    }

    // Extract JSON — try code block first, then raw object
    let rawJson: string | null = null
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonBlockMatch) {
      rawJson = jsonBlockMatch[1].trim()
    } else {
      const jsonObjectMatch = text.match(/\{[\s\S]*\}/)
      if (jsonObjectMatch) rawJson = jsonObjectMatch[0]
    }

    if (!rawJson) {
      console.warn("[Analyze API] Could not extract JSON, using heuristic fallback. Response:", text.substring(0, 200))
      return NextResponse.json(computeHeuristicAnalysis(answers, decision))
    }

    let analysis: any
    try {
      analysis = JSON.parse(rawJson)
    } catch (parseErr) {
      console.warn("[Analyze API] JSON parse error, using heuristic fallback:", parseErr)
      return NextResponse.json(computeHeuristicAnalysis(answers, decision))
    }

    // Validate — if any required field is missing, fall back
    const requiredNumbers = ['clarityScore', 'fearLevel', 'logicLevel', 'gutLevel', 'predictionConfidence']
    const hasAllFields = requiredNumbers.every(f => typeof analysis[f] === 'number')
    if (!hasAllFields) {
      console.warn("[Analyze API] Missing fields in AI response, using heuristic fallback. Got:", Object.keys(analysis))
      return NextResponse.json(computeHeuristicAnalysis(answers, decision))
    }

    // Enforce fear+logic+gut = 100
    const total = (analysis.fearLevel || 0) + (analysis.logicLevel || 0) + (analysis.gutLevel || 0)
    if (total === 0) {
      analysis.fearLevel = 34; analysis.logicLevel = 33; analysis.gutLevel = 33
    } else if (total !== 100) {
      const scale = 100 / total
      analysis.fearLevel = Math.round(analysis.fearLevel * scale)
      analysis.logicLevel = Math.round(analysis.logicLevel * scale)
      analysis.gutLevel = 100 - analysis.fearLevel - analysis.logicLevel
    }

    // Clamp and sanitize
    analysis.clarityScore = Math.max(0, Math.min(100, Math.round(analysis.clarityScore)))
    analysis.predictionConfidence = Math.max(50, Math.min(95, Math.round(analysis.predictionConfidence)))
    analysis.redFlags = Array.isArray(analysis.redFlags) ? analysis.redFlags.slice(0, 3) : []
    if (analysis.prediction !== 'go' && analysis.prediction !== 'stay') {
      analysis.prediction = analysis.predictionConfidence > 70 ? 'go' : 'stay'
    }
    analysis.reasoning = analysis.reasoning || "Your decision patterns reveal more than your words."
    analysis.emotionalState = analysis.emotionalState || "searching for clarity"

    console.log('[Analyze API] Success — Clarity:', analysis.clarityScore, 'Fear/Logic/Gut:', analysis.fearLevel, analysis.logicLevel, analysis.gutLevel)
    return NextResponse.json(analysis)

  } catch (error) {
    console.warn("[Analyze API] Gemini call failed, using heuristic fallback:", error)
    // Never return a 500 — always return something useful
    return NextResponse.json(computeHeuristicAnalysis(answers, decision))
  }
}
