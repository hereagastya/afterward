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

export interface FlashcardData {
  content: string 
  pathType: "go" | "stay"
  category: "financial" | "relationships" | "emotional" | "time" | "identity" | "general"
  likelihood: "high" | "medium" | "low"
  emojiBefore: string
  emojiAfter: string
  _id?: number // For internal UI keys
}

export interface FlashcardSet {
  goFlashcards: FlashcardData[]
  stayFlashcards: FlashcardData[]
}

export type FlowState = 
  | "input"          // Initial landing
  | "questions"      // Interrogation flow  
  | "simulating"     // Loading simulation
  | "simulation"     // Two-path display
  | "flashcards"     // Regret flashcards
  | "decision"       // Final prompt
  | "saved"          // Confirmation

export type UserChoice = "go" | "stay" | "undecided"

export interface DecisionFlowData {
  decision: string
  decisionId?: string
  questions: GeneratedQuestion[]
  answers: QuestionAnswer[]
  simulations?: DualPathSimulationData
  flashcards?: FlashcardSet
  userChoice?: UserChoice
}
