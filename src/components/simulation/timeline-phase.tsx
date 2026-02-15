"use client"

import { motion } from "framer-motion"
import { TimelinePhase } from "@/lib/types"

interface TimelinePhaseCardProps {
  phase: TimelinePhase
  index: number
  pathType: "go" | "stay"
}

export function TimelinePhaseCard({ phase, index, pathType }: TimelinePhaseCardProps) {
  const isGo = pathType === "go"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="space-y-4"
    >
      {/* Phase Header */}
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          isGo 
            ? "bg-gradient-to-r from-[#8B6FD4] to-[#B794F4]" 
            : "bg-gradient-to-r from-gray-500 to-gray-400"
        }`} />
        <h4 className="text-lg font-medium text-white">{phase.title}</h4>
      </div>

      {/* Feeling Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        isGo
          ? "bg-[#8B6FD4]/20 text-[#B794F4] border border-[#8B6FD4]/30"
          : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
      }`}>
        {phase.feeling}
      </div>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed text-base">
        {phase.shortSummary}
      </p>

      {/* Practical Changes */}
      <ul className="space-y-2 pl-1">
        {phase.details.map((change, i) => (
          <li key={i} className="flex items-start text-sm text-gray-400">
            <span className={`mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              isGo ? "bg-[#8B6FD4]" : "bg-gray-500"
            }`} />
            {change}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
