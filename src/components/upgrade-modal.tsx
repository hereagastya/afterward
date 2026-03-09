"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (tier: 'pro' | 'premium') => {
    setLoading(tier)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
        setLoading(null)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong')
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-4xl w-full glass rounded-2xl p-8 md:p-12 border border-purple-500/20">
              {/* Glowing orb background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="relative z-10 text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-white mb-4">
                    You've reached your <span className="gradient-text-oracle">limit</span>
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Upgrade to continue exploring your futures
                  </p>
                </motion.div>
              </div>

              {/* Pricing cards */}
              <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Pro */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-xl border-2 border-purple-500/30 relative hover:border-purple-500/50 transition-all"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-light text-white">$9.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>50 decisions per month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>All features unlocked</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade('pro')}
                    disabled={loading === 'pro'}
                    className="btn-mystical w-full"
                  >
                    {loading === 'pro' ? 'Loading...' : 'Upgrade to Pro'}
                  </button>
                </motion.div>

                {/* Premium */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <h3 className="text-2xl font-semibold text-white mb-2">Premium</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-light text-white">$29.99</span>
                    <span className="text-gray-400">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Unlimited decisions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Early access to new features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>VIP priority support</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade('premium')}
                    disabled={loading === 'premium'}
                    className="btn-glass w-full"
                  >
                    {loading === 'premium' ? 'Loading...' : 'Upgrade to Premium'}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
