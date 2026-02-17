import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GeneratedQuestion } from "@/lib/types"
import { ArrowRight, Check } from "lucide-react"

interface QuestionCardProps {
  question: GeneratedQuestion
  onAnswer: (answer: string) => void
  isLast: boolean
  index: number
  total: number
}

export function QuestionCard({ question, onAnswer, isLast, index, total }: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [scaleValue, setScaleValue] = useState(5)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset state when question changes
  useEffect(() => {
    setAnswer("")
    setScaleValue(5)
    if (question.type === "text" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [question])

  const handleSubmit = () => {
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
    <div className="w-full max-w-3xl mx-auto relative z-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center" // Centered layout
      >
        <div className="mb-8 p-1 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
             <span className="text-[10px] font-[var(--font-mono)] tracking-[0.2em] text-[var(--accent-glow)] uppercase">
                Query {index + 1} of {total}
             </span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-playfair)] text-white mb-12 leading-tight max-w-2xl">
          {question.question}
        </h2>

        {/* Text Input */}
        {question.type === "text" && (
          <div className="w-full max-w-xl space-y-8">
            <div className="relative group">
                <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reflection..."
                className="oracle-textarea text-xl md:text-2xl text-center min-h-[160px] md:min-h-[200px]"
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-4 right-4 text-xs font-[var(--font-mono)] text-[var(--text-muted)] pointer-events-none transition-opacity duration-300 opacity-50 group-focus-within:opacity-100">
                    {answer.length} chars
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 rounded-full overflow-hidden"
            >
             <span className="relative z-10 flex items-center gap-2">
                {isLast ? "Reveal the Future" : "Continue"}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <div className="text-xs font-[var(--font-mono)] text-[var(--text-muted)] uppercase tracking-widest">
                Press Enter to continue
            </div>
          </div>
        )}

        {/* Multiple Choice */}
        {question.type === "multiple_choice" && (
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((option, idx) => (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                key={idx}
                onClick={() => onAnswer(option)}
                className="group relative p-6 text-left rounded-xl glass-hover hover:-translate-y-1 transition-all duration-300 min-h-[100px] flex flex-col justify-center"
              >
                 <span className="text-lg md:text-xl font-[var(--font-sans)] text-[var(--text-primary)] group-hover:text-white transition-colors">
                    {option}
                 </span>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Check className="w-5 h-5 text-[var(--accent-glow)]" />
                 </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Scale (1-10) */}
        {question.type === "scale" && (
          <div className="w-full max-w-xl space-y-12 py-8">
            <div className="relative pt-10 pb-4">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={scaleValue}
                onChange={(e) => setScaleValue(parseInt(e.target.value))}
                className="w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer focus:outline-none"
                style={{
                    background: `linear-gradient(to right, #7c5cbf 0%, #c4a8ff ${((scaleValue - 1) / 9) * 100}%, var(--bg-elevated) ${((scaleValue - 1) / 9) * 100}%, var(--bg-elevated) 100%)`
                }}
              />
              
              {/* Custom Thumb (styled via CSS in globals would be better, but inline works for quick logic) */}
              <style jsx>{`
                input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: #fff;
                  box-shadow: 0 0 20px rgba(124, 92, 191, 0.5);
                  cursor: pointer;
                  margin-top: -10px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                  transition: transform 0.2s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
               input[type=range]::-moz-range-thumb {
                   height: 24px;
                   width: 24px;
                   border: none;
                   border-radius: 50%;
                   background: #fff;
                   cursor: pointer;
                   box-shadow: 0 0 20px rgba(124, 92, 191, 0.5);
               }
              `}</style>

              <div className="flex justify-between text-xs font-[var(--font-mono)] text-[var(--text-muted)] mt-6 uppercase tracking-widest">
                <span>Not at all</span>
                <span>Somewhat</span>
                <span>Extremely</span>
              </div>
            </div>

            <div className="text-center">
               <motion.div 
                 key={scaleValue}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex items-baseline justify-center"
               >
                  <span className="text-7xl font-[var(--font-playfair)] text-white">{scaleValue}</span>
                  <span className="text-xl text-[var(--text-muted)] ml-2 font-[var(--font-mono)]">/10</span>
               </motion.div>
            </div>

            <button
               onClick={() => onAnswer(scaleValue.toString())}
               className="w-full py-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-white font-medium rounded-xl hover:bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)] hover:shadow-[0_0_30px_rgba(124,92,191,0.2)] transition-all duration-300"
            >
               Confirm Rating
            </button>
          </div>
        )}

      </motion.div>
    </div>
  )
}
