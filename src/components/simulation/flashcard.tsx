import { useRef, useState } from "react"
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"
import { FlashcardData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  card: FlashcardData
  onSwipe: (direction: "left" | "right") => void
  index: number
}

export function Flashcard({ card, onSwipe, index }: FlashcardProps) {
  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const controls = useAnimation()

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -100) {
      setExitX(-200)
      onSwipe("left")
    } else if (info.offset.x > 100) {
      setExitX(200)
      onSwipe("right")
    } else {
      controls.start({ x: 0 })
    }
  }

  const isGo = card.pathType === "go"
  const gradient = isGo 
    ? "from-emerald-900/50 to-black" 
    : "from-indigo-900/50 to-black"
  const borderColor = isGo ? "border-emerald-500/30" : "border-indigo-500/30"

  return (
    <motion.div
      style={{ 
        x, 
        rotate, 
        opacity,
        zIndex: 100 - index
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className={cn(
        "absolute w-full max-w-sm h-96 rounded-2xl p-8 cursor-grab active:cursor-grabbing border backdrop-blur-xl flex flex-col justify-between shadow-2xl origin-bottom",
        gradient,
        borderColor,
        "bg-gradient-to-br"
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-4xl filter drop-shadow-lg">{card.emojiBefore}</span>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border",
          isGo ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
        )}>
          {card.category}
        </span>
      </div>

      <div className="text-center">
        <p className="text-xl font-medium text-white leading-relaxed">
          "{card.content}"
        </p>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-xs text-gray-500 font-mono">
          Likelihood: <span className={cn(
            "font-bold",
            card.likelihood === "high" ? "text-red-400" : card.likelihood === "medium" ? "text-yellow-400" : "text-green-400"
          )}>{card.likelihood.toUpperCase()}</span>
        </div>
        <span className="text-4xl filter drop-shadow-lg">{card.emojiAfter}</span>
      </div>

    </motion.div>
  )
}
