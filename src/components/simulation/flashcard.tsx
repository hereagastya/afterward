import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion"
import { FlashcardData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowRight, AlertTriangle } from "lucide-react"

interface FlashcardProps {
  card: FlashcardData
  onSwipe: (direction: "left" | "right") => void
  index: number
}

export function Flashcard({ card, onSwipe, index }: FlashcardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9])
  const controls = useAnimation()
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x < -threshold) {
      setDirection("left")
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe("left"))
    } else if (info.offset.x > threshold) {
      setDirection("right")
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe("right"))
    } else {
      controls.start({ x: 0, opacity: 1, scale: 1 })
      setDirection(null)
    }
  }

  const isGo = card.pathType === "go"
  // Darker, more dramatic card base
  const borderHighlight = isGo ? "group-hover:border-emerald-500/30" : "group-hover:border-indigo-500/30"
  
  // Stacking effect
  const initialScale = 1 - index * 0.05
  const initialY = index * 15
  const initialZ = 100 - index

  return (
    <motion.div
      style={{ 
        x, 
        rotate, 
        opacity,
        scale,
        zIndex: initialZ,
        y: initialY
      }}
      drag={index === 0 ? "x" : false} // Only top card is draggable
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: initialScale, y: initialY }}
      className={cn(
        "absolute w-full max-w-[90vw] md:max-w-md h-[450px] md:h-[500px] rounded-3xl p-8 cursor-grab active:cursor-grabbing flex flex-col justify-between origin-bottom transition-shadow duration-300",
        "bg-[#16161E] border border-white/10 backdrop-blur-2xl",
        "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]",
        index === 0 ? "shadow-[0_20px_60px_rgba(124,92,191,0.15)]" : "shadow-xl brightness-50"
      )}
    >
        {/* Card Noise Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-3xl pointer-events-none" />
        
        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start">
            <div className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border flex items-center gap-2",
                "bg-white/5 border-white/10 text-gray-400"
            )}>
                <span>{card.category}</span>
            </div>

            <div className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border flex items-center gap-1",
                card.likelihood === "high" ? "border-red-500/30 text-red-400 bg-red-900/10 shadow-[0_0_10px_rgba(248,113,113,0.2)]" : 
                card.likelihood === "medium" ? "border-yellow-500/30 text-yellow-400 bg-yellow-900/10" : 
                "border-green-500/30 text-green-400 bg-green-900/10"
            )}>
                {card.likelihood === "high" && <AlertTriangle className="w-3 h-3" />}
                <span>{card.likelihood} Likelihood</span>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center my-4 space-y-6">
             <div className="flex items-center gap-4 text-4xl mb-4">
                 <span className="filter drop-shadow-md grayscale hover:grayscale-0 transition-all duration-500">{card.emojiBefore}</span>
                 <ArrowRight className="w-6 h-6 text-gray-600" />
                 <span className="filter drop-shadow-md grayscale hover:grayscale-0 transition-all duration-500">{card.emojiAfter}</span>
             </div>

             <h3 className="text-2xl md:text-3xl font-[var(--font-playfair)] text-white italic leading-relaxed">
                "{card.content}"
             </h3>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/5 pt-6 flex justify-between items-end">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider mb-1">Timeline Path</span>
                <span className={cn(
                    "text-xs font-medium tracking-wide",
                    isGo ? "text-emerald-400" : "text-indigo-400"
                )}>
                    {isGo ? "If You Go" : "If You Stay"}
                </span>
            </div>
            
            <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                {index === 0 ? "Swipe to dismiss" : "Next Regret"}
            </div>
        </div>
        
        {/* Glow effect based on likelihood */}
        <div className={cn(
            "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none",
            index === 0 && "opacity-20",
            card.likelihood === "high" ? "bg-red-500/10" : "bg-transparent"
        )} />
    </motion.div>
  )
}
