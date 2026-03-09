"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import { TimelinePhase } from "@/lib/types"

interface MomentJourneyCardProps {
  moment: TimelinePhase
  currentIndex: number
  totalMoments: number
  onNext: () => void
  showNextButton: boolean
  nextButtonText: string
}

const getMoodVisual = (emotion: string) => {
  const moodStyles: Record<string, { bg: string, pattern: string }> = {
    anxiety: {
      bg: "linear-gradient(180deg, #110000 0%, #350000 60%, #000000 100%)",
      pattern: "chaos"
    },
    terror: {
      bg: "linear-gradient(180deg, #09090b 0%, #27272a 60%, #000000 100%)",
      pattern: "static"
    },
    dread: {
      bg: "radial-gradient(circle at 50% 120%, #1f2937, #000000 80%)",
      pattern: "sinking"
    },
    hope: {
      bg: "linear-gradient(180deg, #0f172a 0%, #1d4ed8 60%, #000000 100%)",
      pattern: "ascending"
    },
    excitement: {
      bg: "radial-gradient(circle at top, #4c1d95, #000000)",
      pattern: "bursting"
    },
    regret: {
      bg: "linear-gradient(180deg, #020617 0%, #1e1b4b 50%, #000000 100%)",
      pattern: "fading"
    },
    relief: {
      bg: "linear-gradient(180deg, #064e3b 0%, #022c22 70%, #000000 100%)",
      pattern: "calm"
    }
  }
  
  const normalized = emotion.toLowerCase()
  for (const key of Object.keys(moodStyles)) {
    if (normalized.includes(key)) return moodStyles[key]
  }
  
  // Default dark cinematic
  return {
    bg: "linear-gradient(180deg, #0f0c29 0%, #302b63 60%, #000000 100%)",
    pattern: "floating"
  }
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
  const visual = getMoodVisual(moment.feeling || "")

  // Format short summary correctly splitting by periods
  const parsedSummary = (moment.shortSummary || "").split('.').filter(s => s.trim().length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-full h-full text-white overflow-hidden bg-black"
    >
      {/* Background Cinematic Visual */}
      <div 
        className="absolute inset-0 z-0 opacity-80" 
        style={{ background: visual.bg }} 
      />
      
      {/* Glitch Overlay / Film Grain */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay noise-overlay" />

      {/* Progress Dots - fixed top */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-50 w-full max-w-sm px-8 pointer-events-none">
        {Array.from({ length: totalMoments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 shadow-sm ${
              i < currentIndex ? 'bg-white/80' :
              i === currentIndex ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' :
              'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Main Full-Screen Content */}
      <div 
        className="relative z-10 w-full h-full flex flex-col justify-end px-6 md:px-12 pb-24 max-w-4xl mx-auto cursor-pointer"
        onClick={(!showDetails && showNextButton) ? onNext : undefined}
      >
        <div className="flex flex-col mb-12" onClick={e => e.stopPropagation()}>
          {/* Mystical Time Stamp */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="inline-block relative">
              <span className="text-white/40 font-[var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase">
                {moment.timeLabel}
              </span>
              <div className="absolute -inset-x-4 -inset-y-2 bg-white/5 rounded-full blur-md -z-10" />
            </div>
          </motion.div>

          {/* Core Title */}
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-[var(--font-playfair)] font-light text-white mb-6 leading-[1.1] tracking-tight"
          >
            {moment.title}
          </motion.h2>

          {/* 3-Sentence Rule Lines */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="space-y-4 mb-4"
          >
            {parsedSummary.length > 0 ? (
              parsedSummary.map((sentence, i) => (
                <p key={i} className={`text-2xl sm:text-3xl font-light text-white leading-snug max-w-2xl ${i === 1 ? 'text-white/70 italic' : i === 2 ? 'text-white/50 font-[var(--font-dm-mono)] text-sm uppercase tracking-widest mt-6' : ''}`}>
                  {sentence.trim()}.
                </p>
              ))
            ) : (
              // Fallback if summary parsing fails
              <p className="text-2xl sm:text-3xl font-light text-white/90 leading-snug">
                {moment.shortSummary}
              </p>
            )}
          </motion.div>

          {/* Feeling / Mood badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 mb-4 border-l-2 border-white/20 pl-4 py-1"
          >
            <span className="text-white/60 text-[10px] uppercase font-[var(--font-dm-mono)] tracking-[0.2em] block mb-1">Dominant Emotion</span>
            <span className="text-white font-medium capitalize tracking-wide">{moment.feeling}</span>
          </motion.div>
        </div>

        {/* Expandable Details Wrapper */}
        <div className="mt-auto" onClick={e => e.stopPropagation()}>
          <AnimatePresence>
            {showDetails && moment.details && moment.details.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                className="mb-8"
              >
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                  <h4 className="text-white/40 font-[var(--font-dm-mono)] tracking-widest text-xs uppercase mb-4">
                    The Reality
                  </h4>
                  <ul className="space-y-4">
                    {moment.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-white/80 text-lg md:text-xl font-light">
                        <span className="mr-3 text-white/30">—</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Area: Details toggle + Next screen */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full pt-4 border-t border-white/10">
            {moment.details && moment.details.length > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-white/50 hover:text-white transition-colors duration-300 font-[var(--font-dm-mono)] text-xs uppercase tracking-widest py-2"
              >
                {showDetails ? (
                  <><ChevronDown className="w-4 h-4 mr-2" /> Hide reality</>
                ) : (
                  <><ChevronUp className="w-4 h-4 mr-2" /> Uncover reality</>
                )}
              </button>
            )}

            {showNextButton && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={onNext}
                className="text-white font-[var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] bg-white/10 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 px-8 py-4 rounded-full w-full sm:w-auto text-center"
              >
                {nextButtonText}
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tappable transparent overlay to advance if details are hidden */}
      {!showDetails && showNextButton && (
        <div 
          className="absolute inset-0 z-0" 
          onClick={onNext}
          aria-label="Tap to advance"
        />
      )}
    </motion.div>
  )
}
