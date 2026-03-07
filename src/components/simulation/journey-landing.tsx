"use client"

import { motion } from "framer-motion"

interface JourneyLandingProps {
  onBegin: () => void
}

export function JourneyLanding({ onBegin }: JourneyLandingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      {/* Glowing orb background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
          You're about to see two futures.
        </h1>
        
        <p className="text-xl text-gray-400 mb-4">
          First, if you <span className="text-purple-400 font-semibold">GO</span>.
        </p>
        <p className="text-xl text-gray-400 mb-12">
          Then, if you <span className="text-purple-400 font-semibold">STAY</span>.
        </p>

        <button
          onClick={onBegin}
          className="px-8 py-4 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-lg hover:shadow-[0_0_30px_rgba(139,111,212,0.5)] transition-all font-semibold text-lg"
        >
          Begin Journey →
        </button>
      </motion.div>
    </motion.div>
  )
}
