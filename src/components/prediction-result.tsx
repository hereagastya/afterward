"use client"

import { motion } from "framer-motion"

interface PredictionResultProps {
  wasCorrect: boolean
  prediction: string
  actualChoice: string
  reasoning: string
}

export function PredictionResult({ 
  wasCorrect, 
  prediction, 
  actualChoice,
  reasoning 
}: PredictionResultProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", delay: 0.5 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-6"
    >
      <div className={`glass rounded-2xl p-6 border-2 ${
        wasCorrect 
          ? 'border-green-500/50 bg-green-500/10' 
          : 'border-purple-500/50 bg-purple-500/10'
      }`}>
        <div className="text-center">
          <div className="text-5xl mb-3">
            {wasCorrect ? '🎯' : '🤔'}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {wasCorrect ? 'We Called It!' : 'Interesting Choice'}
          </h3>
          <p className="text-gray-300 mb-4">
            {wasCorrect 
              ? `We predicted you'd choose ${prediction.toUpperCase()} — and you did.`
              : `We predicted ${prediction.toUpperCase()}, but you chose ${actualChoice.toUpperCase()}.`
            }
          </p>
          <p className="text-sm text-gray-400 italic">
            "{reasoning}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}
