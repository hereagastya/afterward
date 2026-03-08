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
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative overflow-hidden"
    >
      {/* Portal rift effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Vertical split */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"
        />
        
        {/* Expanding glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
          className="text-purple-400 font-[var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-8"
        >
          SHIFTING TIMELINE
        </motion.div>

        <h2 className="text-5xl md:text-6xl font-[var(--font-playfair)] font-light text-white mb-12">
          Now, if you <span className="italic gradient-text-oracle">STAYED</span>.
        </h2>

        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all"
        >
          Continue →
        </motion.button>
      </motion.div>

      {/* Energy particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: i % 2 === 0 ? '-100%' : '100%',
            y: `${Math.random() * 100}%`
          }}
          animate={{
            x: i % 2 === 0 ? '100%' : '-100%',
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
        />
      ))}
    </motion.div>
  )
}
