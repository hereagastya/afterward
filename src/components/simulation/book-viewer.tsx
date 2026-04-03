"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DualPathSimulation } from "@/lib/types"

interface BookViewerProps {
  simulations: DualPathSimulation
  onComplete: () => void
}

type PageType = 
  | { type: 'cover'; path: 'go' }
  | { type: 'moment'; path: 'go' | 'stay'; scenario: 'base' | 'upside' | 'downside'; momentIndex: number }
  | { type: 'transition' }
  | { type: 'cover'; path: 'stay' }
  | { type: 'tradeoffs' }

export function BookViewer({ simulations, onComplete }: BookViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  // Build the book structure
  const pages: PageType[] = [
    // Book 1: IF YOU GO
    { type: 'cover', path: 'go' },
    ...simulations.pathA.baseCase.moments.map((_, i) => ({
      type: 'moment' as const,
      path: 'go' as const,
      scenario: 'base' as const,
      momentIndex: i
    })),
    
    // Chapter transition
    { type: 'transition' },
    
    // Book 2: IF YOU STAY  
    { type: 'cover', path: 'stay' },
    ...simulations.pathB.baseCase.moments.map((_, i) => ({
      type: 'moment' as const,
      path: 'stay' as const,
      scenario: 'base' as const,
      momentIndex: i
    })),
    
    // Epilogue: The Cost
    { type: 'tradeoffs' }
  ]

  const currentPage = pages[currentPageIndex]

  const playPageFlip = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3')
    audio.volume = 0.12
    audio.playbackRate = 1.4
    audio.play().catch(() => {})
  }, [])

  const handleNext = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      setDirection(1)
      setCurrentPageIndex(prev => prev + 1)
      playPageFlip()
    } else {
      onComplete()
    }
  }, [currentPageIndex, pages.length, playPageFlip, onComplete])

  const handlePrev = useCallback(() => {
    if (currentPageIndex > 0) {
      setDirection(-1)
      setCurrentPageIndex(prev => prev - 1)
      playPageFlip()
    }
  }, [currentPageIndex, playPageFlip])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 15 : -15,
      opacity: 0,
      x: dir > 0 ? 100 : -100,
      scale: 0.95
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      x: 0,
      scale: 1
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -15 : 15,
      opacity: 0,
      x: dir > 0 ? -100 : 100,
      scale: 0.95
    })
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden" style={{ perspective: '2000px' }}>
      
      {/* Ambient background based on current path */}
      <motion.div
        key={currentPage.type === 'moment' ? currentPage.path : 'neutral'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 blur-3xl ${
          currentPage.type === 'moment' && currentPage.path === 'go'
            ? 'bg-gradient-to-br from-green-900 to-emerald-900'
            : currentPage.type === 'moment' && currentPage.path === 'stay'
            ? 'bg-gradient-to-br from-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-purple-900 to-pink-900'
        }`}
      />

      {/* The Book */}
      <div className="relative w-full max-w-4xl h-[85vh] flex items-center justify-center">
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPageIndex}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.7,
              ease: [0.32, 0.72, 0, 1],
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {renderPage(currentPage, simulations)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation UI */}
      <div className="fixed bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Previous button */}
          <button
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className={`text-sm text-gray-500 hover:text-gray-300 transition ${
              currentPageIndex === 0 ? 'invisible' : ''
            }`}
          >
            ← Previous
          </button>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentPageIndex
                    ? 'w-8 bg-purple-500'
                    : i < currentPageIndex
                    ? 'w-2 bg-purple-700'
                    : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            {currentPageIndex < pages.length - 1 ? 'Turn Page →' : 'Continue →'}
          </button>
        </div>
      </div>

      {/* Click zones for page turning (left/right thirds of screen) */}
      <button
        onClick={handlePrev}
        disabled={currentPageIndex === 0}
        className="fixed left-0 top-0 bottom-0 w-1/3 opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Previous page"
      />
      <button
        onClick={handleNext}
        className="fixed right-0 top-0 bottom-0 w-1/3 opacity-0 z-10"
        aria-label="Next page"
      />

      {/* Instructions hint (fades out after first interaction) */}
      {currentPageIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm pointer-events-none"
        >
          Click anywhere or use arrow keys to turn pages
        </motion.div>
      )}
    </div>
  )
}

// Render individual page content
function renderPage(page: PageType, simulations: DualPathSimulation) {
  
  // COVER PAGE
  if (page.type === 'cover') {
    const isGo = page.path === 'go'
    const title = isGo ? 'If You GO' : 'If You STAY'
    const subtitle = isGo ? 'The Path of Change' : 'The Path of Safety'
    
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-12 flex flex-col relative overflow-hidden">
        
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-purple-500/20" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-purple-500/20" />
        
        {/* Texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            {/* Title */}
            <h1 className="text-7xl md:text-8xl font-[var(--font-playfair)] text-white mb-8 leading-none">
              {title}
            </h1>
            
            {/* Decorative divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '12rem' }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
            />
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 font-light italic">
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* Chapter indicator */}
        <div className="text-center text-gray-700 text-sm font-mono">
          CHAPTER {isGo ? 'I' : 'II'}
        </div>
      </div>
    )
  }

  // MOMENT PAGE
  if (page.type === 'moment') {
    const simulation = page.path === 'go' ? simulations.pathA : simulations.pathB
    const moment = simulation.baseCase.moments[page.momentIndex]
    const pathColor = page.path === 'go' ? 'from-green-900/20' : 'from-blue-900/20'
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${pathColor} via-black to-black border border-gray-800 rounded-2xl shadow-2xl p-12 flex flex-col justify-center relative overflow-hidden`}>
        
        {/* Subtle paper texture */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          
          {/* Time stamp */}
          <div className="mb-8">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-400 text-sm font-mono uppercase tracking-[0.3em]"
            >
              {moment.timeLabel}
            </motion.span>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-[var(--font-playfair)] text-white mb-10 leading-tight"
          >
            {moment.title}
          </motion.h2>

          {/* Story content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light whitespace-pre-line">
              {moment.description}
            </p>
          </motion.div>

          {/* Emotional note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
            <span className="text-purple-400 italic text-sm tracking-wide">
              {moment.feeling}
            </span>
          </motion.div>
        </motion.div>

        {/* Page number */}
        <div className="absolute bottom-8 right-8 text-gray-800 font-mono text-xs">
          {page.momentIndex + 1}
        </div>
      </div>
    )
  }

  // TRANSITION PAGE (between GO and STAY)
  if (page.type === 'transition') {
    return (
      <div className="w-full h-full bg-black border-2 border-purple-500/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
        
        {/* Animated rift effect */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 blur-3xl" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="text-6xl md:text-7xl font-[var(--font-playfair)] text-white mb-6">
              But what if...
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl text-purple-400 italic font-light"
          >
            you had stayed?
          </motion.p>
        </motion.div>

        {/* Particle effects */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: `${10 + (i * 4.2) % 80}%`,
              top: `${5 + (i * 4.7) % 90}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        ))}
      </div>
    )
  }

  // TRADEOFFS PAGE
  if (page.type === 'tradeoffs') {
    const tradeoffs = [
      { key: 'money', icon: '💰', label: 'Money' },
      { key: 'stress', icon: '😰', label: 'Stress' },
      { key: 'sleep', icon: '🛌', label: 'Sleep' },
      { key: 'growth', icon: '🚀', label: 'Growth' },
      { key: 'regretRisk', icon: '🎯', label: 'Regret Risk' }
    ]

    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-950/30 via-black to-black border border-gray-800 rounded-2xl shadow-2xl p-8 overflow-y-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-[var(--font-playfair)] text-white mb-4">
            The Real Cost
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-4" />
          <p className="text-gray-400 text-lg italic">
            What you&apos;re actually trading
          </p>
        </motion.div>

        {/* Tradeoffs comparison */}
        <div className="max-w-4xl mx-auto space-y-8">
          {tradeoffs.map((dim, i) => {
            const goTradeoff = simulations.pathA.tradeoffs[dim.key as keyof typeof simulations.pathA.tradeoffs]
            const stayTradeoff = simulations.pathB.tradeoffs[dim.key as keyof typeof simulations.pathB.tradeoffs]

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                {/* Dimension header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{dim.icon}</span>
                  <h3 className="text-2xl font-semibold text-white">{dim.label}</h3>
                </div>

                {/* Comparison grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* IF YOU GO */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                        If You Go
                      </span>
                      <span className={`text-lg font-bold ${
                        goTradeoff.score >= 3 ? 'text-green-400' :
                        goTradeoff.score >= 0 ? 'text-gray-400' :
                        goTradeoff.score >= -3 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {goTradeoff.score > 0 ? '+' : ''}{goTradeoff.score}
                      </span>
                    </div>
                    
                    {/* Visual bar */}
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${((goTradeoff.score + 5) / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 + (i * 0.15) }}
                        className={`h-full ${
                          goTradeoff.score >= 3 ? 'bg-green-500' :
                          goTradeoff.score >= 0 ? 'bg-gray-600' :
                          goTradeoff.score >= -3 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {goTradeoff.summary}
                    </p>
                  </div>

                  {/* IF YOU STAY */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                        If You Stay
                      </span>
                      <span className={`text-lg font-bold ${
                        stayTradeoff.score >= 3 ? 'text-green-400' :
                        stayTradeoff.score >= 0 ? 'text-gray-400' :
                        stayTradeoff.score >= -3 ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {stayTradeoff.score > 0 ? '+' : ''}{stayTradeoff.score}
                      </span>
                    </div>
                    
                    {/* Visual bar */}
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${((stayTradeoff.score + 5) / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 + (i * 0.15) }}
                        className={`h-full ${
                          stayTradeoff.score >= 3 ? 'bg-blue-500' :
                          stayTradeoff.score >= 0 ? 'bg-gray-600' :
                          stayTradeoff.score >= -3 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {stayTradeoff.summary}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Closing thought */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl max-w-2xl mx-auto"
        >
          <p className="text-gray-300 text-center italic leading-relaxed">
            &ldquo;The question isn&apos;t which path is perfect. It&apos;s which tradeoffs you can live with.&rdquo;
          </p>
        </motion.div>
      </div>
    )
  }

  return null
}
