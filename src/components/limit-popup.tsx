"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Zap } from "lucide-react"

interface LimitPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function LimitPopup({ isOpen, onClose }: LimitPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl p-8 overflow-hidden"
            style={{
              background: "rgba(20, 20, 25, 0.95)",
              border: "1px solid rgba(124, 92, 191, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(124, 92, 191, 0.1)",
            }}
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8]" />
            <div className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] bg-[#7c5cbf] rounded-full blur-[100px] opacity-20 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[rgba(124,92,191,0.1)] flex items-center justify-center mb-2">
                <Lock className="w-8 h-8 text-[#9d7de8]" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-[var(--font-playfair)] text-white">
                  Decision Limit Reached
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[280px] mx-auto">
                  You have reached your daily limit of 2 decisions.
                </p>
                <div className="pt-2">
                   <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-[var(--font-dm-mono)]">
                    Paid plans coming soon
                   </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,92,191,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Got it</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
