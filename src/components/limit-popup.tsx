"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Zap, Crown, Sparkles, Gem, ArrowRight } from "lucide-react"
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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.5, type: "spring", damping: 25 }}
            className="relative w-full max-w-lg rounded-[2.5rem] p-1 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(124, 92, 191, 0.2) 50%, rgba(0, 0, 0, 1) 100%)",
            }}
          >
            {/* Glossy Overlay */}
            <div className="relative bg-[#07070a] rounded-[2.4rem] p-8 md:p-12 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7c5cbf]/10 rounded-full blur-[80px]" />
                
                {/* Close Button */}
                <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors duration-300 z-10"
                >
                <X className="w-6 h-6" />
                </button>

                <div className="relative flex flex-col items-center text-center space-y-8">
                {/* Royal Badge */}
                <motion.div 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                >
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">Deep Dive Simulation</span>
                </motion.div>

                {/* Hero Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-[#D4AF37] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center border border-white/10 shadow-2xl">
                        <Gem className="w-10 h-10 text-[#D4AF37]" />
                        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#D4AF37] animate-pulse" />
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="space-y-4 max-w-sm">
                    <h3 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-white leading-tight italic">
                        The Oracle <span className="text-[#D4AF37]">Awaits.</span>
                    </h3>
                    <p className="text-gray-400 text-base font-light leading-relaxed">
                        Step beyond the threshold. Unlock the full weight of your choices with a singular, high-fidelity deep dive.
                    </p>
                </div>

                {/* Feature List */}
                <div className="grid grid-cols-1 gap-3 w-full max-w-[280px]">
                    {[
                        "Dual-Path Future Visuals",
                        "Emotional Probability Map",
                        "Permanent Record Access"
                    ].map((feature, i) => (
                        <motion.div 
                            key={feature}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="flex items-center gap-3 text-left"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            <span className="text-xs text-gray-300 font-light">{feature}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div className="w-full space-y-6">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Single Access</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-light text-white">$4</span>
                            <span className="text-2xl font-light text-[#D4AF37]">.99</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="group relative w-full py-5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#7c5cbf] via-[#D4AF37] to-[#7c5cbf] bg-[length:200%_auto] animate-gradient group-hover:scale-105 transition-transform duration-500" />
                        
                        <div className="relative flex items-center justify-center gap-3 text-white font-bold tracking-[0.1em] uppercase text-sm">
                            {loading ? (
                                <div className="flex items-center gap-3 font-medium">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Opening Portal...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Unveil My Futures</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>

                    <Link 
                        href="/pricing"
                        className="block text-gray-500 hover:text-[#D4AF37] transition-colors text-[10px] uppercase tracking-[0.3em] font-medium"
                    >
                        View More Details
                    </Link>
                </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
