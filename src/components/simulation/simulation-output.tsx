"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DualPathSimulation } from "@/lib/types"
import { JourneyLanding } from "./journey-landing"
import { ScenarioViewer } from "./scenario-viewer"
import { TradeoffAnalysis } from "./tradeoff-analysis"
import { useSound } from "@/lib/hooks/use-sound"

interface SimulationOutputProps {
  simulations: DualPathSimulation
  onContinue: () => void
}

type Step = "landing" | "scenarios" | "tradeoffs"

export function SimulationOutput({
  simulations,
  onContinue
}: SimulationOutputProps) {
  const [step, setStep] = useState<Step>("landing")
  const { playFlip } = useSound()

  const handleNext = (next: Step) => {
    playFlip()
    setStep(next)
  }

  return (
    <div className="min-h-screen relative">
      <AnimatePresence mode="wait">
        {/* Landing */}
        {step === "landing" && (
          <JourneyLanding
            key="landing"
            onBegin={() => handleNext("scenarios")}
          />
        )}

        {/* Scenarios Comparison */}
        {step === "scenarios" && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-12"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-[var(--font-playfair)] text-white mb-3">
                  Three Ways Each Path Could Play Out
                </h2>
                <p className="text-gray-400">
                  Best case, likely case, worst case — for both choices
                </p>
              </div>

              {/* Side by side scenarios */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <ScenarioViewer 
                  path={simulations.pathA} 
                  pathColor="green"
                />
                <ScenarioViewer 
                  path={simulations.pathB} 
                  pathColor="blue"
                />
              </div>

              {/* Continue button */}
              <div className="text-center">
                <button
                  onClick={() => handleNext("tradeoffs")}
                  className="btn-mystical text-lg px-10 py-4"
                >
                  See What You&apos;re Really Trading →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tradeoff Analysis */}
        {step === "tradeoffs" && (
          <motion.div
            key="tradeoffs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-12"
          >
            <TradeoffAnalysis
              goTradeoffs={simulations.pathA.tradeoffs}
              stayTradeoffs={simulations.pathB.tradeoffs}
            />

            {/* Continue to decision */}
            <div className="text-center mt-12">
              <button
                onClick={onContinue}
                className="btn-mystical text-lg px-10 py-4"
              >
                Continue to Final Decision →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
