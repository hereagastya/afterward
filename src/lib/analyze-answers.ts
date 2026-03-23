import { QuestionAnswer, AnalysisResult } from './types'

export function analyzeAnswers(answers: QuestionAnswer[], decision: string): AnalysisResult {
  let fearLevel = 0
  let logicLevel = 0
  let gutLevel = 0
  const redFlags: string[] = []
  let totalWords = 0

  answers.forEach(answer => {
    const text = answer.answer.toLowerCase()
    const wordCount = text.split(/\s+/).length
    totalWords += wordCount
    
    // FEAR INDICATORS
    const fearWords = [
      'scared', 'afraid', 'worry', 'anxious', 'nervous', 'terrified', 
      'panic', 'doubt', 'uncertain', 'hesitant', 'risk', 'lose', 
      'fail', 'wrong', 'regret', 'mistake'
    ]
    const fearCount = fearWords.filter(w => text.includes(w)).length
    fearLevel += fearCount * 12

    // LOGIC INDICATORS  
    const logicWords = [
      'because', 'therefore', 'analysis', 'data', 'research', 'plan', 
      'strategy', 'calculate', 'consider', 'pros', 'cons', 'rational',
      'practical', 'financially', 'realistically'
    ]
    const logicCount = logicWords.filter(w => text.includes(w)).length
    logicLevel += logicCount * 12

    // GUT FEELING INDICATORS
    const gutWords = [
      'feel', 'intuition', 'sense', 'instinct', 'heart', 'gut',
      'believe', 'soul', 'deep down', 'honestly', 'truly'
    ]
    const gutCount = gutWords.filter(w => text.includes(w)).length
    gutLevel += gutCount * 12

    // RED FLAG DETECTION
    
    // Seeking validation
    if ((text.includes('should') && text.includes('but')) || 
        text.includes('supposed to') ||
        text.includes('expected to')) {
      redFlags.push("Seeking external validation")
    }
    
    // Catastrophizing
    if (text.includes('always') || text.includes('never') || 
        text.includes('worst') || text.includes('everything will')) {
      redFlags.push("Catastrophizing outcomes")
    }
    
    // Fear of judgment
    if (text.includes('what will people think') || 
        text.includes('what would they') ||
        text.includes('people will say') ||
        text.includes('judged')) {
      redFlags.push("Afraid of judgment")
    }
    
    // Surface-level thinking
    if (wordCount < 15) {
      redFlags.push("Surface-level thinking")
    }
    
    // Analysis paralysis
    if (wordCount > 250) {
      redFlags.push("Overthinking/Analysis paralysis")
    }

    // Hedging language
    if ((text.match(/maybe|perhaps|possibly|might|could/g) || []).length > 2) {
      redFlags.push("Excessive hedging - lacking conviction")
    }

    // Contradictions
    if ((text.includes('but') || text.includes('however')) && 
        (text.includes('want') || text.includes('need'))) {
      redFlags.push("Internal contradiction detected")
    }
  })

  // Normalize to 0-100 range
  fearLevel = Math.min(100, Math.max(0, fearLevel))
  logicLevel = Math.min(100, Math.max(0, logicLevel))
  gutLevel = Math.min(100, Math.max(0, gutLevel))

  // If all are low, boost the dominant one
  const total = fearLevel + logicLevel + gutLevel
  if (total < 50) {
    const max = Math.max(fearLevel, logicLevel, gutLevel)
    if (max === fearLevel) fearLevel = 60
    else if (max === logicLevel) logicLevel = 60
    else gutLevel = 60
  }

  // Calculate clarity score
  // High clarity = balanced emotions + sufficient depth
  const avgWordCount = totalWords / answers.length
  const depthScore = Math.min(100, (avgWordCount / 100) * 100) // 100 words = 100%
  
  // Balance score (low variance = high clarity)
  const variance = Math.abs(fearLevel - logicLevel) + Math.abs(logicLevel - gutLevel) + Math.abs(gutLevel - fearLevel)
  const balanceScore = Math.max(0, 100 - (variance / 3))
  
  // Clarity = 70% balance + 30% depth
  const clarityScore = Math.round((balanceScore * 0.7) + (depthScore * 0.3))

  // Predict choice
  let prediction: 'go' | 'stay'
  let predictionConfidence: number

  if (fearLevel > 65) {
    // High fear = likely to stay (safety bias)
    prediction = 'stay'
    predictionConfidence = fearLevel
  } else if (logicLevel > fearLevel + 20) {
    // Logic dominates = likely to go
    prediction = 'go'
    predictionConfidence = logicLevel
  } else if (gutLevel > 70) {
    // Strong gut feeling
    const decisionLower = decision.toLowerCase()
    if (decisionLower.includes('quit') || decisionLower.includes('leave') || decisionLower.includes('start')) {
      prediction = 'go'
    } else {
      prediction = 'stay'
    }
    predictionConfidence = gutLevel
  } else {
    // Default: slight bias toward status quo
    prediction = 'stay'
    predictionConfidence = 55
  }

  // Determine emotional state
  let emotionalState: string
  if (fearLevel > 75) emotionalState = "Overwhelmed by fear"
  else if (clarityScore < 30) emotionalState = "Paralyzed by uncertainty"
  else if (clarityScore > 70) emotionalState = "Clear and confident"
  else if (logicLevel > 70) emotionalState = "Over-analyzing"
  else if (gutLevel > 70) emotionalState = "Following your gut"
  else emotionalState = "Emotionally conflicted"

  // Generate reasoning
  const dominant = fearLevel > logicLevel && fearLevel > gutLevel ? 'fear' :
                   logicLevel > gutLevel ? 'logic' : 'gut feeling'
  
  const reasoning = `Your ${dominant} (${Math.round(fearLevel > logicLevel && fearLevel > gutLevel ? fearLevel : logicLevel > gutLevel ? logicLevel : gutLevel)}%) is ${
    dominant === 'fear' ? 'overpowering' : 'driving'
  } this decision. ${
    fearLevel > 60 ? "That's normal - but don't let fear make your choice." : ""
  }`

  return {
    clarityScore: Math.round(clarityScore),
    fearLevel: Math.round(fearLevel),
    logicLevel: Math.round(logicLevel),
    gutLevel: Math.round(gutLevel),
    redFlags: [...new Set(redFlags)].slice(0, 4), // Max 4 unique flags
    prediction,
    predictionConfidence: Math.round(predictionConfidence),
    reasoning,
    emotionalState
  }
}
