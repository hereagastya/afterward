"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Clock, CheckCircle2, CircleDashed, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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
  
  const isResolved = status === "resolved" || status === "archived"
  const isGo = userChoice === "go"
  const isStay = userChoice === "stay"
  
  return (
    <Link href={`/dashboard/${id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="h-full relative overflow-hidden rounded-2xl border border-white/5 bg-[#111113] p-6 transition-all duration-300 group-hover:border-[var(--accent-glow)] group-hover:shadow-[0_0_30px_rgba(124,92,191,0.15)] flex flex-col justify-between backdrop-blur-sm"
      >
        {/* Glow Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
             <div className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isResolved ? "bg-green-500" : "bg-amber-500 animate-pulse"
                )} />
                <span className="text-[10px] font-[var(--font-mono)] uppercase tracking-widest text-gray-500">
                  {status || "Active"}
                </span>
             </div>
             
             <span className="text-[10px] font-[var(--font-mono)] text-gray-600">
               {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
             </span>
          </div>

          <h3 className="text-lg md:text-xl font-[var(--font-sans)] text-[var(--text-primary)] leading-relaxed line-clamp-2 group-hover:text-white transition-colors font-medium">
            {query}
          </h3>

          <div className="pt-2">
             <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                isGo ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : 
                isStay ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" :
                "bg-amber-500/10 border-amber-500/20 text-amber-300"
             )}>
                {isGo && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {isStay && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                {!isGo && !isStay && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                
                <span className="font-medium">
                   {isGo ? "Went For It" : isStay ? "Stayed Put" : "Undecided"}
                </span>
             </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center text-xs text-gray-500 font-[var(--font-mono)]">
              {lastCheckInDate ? (
                 <span className="flex items-center gap-1.5 text-green-400/80">
                    <CheckCircle2 className="w-3 h-3" />
                    Last check-in: {new Date(lastCheckInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                 </span>
              ) : (
                 <span className="flex items-center gap-1.5 opacity-60">
                    <HistoryIcon className="w-3 h-3" />
                    No recent updates
                 </span>
              )}
           </div>
           
           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-colors duration-300">
              <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </motion.div>
    </Link>
  )
}

function HistoryIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    )
}
