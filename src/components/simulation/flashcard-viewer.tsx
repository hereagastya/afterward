"use client"

import { useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { FlashcardSet } from "@/lib/types"

interface FlashcardViewerProps {
  flashcards: FlashcardSet
  onComplete: () => void
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [currentPath, setCurrentPath] = useState<'pathA' | 'pathB'>('pathA')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  const pathKey = currentPath === 'pathA' ? 'goFlashcards' : 'stayFlashcards'
  const currentCards = flashcards[pathKey] || []
  const currentCard = currentCards[currentIndex]

  // If there are no flashcards somehow, fallback gracefully
  if (!currentCards.length) {
    return <div className="text-white p-10 h-screen bg-black flex items-center justify-center">Loading visions...</div>
  }

  const goLength = flashcards.goFlashcards?.length || 0
  const stayLength = flashcards.stayFlashcards?.length || 0
  const totalCards = goLength + stayLength
  const overallIndex = currentPath === 'pathA' ? currentIndex : goLength + currentIndex

  const handleSwipe = (offset: number) => {
    if (offset < -100) {
      // Swiped left - go to next (content moves left)
      handleNext()
    } else if (offset > 100) {
      // Swiped right - go to prev (content moves right)
      handlePrev()
    }
  }

  const handleNext = () => {
    setDirection(1)
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (currentPath === 'pathA') {
      setCurrentPath('pathB')
      setCurrentIndex(0)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    setDirection(-1)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (currentPath === 'pathB') {
      setCurrentPath('pathA')
      setCurrentIndex(goLength - 1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100vw' : '-100vw',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100vw' : '-100vw',
      opacity: 0,
      scale: 0.95
    })
  }

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-screen w-full px-6 relative overflow-hidden bg-black"
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
            className="w-[120vw] h-[120vw] md:w-[600px] md:h-[600px] rounded-full border border-purple-500/20"
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
            className="absolute w-[80vw] h-[80vw] md:w-[400px] md:h-[400px] bg-purple-500/10 rounded-full blur-3xl"
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
              <span className="text-6xl text-white">👁️</span>
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
            className="btn-mystical text-lg"
          >
            Face the Shadows →
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden touch-none text-white selection:bg-purple-900/50">
      {/* Progress dots - fixed at top */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 w-full max-w-md px-6 pointer-events-none">
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < overallIndex ? 'bg-white/80' :
              i === overallIndex ? 'bg-white relative after:absolute after:inset-0 after:bg-white after:blur-[4px]' :
              'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Path indicator */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <span className="text-purple-400 font-mono text-xs tracking-[0.2em] uppercase bg-black/50 px-4 py-1.5 rounded-full border border-purple-500/20 backdrop-blur-md">
          {currentPath === 'pathA' ? 'IF YOU GO' : 'IF YOU STAY'}
        </span>
      </div>

      {/* Swipeable card */}
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
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(e, { offset, velocity }: PanInfo) => {
            const swipe = offset.x
            if (Math.abs(swipe) > 100 || Math.abs(velocity.x) > 500) {
              handleSwipe(swipe)
            }
          }}
          className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 w-full cursor-grab active:cursor-grabbing"
        >
          {/* Full screen card content */}
          <div className="w-full max-w-3xl h-full pb-20 pt-32 flex flex-col justify-center">
            {/* Ambient glow matching likelihood */}
            <div 
              className="absolute inset-0 opacity-20 blur-3xl -z-10 transition-colors duration-1000"
              style={{
                background: currentCard?.likelihood?.toLowerCase()?.includes('high') ? 'radial-gradient(circle, #ef4444 0%, transparent 70%)' :
                            currentCard?.likelihood?.toLowerCase()?.includes('medium') ? 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' : 
                            'radial-gradient(circle, #10b981 0%, transparent 70%)'
              }}
            />

            <div className="flex-1 flex flex-col justify-center text-center space-y-10 items-center">
              {/* Category */}
              {currentCard?.category && (
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {currentCard.category.split(',').map((cat: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-[var(--font-dm-mono)] uppercase tracking-widest backdrop-blur-sm"
                    >
                      {cat.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Title - HUGE */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-[var(--font-playfair)] text-white leading-[1.1] tracking-tight text-balance">
                {/* @ts-ignore */}
                {currentCard?.scenario || currentCard?.content || "Unknown Vision"}
              </h1>

              {/* Description - Medium */}
              <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light text-balance max-w-2xl">
                {/* @ts-ignore */}
                {currentCard?.description || currentCard?.content || "Description unavailable for this vision."}
              </p>

              {/* Likelihood meter */}
              {currentCard?.likelihood && (
                <div className="w-full max-w-sm mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                      Likelihood
                    </span>
                    <span className="text-white font-[var(--font-dm-mono)] text-sm tracking-widest uppercase bg-white/10 px-3 py-1 rounded-md">
                      {currentCard.likelihood}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: currentCard.likelihood.toLowerCase().includes('high') ? '85%' :
                               currentCard.likelihood.toLowerCase().includes('medium') ? '50%' : '20%'
                      }}
                      className="h-full bg-white relative after:absolute after:inset-0 after:bg-white after:blur-[2px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation hint (bottom) */}
            <div className="fixed bottom-8 left-0 right-0 text-center">
              <motion.div 
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/40 text-[11px] font-[var(--font-dm-mono)] uppercase tracking-[0.3em]"
              >
                ← Swipe to navigate →
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tap zones for non-swipe navigation */}
      <button
        onClick={handlePrev}
        disabled={currentPath === 'pathA' && currentIndex === 0}
        className="fixed left-0 top-0 bottom-0 w-[20vw] z-40 opacity-0"
        aria-label="Previous"
      />
      <button
        onClick={handleNext}
        className="fixed right-0 top-0 bottom-0 w-[20vw] z-40 opacity-0"
        aria-label="Next"
      />
    </div>
  )
}
