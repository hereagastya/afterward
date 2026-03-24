import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Overcome Analysis Paralysis: Frameworks and AI Simulators",
  description: "Stuck in analysis paralysis? Learn how to break the cycle of overthinking with structured decision trees and AI-powered regret visualization.",
  openGraph: {
    title: "How to Overcome Analysis Paralysis",
    description: "Stop researching and start deciding. Use Afterward's AI to simulate your options and gain instant emotional clarity.",
  }
}

export default function AnalysisParalysisPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-[var(--text-primary)] mb-6">
        How to Overcome Analysis Paralysis
      </h1>

      <p className="text-xl text-[var(--text-muted)] mb-8">
        Last updated: March 2026 • 7 min read
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mb-8 not-prose">
        <p className="text-white mb-3">
          <strong>TL;DR:</strong> More information will not save you. You don't need another Google search; you need to feel your future. Use Afterward's AI to visualize your outcomes.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all"
        >
          Break Your Paralysis →
        </Link>
      </div>

      <h2>The Information Trap</h2>
      <p>
        Analysis paralysis happens when you mistakenly believe that if you just gather <em>one more piece of data</em>, the right decision will magically reveal itself. 
      </p>
      <p>
        But after a certain point, new information actually decreases your clarity. It adds variables to an equation that your brain already lacks the RAM to solve.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Stop Googling. Start Simulating.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Try Afterward Free →
        </Link>
      </div>

      <h2>Satisficing vs. Maximizing</h2>
      <p>
        Psychologist Barry Schwartz identifies two types of decision-makers: Maximizers (who need the absolute best outcome) and Satisficers (who accept an outcome once it meets their criteria).
      </p>
      <p>
        Maximizers suffer constantly from analysis paralysis. To break it, you must intentionally adopt a Satisficer mindset. Define your "good enough" criteria. 
      </p>

      <h2>The Simulation Solution</h2>
      
      <p>
        When you are paralyzed, it is because you are stuck in the theoretical realm. You need to pull the decision down into the visceral, emotional realm. 
      </p>

      <p>
        Afterward is an AI simulator that forces you out of theoretical research loops. It crafts a narrative of your life based on the choices you make, allowing you to react intuitively rather than calculating endlessly.
      </p>

      <div className="bg-[rgba(15,15,20,0.8)] border border-[var(--border-subtle)] rounded-xl p-8 my-8 not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">Visualize Your Future</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          See what happens if you GO vs if you STAY. Answer 5 questions and let our AI end your analysis paralysis forever.
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          Simulate: Your Decision →
        </Link>
      </div>

      <hr className="my-12 border-[var(--border-subtle)]" />

      <div className="text-sm text-[var(--text-muted)]">
        <p>
          <strong>About Afterward:</strong> AI-powered tools for modern decision making. See your choices play out before you make them.
        </p>
      </div>
    </article>
  )
}
