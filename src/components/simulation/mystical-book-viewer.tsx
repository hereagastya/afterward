"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DualPathSimulation, SimulationMoment } from "@/lib/types"

interface MysticalBookViewerProps {
  simulations: DualPathSimulation
  onComplete: () => void
}

type ScenarioType = 'downside' | 'baseCase' | 'upside'

export function MysticalBookViewer({ simulations, onComplete }: MysticalBookViewerProps) {
  const [currentBook, setCurrentBook] = useState<'go' | 'stay'>('go')
  const [currentPage, setCurrentPage] = useState(0) // 0 = cover, 1-3 = moments
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('baseCase')
  const [showTradeoffs, setShowTradeoffs] = useState(false)

  const playPageFlip = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3')
    audio.volume = 0.12
    audio.playbackRate = 1.4
    audio.play().catch(() => {})
  }, [])

  const handleNext = useCallback(() => {
    playPageFlip()
    
    if (currentBook === 'go') {
      if (currentPage < 3) {
        setCurrentPage(currentPage + 1)
      } else {
        setCurrentBook('stay')
        setCurrentPage(0)
      }
    } else {
      if (currentPage < 3) {
        setCurrentPage(currentPage + 1)
      } else {
        setShowTradeoffs(true)
      }
    }
  }, [currentBook, currentPage, playPageFlip])

  const handlePrev = useCallback(() => {
    playPageFlip()
    
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    } else if (currentBook === 'stay') {
      setCurrentBook('go')
      setCurrentPage(3)
    }
  }, [currentBook, currentPage, playPageFlip])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!showTradeoffs) handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (!showTradeoffs) handlePrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleNext, handlePrev, showTradeoffs])

  if (showTradeoffs) {
    return (
      <TradeoffsView 
        simulations={simulations}
        onContinue={onComplete}
      />
    )
  }

  const simulation = currentBook === 'go' ? simulations?.pathA : simulations?.pathB
  const scenario = simulation ? simulation[activeScenario] : null
  
  // Safe moment getter
  const moments = scenario?.moments || []
  const currentMoment = moments[currentPage - 1] || {
    timeLabel: "Moment",
    title: "The Path Continues",
    description: "The details of this specific moment are unfolding as you progress through the simulation.",
    feeling: "contemplative"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1512 0%, #0d0b09 40%, #0f0d0a 60%, #141210 100%)' }}
    >
      
      {/* Warm ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, rgba(180, 140, 80, 0.5) 0%, transparent 70%)' }}
        />
        {/* Subtle book path color tint */}
        <motion.div
          key={currentBook}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 ${
            currentBook === 'go' 
              ? 'bg-gradient-to-br from-emerald-800 to-transparent'
              : 'bg-gradient-to-br from-indigo-800 to-transparent'
          }`}
        />
      </div>

      {/* Main book container */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Scenario tabs (only show on moment pages) */}
        {currentPage > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-3 mb-6"
          >
            {([
              { key: 'downside' as ScenarioType, label: 'Worst Case', emoji: '💀', prob: '20%' },
              { key: 'baseCase' as ScenarioType, label: 'Most Likely', emoji: '📊', prob: '60%' },
              { key: 'upside' as ScenarioType, label: 'Best Case', emoji: '✨', prob: '20%' }
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveScenario(tab.key)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  activeScenario === tab.key
                    ? 'bg-amber-900/30 border-amber-700/60 text-amber-100'
                    : 'bg-black/30 border-amber-900/20 text-gray-500 hover:border-amber-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs font-semibold">{tab.label}</div>
                    <div className="text-[10px] opacity-60">{tab.prob}</div>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* The Page */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBook}-${currentPage}-${activeScenario}`}
            initial={{ rotateY: 10, opacity: 0, x: 50 }}
            animate={{ rotateY: 0, opacity: 1, x: 0 }}
            exit={{ rotateY: -10, opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {currentPage === 0 ? (
              <BookCover path={currentBook} />
            ) : (
              <BookPage
                moment={currentMoment}
                pageNumber={currentPage}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentBook === 'go' && currentPage === 0}
            className={`text-amber-800/60 hover:text-amber-600 transition text-sm ${
              currentBook === 'go' && currentPage === 0 ? 'invisible' : ''
            }`}
          >
            ← Previous Page
          </button>

          <div className="text-amber-900/40 text-xs font-mono">
            {currentBook === 'go' ? 'Book I' : 'Book II'} • Page {currentPage}/3
          </div>

          <button
            onClick={handleNext}
            className="text-amber-800/60 hover:text-amber-600 transition text-sm"
          >
            {currentBook === 'stay' && currentPage === 3 ? 'See The Cost →' : 'Turn Page →'}
          </button>
        </div>

        {/* Click zones */}
        <button
          onClick={handlePrev}
          disabled={currentBook === 'go' && currentPage === 0}
          className="fixed left-0 top-0 bottom-0 w-1/4 opacity-0 disabled:cursor-not-allowed z-20"
          aria-label="Previous page"
        />
        <button
          onClick={handleNext}
          className="fixed right-0 top-0 bottom-0 w-1/4 opacity-0 z-20"
          aria-label="Next page"
        />

        {/* Hint on cover */}
        {currentPage === 0 && currentBook === 'go' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 4, duration: 1 }}
            className="text-center mt-4 text-amber-900/30 text-xs pointer-events-none"
          >
            Use arrow keys or click edges to turn pages
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ path }: { path: 'go' | 'stay' }) {
  const isGo = path === 'go'
  
  return (
    <div className="min-h-[70vh] max-w-2xl mx-auto bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-sm shadow-[0_4px_60px_rgba(0,0,0,0.5)] px-10 py-14 md:px-16 md:py-20 flex flex-col justify-between relative overflow-hidden border border-amber-900/15">
      
      {/* Paper texture */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C6644' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
        }}
      />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-amber-900/25" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-amber-900/25" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-amber-900/25" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-amber-900/25" />

      {/* Top label */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="text-amber-900/50 text-xs uppercase tracking-[0.4em]" style={{ fontFamily: 'Georgia, serif' }}>
            Book {isGo ? 'I' : 'II'}
          </div>
        </motion.div>
      </div>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center relative z-10"
      >
        <h1
          className="text-5xl md:text-7xl text-amber-900 text-center leading-tight mb-6 whitespace-pre-line"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {isGo ? 'If You\nGO' : 'If You\nSTAY'}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-24 h-px bg-amber-900/30 mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-amber-800/60 text-base italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {isGo ? 'A tale of change' : 'A tale of continuity'}
        </motion.p>
      </motion.div>

      {/* Footer ornament */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-amber-900/30 text-xs tracking-widest relative z-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        ◆ ◆ ◆
      </motion.div>
    </div>
  )
}

// ─── Book Page ────────────────────────────────────────────────────────────────
function BookPage({ 
  moment, 
  pageNumber
}: { 
  moment: SimulationMoment
  pageNumber: number
}) {
  return (
    <div className="min-h-[70vh] max-w-2xl mx-auto bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-sm shadow-[0_4px_60px_rgba(0,0,0,0.5)] px-10 py-12 md:px-16 md:py-14 flex flex-col relative overflow-hidden border border-amber-900/15">
      
      {/* Paper texture */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C6644' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Time header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div
            className="inline-block px-3 py-1.5 bg-amber-900/8 border border-amber-900/15 rounded text-amber-900/50 text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {moment.timeLabel}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl text-amber-900 mb-6 leading-snug"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {moment.title}
        </motion.h2>

        {/* Story text — no fixed aspect ratio, text flows naturally */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1"
        >
          <p
            className="text-base md:text-lg text-amber-800/85 leading-[1.8] whitespace-pre-line"
            style={{ fontFamily: 'Georgia, serif', textIndent: '2em' }}
          >
            {moment.description}
          </p>
        </motion.div>

        {/* Emotional note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-5 border-t border-amber-900/15"
        >
          <div
            className="flex items-center gap-2 text-amber-900/45 italic text-sm"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span>—</span>
            <span>{moment.feeling}</span>
          </div>
        </motion.div>
      </div>

      {/* Page number */}
      <div
        className="absolute bottom-5 right-8 text-amber-900/30 text-sm"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {pageNumber}
      </div>
    </div>
  )
}

// ─── Tradeoffs View (Book Theme) ──────────────────────────────────────────────
function TradeoffsView({ 
  simulations, 
  onContinue 
}: { 
  simulations: DualPathSimulation
  onContinue: () => void
}) {
  const tradeoffs = [
    { key: 'money', label: 'Financial Reality' },
    { key: 'stress', label: 'Mental Weight' },
    { key: 'sleep', label: 'Peace of Mind' },
    { key: 'growth', label: 'Personal Evolution' },
    { key: 'regretRisk', label: 'Future Regret' }
  ]

  return (
    <div 
      className="min-h-screen p-4 md:p-6 overflow-y-auto flex justify-center"
      style={{ background: 'linear-gradient(135deg, #1a1512 0%, #0d0b09 40%, #0f0d0a 60%, #141210 100%)' }}
    >
      {/* Warm ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, rgba(180, 140, 80, 0.5) 0%, transparent 70%)' }}
        />
      </div>

      {/* Book-style tradeoffs page */}
      <div className="relative z-10 w-full max-w-2xl py-8">
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-sm shadow-[0_4px_60px_rgba(0,0,0,0.5)] px-8 py-12 md:px-14 md:py-16 relative overflow-hidden border border-amber-900/15">
          
          {/* Paper texture */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C6644' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
            }}
          />

          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-amber-900/25" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-amber-900/25" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-amber-900/25" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-amber-900/25" />

          <div className="relative z-10">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="text-amber-900/40 text-xs uppercase tracking-[0.4em] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Epilogue
              </div>
              <h2
                className="text-4xl md:text-5xl text-amber-900 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                The True Price
              </h2>
              <div className="w-24 h-px bg-amber-900/25 mx-auto" />
            </motion.div>

            {/* Tradeoff rows */}
            <div className="space-y-8">
              {tradeoffs.map((dim, i) => {
                const goTrade = simulations?.pathA?.tradeoffs?.[dim.key as keyof typeof simulations.pathA.tradeoffs] || { score: 0, summary: "No data available." }
                const stayTrade = simulations?.pathB?.tradeoffs?.[dim.key as keyof typeof simulations.pathB.tradeoffs] || { score: 0, summary: "No data available." }

                return (
                  <motion.div
                    key={dim.key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Dimension label */}
                    <h3
                      className="text-lg text-amber-900 mb-4 font-semibold"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {dim.label}
                    </h3>

                    {/* Two-column comparison */}
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* GO */}
                      <div className="border-l-2 border-amber-900/20 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-amber-900/50 text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                            If You Go
                          </span>
                          <span className={`text-sm font-bold ${
                            goTrade.score >= 2 ? 'text-emerald-700' :
                            goTrade.score >= 0 ? 'text-amber-800' :
                            goTrade.score >= -2 ? 'text-orange-700' :
                            'text-red-700'
                          }`}>
                            {goTrade.score > 0 ? '+' : ''}{goTrade.score}
                          </span>
                        </div>

                        {/* Minimal bar */}
                        <div className="h-1.5 bg-amber-900/10 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((goTrade.score + 5) / 10) * 100}%` }}
                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}
                            className={`h-full rounded-full ${
                              goTrade.score >= 2 ? 'bg-emerald-600' :
                              goTrade.score >= 0 ? 'bg-amber-700' :
                              goTrade.score >= -2 ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}
                          />
                        </div>

                        <p className="text-amber-800/70 text-xs leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {goTrade.summary}
                        </p>
                      </div>

                      {/* STAY */}
                      <div className="border-l-2 border-amber-900/20 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-amber-900/50 text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                            If You Stay
                          </span>
                          <span className={`text-sm font-bold ${
                            stayTrade.score >= 2 ? 'text-emerald-700' :
                            stayTrade.score >= 0 ? 'text-amber-800' :
                            stayTrade.score >= -2 ? 'text-orange-700' :
                            'text-red-700'
                          }`}>
                            {stayTrade.score > 0 ? '+' : ''}{stayTrade.score}
                          </span>
                        </div>

                        {/* Minimal bar */}
                        <div className="h-1.5 bg-amber-900/10 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((stayTrade.score + 5) / 10) * 100}%` }}
                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}
                            className={`h-full rounded-full ${
                              stayTrade.score >= 2 ? 'bg-emerald-600' :
                              stayTrade.score >= 0 ? 'bg-amber-700' :
                              stayTrade.score >= -2 ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}
                          />
                        </div>

                        <p className="text-amber-800/70 text-xs leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {stayTrade.summary}
                        </p>
                      </div>
                    </div>

                    {/* Divider between rows (except last) */}
                    {i < tradeoffs.length - 1 && (
                      <div className="w-full h-px bg-amber-900/10 mt-8" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Closing quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-amber-900/15 text-center"
            >
              <p
                className="text-base text-amber-800/60 italic leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                &ldquo;The question is not which path is perfect.<br />
                The question is which tradeoffs you can live with.&rdquo;
              </p>
            </motion.div>

            {/* Continue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-10"
            >
              <button
                onClick={onContinue}
                className="px-10 py-3 bg-amber-900 text-amber-50 rounded-sm hover:bg-amber-800 transition-colors text-sm tracking-wider uppercase"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Make Your Decision →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
