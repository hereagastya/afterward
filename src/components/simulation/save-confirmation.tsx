"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UserChoice } from "@/lib/types"
import { CheckCircle2, LayoutDashboard, RotateCcw } from "lucide-react"

interface SaveConfirmationProps {
  decision: string
  userChoice: UserChoice
  onStartNew: () => void
  onViewDashboard?: () => void
}

export function SaveConfirmation({ 
  decision, 
  userChoice, 
  onStartNew,
  onViewDashboard 
}: SaveConfirmationProps) {
  const choiceLabels: Record<UserChoice, string> = {
    go: "Going for it",
    stay: "Staying put",
    undecided: "Taking time to think"
  }

  const choiceColors: Record<UserChoice, string> = {
    go: "from-[#8B6FD4] to-[#B794F4]",
    stay: "from-gray-600 to-gray-500",
    undecided: "from-amber-600 to-amber-500"
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-10">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${choiceColors[userChoice]} flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Confirmation Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-light text-white">
          Decision Saved
        </h2>
        <p className="text-gray-400 text-lg">
          Your journey has been recorded.
        </p>
      </motion.div>

      {/* Decision Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#111113] border border-[#2a2a2e] rounded-2xl p-6 space-y-4"
      >
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Decision</p>
          <p className="text-white text-lg line-clamp-2">{decision}</p>
        </div>
        <div className="h-px bg-[#2a2a2e]" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Choice</p>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${choiceColors[userChoice]} text-white`}>
            {choiceLabels[userChoice]}
          </span>
        </div>
      </motion.div>

      {/* Future Check-in Teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 rounded-xl bg-[#8B6FD4]/10 border border-[#8B6FD4]/20"
      >
        <p className="text-[#B794F4] text-sm">
          ✨ We'll check in with you in 2 weeks to see how it's going
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {onViewDashboard && (
          <Button
            onClick={onViewDashboard}
            className="px-8 py-6 text-base font-medium rounded-xl bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white shadow-[0_0_20px_rgba(139,111,212,0.3)] hover:shadow-[0_0_30px_rgba(139,111,212,0.5)] hover:scale-[1.02] transition-all duration-200"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            View Dashboard
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={onStartNew}
          className="px-8 py-6 text-base text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Simulate Another Decision
        </Button>
      </motion.div>
    </div>
  )
}
