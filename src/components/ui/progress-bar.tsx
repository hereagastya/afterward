"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100)

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-mono tracking-wider text-xs uppercase">
            {label}
          </span>
          <span className="text-gray-500 font-mono text-xs">
            {current} of {total}
          </span>
        </div>
      )}
      <div className="h-1 w-full bg-[#1a1a1e] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
