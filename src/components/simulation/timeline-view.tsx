import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DualPathSimulationData, TimelineSimulation } from "@/lib/types"
import { MomentCard } from "./moment-card"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  simulation: DualPathSimulationData
  onReflect: () => void
}

export function TimelineView({ simulation, onReflect }: TimelineViewProps) {
  const [activePath, setActivePath] = useState<"go" | "stay">("go")

  // For mobile, we toggle. For desktop, we might want side-by-side, but let's stick to a clean toggle view for now for focus, or side-by-side if screen is large.
  // Actually, side-by-side is better for comparison.

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Introduction */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-light text-white mb-4">Your Two Futures</h2>
        <p className="text-gray-400">Witness the trajectory of your choice.</p>
      </motion.div>

      {/* Desktop View: Side-by-Side */}
      <div className="hidden md:grid grid-cols-2 gap-8 relative">
        {/* Divider */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 -translate-x-1/2" />

        <TimelineColumn simulation={simulation.pathA} pathType="go" />
        <TimelineColumn simulation={simulation.pathB} pathType="stay" />
      </div>

      {/* Mobile View: Toggle */}
      <div className="md:hidden">
        <div className="flex bg-white/5 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setActivePath("go")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activePath === "go" ? "bg-emerald-500/20 text-emerald-300" : "text-gray-400 hover:text-white"
            )}
          >
            If You Go
          </button>
          <button 
            onClick={() => setActivePath("stay")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activePath === "stay" ? "bg-indigo-500/20 text-indigo-300" : "text-gray-400 hover:text-white"
            )}
          >
            If You Stay
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            initial={{ opacity: 0, x: activePath === "go" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activePath === "go" ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {activePath === "go" ? (
              <TimelineColumn simulation={simulation.pathA} pathType="go" />
            ) : (
              <TimelineColumn simulation={simulation.pathB} pathType="stay" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={onReflect}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all hover:scale-105 backdrop-blur-md border border-white/10"
        >
          I've seen enough. Show me the regrets.
        </button>
      </div>
    </div>
  )
}

function TimelineColumn({ simulation, pathType }: { simulation: TimelineSimulation, pathType: "go" | "stay" }) {
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center md:text-left p-4 rounded-xl bg-white/5 border border-white/5">
        <h3 className={cn("text-xl font-medium mb-1", pathType === "go" ? "text-emerald-400" : "text-indigo-400")}>
          {simulation.pathTitle}
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider">The Trajectory</p>
      </div>

      <div className="space-y-6 relative">
        {/* Connecting Line (visual only, simplified) */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-white/5 md:left-8 z-0" />
        
        {simulation.phases.map((phase, idx) => (
          <div key={idx} className="relative z-10 pl-2">
            <MomentCard phase={phase} pathType={pathType} index={idx} />
          </div>
        ))}
      </div>
    </div>
  )
}
