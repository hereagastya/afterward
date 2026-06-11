"use client"

import { AnalysisResult } from "@/lib/types"

interface ShareAnalysisButtonProps {
  analysis: AnalysisResult
  decision: string
}

export function ShareAnalysisButton({ analysis, decision }: ShareAnalysisButtonProps) {
  const handleShare = () => {
    const text = `My Decision DNA for "${decision}":

🧬 Clarity: ${analysis.clarityScore}%
😰 Fear: ${analysis.fearLevel}%
🧠 Logic: ${analysis.logicLevel}%
💚 Gut: ${analysis.gutLevel}%

Prediction: I'll choose ${analysis.prediction.toUpperCase()}

${analysis.emotionalState}

Try it yourself at afterward.fyi`

    if (navigator.share) {
      navigator.share({
        text,
        url: 'https://afterward.fyi'
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
    >
      Share your DNA →
    </button>
  )
}
