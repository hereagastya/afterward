"use client"

import { useEffect, useState } from "react"
import { DecisionCard } from "@/components/dashboard/decision-card"
import { Loader2, Plus, Filter, ArrowDownUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface DecisionSummary {
  id: string
  query: string
  userChoice: string | null
  status: string | null
  createdAt: string
  checkIns: { createdAt: string }[]
}

export default function DashboardPage() {
  const [decisions, setDecisions] = useState<DecisionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all")

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await fetch("/api/decisions")
        if (res.ok) {
          const data = await res.json()
          setDecisions(data.decisions)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDecisions()
  }, [])

  const filteredDecisions = decisions.filter(d => {
    if (filter === "all") return true
    if (filter === "active") return !d.status || d.status === "active"
    if (filter === "resolved") return d.status === "resolved" || d.status === "archived"
    return true
  })

  // Simulated Stats (Calculate from real data ideally)
  const totalSimulated = decisions.length
  const activeCount = decisions.filter(d => !d.status || d.status === "active").length

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
             <div className="absolute inset-0 bg-[var(--accent-primary)] blur-3xl opacity-20 animate-pulse" />
             <Loader2 className="w-10 h-10 text-[var(--accent-glow)] animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-[var(--text-muted)] font-[var(--font-mono)] text-xs tracking-[0.2em] animate-pulse">
            RETRIEVING ARCHIVES...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-6 lg:p-12 relative overflow-hidden">
      {/* Ambient BG */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-white">
              Your Decisions
            </h1>
            <div className="flex items-center gap-4 text-sm font-[var(--font-mono)] text-[var(--text-secondary)]">
                <span>{totalSimulated} Simulated</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="text-[var(--accent-glow)]">{activeCount} Active</span>
            </div>
          </div>

          <Link href="/">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Plus className="w-4 h-4" />
              <span>New Simulation</span>
            </button>
          </Link>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-white/5">
            <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm self-start sm:self-auto">
                {(["all", "active", "resolved"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            filter === f 
                            ? "bg-[var(--bg-elevated)] text-white shadow-sm border border-white/10" 
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-[var(--font-mono)] uppercase tracking-wider self-end sm:self-auto">
                <ArrowDownUp className="w-3 h-3" />
                <span>Sorted by Recent</span>
            </div>
        </div>

        {/* List */}
        {filteredDecisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm"
          >
            <div className="w-16 h-16 mx-auto bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Filter className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-[var(--font-playfair)] text-white mb-2">No decisions found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
               {decisions.length === 0 
                  ? "You haven't faced any tough choices yet." 
                  : "No decisions match the selected filter."}
            </p>
            
            {decisions.length === 0 && (
                <Link href="/">
                <span className="text-[var(--accent-glow)] hover:text-white hover:underline underline-offset-4 cursor-pointer transition-colors">
                    Start your first simulation
                </span>
                </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                id={decision.id}
                query={decision.query}
                userChoice={decision.userChoice}
                status={decision.status}
                createdAt={decision.createdAt}
                lastCheckInDate={decision.checkIns[0]?.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
