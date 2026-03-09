"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TimelinePhase } from "@/lib/types"
import { EmotionOrb } from "./emotion-orb"

interface MomentJourneyCardProps {
  moment: TimelinePhase
  currentIndex: number
  totalMoments: number
  onNext: () => void
  showNextButton: boolean
  nextButtonText: string
}

export function MomentJourneyCard({
  moment,
  currentIndex,
  totalMoments,
  onNext,
  showNextButton,
  nextButtonText
}: MomentJourneyCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      {/* Progress Dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalMoments }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? "bg-purple-400 w-8"
                : i < currentIndex
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="max-w-2xl w-full glass p-8 md:p-12 rounded-2xl">
        {/* Mystical time label */}
        <div className="text-center mb-6">
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative inline-block"
          >
            {/* Glow background */}
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            
            <span className="relative font-[var(--font-dm-mono)] uppercase tracking-[0.25em] text-purple-400 text-sm px-6 py-2 border border-purple-500/30 rounded-full bg-purple-500/5">
              {moment.timeLabel}
            </span>
          </motion.div>
        </div>

        {/* Emotion Orb instead of emoji */}
        <div className="text-center mb-6">
          <EmotionOrb emotion={moment.feeling} size="lg" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-serif italic text-white text-center mb-2">
          {moment.title}
        </h2>

        {/* Feeling */}
        <p className="text-center text-purple-400 font-mono text-sm uppercase tracking-wide mb-8">
          {moment.feeling}
        </p>

        {/* Summary */}
        <p className="text-gray-300 text-lg leading-relaxed text-center mb-8">
          {moment.shortSummary}
        </p>

        {/* Expandable Details */}
        {moment.details && moment.details.length > 0 && (
          <div className="border-t border-white/10 pt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium mr-2">
                {showDetails ? "Hide" : "Show"} details
              </span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-3"
              >
                {moment.details.map((detail, i) => (
                  <li key={i} className="flex items-start text-gray-400 text-sm">
                    <span className="text-purple-400 mr-3 mt-1">▸</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        )}
      </div>

      {/* Next Button */}
      {showNextButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onNext}
          className="btn-glass mt-8"
        >
          {nextButtonText}
        </motion.button>
      )}
    </motion.div>
  )
}
