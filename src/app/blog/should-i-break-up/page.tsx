import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Should I Break Up? Experience Both Futures Before You Decide",
  description: "Torn deciding 'should I break up?' See what your life looks like post-breakup vs if you stay together using our AI regret simulator.",
  openGraph: {
    title: "Should I Break Up? See Both Futures Before Deciding",
    description: "Experience what happens if you break up vs if you stay. AI simulation shows your life 3 months, 1 year, and 3 years from now.",
  }
}

export default function ShouldIBreakUpPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-[var(--text-primary)] mb-6">
        Should I Break Up? The Emotional Decision Framework
      </h1>

      <p className="text-xl text-[var(--text-muted)] mb-8">
        Last updated: March 2026 • 10 min read
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mb-8 not-prose">
        <p className="text-white mb-3">
          <strong>TL;DR:</strong> Relationships are messy. Use Afterward's AI simulator to see both futures before you have "the talk". 
          Experience what your life looks like 3 months, 1 year, and 3 years from now if you STAY vs LEAVE.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all"
        >
          Simulate Your Decision →
        </Link>
      </div>

      <h2>The Paralysis of "Should I Break Up?"</h2>
      <p>
        Deciding whether to end a relationship is widely considered one of the most agonizing, isolating experiences of adult life. You parse through every text message, every argument, every good day, looking for a sign.
      </p>
      <p>
        The reason you're trapped in analysis paralysis is simple: <strong>fear of regret</strong>. You don't want to throw away years for nothing, but you also don't want to waste the rest of your life. 
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Wondering if you should break up? See both futures.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Try Afterward Free →
        </Link>
      </div>

      <h2>Love vs. Compatibility</h2>
      <p>
        Love is necessary, but it isn't sufficient. You can deeply love someone who is fundamentally incompatible with your vision of the future. The hardest breakups are often the ones where love isn't the problem.
      </p>

      <h3>The "Sunk Cost" Fallacy</h3>
      <p>
        "But we've been together for three years..." Time spent is a sunk cost. Do not spend the next 30 years of your life trying to justify the last three.
      </p>

      <h2>4 Questions to Clarify Your Choice</h2>
      
      <h3>1. Are your core values misaligned?</h3>
      <p>
        Kids, money, religion, geography. If you conflict on core issues, one of you will end up building a foundation of resentment.
      </p>

      <h3>2. Are you in love with their potential?</h3>
      <p>
        Are you dating who they are today, or who you hope they'll be in 5 years? People rarely change unless they genuinely want to.
      </p>

      <h3>3. Would you want your child to marry someone just like them?</h3>
      <p>
        This question instantly removes all the complicated justifications and exposes the raw truth of how you view your partner's character.
      </p>

      <h3>4. Is the relationship preventing your growth?</h3>
      <p>
        A good partnership acts as an accelerant to your personal growth. A bad one forces you to shrink to fit inside it.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Stop scrolling, start experiencing.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Simulate Your Relationship →
        </Link>
      </div>

      <h2>How to Actually Decide</h2>
      
      <p>
        Logic alone won't get you through a breakup. You have to emotionally process the emptiness of an erased future, or the suffocating feeling of staying forever.
      </p>

      <p>
        That's why Afterward exists. By simulating the emotional aftermath of your decision up to three years away, you can safely trial the grief without the risk.
      </p>

      <div className="bg-[rgba(15,15,20,0.8)] border border-[var(--border-subtle)] rounded-xl p-8 my-8 not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">See Both Futures Before You Say Goodbye</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Answer 5 questions about your relationship. Afterward will vividly depict your life 3 months, 1 year, and 3 years from now across both timelines.
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          Simulate: Should I Break Up? →
        </Link>
      </div>

      <hr className="my-12 border-[var(--border-subtle)]" />

      <div className="text-sm text-[var(--text-muted)]">
        <p>
          <strong>About Afterward:</strong> AI-powered decision simulator exploring the multiverse of your potential regrets and triumphs.
        </p>
      </div>
    </article>
  )
}
