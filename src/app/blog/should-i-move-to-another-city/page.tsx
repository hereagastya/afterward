import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Should I Move to Another City? The Ultimate Relocation Guide",
  description: "Debating 'should I move to another city?' Use our AI-powered simulator to see both futures: what your life looks like if you move vs if you stay.",
  openGraph: {
    title: "Should I Move to Another City? See Both Futures Before Deciding",
    description: "Experience what happens if you pack up and leave vs if you stay put. AI simulation shows your life 3 months, 1 year, and 3 years from now.",
  }
}

export default function ShouldIMovePage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-[var(--text-primary)] mb-6">
        Should I Move to Another City? The Relocation Framework
      </h1>

      <p className="text-xl text-[var(--text-muted)] mb-8">
        Last updated: March 2026 • 9 min read
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mb-8 not-prose">
        <p className="text-white mb-3">
          <strong>TL;DR:</strong> Use Afterward's AI simulator to see both futures before you break your lease. 
          Experience what your life looks like 3 months, 1 year, and 3 years from now if you MOVE vs if you STAY.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all"
        >
          Simulate Your Decision →
        </Link>
      </div>

      <h2>The Geography of Happiness</h2>
      <p>
        "If I just lived in New York, everything would be different." We've all had the thought. A new city promises a blank slate, new friends, better weather, or a stronger job market. But geography rarely cures internal unrest. 
      </p>
      <p>
        The hardest part about deciding to move isn't the logistics of packing. It's the emotional leap of faith. The fear of deep loneliness in a new place, juxtaposed with the fear of stagnating right where you are.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Torn between the devil you know and the deep blue sea?
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Try Afterward Free →
        </Link>
      </div>

      <h2>The Two Futures Framework</h2>
      <p>
        When considering a move, we usually underestimate the short-term difficulty and overestimate the long-term magic. Let's break it down accurately:
      </p>

      <h3>Future A: You Move</h3>
      <ul>
        <li><strong>3 months:</strong> Exciting but intensely lonely. You rely on FaceTime and takeout.</li>
        <li><strong>1 year:</strong> You have a favorite coffee shop and two friends. It's starting to feel like home.</li>
        <li><strong>3 years:</strong> You can't believe you ever lived anywhere else.</li>
      </ul>

      <h3>Future B: You Stay</h3>
      <ul>
        <li><strong>3 months:</strong> Comfortable. Your routine carries you.</li>
        <li><strong>1 year:</strong> You feel a pang of jealousy when friends post travel photos.</li>
        <li><strong>3 years:</strong> You've built deep local roots, but occasionally wonder "what if?"</li>
      </ul>

      <h2>3 Good Reasons to Move</h2>
      
      <h3>1. Your Career Ceiling is Local</h3>
      <p>
        If your industry genuinely lives elsewhere (e.g., Tech in SF, Policy in DC), making the pilgrimage is often necessary for exponential career growth.
      </p>

      <h3>2. You Are Running TOWARD Something</h3>
      <p>
        You have a job offer, a romantic partner, or a specific lifestyle (ocean, mountains) calling you. You aren't just escaping.
      </p>

      <h3>3. Your Social Circuit is Stifling</h3>
      <p>
        Sometimes we outgrow our hometown friend groups, and rewriting our identity is impossible when everyone expects us to be who we were at 18.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          See what packing your bags actually feels like.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Simulate Your Choice →
        </Link>
      </div>

      <h2>3 Bad Reasons to Move</h2>

      <h3>1. "Wherever you go, there you are."</h3>
      <p>
        If you are depressed, severely anxious, or avoiding grief, a new ZIP code will not cure you. The problems will just have a different backdrop.
      </p>

      <h3>2. Temporary Burnout</h3>
      <p>
        If you're exhausted from a harsh winter or a bad breakup, take a two-week vacation, not a 3,000-mile permanent relocation.
      </p>

      <h3>3. Financial Delusion</h3>
      <p>
        Moving to an expensive city without a job lined up or significant savings is a recipe for immense, crushing stress that will ruin the experience anyway.
      </p>

      <h2>How to Actually Decide</h2>
      
      <p>
        Trying to imagine the feeling of an entirely new life is difficult. 
        That's why we built Afterward. By answering specific questions about your motivations, our AI engine constructs a highly personal timeline of what your life will actually look and feel like across both choices.
      </p>

      <div className="bg-[rgba(15,15,20,0.8)] border border-[var(--border-subtle)] rounded-xl p-8 my-8 not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">See Both Futures Before You Pack</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Answer 5 questions about your living situation. See what your life looks like if you 
          move vs if you stay—3 months, 1 year, 3 years from now.
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          Simulate: Should I Move? →
        </Link>
      </div>

      <hr className="my-12 border-[var(--border-subtle)]" />

      <div className="text-sm text-[var(--text-muted)]">
        <p>
          <strong>About Afterward:</strong> The AI-powered decision simulator exploring the multiverse of your potential regrets and triumphs. Perfect for major life crossroads like relocations.
        </p>
      </div>
    </article>
  )
}
