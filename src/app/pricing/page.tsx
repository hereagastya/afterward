"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Check, Zap } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

export default function PricingPage() {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/pricing"
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#07070a] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <Navbar />

      <div className="relative z-20 max-w-7xl mx-auto pt-32 pb-20 px-6 w-full">
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-[var(--font-playfair)] text-white leading-tight">
             Clarity, <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#7c5cbf] to-[#c4a8ff]">Quantified.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-xl font-light max-w-2xl mx-auto">
            Experience the future consequences of your choice before you make it.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center max-w-lg mx-auto">
          {/* Per-Simulation Tier */}
          <div className="w-full relative p-8 md:p-10 rounded-3xl border border-[#8B6FD4]/50 bg-[#0f0f14] shadow-[0_0_50px_rgba(124,92,191,0.15)] overflow-hidden">
             {/* Gradient Shine */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#8B6FD4]/5 to-transparent pointer-events-none" />
             
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-[#8B6FD4] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
              Pay As You Go
            </div>

            <h3 className="text-3xl font-[var(--font-playfair)] text-white mb-2">Deep Dive</h3>
            <p className="text-[#9d7de8] mb-8 font-light">1 free simulation included on signup.</p>
            
            <div className="mb-10">
              <span className="text-5xl font-light text-white tracking-tighter">$4.99</span>
              <span className="text-gray-500 ml-2">/simulation</span>
            </div>

            <ul className="space-y-4 mb-10 relative z-10">
              {[
                  "Full dual-path AI simulation",
                  "Deep-dive psychological tradeoffs",
                  "Save & revisit decisions anytime",
                  "Automated future check-ins"
              ].map(feature => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-[#c4a8ff] mr-3 shrink-0" />
                    <span className="text-gray-200 font-light">{feature}</span>
                  </li>
              ))}
            </ul>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-bold tracking-wide shadow-lg hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10 flex items-center justify-center gap-2"
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
                  <Zap className="w-5 h-5"/>
                  <span>Get A Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-2xl mx-auto">
          <h2 className="text-3xl font-[var(--font-playfair)] text-white mb-10 text-center">
            Common Inquiries
          </h2>
          
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-white font-medium mb-2 text-lg">Are there any subscriptions?</h3>
              <p className="text-gray-400 font-light leading-relaxed">No. We removed all subscriptions. You only pay when you need clarity on a life-changing decision.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-white font-medium mb-2 text-lg">What counts as a simulation?</h3>
              <p className="text-gray-400 font-light leading-relaxed">Each unique dual-path analysis you generate costs one credit. Revisiting, reading, editing, or checking in on past decisions is free and unlimited.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-white font-medium mb-2 text-lg">Do my credits expire?</h3>
              <p className="text-gray-400 font-light leading-relaxed">Never. Whether you use them today or next year, they stay in your account forever.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
