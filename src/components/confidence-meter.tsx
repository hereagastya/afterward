"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnalysisResult } from "@/lib/types"
import { Lock, Sparkles, Eye, TrendingUp, AlertTriangle, GitBranch, Loader2 } from "lucide-react"

interface ConfidenceMeterProps {
  analysis: AnalysisResult & { isLocked?: boolean }
  onContinue: () => void
  decision?: string
  answers?: { question: string; answer: string }[]
}

export function ConfidenceMeter({ analysis, onContinue, decision, answers }: ConfidenceMeterProps) {
  const {
    clarityScore,
    fearLevel,
    logicLevel,
    gutLevel,
    redFlags,
    prediction,
    predictionConfidence,
    reasoning,
    emotionalState
  } = analysis

  const [loading, setLoading] = useState(false)

  // Derive paywall state from API response
  const isLocked = analysis.isLocked === true

  const handlePay = async () => {
    setLoading(true)

    // Save pending simulation to localStorage so we can resume after payment
    if (decision) {
      localStorage.setItem("afterward_pending_simulation", JSON.stringify({
        decision,
        answers: answers || [],
        analysis
      }))
    }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 border border-purple-500/20"
        >
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* FREE SECTION — Always visible                                  */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-[var(--font-playfair)] text-white mb-3">
                Your Decision DNA 🧬
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-purple-300 text-sm italic"
              >
                {emotionalState}
              </motion.p>
            </motion.div>
          </div>

          {/* Clarity Score - Hero Element */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="text-center mb-10"
          >
            <div className="relative inline-block">
              {/* Circular progress */}
              <svg className="transform -rotate-90 w-40 h-40 md:w-48 md:h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="rgba(124, 92, 191, 0.1)"
                  strokeWidth="14"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="url(#clarityGradient)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 528" }}
                  animate={{ strokeDasharray: `${clarityScore * 5.28} 528` }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="clarityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c5cbf" />
                    <stop offset="100%" stopColor="#9d7de8" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-white"
                >
                  {clarityScore}%
                </motion.span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Clarity</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-gray-400 mt-4 text-lg"
            >
              {clarityScore > 70 ? "You're pretty clear on this" :
               clarityScore > 40 ? "You're still figuring it out" :
               "You're very confused"}
            </motion.p>
          </motion.div>

          {/* Emotion Breakdown — Three distinct forces */}
          <div className="space-y-5 mb-8">
            
            {/* Fear */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span className="text-red-400">Fear</span>
                </span>
                <span className="text-red-400 font-bold text-xl tabular-nums">{fearLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-red-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fearLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-orange-500 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Logic */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <span className="text-cyan-400">Logic</span>
                </span>
                <span className="text-cyan-400 font-bold text-xl tabular-nums">{logicLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-cyan-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${logicLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-400 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Gut Feeling */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">💫</span>
                  <span className="text-amber-400">Gut Feeling</span>
                </span>
                <span className="text-amber-400 font-bold text-xl tabular-nums">{gutLevel}%</span>
              </div>
              <div className="h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-amber-500/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gutLevel}%` }}
                  transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 relative rounded-full"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Sum indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-right"
            >
              <span className="text-gray-600 text-xs font-mono">
                = {fearLevel + logicLevel + gutLevel}%
              </span>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LOCKED SECTION — Behind paywall                                */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          {!isLocked ? (
            <>
              {/* Red Flags — Urgent, specific, personal */}
              {redFlags.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.9 }}
                  className="mb-8"
                >
                  <div className="space-y-3">
                    {redFlags.map((flag: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 2.0 + (i * 0.15) }}
                        className="bg-red-500/8 border-l-4 border-red-500 rounded-r-lg p-4 relative overflow-hidden"
                      >
                        <motion.div
                          animate={{ opacity: [0, 0.08, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          className="absolute inset-0 bg-red-500"
                        />
                        <p className="text-gray-200 text-sm leading-relaxed relative z-10">
                          {flag}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Prediction Box */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.3 }}
                className="relative mb-6 overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black rounded-xl" />
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(0deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                      'linear-gradient(180deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                      'linear-gradient(360deg, rgba(124,58,237,0.3) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl"
                />
                
                <div className="relative z-10 p-8 text-center border border-purple-500/30 rounded-xl">
                  <p className="text-gray-500 text-xs mb-4 uppercase tracking-[0.3em]">
                    Our Prediction
                  </p>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5, type: "spring" }}
                  >
                    <p className="text-4xl md:text-5xl font-bold text-white mb-1 font-[var(--font-playfair)]">
                      You&apos;ll {prediction === 'go' ? 'GO' : 'STAY'}
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-1 w-12 bg-purple-500/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${predictionConfidence}%` }}
                          transition={{ delay: 2.7, duration: 0.8 }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                      <span className="text-purple-400 text-sm font-mono">{predictionConfidence}%</span>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    className="text-gray-300 text-base italic leading-relaxed max-w-lg mx-auto"
                  >
                    &ldquo;{reasoning}&rdquo;
                  </motion.p>
                </div>
              </motion.div>

              {/* Continue Button — Only for paid users */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3 }}
                className="text-center"
              >
                <button
                  onClick={onContinue}
                  className="btn-mystical w-full text-lg py-4"
                >
                  Let&apos;s see if we&apos;re right →
                </button>
                <p className="text-gray-500 text-xs mt-3">
                  Generating your timelines...
                </p>
              </motion.div>
            </>
          ) : (
            /* ── PAYWALL: Blurred preview + overlay card ─────────────── */
            <div className="relative mt-2">
              
              {/* Blurred "preview" of what's behind the wall */}
              <div className="blur-[6px] select-none pointer-events-none opacity-40" aria-hidden="true">
                {/* Fake red flags */}
                <div className="space-y-3 mb-6">
                  <div className="bg-red-500/8 border-l-4 border-red-500 rounded-r-lg p-4">
                    <p className="text-gray-200 text-sm">You mentioned uncertainty three times but never once said what you actually want. That pattern says more than your words do.</p>
                  </div>
                  <div className="bg-red-500/8 border-l-4 border-red-500 rounded-r-lg p-4">
                    <p className="text-gray-200 text-sm">The way you framed this decision reveals you already know the answer — you're just looking for permission to act on it.</p>
                  </div>
                </div>

                {/* Fake prediction box */}
                <div className="bg-gradient-to-br from-purple-900/40 to-black rounded-xl p-8 text-center border border-purple-500/30 mb-4">
                  <p className="text-gray-500 text-xs mb-3 uppercase tracking-[0.3em]">Our Prediction</p>
                  <p className="text-4xl font-bold text-white mb-1">You&apos;ll GO</p>
                  <p className="text-gray-300 text-sm italic">&ldquo;Your gut already decided. Your brain is just catching up.&rdquo;</p>
                </div>

                {/* Fake timeline preview */}
                <div className="space-y-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">3 Months — If You Go</p>
                    <p className="text-sm text-gray-300">The initial excitement fades into a quiet rhythm of uncertainty...</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">1 Year — If You Stay</p>
                    <p className="text-sm text-gray-300">The comfort you clung to starts feeling more like a cage than a home...</p>
                  </div>
                </div>
              </div>

              {/* Fade gradient at top of blur */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[rgba(15,10,25,0.95)] to-transparent z-10 pointer-events-none" />

              {/* ── Premium paywall card ─────────────────────────────── */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <div className="w-full max-w-md mx-4">
                  <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 shadow-[0_0_80px_rgba(124,58,237,0.15)]">
                    {/* Animated gradient border glow */}
                    <motion.div
                      animate={{
                        background: [
                          'linear-gradient(0deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
                          'linear-gradient(120deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
                          'linear-gradient(240deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
                          'linear-gradient(360deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
                        ]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    />

                    <div className="relative bg-[rgba(12,8,20,0.92)] backdrop-blur-xl p-8 md:p-10">
                      {/* Lock icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.2, type: "spring" }}
                        className="flex justify-center mb-5"
                      >
                        <div className="w-14 h-14 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-2 font-[var(--font-playfair)]">
                        See your full simulation
                      </h3>
                      <p className="text-gray-400 text-center text-sm mb-6">
                        Your analysis is ready. Unlock everything.
                      </p>

                      {/* What's locked */}
                      <div className="space-y-3 mb-8">
                        {[
                          { icon: AlertTriangle, text: "Complete red flags & blind spots", color: "text-red-400" },
                          { icon: Eye, text: "Predicted choice & confidence score", color: "text-purple-400" },
                          { icon: Sparkles, text: "Full psychological breakdown", color: "text-cyan-400" },
                          { icon: GitBranch, text: "6-month & 1-year timelines for both paths", color: "text-emerald-400" },
                          { icon: TrendingUp, text: "Best, worst & likely outcomes + tradeoffs", color: "text-amber-400" },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -15, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2.4 + (i * 0.08) }}
                            className="flex items-center gap-3"
                          >
                            <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                            <span className="text-gray-300 text-sm">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={handlePay}
                        disabled={loading}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2.8 }}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-4 rounded-xl text-white font-semibold text-lg relative overflow-hidden group disabled:opacity-80 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #7c3aed 100%)",
                        }}
                      >
                        {/* Shimmer */}
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Continue & Pay — $4.99"
                          )}
                        </span>
                      </motion.button>

                      <p className="text-gray-600 text-xs text-center mt-3">
                        One-time payment · Instant access · No subscription
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

