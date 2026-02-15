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
    
    const newAnswer: QuestionAnswer = {
      question: currentQuestion.question,
      answer,
      order: currentIndex + 1
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300) // Small delay for animation
    } else {
      onComplete(newAnswers)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-[#8B6FD4] animate-spin" />
        <p className="text-gray-400 animate-pulse">Analyzing your dilemma...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          Go Back
        </button>
      </div>
    )
  }

  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-[#8B6FD4] to-[#B794F4]"
        />
      </div>

      <AnimatePresence mode="wait">
        {questions[currentIndex] && (
          <QuestionCard
            key={currentIndex}
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            isLast={currentIndex === questions.length - 1}
          />
        )}
      </AnimatePresence>
      
      {/* Navigation (Back) */}
      <div className="mt-8 flex justify-center">
         <button 
            onClick={onBack}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-widest"
          >
            Start Over
          </button>
      </div>
    </div>
  )
}
