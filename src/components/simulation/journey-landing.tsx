"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface JourneyLandingProps {
  onBegin: () => void
}

export function JourneyLanding({ onBegin }: JourneyLandingProps) {
  const [soundPlayed, setSoundPlayed] = useState(false)

  useEffect(() => {
    if (!soundPlayed) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3')
      audio.volume = 0.25
      audio.play().catch(() => {})
      setSoundPlayed(true)
    }
  }, [soundPlayed])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      
      {/* Mystical background animation */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${(i * 2.1) % 100}%`,
              top: `${(i * 2.3) % 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: (i % 8) * 0.4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl font-[var(--font-playfair)] text-white mb-8 leading-tight">
            You&apos;re about to see<br />two futures
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '16rem' }}
            transition={{ delay: 1.5, duration: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="text-xl md:text-2xl text-gray-400 font-light mb-12"
          >
            One if you go.<br />
            One if you stay.<br />
            <span className="text-purple-400 italic">Both are real possibilities.</span>
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            onClick={onBegin}
            className="btn-mystical text-xl px-16 py-5"
          >
            Begin →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
