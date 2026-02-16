import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="relative z-20 max-w-6xl mx-auto mt-32 w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the plan that fits your decision-making needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-semibold text-white mb-2">Free</h3>
            <p className="text-gray-400 mb-6">For trying it out</p>
            
            <div className="mb-8">
              <span className="text-5xl font-light text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">3 decisions per month</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Basic simulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Save decisions</span>
              </li>
              <li className="flex items-start opacity-50">
                <span className="text-gray-600 mr-2">✗</span>
                <span className="text-gray-500">Follow-up check-ins</span>
              </li>
            </ul>

            <Link href="/">
              <button className="w-full py-3 px-6 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all">
                Get Started
              </button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass p-8 rounded-2xl border-2 border-[#8B6FD4]/30 relative">
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white text-xs font-bold rounded-full">
              MOST POPULAR
            </div>

            <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-gray-400 mb-6">For serious decision-makers</p>
            
            <div className="mb-8">
              <span className="text-5xl font-light text-white">$9</span>
              <span className="text-gray-400">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Unlimited decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Deeper simulations (more time periods)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Follow-up check-ins via email</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Export decisions as PDF</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Priority support</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full py-3 px-6 bg-gradient-to-r from-[#8B6FD4]/40 to-[#B794F4]/40 text-white/60 rounded-lg font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>
            <p className="text-center text-sm mt-4" style={{ color: '#B794F4' }}>
              Paid plans launching next week. Early access users get 50% off!
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your billing period.</p>
            </div>

            <div className="glass p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-2">What counts as a decision?</h3>
              <p className="text-gray-400">Each time you enter a new decision and complete the simulation, that counts as one decision. Revisiting saved decisions doesn't count.</p>
            </div>

            <div className="glass p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-2">How do check-ins work?</h3>
              <p className="text-gray-400">Pro users receive email check-ins at 2 weeks, 1 month, 3 months, and 6 months after making a decision. You can respond directly to track your progress.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
