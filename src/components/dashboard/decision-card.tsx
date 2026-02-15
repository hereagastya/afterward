"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ArrowRight, CheckCircle2, CircleDashed } from "lucide-react"

interface DecisionCardProps {
  id: string
  query: string
  userChoice: string | null
  status: string | null
  createdAt: string
  lastCheckInDate?: string
}

export function DecisionCard({ 
  id, 
  query, 
  userChoice, 
  status, 
  createdAt,
  lastCheckInDate 
}: DecisionCardProps) {
  
  const choiceColors: Record<string, string> = {
    go: "text-[#B794F4]",
    stay: "text-gray-400",
    undecided: "text-amber-500",
    default: "text-gray-500"
  }

  const choiceLabels: Record<string, string> = {
    go: "Going for it",
    stay: "Staying put",
    undecided: "Thinking",
    default: "Undecided"
  }

  const isResolved = status === "resolved" || status === "archived"

  return (
    <Link href={`/dashboard/${id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="h-full p-6 rounded-2xl bg-[#111113] border border-[#2a2a2e] hover:border-[#8B6FD4]/50 hover:shadow-[0_4px_20px_rgba(139,111,212,0.1)] transition-all duration-300 flex flex-col justify-between group"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
              isResolved 
                ? "bg-green-500/10 text-green-500" 
                : "bg-amber-500/10 text-amber-500"
            }`}>
              {status || "Active"}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-medium text-gray-100 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
            {query}
          </h3>

          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              userChoice === 'go' ? 'bg-[#8B6FD4]' :
              userChoice === 'stay' ? 'bg-gray-500' :
              userChoice === 'undecided' ? 'bg-amber-500' : 'bg-gray-700'
            }`} />
            <span className={choiceColors[userChoice || 'default']}>
              {choiceLabels[userChoice || 'default']}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#2a2a2e] flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            {lastCheckInDate ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1.5 text-green-500" />
                Checked in {new Date(lastCheckInDate).toLocaleDateString()}
              </>
            ) : (
              <>
                <CircleDashed className="w-3 h-3 mr-1.5" />
                No check-ins yet
              </>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#B794F4] transition-colors -translate-x-2 group-hover:translate-x-0" />
        </div>
      </motion.div>
    </Link>
  )
}
