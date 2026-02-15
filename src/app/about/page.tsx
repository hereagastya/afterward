import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="relative z-20 max-w-3xl mx-auto mt-32 w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6">
            Built by Agastya Sharma
          </h1>
        </div>

        <div className="glass p-8 md:p-12 rounded-2xl space-y-6 text-gray-300 leading-relaxed">
          <p className="text-lg">
            I built <span className="text-white font-semibold">Afterward.</span> because I was tired of making big decisions based on spreadsheets and pros/cons lists that completely ignored how I'd actually <em>feel</em> about my choices months later.
          </p>

          <p>
            Logic can tell you the "right" answer. But it can't tell you what it feels like to wake up at 3am regretting the path you chose — or regretting the one you didn't take.
          </p>

          <p>
            This tool exists to bridge that gap. It's not here to validate you or make you feel good. It's here to show you the uncomfortable truth of both paths before you commit to one.
          </p>

          <p className="text-gray-400 text-sm pt-4">
            Currently working on new AI products and sharing the journey on X.
          </p>

          {/* Social Links */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            
            <a
              href="https://twitter.com/yourusername" // Replace with your actual X/Twitter handle
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-lg hover:shadow-[0_0_20px_rgba(139,111,212,0.4)] transition-all font-semibold text-center"
            >
              Follow my journey on X →
            </a>

            <Link
              href="/"
              className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all text-center"
            >
              Try Afterward.
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
