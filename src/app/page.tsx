"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DecisionInput } from "@/components/simulation/decision-input"
import { QuestionFlow } from "@/components/simulation/question-flow"
import { DualPathSimulation } from "@/components/simulation/dual-path-simulation"
import { FlashcardViewer } from "@/components/simulation/flashcard-viewer"
import { DecisionPrompt } from "@/components/simulation/decision-prompt"
import { SaveConfirmation } from "@/components/simulation/save-confirmation"
import { Navbar } from "@/components/navbar"
import { 
  FlowState, 
  QuestionAnswer, 
  DualPathSimulationData, 
  FlashcardSet,
  UserChoice 
} from "@/lib/types"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { simulationLoadingMessages } from "@/lib/constants/loading-messages"

export default function Home() {
  // Flow state
  const [flowState, setFlowState] = useState<FlowState>("input")
  const [decision, setDecision] = useState("")
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [simulations, setSimulations] = useState<DualPathSimulationData | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardSet | null>(null)
  const [userChoice, setUserChoice] = useState<UserChoice | null>(null)
  const [error, setError] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)

  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  // Check for saved draft on mount after auth load
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const draft = localStorage.getItem("decision_draft")
      if (draft) {
        setDecision(draft)
        setFlowState("questions")
        localStorage.removeItem("decision_draft")
      }
    } else if (isLoaded && !isSignedIn) {
       // If not signed in, check if we have a draft to pre-fill
       const draft = localStorage.getItem("decision_draft")
       if (draft) {
           setDecision(draft)
       }
    }
  }, [isLoaded, isSignedIn])

  // Cycle loading messages
  useEffect(() => {
    if (flowState === "simulating") {
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % simulationLoadingMessages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [flowState])

  // Handle initial decision input
  const handleStartFlow = async (query: string) => {
    if (!isSignedIn) {
        localStorage.setItem("decision_draft", query)
        openSignIn({ 
            appearance: {
                elements: {
                    footerAction: { display: "none" } // Optional: hide sign up link if desired, but user wants sign up 
                }
            } 
        })
        return
    }

    setDecision(query)
    setError("")
    setFlowState("questions")
  }

  // Handle question completion - fetch simulations
  const handleQuestionsComplete = async (completedAnswers: QuestionAnswer[]) => {
    setAnswers(completedAnswers)
    setFlowState("simulating")
    
    try {
      const res = await fetch("/api/simulate-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers: completedAnswers }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate simulations")
      }

      const data = await res.json()
      setSimulations(data)
      setFlowState("simulation")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate simulations")
      setFlowState("questions")
    }
  }

  // Handle simulation viewed - fetch flashcards
  const handleSimulationComplete = async () => {
    setFlowState("simulating")
    
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers, simulations }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate flashcards")
      }

      const data = await res.json()
      setFlashcards(data)
      setFlowState("flashcards")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate flashcards")
      setFlowState("simulation")
    }
  }

  // Handle flashcards complete
  const handleFlashcardsComplete = () => {
    setFlowState("decision")
  }

  // Handle decision made
  const handleDecision = async (choice: UserChoice) => {
    setUserChoice(choice)
    
    // Save if authenticated
    if (isSignedIn && simulations && flashcards) {
      try {
        const res = await fetch("/api/save-decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            decision,
            answers,
            simulations,
            flashcards,
            userChoice: choice
          }),
        })

        if (!res.ok) {
          console.error("Failed to save decision")
          const data = await res.json()
          setError(data.error || "Failed to save decision. Please check your connection.")
          return // Stop here
        }
      } catch (err) {
        console.error("Save error:", err)
        setError("Network error. Could not save decision.")
        return // Stop here
      }
    }

    setFlowState("saved")
  }

  // Reset everything
  const handleReset = () => {
    setFlowState("input")
    setDecision("")
    setAnswers([])
    setSimulations(null)
    setFlashcards(null)
    setUserChoice(null)
    setError("")
  }

  // Go back to questions from simulating
  const handleBackToQuestions = () => {
    setFlowState("questions")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="relative flex flex-col items-center text-center max-w-6xl mx-auto mt-24 lg:mt-0 w-full z-20">
        <AnimatePresence mode="wait">
          {/* INPUT STATE */}
          {flowState === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Welcome Message for Signed In Users */}
              {isLoaded && user && (
                <p className="text-gray-400 text-sm mb-4">
                  Welcome back, {user.firstName || user.username}
                </p>
              )}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-10">
                Regret is better<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6FD4] to-[#B794F4]">
                  simulated.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[#A8A6A1] max-w-2xl mx-auto leading-relaxed font-light mb-16">
                Logic lies. Emotion doesn&apos;t. Experience the future consequences of your choice before you make it.
              </p>

              <div className="w-full">
                <DecisionInput 
                    onSimulate={handleStartFlow} 
                    isSimulating={false}
                    initialValue={decision} 
                />
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>

              <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto opacity-50 hover:opacity-100 transition-opacity duration-500">
                <div className="p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-white/90">Emotional Clarity</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Spreadsheets can't tell you how lonely the "logical" choice will feel.</p>
                </div>
                <div className="p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-white/90">Time Travel</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Fast forward 5 years in 5 seconds. See who you become.</p>
                </div>
                <div className="p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-white/90">Zero Validation</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">No affirmations. Just the raw, uncomfortable truth of your path.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUESTIONS STATE */}
          {flowState === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <QuestionFlow
                decision={decision}
                onComplete={handleQuestionsComplete}
                onBack={handleReset}
              />
            </motion.div>
          )}

          {/* SIMULATING STATE (Loading) */}
          {flowState === "simulating" && (
            <motion.div
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] flex items-center justify-center"
              >
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-white text-xl font-light">
                  {simulationLoadingMessages[messageIndex]}
                </p>
                <p className="text-gray-500 text-sm">Usually takes 10-15 seconds</p>
              </div>
            </motion.div>
          )}

          {/* SIMULATION STATE */}
          {flowState === "simulation" && simulations && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <DualPathSimulation
                simulations={simulations}
                onContinue={handleSimulationComplete}
              />
            </motion.div>
          )}

          {/* FLASHCARDS STATE */}
          {flowState === "flashcards" && flashcards && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <FlashcardViewer
                flashcards={flashcards}
                onComplete={handleFlashcardsComplete}
              />
            </motion.div>
          )}

          {/* DECISION STATE */}
          {flowState === "decision" && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <DecisionPrompt
                onDecide={handleDecision}
                isAuthenticated={isSignedIn || false}
              />
            </motion.div>
          )}

          {/* SAVED STATE */}
          {flowState === "saved" && userChoice && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SaveConfirmation
                decision={decision}
                userChoice={userChoice}
                onStartNew={handleReset}
                onViewDashboard={() => router.push("/dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
