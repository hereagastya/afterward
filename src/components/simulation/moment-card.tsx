import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TimelinePhase } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface MomentCardProps {
  phase: TimelinePhase
  pathType: "go" | "stay"
  index: number
}

export function MomentCard({ phase, pathType, index }: MomentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isGo = pathType === "go"
  
  // Custom Oracle Gradients
  const accentGradient = isGo 
    ? "from-emerald-900/40 to-emerald-800/20 border-emerald-500/30" 
    : "from-indigo-900/40 to-indigo-800/20 border-indigo-500/30"
    
  const accentText = isGo ? "text-emerald-300" : "text-indigo-300"
  const glowColor = isGo ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)"

  return (
    <motion.div
      initial={{ opacity: 0, x: isGo ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300",
        "bg-[rgba(15,15,20,0.6)] hover:bg-[rgba(20,20,25,0.7)]",
        isGo ? "hover:border-emerald-500/40" : "hover:border-indigo-500/40",
        accentGradient
      )}
      style={{
        boxShadow: `0 0 0 1px inset rgba(255,255,255,0.05)`
      }}
    >
        {/* Top Accent Bar */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", isGo ? "from-emerald-500 to-teal-400" : "from-indigo-500 to-purple-400")} />

        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <span className="text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{phase.emoji}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 border border-white/10 px-2 py-1 rounded-full bg-black/20">
                    {phase.timeLabel}
                </span>
            </div>

            <h3 className="text-xl md:text-2xl font-[var(--font-playfair)] text-white mb-2 leading-tight">
                {phase.title}
            </h3>
            
            <p className={cn("text-xs font-mono uppercase tracking-wide mb-4", accentText)}>
                {phase.feeling}
            </p>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-[var(--font-sans)]">
                {phase.shortSummary}
            </p>
        </div>

        {/* Expandable Details */}
        <div className="border-t border-white/5 bg-black/20">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
                <span>{isExpanded ? "Hide Details" : "Reveal Nuance"}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2 space-y-3">
                            {phase.details?.map((detail, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-2 border-l-2 border-white/10"
                                >
                                    <span>{detail}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
  )
}
