"use client"

import { motion } from "framer-motion"
import { AnalysisResult } from "@/lib/types"

interface ConfidenceMeterProps {
  analysis: AnalysisResult
  onContinue: () => void
}

export function ConfidenceMeter({ analysis, onContinue }: ConfidenceMeterProps) {
  const {
    clarityScore,
    fearLevel,
    logicLevel,
    gutLevel,
    redFlags,
    prediction,
    predictionConfidence,
    reasoning,
    emotionalState
  } = analysis

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 border border-purple-500/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-[var(--font-playfair)] text-white mb-3">
                Your Decision DNA 🧬
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We&apos;ve analyzed the emotional and logical weighting of your responses to reveal what&apos;s truly driving this choice.
              </p>
            </motion.div>
          </div>

          {/* Clarity Score - Hero Element */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="text-center mb-10"
          >
            <div className="relative inline-block">
              {/* Circular progress */}
              <svg className="transform -rotate-90 w-40 h-40 md:w-48 md:h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="rgba(124, 92, 191, 0.1)"
                  strokeWidth="14"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="url(#clarityGradient)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 528" }}
                  animate={{ strokeDasharray: `${clarityScore * 5.28} 528` }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="clarityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c5cbf" />
                    <stop offset="100%" stopColor="#9d7de8" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-white"
                >
                  {clarityScore}%
                </motion.span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Clarity</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-gray-400 mt-4 text-lg"
            >
              {clarityScore > 70 ? "You're pretty clear on this" :
               clarityScore > 40 ? "You're still figuring it out" :
               "You're very confused"}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-purple-400 text-sm mt-2"
            >
              {emotionalState}
            </motion.p>
          </motion.div>

          {/* Emotion Breakdown */}
          <div className="space-y-5 mb-8">
            {/* Fear */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-mono text-sm uppercase tracking-wider">
                  Fear
                </span>
                <span className="text-red-400 font-bold text-lg">{fearLevel}%</span>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fearLevel}%` }}
                  transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Logic */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-mono text-sm uppercase tracking-wider">
                  Logic
                </span>
                <span className="text-blue-400 font-bold text-lg">{logicLevel}%</span>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${logicLevel}%` }}
                  transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Gut */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm uppercase tracking-wider">
                  Gut Feeling
                </span>
                <span className="text-green-400 font-bold text-lg">{gutLevel}%</span>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gutLevel}%` }}
                  transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Red Flags */}
          {redFlags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6"
            >
              <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2 text-lg">
                <span>⚠️</span> Red Flags Detected
              </h4>
              <ul className="space-y-2">
                {redFlags.map((flag: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.9 + (i * 0.1) }}
                    className="text-gray-300 text-sm flex items-start gap-2"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{flag}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Prediction Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl p-6 mb-6"
          >
            <p className="text-gray-400 text-sm mb-3 text-center uppercase tracking-wider">
              Our Prediction
            </p>
            <div className="text-center mb-3">
              <p className="text-3xl font-bold text-white mb-1">
                You'll choose: <span className="text-purple-400 uppercase">{prediction}</span>
              </p>
              <p className="text-gray-400">
                {predictionConfidence}% confidence
              </p>
            </div>
            <p className="text-gray-300 text-sm text-center italic">
              "{reasoning}"
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-center"
          >
            <button
              onClick={onContinue}
              className="btn-mystical w-full text-lg py-4"
            >
              Let's see if we're right →
            </button>
            <p className="text-gray-500 text-xs mt-3">
              Generating your timelines...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
