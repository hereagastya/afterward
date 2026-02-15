"use client"

import { Button } from "@/components/ui/button"
import { SimulationResponse } from "@/lib/types"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCcw } from "lucide-react"

interface SimulationOutputProps {
  data: SimulationResponse
  onReset: () => void
}

export function SimulationOutput({ data, onReset }: SimulationOutputProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-widest text-gray-400">
          Core Feeling
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white">{data.coreFeeling}</h2>
        <p className="italic text-gray-500 max-w-xl mx-auto">"{data.innerDialogue}"</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Short Term */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-white/5 p-8 rounded-xl space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-light text-gray-300 uppercase tracking-widest">{data.shortTerm.title}</h3>
            <p className="text-sm text-gray-500">{data.shortTerm.emotionalToll}</p>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-gray-300 leading-relaxed font-serif text-lg">
            {data.shortTerm.description}
          </p>
          <ul className="space-y-3">
            {data.shortTerm.consequences.map((c, i) => (
              <li key={i} className="flex items-start text-sm text-gray-400">
                <span className="mr-3 text-red-500/50">●</span>
                {c}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Long Term */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-white/10 p-8 rounded-xl space-y-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 blur-3xl rounded-full pointer-events-none" />
          <div className="space-y-2">
            <h3 className="text-xl font-light text-white uppercase tracking-widest">{data.longTerm.title}</h3>
            <p className="text-sm text-gray-500">{data.longTerm.emotionalToll}</p>
          </div>
          <div className="h-px bg-white/10" />
          <p className="text-gray-300 leading-relaxed font-serif text-lg">
            {data.longTerm.description}
          </p>
          <ul className="space-y-3">
            {data.longTerm.consequences.map((c, i) => (
              <li key={i} className="flex items-start text-sm text-gray-400">
                <span className="mr-3 text-red-500">●</span>
                {c}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <Button variant="ghost" className="text-gray-500 hover:text-white hover:bg-white/5" onClick={onReset}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Simulate Another Regret
        </Button>
      </motion.div>
    </div>
  )
}
