"use client"

import { motion } from "framer-motion"

interface CheckIn {
  id: string
  response: string
  createdAt: string
}

interface CheckInTimelineProps {
  checkIns: CheckIn[]
}

export function CheckInTimeline({ checkIns }: CheckInTimelineProps) {
  if (checkIns.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 text-sm italic">
        No check-ins yet. Start your journey today.
      </div>
    )
  }

  return (
    <div className="relative pl-4 border-l border-gray-800 space-y-8 ml-2">
      {checkIns.map((checkIn, index) => (
        <motion.div
          key={checkIn.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Dot */}
          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1a1a1e] border-2 border-[#8B6FD4]" />
          
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-mono">
              {new Date(checkIn.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <div className="bg-[#1a1a1e] border border-[#2a2a2e] p-4 rounded-xl rounded-tl-sm text-gray-300 text-sm leading-relaxed">
              "{checkIn.response}"
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
