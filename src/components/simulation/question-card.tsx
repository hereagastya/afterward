import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GeneratedQuestion } from "@/lib/types"

interface QuestionCardProps {
  question: GeneratedQuestion
  onAnswer: (answer: string) => void
  isLast: boolean
}

export function QuestionCard({ question, onAnswer, isLast }: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [scaleValue, setScaleValue] = useState(5)

  // Reset state when question changes
  useEffect(() => {
    setAnswer("")
    setScaleValue(5)
  }, [question])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (question.type === "scale") {
      onAnswer(scaleValue.toString())
    } else if (answer.trim()) {
      onAnswer(answer)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && question.type === "text") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="glass p-8 md:p-12 rounded-2xl border border-white/10 relative overflow-hidden"
      >
        {/* Abstract decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <h2 className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Text Input */}
        {question.type === "text" && (
          <div className="space-y-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8B6FD4]/50 focus:ring-1 focus:ring-[#8B6FD4]/50 transition-all resize-none min-h-[120px]"
              autoFocus
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLast ? "See Your Future" : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {/* Multiple Choice */}
        {question.type === "multiple_choice" && (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(option)}
                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8B6FD4]/30 transition-all text-gray-200 hover:text-white group"
              >
                <span className="inline-block w-6 h-6 rounded-full border border-white/20 mr-3 group-hover:border-[#8B6FD4] group-hover:bg-[#8B6FD4]/20 transition-colors" />
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Scale (1-10) */}
        {question.type === "scale" && (
          <div className="space-y-8 py-4">
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={scaleValue}
                onChange={(e) => setScaleValue(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8B6FD4]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono uppercase tracking-wider">
                <span>Not at all</span>
                <span>Somewhat</span>
                <span>Extremely</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-6xl font-light text-white">{scaleValue}</span>
              <span className="text-xl text-gray-500 ml-2">/ 10</span>
            </div>

            <button
              onClick={() => onAnswer(scaleValue.toString())}
              className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              Confirm {scaleValue}
            </button>
          </div>
        )}

        {/* Progress indicator or hint */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-xs text-gray-500">
            <span>Press Enter to submit text</span>
            <span>Honesty yields better results</span>
        </div>
      </motion.div>
    </div>
  )
}
