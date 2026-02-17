import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DualPathSimulationData, TimelineSimulation } from "@/lib/types"
import { MomentCard } from "./moment-card"
import { cn } from "@/lib/utils"
import { ArrowLeftRight, Clock, MapPin } from "lucide-react"

interface TimelineViewProps {
  simulation: DualPathSimulationData
  onReflect: () => void
}

export function TimelineView({ simulation, onReflect }: TimelineViewProps) {
  const [activeTab, setActiveTab] = useState<"go" | "stay">("go")

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
      
      {/* Cinematic Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <span className="text-xs font-[var(--font-mono)] text-[var(--accent-glow)] tracking-[0.3em] uppercase">
            Temporal Simulation Complete
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-playfair)] text-white">
          Two Futures Diverge
        </h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg pt-2 leading-relaxed">
          Witness the trajectory of your potential timelines. Where does each path lead?
        </p>
      </motion.div>

      {/* Mobile Toggle (Visible < 1024px) */}
      <div className="lg:hidden sticky top-20 z-30 mb-8 backdrop-blur-xl bg-black/40 p-2 rounded-2xl border border-white/10 shadow-xl max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 relative">
           {/* Slider Background */}
           <motion.div 
             className={cn("absolute inset-y-0 w-1/2 bg-white/10 rounded-xl border border-white/10 shadow-lg")}
             animate={{ x: activeTab === "go" ? "0%" : "100%" }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
           />
           
          <button 
            onClick={() => setActiveTab("go")}
            className={cn(
              "relative z-10 py-3 text-sm font-medium rounded-xl transition-colors duration-300 flex items-center justify-center gap-2",
              activeTab === "go" ? "text-emerald-300" : "text-gray-400"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
            If You Go
          </button>
          <button 
            onClick={() => setActiveTab("stay")}
            className={cn(
              "relative z-10 py-3 text-sm font-medium rounded-xl transition-colors duration-300 flex items-center justify-center gap-2",
              activeTab === "stay" ? "text-indigo-300" : "text-gray-400"
            )}
          >
             <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></span>
            If You Stay
          </button>
        </div>
      </div>

      {/* Desktop Layout (Side by Side) */}
      <div className="hidden lg:grid grid-cols-2 gap-12 relative items-start">
         {/* Central Divider */}
         <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />
         
         {/* Floating Label Logic could go here, but stick to columns */}
         <TimelineColumn simulation={simulation.pathA} pathType="go" />
         <TimelineColumn simulation={simulation.pathB} pathType="stay" />
      </div>

      {/* Mobile Layout (Tabbed) */}
      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          {activeTab === "go" ? (
            <motion.div
              key="go"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TimelineColumn simulation={simulation.pathA} pathType="go" />
            </motion.div>
          ) : (
            <motion.div
              key="stay"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TimelineColumn simulation={simulation.pathB} pathType="stay" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 text-center">
        <button
          onClick={onReflect}
          className="group relative inline-flex items-center justify-center px-10 py-5 bg-[var(--bg-elevated)] border border-[var(--border-glow)] text-white rounded-full font-[var(--font-mono)] uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:bg-[var(--accent-primary)] hover:border-transparent hover:shadow-[0_0_40px_rgba(124,92,191,0.4)]"
        >
          <span className="mr-3">I have seen enough</span>
          <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
        <p className="mt-4 text-xs text-gray-500 font-mono">
            Proceed to the regret analysis
        </p>
      </div>
    </div>
  )
}

function TimelineColumn({ simulation, pathType }: { simulation: TimelineSimulation, pathType: "go" | "stay" }) {
    const isGo = pathType === "go"
    const colorClass = isGo ? "text-emerald-400" : "text-indigo-400"
    const bgClass = isGo ? "bg-emerald-500/10 border-emerald-500/20" : "bg-indigo-500/10 border-indigo-500/20"

  return (
    <div className="space-y-8">
      {/* Column Header */}
      <div className={cn("text-center p-6 rounded-2xl border backdrop-blur-sm sticky top-24 z-20 lg:static lg:bg-transparent lg:border-none lg:backdrop-filter-none lg:p-0 mb-12", bgClass)}>
        <h3 className={cn("text-3xl font-[var(--font-playfair)] mb-2", colorClass)}>
          {simulation.pathTitle}
        </h3>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-[var(--font-mono)]">The Trajectory</p>
      </div>

      <div className="space-y-4 relative pl-4 lg:pl-0">
        {/* Connecting Line */}
        <div className={cn("absolute left-[2.25rem] lg:left-8 top-8 bottom-8 w-px", isGo ? "bg-gradient-to-b from-emerald-500/20 via-emerald-500/50 to-transparent" : "bg-gradient-to-b from-indigo-500/20 via-indigo-500/50 to-transparent")} />
        
        {simulation.phases.map((phase, idx) => (
          <div key={idx} className="relative z-10 pl-6 lg:pl-8">
             {/* Timeline Dot */}
             <div className={cn("absolute left-0 top-8 w-4 h-4 rounded-full border-2 bg-[#0a0a0c]", isGo ? "border-emerald-500" : "border-indigo-500")} />
             
            <MomentCard phase={phase} pathType={pathType} index={idx} />
          </div>
        ))}
      </div>
    </div>
  )
}
