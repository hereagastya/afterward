"use client"

import { motion } from "framer-motion"
import { TimelineSimulation } from "@/lib/types"

interface ComparisonScreenProps {
  pathA: TimelineSimulation
  pathB: TimelineSimulation
  onContinue: () => void
}

export function ComparisonScreen({ pathA, pathB, onContinue }: ComparisonScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
        Both Futures, Side by Side
      </h2>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full mb-12">
        {/* Path A */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-xl"
        >
          <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
            {pathA.pathTitle}
          </h3>

          <div className="space-y-4">
            {pathA.phases.map((phase, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-3xl">{phase.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-mono text-gray-500">{phase.timeLabel}</p>
                  <p className="text-white font-medium">{phase.title}</p>
                  <p className="text-gray-400 text-sm">{phase.feeling}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Path B */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-xl"
        >
          <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
            {pathB.pathTitle}
          </h3>

          <div className="space-y-4">
            {pathB.phases.map((phase, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-3xl">{phase.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-mono text-gray-500">{phase.timeLabel}</p>
                  <p className="text-white font-medium">{phase.title}</p>
                  <p className="text-gray-400 text-sm">{phase.feeling}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-2xl glass p-6 rounded-xl mb-8"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Key Insights:</h4>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span>Path A peaks at Year 3 but requires struggle at Month 3</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span>Path B feels comfortable now but becomes painful at Year 3</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span>The emotional trajectory differs significantly between paths</span>
          </li>
        </ul>
      </motion.div>

      <button
        onClick={onContinue}
        className="px-8 py-4 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-lg hover:shadow-[0_0_30px_rgba(139,111,212,0.5)] transition-all font-semibold"
      >
        See Your Potential Regrets →
      </button>
    </motion.div>
  )
}
