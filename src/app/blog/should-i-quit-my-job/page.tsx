import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Should I Quit My Job? The Complete Decision Framework (2026)",
  description: "Stuck wondering 'should I quit my job?' Use our AI-powered decision simulator to see both futures: if you quit vs if you stay. Make the right choice with clarity.",
  openGraph: {
    title: "Should I Quit My Job? See Both Futures Before Deciding",
    description: "Experience what happens if you quit vs if you stay. AI simulation shows your life 3 months, 1 year, and 3 years from now.",
  }
}

export default function ShouldIQuitMyJobPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] text-[var(--text-primary)] mb-6">
        Should I Quit My Job? The Complete Decision Framework
      </h1>

      <p className="text-xl text-[var(--text-muted)] mb-8">
        Last updated: March 2026 • 12 min read
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mb-8 not-prose">
        <p className="text-white mb-3">
          <strong>TL;DR:</strong> Use Afterward's AI simulator to see both futures before you quit. 
          Experience what your life looks like 3 months, 1 year, and 3 years from now if you GO vs if you STAY.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(124,92,191,0.4)] transition-all"
        >
          Simulate Your Decision →
        </Link>
      </div>

      <h2>The Question That Keeps You Up at Night</h2>
      <p>
        You're reading this at 2 AM, aren't you? Stuck in that mental loop: 
        "Should I quit my job?" You've made the pros/cons list. You've talked to friends. 
        You've Googled "signs you should quit your job" seventeen times this week.
      </p>
      <p>
        But here's why you're still stuck: <strong>pros/cons lists are lifeless</strong>. 
        They don't capture the emotional weight. They can't show you what your life 
        actually feels like 6 months after you quit. Or 6 months after you stay.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Wondering if you should quit? See both futures.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Try Afterward Free →
        </Link>
      </div>

      <h2>The Two Futures Framework</h2>
      <p>
        Instead of asking "should I quit?", ask: <strong>"Which regret can I live with?"</strong>
      </p>

      <h3>Future A: You Quit</h3>
      <ul>
        <li><strong>3 months:</strong> The relief is real, but so is the anxiety about money</li>
        <li><strong>1 year:</strong> You've either found something better or you're scrambling</li>
        <li><strong>3 years:</strong> Looking back, was the risk worth it?</li>
      </ul>

      <h3>Future B: You Stay</h3>
      <ul>
        <li><strong>3 months:</strong> Same desk, same meetings, paycheck still clears</li>
        <li><strong>1 year:</strong> Promotion came, but you feel more trapped</li>
        <li><strong>3 years:</strong> Comfortable, but is this the life you wanted?</li>
      </ul>

      <h2>The 5 Signs You Should Actually Quit</h2>
      
      <h3>1. Sunday Night Dread Is Physical</h3>
      <p>
        Not just "ugh, work tomorrow." We're talking nausea, insomnia, chest tightness. 
        If your body is screaming, listen.
      </p>

      <h3>2. You've Stopped Growing</h3>
      <p>
        Six months ago, what new skill did you learn? If the answer is "nothing," you're stagnating.
      </p>

      <h3>3. Your Values Are Compromised</h3>
      <p>
        You're doing work that conflicts with who you are. Every day chips away at your integrity.
      </p>

      <h3>4. The Money Isn't Worth It Anymore</h3>
      <p>
        You used to justify the stress with the paycheck. Now? Not even close.
      </p>

      <h3>5. You Have a Concrete Next Step</h3>
      <p>
        Key word: concrete. Not "I'll figure it out." You have savings, a plan, or another offer.
      </p>

      <div className="my-8 p-6 bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl not-prose">
        <p className="text-[var(--text-primary)] font-semibold mb-3">
          Tired of endless weighing? Let the oracle guide you.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-mono text-sm tracking-wider uppercase">
          Experience Your Options →
        </Link>
      </div>

      <h2>The 5 Signs You Should Stay (For Now)</h2>

      <h3>1. You're Just Having a Bad Week</h3>
      <p>
        One terrible project doesn't mean quit. One bad manager might mean internal transfer.
      </p>

      <h3>2. You're Running FROM, Not Toward</h3>
      <p>
        If you can't articulate what you're moving toward, you're just escaping. That rarely works.
      </p>

      <h3>3. Financial Runway Is Zero</h3>
      <p>
        No emergency fund? No job lined up? Stay and save first. Desperation leads to bad decisions.
      </p>

      <h3>4. You Haven't Tried to Fix It</h3>
      <p>
        Talked to your manager? Requested different projects? Set boundaries? Try those first.
      </p>

      <h3>5. The Job Market Is Brutal Right Now</h3>
      <p>
        Sometimes timing matters. If layoffs are everywhere, staying might be strategic.
      </p>

      <h2>How to Actually Decide</h2>
      
      <p>
        Here's what most advice misses: <strong>you need to feel both futures, not just think through them.</strong>
      </p>

      <p>
        That's why we built Afterward. It doesn't tell you what to do. It shows you what both paths 
        feel like—so you can choose with your eyes wide open.
      </p>

      <div className="bg-[rgba(15,15,20,0.8)] border border-[var(--border-subtle)] rounded-xl p-8 my-8 not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">Try Afterward Free</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Answer 5 questions about your job situation. See what your life looks like if you 
          quit vs if you stay—3 months, 1 year, 3 years from now.
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          Simulate: Should I Quit My Job? →
        </Link>
        <p className="text-[var(--text-muted)] text-sm mt-4">
          Free • 2 minutes • No credit card required
        </p>
      </div>

      <h2>Real Talk: The Regret You Can Live With</h2>
      
      <p>
        Here's the truth nobody tells you: <strong>both choices have regret attached.</strong>
      </p>

      <p>
        If you quit and it goes badly, you'll regret the instability. If you stay and watch 
        years slip by, you'll regret the what-ifs.
      </p>

      <p>
        The question isn't "which choice has zero regret?" It's <strong>"which regret can I live with?"</strong>
      </p>

      <h2>The Bottom Line</h2>
      
      <p>
        Should you quit your job? Only you know. But you can't know until you've honestly 
        experienced both futures.
      </p>

      <p>
        Stop overthinking. Start simulating.
      </p>

      <div className="bg-[#7c5cbf]/10 border border-[#7c5cbf]/30 rounded-xl p-6 mt-8 not-prose">
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(124,92,191,0.5)] transition-all text-lg"
        >
          See Both Futures Now →
        </Link>
      </div>

      <hr className="my-12 border-[var(--border-subtle)]" />

      <div className="text-sm text-[var(--text-muted)]">
        <p>
          <strong>About Afterward:</strong> AI-powered decision simulator that shows you both 
          possible futures before you choose. Used by thousands facing career changes, 
          relationship decisions, and major life choices.
        </p>
      </div>
    </article>
  )
}
