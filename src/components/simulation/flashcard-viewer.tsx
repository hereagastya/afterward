"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FlashcardSet, FlashcardData } from "@/lib/types" // Flashcard type is FlashcardData in definition
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FlashcardViewerProps {
  flashcards: FlashcardSet
  onComplete: () => void
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [currentPath, setCurrentPath] = useState<'pathA' | 'pathB'>('pathA')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  // Map flashcards using the right keys. Wait, we need to check how flashcards API output looks like. 
  // Let's assume it returns { goFlashcards, stayFlashcards } or something. The prop uses pathA/pathB or goFlashcards/stayFlashcards.
  // The API likely returns FlashcardSet which has goFlashcards and stayFlashcards for backward compatibility but let's check.
  // The provided snippet uses: `const currentCards = flashcards[currentPath]`.
  // The types.ts file: export interface FlashcardSet { goFlashcards: FlashcardData[], stayFlashcards: FlashcardData[] }
  // Oh wait! In types.ts it was `goFlashcards` and `stayFlashcards`, not `pathA` and `pathB`.
  // Let me map this properly so it compiles without errors.
  
  const pathKey = currentPath === 'pathA' ? 'goFlashcards' : 'stayFlashcards'
  const currentCards = flashcards[pathKey] || []
  const currentCard = currentCards[currentIndex]

  // If there are no flashcards somehow, fallback gracefully
  if (!currentCards.length) {
    return <div className="text-white p-10">Loading visions...</div>
  }

  const goLength = flashcards.goFlashcards?.length || 0
  const stayLength = flashcards.stayFlashcards?.length || 0
  const totalCards = goLength + stayLength
  const overallIndex = currentPath === 'pathA' ? currentIndex : goLength + currentIndex

  const handleNext = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (currentPath === 'pathA') {
      // Switch to path B
      setCurrentPath('pathB')
      setCurrentIndex(0)
    } else {
      // Done with all cards
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (currentPath === 'pathB') {
      // Go back to path A
      setCurrentPath('pathA')
      setCurrentIndex(goLength - 1)
    }
  }

  const getLikelihoodColor = (likelihood: string) => {
    const lower = likelihood.toLowerCase()
    if (lower.includes('high') || lower.includes('very likely')) return 'from-red-500 to-orange-500'
    if (lower.includes('medium') || lower.includes('possible')) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-teal-500'
  }

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden"
      >
        {/* Portal background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-[600px] h-[600px] rounded-full border border-purple-500/20"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.6)]">
              <span className="text-6xl">👁️</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-[var(--font-playfair)] text-white mb-6"
          >
            The <span className="gradient-text-oracle italic">Regret Visions</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg mb-12"
          >
            These are the 3am thoughts you're avoiding.
            <br />
            The fears that whisper when you're alone.
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => setShowIntro(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all"
          >
            Face the Shadows →
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      {/* Progress indicator */}
      <div className="relative z-10 w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-[var(--font-dm-mono)] tracking-wider">
            {currentPath === 'pathA' ? 'IF YOU GO' : 'IF YOU STAY'}
          </span>
          <span className="font-[var(--font-dm-mono)]">
            {overallIndex + 1} / {totalCards}
          </span>
        </div>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((overallIndex + 1) / totalCards) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Vision card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPath}-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="glass rounded-2xl p-8 md:p-12 border border-purple-500/20 relative overflow-hidden">
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentCard.category.split(',').map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-[var(--font-dm-mono)] uppercase tracking-wider"
                >
                  {cat.trim()}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-[var(--font-playfair)] text-white mb-6 leading-tight">
              {/* @ts-ignore - Some older API shapes use 'scenario' vs 'content' */}
              {currentCard.scenario || currentCard.content}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {currentCard.content || "Description unavailable for this vision."}
            </p>

            {/* Likelihood meter */}
            {currentCard.likelihood && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-[var(--font-dm-mono)] uppercase tracking-wider">
                    Likelihood
                  </span>
                  <span className="text-purple-400 font-semibold">
                    {currentCard.likelihood}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: currentCard.likelihood.toLowerCase().includes('high') ? '80%' :
                            currentCard.likelihood.toLowerCase().includes('medium') ? '50%' : '30%'
                    }}
                    className={`h-full bg-gradient-to-r ${getLikelihoodColor(currentCard.likelihood)}`}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="relative z-10 flex items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPath === 'pathA' && currentIndex === 0}
          className="p-3 glass rounded-full border border-purple-500/20 text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
        >
          {currentPath === 'pathB' && currentIndex === currentCards.length - 1
            ? 'Continue →'
            : 'Next Vision →'}
        </button>

        <button
          onClick={handleNext}
          className="p-3 glass rounded-full border border-purple-500/20 text-white hover:border-purple-500/40 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
