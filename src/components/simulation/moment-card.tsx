import { motion } from "framer-motion"
import { TimelinePhase } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MomentCardProps {
  phase: TimelinePhase
  pathType: "go" | "stay"
  index: number
}

export function MomentCard({ phase, pathType, index }: MomentCardProps) {
  const isGo = pathType === "go"
  const accentColor = isGo ? "bg-emerald-500" : "bg-indigo-500"
  const borderColor = isGo ? "border-emerald-500/20" : "border-indigo-500/20"
  const hoverBorderColor = isGo ? "group-hover:border-emerald-500/40" : "group-hover:border-indigo-500/40"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-black/40 p-6 backdrop-blur-sm transition-colors",
        borderColor,
        hoverBorderColor
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 text-xs font-mono uppercase tracking-wider text-gray-400">
        {phase.timeLabel}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{phase.emoji}</div>
        <div>
          <h3 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors">
            {phase.title}
          </h3>
          <p className={cn("text-xs font-medium uppercase tracking-wide opacity-80", isGo ? "text-emerald-400" : "text-indigo-400")}>
            {phase.feeling}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        {phase.shortSummary}
      </p>

      <ul className="space-y-2">
        {phase.details?.map((detail, idx) => (
          <li key={idx} className="flex items-start text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            <span className={cn("mr-2 mt-1 h-1 w-1 rounded-full shrink-0", accentColor)} />
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
