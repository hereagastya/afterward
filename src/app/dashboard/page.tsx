"use client"

import { useEffect, useState } from "react"
import { DecisionCard } from "@/components/dashboard/decision-card"
import { Loader2, Plus } from "lucide-react"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B6FD4] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Your Decisions</h1>
            <p className="text-gray-400">Track the paths you chose.</p>
          </div>
          <Link href="/">
            <button className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Simulation
            </button>
          </Link>
        </div>

        {/* List */}
        {decisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl"
          >
            <p className="text-gray-500 mb-4">You haven't saved any decisions yet.</p>
            <Link href="/">
              <span className="text-[#B794F4] hover:text-[#8B6FD4] hover:underline cursor-pointer">
                Start your first simulation
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decisions.map((decision) => (
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
