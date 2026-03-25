"use client"

import { motion } from "framer-motion"
import { PathSimulation } from "@/lib/types"
import { useState } from "react"

interface ScenarioViewerProps {
  path: PathSimulation
  pathColor: "green" | "blue"
}

export function ScenarioViewer({ path, pathColor }: ScenarioViewerProps) {
  const [activeScenario, setActiveScenario] = useState<'base' | 'upside' | 'downside'>('base')

  const scenarios = {
    base: path.baseCase,
    upside: path.upside,
    downside: path.downside
  }

  const currentScenario = scenarios[activeScenario]

  const colors = {
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      text: "text-green-400",
      hover: "hover:border-green-500/60"
    },
    blue: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      hover: "hover:border-blue-500/60"
    }
  }

  const color = colors[pathColor]

  return (
    <div className="oracle-card rounded-2xl p-6 md:p-8 bg-[rgba(15,15,20,0.8)] backdrop-blur-sm border border-gray-800">
      {/* Path Label */}
      <div className="text-center mb-6">
        <span className={`inline-block px-4 py-2 ${color.bg} border ${color.border} rounded-full ${color.text} text-xs font-mono uppercase tracking-wider`}>
          {path.label}
        </span>
      </div>

      {/* Scenario Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveScenario('downside')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeScenario === 'downside'
              ? 'bg-red-500/20 border border-red-500/50 text-red-400'
              : 'bg-gray-900 border border-gray-800 text-gray-500 hover:border-gray-700'
          }`}
        >
          💀 Worst
          <div className="text-[10px] opacity-60">{path.downside.probability}</div>
        </button>

        <button
          onClick={() => setActiveScenario('base')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeScenario === 'base'
              ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
              : 'bg-gray-900 border border-gray-800 text-gray-500 hover:border-gray-700'
          }`}
        >
          📊 Likely
          <div className="text-[10px] opacity-60">{path.baseCase.probability}</div>
        </button>

        <button
          onClick={() => setActiveScenario('upside')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeScenario === 'upside'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-gray-900 border border-gray-800 text-gray-500 hover:border-gray-700'
          }`}
        >
          ✨ Best
          <div className="text-[10px] opacity-60">{path.upside.probability}</div>
        </button>
      </div>

      {/* Timeline */}
      <motion.div
        key={activeScenario}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {currentScenario.moments.map((moment, i) => (
          <div
            key={i}
            className={`border-l-2 ${color.border} pl-4 ${color.hover} transition-all`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                {moment.timeLabel}
              </span>
              <div className={`h-px flex-1 bg-gradient-to-r ${color.border} to-transparent`} />
            </div>
            <h4 className="text-white font-semibold text-base mb-1">
              {moment.title}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {moment.description}
            </p>
            <p className={`text-xs ${color.text} mt-1 italic`}>
              Feeling: {moment.feeling}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
