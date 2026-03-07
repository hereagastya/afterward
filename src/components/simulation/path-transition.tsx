"use client"

import { motion } from "framer-motion"

interface PathTransitionProps {
  onContinue: () => void
}

export function PathTransition({ onContinue }: PathTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-light text-white mb-12">
          Now, if you <span className="italic font-serif">STAYED</span>.
        </h2>

        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-lg hover:shadow-[0_0_30px_rgba(139,111,212,0.5)] transition-all font-semibold"
        >
          Continue →
        </button>
      </motion.div>
    </motion.div>
  )
}
