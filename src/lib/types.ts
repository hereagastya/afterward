// Legacy types (keeping for backward compatibility)
export interface SimulationResponse {
  shortTerm: RegretScenario
  longTerm: RegretScenario
  coreFeeling: string
  innerDialogue: string
  actionableCushion?: string
}

export interface RegretScenario {
  title: string
  description: string
  consequences: string[]
  emotionalToll: string
}

export type SimulationState = "idle" | "loading" | "success" | "error"

// New types for Decision Clarity Platform

export interface QuestionAnswer {
  question: string
  answer: string
  order: number
}

export interface GeneratedQuestion {
  question: string
  type: "multiple_choice" | "text" | "scale"
  options?: string[] // For multiple choice questions
}

export interface TimelinePhase {
  title: string           // "The Leap"
  emoji: string           // "🚀"
  timeLabel: string       // "Now", "3 months", "1 year"
  feeling: string         // "exhilaration mixed with terror"
  shortSummary: string    // 2-3 sentences max
  details: string[]       // 2-3 specific bullet points
}

export interface TimelineSimulation {
  pathType: "go" | "stay"
  pathTitle: string       // "If You Go" or "If You Stay"
  phases: TimelinePhase[]
}

export interface DualPathSimulationData {
  pathA: TimelineSimulation  // "If You Go"
  pathB: TimelineSimulation  // "If You Stay"
}

// ─── Multi-Scenario Simulation Types ────────────────────────────────────────

export interface SimulationMoment {
  timeLabel: string
  title: string
  description: string
  feeling: string
}

export interface Scenario {
  probability: string
  moments: SimulationMoment[]
}

export interface Tradeoff {
  score: number // -5 to +5
  summary: string
}

export interface Tradeoffs {
  money: Tradeoff
  stress: Tradeoff
  sleep: Tradeoff
  growth: Tradeoff
  regretRisk: Tradeoff
}

export interface PathSimulation {
  label: string
  baseCase: Scenario
  upside: Scenario
  downside: Scenario
  tradeoffs: Tradeoffs
}

export interface DualPathSimulation {
  pathA: PathSimulation
  pathB: PathSimulation
}



export interface AnalysisResult {
  clarityScore: number
  fearLevel: number
  logicLevel: number
  gutLevel: number
  redFlags: string[]
  prediction: 'go' | 'stay'
  predictionConfidence: number
  reasoning: string
  emotionalState: string
}

export type FlowState = 
  | "input"          // Initial landing
  | "questions"      // Interrogation flow  
  | "analysis"       // Confidence Meter visualization
  | "simulating"     // Loading simulation
  | "simulation"     // Two-path display
  | "decision"       // Final prompt
  | "saved"          // Confirmation

export type UserChoice = "go" | "stay" | "undecided"

export interface DecisionFlowData {
  decision: string
  decisionId?: string
  questions: GeneratedQuestion[]
  answers: QuestionAnswer[]
  simulations?: DualPathSimulationData
  userChoice?: UserChoice
}
