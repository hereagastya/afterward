"use client"

import { motion } from "framer-motion"
import { Tradeoffs } from "@/lib/types"

interface TradeoffAnalysisProps {
  goTradeoffs: Tradeoffs
  stayTradeoffs: Tradeoffs
}

export function TradeoffAnalysis({ goTradeoffs, stayTradeoffs }: TradeoffAnalysisProps) {
  const dimensions = [
    { key: 'money' as const, icon: '💰', label: 'Money' },
    { key: 'stress' as const, icon: '😰', label: 'Stress' },
    { key: 'sleep' as const, icon: '🛌', label: 'Sleep' },
    { key: 'growth' as const, icon: '🚀', label: 'Growth' },
    { key: 'regretRisk' as const, icon: '🎯', label: 'Regret Risk' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 3) return 'text-green-400'
    if (score >= 1) return 'text-green-500'
    if (score >= -1) return 'text-gray-400'
    if (score >= -3) return 'text-orange-400'
    return 'text-red-400'
  }

  const getBarWidth = (score: number) => {
    return `${((score + 5) / 10) * 100}%`
  }

  const getGoBarColor = (score: number) => {
    if (score >= 3) return 'bg-green-500'
    if (score >= 1) return 'bg-green-600'
    if (score >= -1) return 'bg-gray-600'
    if (score >= -3) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStayBarColor = (score: number) => {
    if (score >= 3) return 'bg-blue-500'
    if (score >= 1) return 'bg-blue-600'
    if (score >= -1) return 'bg-gray-600'
    if (score >= -3) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-[var(--font-playfair)] text-white mb-3">
          The Real Tradeoffs
        </h3>
        <p className="text-gray-400">
          What you&apos;re actually trading when you choose
        </p>
      </div>

      <div className="space-y-8">
        {dimensions.map((dim, i) => {
          const goTradeoff = goTradeoffs?.[dim.key] || { score: 0, summary: "No data provided" }
          const stayTradeoff = stayTradeoffs?.[dim.key] || { score: 0, summary: "No data provided" }
          
          const goScore = goTradeoff.score ?? 0
          const stayScore = stayTradeoff.score ?? 0
          const goSummary = goTradeoff.summary || "No data provided"
          const staySummary = stayTradeoff.summary || "No data provided"

          return (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 border border-purple-500/20"
            >
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">{dim.icon}</span>
                <span>{dim.label}</span>
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                {/* IF YOU GO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      If You Go
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(goScore)}`}>
                      {goScore > 0 ? '+' : ''}{goScore}
                    </span>
                  </div>
                  
                  {/* Score bar */}
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: '50%' }}
                      animate={{ width: getBarWidth(goScore) }}
                      transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                      className={`h-full ${getGoBarColor(goScore)}`}
                    />
                  </div>

                  <p className="text-gray-400 text-sm">{goSummary}</p>
                </div>

                {/* IF YOU STAY */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      If You Stay
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(stayScore)}`}>
                      {stayScore > 0 ? '+' : ''}{stayScore}
                    </span>
                  </div>
                  
                  {/* Score bar */}
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: '50%' }}
                      animate={{ width: getBarWidth(stayScore) }}
                      transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                      className={`h-full ${getStayBarColor(stayScore)}`}
                    />
                  </div>

                  <p className="text-gray-400 text-sm">{staySummary}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
        <p className="text-gray-300 text-center italic">
          &ldquo;Less money but you sleep at night&rdquo; vs &ldquo;More money but constant anxiety&rdquo; — this is what you&apos;re actually choosing between.
        </p>
      </div>
    </div>
  )
}
