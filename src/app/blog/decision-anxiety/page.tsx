import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Decision Anxiety: How to Stop Spiraling in 2026",
  description: "Paralyzed by decision anxiety? Learn why your brain freezes and how to thaw it using AI simulation and proven psychological frameworks.",
  openGraph: {
    title: "Decision Anxiety: The Ultimate Cure",
    description: "When pros/cons lists fail, try simulating the future. Beat decision anxiety with our AI-powered regret simulator.",
  }
}

export default function DecisionAnxietyPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-[var(--text-primary)] mb-6">
        Decision Anxiety: Why You're Spiraling and How to Stop
      </h1>

      <p className="text-xl text-[var(--text-muted)] mb-8">
        Last updated: March 2026 • 8 min read
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mb-8 not-prose">
        <p className="text-white mb-3">
          <strong>TL;DR:</strong> Decision anxiety stems from an impossible desire to know the future with 100% certainty. Use Afterward's AI simulator to safely "experience" your options so your brain can stop looping.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all"
        >
          Cure Your Decision Anxiety →
        </Link>
      </div>

      <h2>The Anatomy of a Spiral</h2>
      <p>
        You sit down to make a choice. You gather facts. You make a spreadsheet. Then, the chest tightness begins. *What if I choose wrong? What if I regret it forever?*
      </p>
      <p>
        Welcome to decision anxiety: the psychological phenomenon where the sheer gravity of a choice overwhelms your executive functioning, causing you to freeze entirely.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Let AI do the heavy lifting of imagining the future.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Try Afterward Free →
        </Link>
      </div>

      <h2>The "Perfect Choice" Myth</h2>
      <p>
        Decision anxiety is predicated on a lie: that there is a single, objectively "perfect" path, and your job is to discover it. This is false.
      </p>

      <p>
        Every path has struggle. Every path has joy. The healthy framing is: <strong>"Do I want the struggles attached to Path A, or the struggles attached to Path B?"</strong>
      </p>

      <h2>3 Ways to Break the Loop</h2>

      <h3>1. Set an Artificial Deadline</h3>
      <p>
        Parkinson's Law states that work expands to fill the time allotted. Decision-making is the same. If you give yourself a month to decide, you will agonize for a month. Give yourself 48 hours. 
      </p>

      <h3>2. Shrink the Blast Radius</h3>
      <p>
        Can you test the decision? If you're debating moving cities, can you Airbnb there for two weeks first? If you're debating a career pivot, can you do a freelance project in that field?
      </p>

      <h3>3. Externalize the Future</h3>
      <p>
        Your brain is terrible at predicting 5 years in the future because it is blinded by present-day fear. You need an external system to show you what might happen objectively.
      </p>

      <h2>Enter the Digital Oracle</h2>
      
      <p>
        Afterward was built specifically for decision anxiety. By inputting your situation into our simulator, the AI constructs a vivid, third-party timeline of what your life looks like across both choices. It takes the burden of imagination off your stressed-out brain.
      </p>

      <div className="bg-[rgba(15,15,20,0.8)] border border-[var(--border-subtle)] rounded-xl p-8 my-8 not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">Stop the Spiral Now</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          See what your life looks like if you make the choice vs if you don't. Instantly receive an emotional blueprint of your future.
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          Simulate: Your Toughest Decision →
        </Link>
      </div>

      <hr className="my-12 border-[var(--border-subtle)]" />

      <div className="text-sm text-[var(--text-muted)]">
        <p>
          <strong>About Afterward:</strong> The AI tool that helps thousands of people overcome decision paralysis every month by visualizing their multiverses.
        </p>
      </div>
    </article>
  )
}
