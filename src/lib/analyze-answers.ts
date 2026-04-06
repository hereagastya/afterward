import { QuestionAnswer, AnalysisResult } from './types'

export async function analyzeAnswers(answers: QuestionAnswer[], decision: string): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, answers })
    })

    if (!res.ok) {
      throw new Error(`Analysis API failed: ${res.status}`)
    }

    const data = await res.json()
    return data as AnalysisResult
  } catch (error) {
    console.error('Analysis failed, using fallback:', error)
    // Fallback with reasonable defaults if API fails
    return {
      clarityScore: 42,
      fearLevel: 45,
      logicLevel: 30,
      gutLevel: 25,
      redFlags: ["Analysis unavailable — your answers were too complex for a quick read. That itself says something."],
      prediction: 'stay',
      predictionConfidence: 55,
      reasoning: "When the AI can't figure you out, it usually means you're overthinking this.",
      emotionalState: "tangled but searching"
    }
  }
}
