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
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative overflow-hidden"
    >
      {/* Animated portal background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[800px] h-[800px] rounded-full border-2 border-purple-500/20"
        />
        
        {/* Middle ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute w-[600px] h-[600px] rounded-full border-2 border-purple-500/30"
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute w-[400px] h-[400px] rounded-full border-2 border-purple-500/40 bg-purple-500/5"
        />

        {/* Center glow */}
        <div className="absolute w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-purple-400 font-[var(--font-dm-mono)] text-xs tracking-[0.3em] uppercase mb-6"
        >
          TEMPORAL SIMULATION INITIALIZING
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-[var(--font-playfair)] font-light text-white mb-6 leading-tight">
          You're about to witness
          <br />
          <span className="gradient-text-oracle italic">two futures</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-4">
          First, if you <span className="text-purple-400 font-semibold">GO</span>.
        </p>
        <p className="text-xl text-gray-400 mb-12">
          Then, if you <span className="text-purple-400 font-semibold">STAY</span>.
        </p>

        <motion.button
          onClick={onBegin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg overflow-hidden"
        >
          {/* Button shimmer */}
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          
          <span className="relative z-10">Enter the Timeline →</span>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-all duration-300 rounded-xl" />
        </motion.button>
      </motion.div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </motion.div>
  )
}
