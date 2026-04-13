"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Zap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface LimitPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function LimitPopup({ isOpen, onClose }: LimitPopupProps) {
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong')
      setLoading(false)
    }
  }

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
                  Simulation Locked
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[280px] mx-auto">
                  You've used your free simulation. Get one more full deep-dive dual-path simulation for $4.99.
                </p>
                <div className="pt-2">
                    <Link 
                      href="/pricing"
                      className="text-[var(--text-muted)] hover:text-[#9d7de8] transition-colors text-xs uppercase tracking-widest font-[var(--font-dm-mono)] underline underline-offset-4"
                    >
                      Pricing details
                    </Link>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,92,191,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Pay $4.99</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
