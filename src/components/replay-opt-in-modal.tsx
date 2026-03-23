"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface ReplayOptInModalProps {
  isOpen: boolean
  onClose: () => void
  decisionId: string
  decision: string
  userChoice: string
}

export function ReplayOptInModal({ 
  isOpen, 
  onClose, 
  decisionId,
  decision,
  userChoice 
}: ReplayOptInModalProps) {
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState(3)
  const [email, setEmail] = useState("")

  const handleEnable = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/enable-replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          decisionId, 
          email,
          checkInMonths: months 
        })
      })

      if (!res.ok) throw new Error("Failed to enable replay")

      const data = await res.json()
      
      alert(`✅ Reminder set! We'll check in on ${new Date(data.scheduledFor).toLocaleDateString()}`)
      onClose()
    } catch (error) {
      console.error(error)
      alert('Failed to set reminder. Please try again.')
    } finally {
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-8 max-w-md w-full border border-purple-500/20"
          >
            <h3 className="text-2xl font-[var(--font-playfair)] text-white mb-4">
              See How Accurate We Were? 🔮
            </h3>
            
            <p className="text-gray-300 mb-6">
              We&apos;ll check in with you in {months} months to see how things actually played out.
            </p>

            {/* Email input */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Your email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Month selector */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Check-in timeline:</label>
              <div className="flex gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                      months === m
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {m} mos
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="btn-mystical flex-1"
              >
                {loading ? 'Setting up...' : 'Yes, remind me'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-700 rounded-xl text-gray-400 hover:border-gray-600 transition-all"
              >
                Skip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
