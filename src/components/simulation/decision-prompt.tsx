"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UserChoice } from "@/lib/types"
import { Rocket, Anchor, Clock } from "lucide-react"

interface DecisionPromptProps {
  onDecide: (choice: UserChoice) => void
  isAuthenticated: boolean
  onSignIn?: () => void
}

export function DecisionPrompt({ onDecide, isAuthenticated, onSignIn }: DecisionPromptProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
          So...{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6FD4] to-[#B794F4]">
            what are you going to do?
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          There's no wrong answer. This is just a moment of clarity.
        </p>
      </motion.div>

      {/* Decision Options */}
      <div className="space-y-4">
        {/* Go For It */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onDecide("go")}
          className="w-full p-6 md:p-8 rounded-2xl border-2 border-[#8B6FD4]/50 bg-gradient-to-r from-[#8B6FD4]/10 to-[#B794F4]/10 hover:from-[#8B6FD4]/20 hover:to-[#B794F4]/20 hover:border-[#8B6FD4] transition-all duration-300 group text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-[#B794F4] transition-colors">
                I'm going for it
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Time to take the leap
              </p>
            </div>
          </div>
        </motion.button>

        {/* Stay Put */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => onDecide("stay")}
          className="w-full p-6 md:p-8 rounded-2xl border-2 border-gray-600/50 bg-[#111113] hover:bg-[#161618] hover:border-gray-500 transition-all duration-300 group text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-gray-300 transition-colors">
                I'm staying put
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Stability is the choice
              </p>
            </div>
          </div>
        </motion.button>

        {/* Need More Time */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => onDecide("undecided")}
          className="w-full p-5 md:p-6 rounded-xl border border-[#2a2a2e] bg-transparent hover:bg-[#111113] hover:border-[#3a3a3e] transition-all duration-300 group text-center"
        >
          <div className="flex items-center justify-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />
            <span className="text-gray-500 group-hover:text-gray-400 font-medium">
              I need more time to think
            </span>
          </div>
        </motion.button>
      </div>

      {/* Auth Notice */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center p-4 rounded-xl bg-[#111113] border border-[#2a2a2e]"
        >
          <p className="text-gray-400 text-sm mb-3">
            Sign in to save your decision and track your journey
          </p>
          {onSignIn && (
            <button
              onClick={onSignIn}
              className="text-[#B794F4] hover:text-[#8B6FD4] font-medium text-sm underline underline-offset-4"
            >
              Sign in now
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
