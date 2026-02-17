import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#07070a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="relative z-20 max-w-4xl mx-auto pt-32 pb-20 px-6 w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-[var(--font-mono)] text-[var(--accent-glow)] tracking-[0.3em] uppercase mb-4 block">
            The Architect
          </span>
          <h1 className="text-5xl md:text-7xl font-[var(--font-playfair)] text-white mb-8">
            Built by <span className="italic text-[var(--accent-bright)]">Agastya Sharma</span>
          </h1>
        </div>

        <div className="relative">
            {/* Glass Container */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5 -rotate-1 scale-[1.02]" />
            
            <div className="relative bg-[#0f0f14]/80 p-8 md:p-16 rounded-3xl border border-white/10 space-y-8 text-lg font-light leading-loose text-gray-300 shadow-2xl">
            <p>
                I built <span className="text-white font-medium">Afterward.</span> for a simple reason: <strong className="text-white font-normal">Spreadsheets lie.</strong>
            </p>

            <p>
                When we make big life decisions, we tend to over-index on logic. We list pros and cons. We calculate ROI. We try to outsmart the future.
            </p>

            <p>
                But logic doesn't wake up at 3am with a pit in its stomach. Logic doesn't feel the weight of "what if."
            </p>
            
            <p>
                I wanted to build something that forced me to confront the <em>emotional</em> reality of my choices, not just the logical one. A tool that acts like a mirror to the future, showing you the regret you're trying to ignore.
            </p>

            <div className="border-t border-white/10 pt-8 mt-12">
                <p className="text-sm font-[var(--font-mono)] text-gray-500 mb-6">
                    CONNECT WITH ME
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="https://x.com/visionary_comer/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-white text-black rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all font-medium text-center hover:-translate-y-1"
                    >
                    Follow on X (Twitter)
                    </a>

                    <Link
                    href="/"
                    className="px-8 py-4 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all text-center"
                    >
                    Simulate a Decision
                    </Link>
                </div>
            </div>
            </div>
        </div>
      </div>
    </main>
  )
}
