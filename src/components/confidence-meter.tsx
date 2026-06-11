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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-purple-300 text-sm italic"
              >
                {emotionalState}
              </motion.p>
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
          </motion.div>

          {/* Emotion Breakdown — Three distinct forces */}
          <div className="space-y-5 mb-8">
            
            {/* Fear */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span className="text-red-400">Fear</span>
                </span>
                <span className="text-red-400 font-bold text-xl tabular-nums">{fearLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-red-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fearLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-orange-500 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Logic */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <span className="text-cyan-400">Logic</span>
                </span>
                <span className="text-cyan-400 font-bold text-xl tabular-nums">{logicLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-cyan-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${logicLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-400 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Gut Feeling */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">💫</span>
                  <span className="text-amber-400">Gut Feeling</span>
                </span>
                <span className="text-amber-400 font-bold text-xl tabular-nums">{gutLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-amber-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gutLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Sum indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-right"
            >
              <span className="text-gray-600 text-xs font-mono">
                = {fearLevel + logicLevel + gutLevel}%
              </span>
            </motion.div>
          </div>

          {/* Red Flags — Urgent, specific, personal */}
          {redFlags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.9 }}
              className="mb-8"
            >
              <div className="space-y-3">
                {redFlags.map((flag: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.0 + (i * 0.15) }}
                    className="bg-red-500/8 border-l-4 border-red-500 rounded-r-lg p-4 relative overflow-hidden"
                  >
                    {/* Subtle pulse glow */}
                    <motion.div
                      animate={{ opacity: [0, 0.08, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute inset-0 bg-red-500"
                    />
                    <p className="text-gray-200 text-sm leading-relaxed relative z-10">
                      {flag}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prediction Box — The gut punch */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.3 }}
            className="relative mb-6 overflow-hidden rounded-xl"
          >
            {/* Background with animated border */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black rounded-xl" />
            <motion.div
              animate={{
                background: [
                  'linear-gradient(0deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                  'linear-gradient(180deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                  'linear-gradient(360deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-xl"
            />
            
            <div className="relative z-10 p-8 text-center border border-purple-500/30 rounded-xl">
              <p className="text-gray-500 text-xs mb-4 uppercase tracking-[0.3em]">
                Our Prediction
              </p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.5, type: "spring" }}
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-1 font-[var(--font-playfair)]">
                  You&apos;ll {prediction === 'go' ? 'GO' : 'STAY'}
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-purple-500/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${predictionConfidence}%` }}
                      transition={{ delay: 2.7, duration: 0.8 }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-purple-400 text-sm font-mono">{predictionConfidence}%</span>
                </div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="text-gray-300 text-base italic leading-relaxed max-w-lg mx-auto"
              >
                &ldquo;{reasoning}&rdquo;
              </motion.p>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-center"
          >
            <button
              onClick={onContinue}
              className="btn-mystical w-full text-lg py-4"
            >
              Let&apos;s see if we&apos;re right →
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
