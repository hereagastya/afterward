import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GeneratedQuestion, QuestionAnswer } from "@/lib/types"
import { QuestionCard } from "./question-card"
import { Loader2 } from "lucide-react"

interface QuestionFlowProps {
  decision: string
  onComplete: (answers: QuestionAnswer[]) => void
  onBack: () => void
}

export function QuestionFlow({ decision, onComplete, onBack }: QuestionFlowProps) {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision }),
        })

        if (!res.ok) throw new Error("Failed to generate questions")

        const data = await res.json()
        setQuestions(data.questions)
      } catch (err) {
        console.error(err)
        setError("Failed to load questions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (decision) {
      fetchQuestions()
    }
  }, [decision])

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentIndex]
    
    // Smooth transition delay
    const delay = 400

    const newAnswer: QuestionAnswer = {
      question: currentQuestion.question,
      answer,
      order: currentIndex + 1
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      // Small pause before navigating
      setTimeout(() => setCurrentIndex(prev => prev + 1), delay) 
    } else {
      setTimeout(() => onComplete(newAnswers), delay)
    }
  }

  // Loading State - Dramatic
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)] rounded-full blur-[120px] opacity-10 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
             <div className="relative">
                <Loader2 className="w-12 h-12 text-[#c4a8ff] animate-spin" />
                <div className="absolute inset-0 blur-lg bg-[#c4a8ff] opacity-50 animate-pulse" />
             </div>
             <p className="font-[var(--font-mono)] text-[var(--accent-glow)] tracking-[0.2em] text-sm animate-pulse">
                CONSULTING THE ORACLE...
             </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
        <p className="text-red-400 font-[var(--font-mono)]">{error}</p>
        <button 
          onClick={onBack}
          className="text-[var(--text-secondary)] hover:text-white underline underline-offset-4 transition-colors"
        >
          Return to Safety
        </button>
      </div>
    )
  }

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="w-full flex flex-col min-h-[80vh] py-12 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-10 -translate-x-1/3 -translate-y-1/3 pointer-events-none mix-blend-screen" />
      <div className="fixed inset-0 noise-overlay opacity-50 pointer-events-none" />

      {/* Progress Bar (Top Fixed? Or just top of container) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-[#7c5cbf] to-[#c4a8ff] shadow-[0_0_20px_rgba(124,92,191,0.5)]"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
            {questions[currentIndex] && (
            <QuestionCard
                key={currentIndex}
                question={questions[currentIndex]}
                onAnswer={handleAnswer}
                isLast={currentIndex === questions.length - 1}
                index={currentIndex}
                total={questions.length}
            />
            )}
        </AnimatePresence>
      </div>
      
      {/* Navigation (Back) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex justify-center z-10"
      >
         <button 
            onClick={onBack}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors uppercase tracking-[0.3em]"
          >
            Abort Simulation
          </button>
      </motion.div>
    </div>
  )
}
