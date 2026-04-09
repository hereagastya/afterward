"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GeneratedQuestion } from "@/lib/types"

interface QuestionCardProps {
  question: GeneratedQuestion
  onAnswer: (answer: string) => void
  isLast: boolean
  index: number
  total: number
}

export function QuestionCard({ question, onAnswer, isLast, index, total }: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [isOther, setIsOther] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Clean the question text (remove markdown asterisks)
  const cleanQuestion = question.question.replace(/\*/g, '')

  // Reset state when question changes
  useEffect(() => {
    setIsOther(false)
    if (question.type === "scale") {
      setAnswer("5") // default for scale
    } else {
      setAnswer("")
    }
    
    if (question.type === "text" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [question])

  const onSubmit = () => {
    if (answer) {
      onAnswer(answer)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && question.type === "text") {
      e.preventDefault()
      if (answer) onSubmit()
    }
  }

  return (
    <div className="w-full relative z-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center" 
      >
        <div className="relative glass rounded-2xl p-6 md:p-8 border border-purple-500/20 overflow-hidden w-full">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          
          {/* Subtle glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Question number badge */}
            <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-mono uppercase tracking-wider mb-6">
              Query {index + 1} of {total}
            </div>
            
            {/* Question text */}
            <h2 className="text-2xl md:text-3xl font-[var(--font-playfair)] font-light text-white leading-relaxed mb-2">
              {cleanQuestion}
            </h2>
            {/* Clarity hint */}
            <p className="text-sm text-gray-500 italic mb-8">
              {question.type === "text"
                ? "Be honest and specific — say what you'd tell a close friend, not a stranger."
                : question.type === "multiple_choice"
                ? "Pick the one that stings a little. That's usually the real answer."
                : "Go with your gut. Don't overthink the number."}
            </p>
            
            {/* Input fields */}
            <div className="w-full">
              {/* Text input */}
              {question.type === "text" && (
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer..."
                  className="w-full p-4 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none min-h-[120px]"
                  rows={4}
                />
              )}

              {/* Scale input */}
              {question.type === "scale" && (
                <div className="space-y-4 py-8">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={answer || "5"}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>1</span>
                    <span className="text-3xl text-white font-bold">{answer || "5"}</span>
                    <span>10</span>
                  </div>
                </div>
              )}

              {/* Multiple choice */}
              {question.type === "multiple_choice" && question.options && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...question.options, "Other..."].map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => {
                          if (option === "Other...") {
                            setAnswer("")
                            setIsOther(true)
                          } else {
                            setAnswer(option)
                            setIsOther(false)
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all text-left ${
                          (answer === option && !isOther) || (option === "Other..." && isOther)
                            ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'border-purple-500/30 bg-black/40 text-gray-300 hover:border-purple-500/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {isOther && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4"
                    >
                      <textarea
                        ref={textareaRef}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full p-4 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none min-h-[100px]"
                        rows={3}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="mt-8">
              <button
                onClick={() => {
                  if (answer.trim()) {
                    onSubmit()
                  }
                }}
                disabled={!answer.trim()}
                className="btn-holo w-full"
              >
                {isLast ? 'Generate Simulation →' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
