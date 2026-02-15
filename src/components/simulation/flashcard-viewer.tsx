import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FlashcardSet, FlashcardData } from "@/lib/types"
import { Flashcard } from "./flashcard"

interface FlashcardViewerProps {
  flashcards: FlashcardSet
  onComplete: () => void
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  // Combine cards? Or show Go then Stay? 
  // Let's interleave them or show them in two stacks? 
  // Better: Show one path's regrets, then the other.
  // Actually, checking "Flashcards Redesign" plan... just "Update FlashcardViewer".
  // I'll combine them into a single deck for "chaos" or keep separate.
  // The system prompt generates them separately.
  // Let's mix them or let user choose? 
  // Simple flow: 3 Go cards -> 3 Stay cards -> Done.
  
  const allCards = [
    ...flashcards.goFlashcards.map(c => ({ ...c, _id: Math.random() })),
    ...flashcards.stayFlashcards.map(c => ({ ...c, _id: Math.random() }))
  ]

  const [cards, setCards] = useState(allCards)
  const [swipedCount, setSwipedCount] = useState(0)

  const handleSwipe = (direction: "left" | "right") => {
    // Remove the top card (index 0)
    setTimeout(() => {
      setCards(prev => prev.slice(1))
      setSwipedCount(prev => prev + 1)
      
      if (cards.length <= 1) { // We just swiped the last one
        onComplete()
      }
    }, 200)
  }

  return (
    <div className="w-full flex flex-col items-center min-h-[600px] py-12">
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-3xl font-light text-white">The Witching Hour</h2>
        <p className="text-gray-400">Swipe to confront your 3am thoughts.</p>
      </div>

      <div className="relative w-full max-w-sm h-96 flex items-center justify-center">
        <AnimatePresence>
          {cards.map((card, index) => (
             index < 3 && ( // Only render top 3 for performance/stacking
               <Flashcard 
                 key={card._id} 
                 card={card} 
                 index={index} 
                 onSwipe={handleSwipe} 
               />
             )
          ))}
        </AnimatePresence>

        {cards.length === 0 && (
          <div className="text-white text-xl">
             Silence...
          </div>
        )}
      </div>

      <div className="mt-12 text-sm text-gray-500 font-mono">
        {swipedCount} / {allCards.length} CONFRONTED
      </div>
    </div>
  )
}
