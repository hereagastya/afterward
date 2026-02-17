import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
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
            Choose the level of foresight you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="group relative p-8 md:p-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
            <h3 className="text-3xl font-[var(--font-playfair)] text-white mb-2">Seeker</h3>
            <p className="text-gray-500 mb-8 font-light">For the curious mind.</p>
            
            <div className="mb-10">
              <span className="text-5xl font-light text-white tracking-tighter">$0</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                  "3 decisions per month",
                  "Basic timeline simulation",
                  "Save decisions for later"
              ].map(feature => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
              ))}
              <li className="flex items-start opacity-40">
                <Check className="w-5 h-5 mr-3 shrink-0" />
                <span className="text-gray-500 font-light">Follow-up check-ins</span>
              </li>
            </ul>

            <Link href="/">
              <button className="w-full py-4 px-6 border border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/30 transition-all font-medium tracking-wide">
                Start Free
              </button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 md:p-12 rounded-3xl border border-[#8B6FD4]/50 bg-[#0f0f14] shadow-[0_0_50px_rgba(124,92,191,0.15)] overflow-hidden">
             {/* Gradient Shine */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#8B6FD4]/5 to-transparent pointer-events-none" />
             
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-[#8B6FD4] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
              Oracle Access
            </div>

            <h3 className="text-3xl font-[var(--font-playfair)] text-white mb-2">Prophet</h3>
            <p className="text-[#9d7de8] mb-8 font-light">For those who verify fate.</p>
            
            <div className="mb-10">
              <span className="text-5xl font-light text-white tracking-tighter">$9</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10 relative z-10">
              {[
                  "Unlimited decisions",
                  "Deep-dive simulation analysis",
                  "Automated future check-ins",
                  "Export decisions as PDF",
                  "Priority support"
              ].map(feature => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-[#c4a8ff] mr-3 shrink-0" />
                    <span className="text-gray-200 font-light">{feature}</span>
                  </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-4 px-6 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-bold tracking-wide shadow-lg hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all transform hover:scale-[1.02] cursor-not-allowed opacity-80"
            >
              Coming Soon
            </button>
            <p className="text-center text-xs mt-4 text-[#9d7de8]/80 font-mono uppercase tracking-wider">
              Launching Q4 2026
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-2xl mx-auto">
          <h2 className="text-3xl font-[var(--font-playfair)] text-white mb-10 text-center">
            Common Inquiries
          </h2>
          
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-white font-medium mb-2 text-lg">Can I cancel anytime?</h3>
              <p className="text-gray-400 font-light leading-relaxed">Yes. Your destiny is yours to control. Cancel your subscription instantly from the dashboard.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-white font-medium mb-2 text-lg">What counts as a decision?</h3>
              <p className="text-gray-400 font-light leading-relaxed">Each unique simulation you generate counts. Revisiting, editing, or checking in on past decisions is free and unlimited.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
