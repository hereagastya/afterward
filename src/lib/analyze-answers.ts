import { QuestionAnswer, AnalysisResult } from './types'

export async function analyzeAnswers(answers: QuestionAnswer[], decision: string): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, answers })
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    console.error('[analyzeAnswers] API error:', res.status, errorBody)
    throw new Error(`Analysis API failed with status ${res.status}`)
  }

  const data = await res.json()

  // Validate we got real AI data back
  if (typeof data.fearLevel !== 'number' || typeof data.logicLevel !== 'number' || typeof data.gutLevel !== 'number') {
    console.error('[analyzeAnswers] Invalid response shape:', data)
    throw new Error('Analysis API returned invalid data')
  }

  return data as AnalysisResult
}
