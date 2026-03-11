"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { FlashcardSet } from "@/lib/types"

interface FlashcardViewerProps {
  flashcards: FlashcardSet
  onComplete: () => void
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [currentPath, setCurrentPath] = useState<'goFlashcards' | 'stayFlashcards'>('goFlashcards')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [direction, setDirection] = useState(0)

  const currentCards = flashcards[currentPath]
  const currentCard = currentCards[currentIndex]
  const totalCards = flashcards.goFlashcards.length + flashcards.stayFlashcards.length
  const overallIndex = currentPath === 'goFlashcards' ? currentIndex : flashcards.goFlashcards.length + currentIndex

  const handleNext = () => {
    setDirection(1)
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (currentPath === 'goFlashcards') {
      setCurrentPath('stayFlashcards')
      setCurrentIndex(0)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    setDirection(-1)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (currentPath === 'stayFlashcards') {
      setCurrentPath('goFlashcards')
      setCurrentIndex(flashcards.goFlashcards.length - 1)
    }
  }

  const getLikelihoodWidth = (likelihood: string) => {
    const lower = likelihood.toLowerCase()
    if (lower.includes('high') || lower.includes('very likely')) return '85%'
    if (lower.includes('medium') || lower.includes('possible')) return '55%'
    return '30%'
  }

  const getLikelihoodGradient = (likelihood: string) => {
    const lower = likelihood.toLowerCase()
    if (lower.includes('high') || lower.includes('very likely')) 
      return 'from-red-600 via-orange-500 to-red-600'
    if (lower.includes('medium') || lower.includes('possible')) 
      return 'from-yellow-600 via-orange-500 to-yellow-600'
    return 'from-green-600 via-teal-500 to-green-600'
  }

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Pulsing background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[800px] h-[800px] bg-purple-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-[var(--font-playfair)] text-white mb-6 leading-tight">
              The <span className="italic gradient-text-oracle">Shadows</span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              These are the 3am thoughts.
              <br />
              The fears that whisper when you're alone.
            </p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setShowIntro(false)}
              className="btn-mystical text-lg px-10 py-4"
            >
              Face Them →
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full blur-3xl"
        />
      </div>

      {/* Progress bar - sleek top bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((overallIndex + 1) / totalCards) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          />
        </div>
      </div>

      {/* Path indicator */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm"
        >
          <span className="text-purple-400 font-mono text-xs tracking-[0.3em] uppercase">
            {currentPath === 'goFlashcards' ? 'If You Go' : 'If You Stay'}
          </span>
        </motion.div>
      </div>

      {/* Counter */}
      <div className="fixed top-8 right-8 z-50 text-gray-500 font-mono text-sm">
        {overallIndex + 1} / {totalCards}
      </div>

      {/* Swipeable card container */}
      <div className="relative w-full h-full flex items-center justify-center px-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${currentPath}-${currentIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }: PanInfo) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe > 5000) {
                offset.x > 0 ? handleNext() : handlePrev()
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Card content - centered, not scrollable */}
            <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-12 px-8">
              
              {/* Scenario title - HUGE and dramatic */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-[var(--font-playfair)] text-white text-center leading-[1.1] max-w-4xl"
              >
                {currentCard.content}
              </motion.h1>

              {/* Description - Medium, readable */}


              {/* Likelihood meter - visual and clean */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 uppercase tracking-[0.2em] text-xs font-mono">
                    Likelihood
                  </span>
                  <span className="text-purple-400 font-bold text-sm">
                    {currentCard.likelihood}
                  </span>
                </div>
                
                <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: getLikelihoodWidth(currentCard.likelihood) }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getLikelihoodGradient(currentCard.likelihood)} rounded-full`}
                  />
                  {/* Shine effect */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
              </motion.div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 text-sm font-mono"
        >
          ← Swipe or tap edges →
        </motion.div>
      </div>

      {/* Invisible tap zones */}
      <button
        onClick={handlePrev}
        disabled={currentPath === 'goFlashcards' && currentIndex === 0}
        className="fixed left-0 top-0 bottom-0 w-1/4 z-40 opacity-0 hover:opacity-5 bg-white disabled:cursor-not-allowed transition-opacity"
        aria-label="Previous"
      />
      <button
        onClick={handleNext}
        className="fixed right-0 top-0 bottom-0 w-1/4 z-40 opacity-0 hover:opacity-5 bg-white transition-opacity"
        aria-label="Next"
      />
    </div>
  )
}
