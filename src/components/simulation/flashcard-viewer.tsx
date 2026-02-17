import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FlashcardSet, FlashcardData } from "@/lib/types"
import { Flashcard } from "./flashcard"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

interface FlashcardViewerProps {
  flashcards: FlashcardSet
  onComplete: () => void
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  // Combine all cards into one deck for the "Witching Hour" experience
  // First show high likelihood regrets, then others? Or just mix path A and B?
  // Let's mix them to show the chaos of choice.
  // Or: If You Go -> If You Stay.
  
  const [cards, setCards] = useState<FlashcardData[]>(() => {
    // Interleave them?
    const combined = [
        ...flashcards.goFlashcards,
        ...flashcards.stayFlashcards
    ].map(c => ({...c, _id: Math.random()})) // Ensure unique IDs for animation keys
    return combined
  })
  
  const [swipedCount, setSwipedCount] = useState(0)
  const totalCards = flashcards.goFlashcards.length + flashcards.stayFlashcards.length

  const handleSwipe = useCallback((direction: "left" | "right") => {
    setSwipedCount(prev => prev + 1)
    setTimeout(() => {
      setCards(prev => prev.slice(1))
    }, 200)
  }, [])
  
  // Desktop navigation handlers
  const handleNext = () => handleSwipe("left") // Swipe left to discard/next

  return (
    <div className="w-full flex flex-col items-center min-h-[800px] py-12 md:py-20 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 text-center mb-16 space-y-4 px-4">
        <span className="text-xs font-[var(--font-mono)] text-red-400/60 tracking-[0.3em] uppercase animate-pulse">
            The Witching Hour
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-playfair)] text-white">
          3am Thoughts
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-lg pt-2 italic font-light">
          "These are the ghosts of the futures you might abandon."
        </p>
      </div>

      <div className="relative w-full max-w-lg h-[550px] flex items-center justify-center perspective-1000">
        <AnimatePresence mode="popLayout">
          {cards.length > 0 ? (
             cards.map((card, index) => (
                index < 3 && ( // Render stack of 3
                    <Flashcard 
                        key={card._id || index} 
                        card={card} 
                        index={index} 
                        onSwipe={handleSwipe} 
                    />
                )
             ))
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                 <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-6">
                    <span className="text-4xl">✨</span>
                 </div>
                 <h3 className="text-2xl font-[var(--font-playfair)] text-white">
                    Silence has returned.
                 </h3>
                 <p className="text-gray-400 max-w-sm mx-auto mb-8">
                    You have confronted your potential regrets. The path is clearer now.
                 </p>
                 <button
                    onClick={onComplete}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-full overflow-hidden transition-transform hover:scale-105"
                 >
                    <span className="relative z-10">Save This Simulation</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cards.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
            <div className="text-xs text-gray-500 font-mono tracking-widest">
                {swipedCount} / {totalCards} CONFRONTED
            </div>
            
            {/* Desktop Navigation Hints */}
            <div className="hidden md:flex items-center gap-8 mt-4 text-gray-600">
                <button 
                    onClick={handleNext}
                    className="p-4 rounded-full border border-white/5 hover:bg-white/5 hover:text-white transition-all group"
                    aria-label="Next card"
                >
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-xs font-mono uppercase tracking-widest opacity-50">
                    Swipe or Click to Dismiss
                </div>
            </div>
          </div>
      )}
    </div>
  )
}
