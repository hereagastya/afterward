"use client"

import { motion } from "framer-motion"

interface EmotionOrbProps {
  emotion: string
  size?: "sm" | "md" | "lg"
}

const emotionStyles: Record<string, { gradient: string; particles: string; shadow: string }> = {
  // Negative emotions
  anxiety: {
    gradient: "bg-gradient-to-br from-red-500 via-orange-500 to-red-600",
    particles: "bg-orange-400",
    shadow: "shadow-[0_0_60px_rgba(239,68,68,0.4)]"
  },
  regret: {
    gradient: "bg-gradient-to-br from-purple-900 via-gray-800 to-black",
    particles: "bg-purple-700",
    shadow: "shadow-[0_0_60px_rgba(88,28,135,0.4)]"
  },
  dread: {
    gradient: "bg-gradient-to-br from-gray-900 via-purple-950 to-black",
    particles: "bg-gray-700",
    shadow: "shadow-[0_0_60px_rgba(17,24,39,0.6)]"
  },
  fear: {
    gradient: "bg-gradient-to-br from-red-700 via-red-900 to-black",
    particles: "bg-red-600",
    shadow: "shadow-[0_0_60px_rgba(153,27,27,0.4)]"
  },
  doubt: {
    gradient: "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900",
    particles: "bg-gray-500",
    shadow: "shadow-[0_0_40px_rgba(75,85,99,0.3)]"
  },
  
  // Positive emotions
  hope: {
    gradient: "bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600",
    particles: "bg-blue-300",
    shadow: "shadow-[0_0_60px_rgba(99,102,241,0.5)]"
  },
  excitement: {
    gradient: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600",
    particles: "bg-yellow-300",
    shadow: "shadow-[0_0_60px_rgba(236,72,153,0.5)]"
  },
  relief: {
    gradient: "bg-gradient-to-br from-green-400 via-teal-500 to-blue-500",
    particles: "bg-green-300",
    shadow: "shadow-[0_0_60px_rgba(52,211,153,0.4)]"
  },
  confidence: {
    gradient: "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600",
    particles: "bg-purple-400",
    shadow: "shadow-[0_0_60px_rgba(124,58,237,0.5)]"
  },
  determination: {
    gradient: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
    particles: "bg-orange-400",
    shadow: "shadow-[0_0_60px_rgba(249,115,22,0.4)]"
  },
  
  // Neutral/mixed
  uncertainty: {
    gradient: "bg-gradient-to-br from-gray-500 via-purple-600 to-blue-700",
    particles: "bg-gray-400",
    shadow: "shadow-[0_0_50px_rgba(107,114,128,0.3)]"
  },
  acceptance: {
    gradient: "bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600",
    particles: "bg-teal-400",
    shadow: "shadow-[0_0_50px_rgba(20,184,166,0.4)]"
  }
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32"
}

export function EmotionOrb({ emotion, size = "md" }: EmotionOrbProps) {
  // Normalize emotion string (lowercase, handle variations)
  const normalizedEmotion = emotion.toLowerCase().trim()
  
  // Find matching style or default to uncertainty
  const style = Object.keys(emotionStyles).find(key => 
    normalizedEmotion.includes(key)
  ) || "uncertainty"
  
  const { gradient, particles, shadow } = emotionStyles[style]

  return (
    <div className="relative flex items-center justify-center">
      {/* Main orb */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size]} ${gradient} ${shadow} rounded-full relative overflow-hidden`}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full" />
        
        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            x: [0, (i - 1) * 15, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
          className={`absolute w-2 h-2 ${particles} rounded-full blur-sm`}
          style={{
            top: '50%',
            left: '50%'
          }}
        />
      ))}
    </div>
  )
}
