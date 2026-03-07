"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { DualPathSimulationData } from "@/lib/types"
import { JourneyLanding } from "./journey-landing"
import { MomentJourneyCard } from "./moment-journey-card"
import { PathTransition } from "./path-transition"
import { ComparisonScreen } from "./comparison-screen"
import { FlashcardViewer } from "./flashcard-viewer"

interface SimulationOutputProps {
  simulations: DualPathSimulationData
  flashcards: any // Your existing flashcard type
  onContinue: () => void
}

type JourneyStep =
  | "landing"
  | "pathA-0" | "pathA-1" | "pathA-2" | "pathA-3"
  | "transition"
  | "pathB-0" | "pathB-1" | "pathB-2" | "pathB-3"
  | "comparison"
  | "flashcards"

export function SimulationOutput({
  simulations,
  flashcards,
  onContinue
}: SimulationOutputProps) {
  const [step, setStep] = useState<JourneyStep>("landing")

  const pathAMoments = simulations.pathA.phases
  const pathBMoments = simulations.pathB.phases

  const handleNext = () => {
    const sequence: JourneyStep[] = [
      "landing",
      "pathA-0", "pathA-1", "pathA-2", "pathA-3",
      "transition",
      "pathB-0", "pathB-1", "pathB-2", "pathB-3",
      "comparison",
      "flashcards"
    ]
    
    const currentIndex = sequence.indexOf(step)
    if (currentIndex < sequence.length - 1) {
      setStep(sequence[currentIndex + 1])
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === "landing" && (
        <JourneyLanding key="landing" onBegin={handleNext} />
      )}

      {step === "pathA-0" && (
        <MomentJourneyCard
          key="pathA-0"
          moment={pathAMoments[0]}
          currentIndex={0}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="3 Months Later →"
        />
      )}

      {step === "pathA-1" && (
        <MomentJourneyCard
          key="pathA-1"
          moment={pathAMoments[1]}
          currentIndex={1}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="1 Year Later →"
        />
      )}

      {step === "pathA-2" && (
        <MomentJourneyCard
          key="pathA-2"
          moment={pathAMoments[2]}
          currentIndex={2}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="3 Years Later →"
        />
      )}

      {step === "pathA-3" && (
        <MomentJourneyCard
          key="pathA-3"
          moment={pathAMoments[3]}
          currentIndex={3}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="See the Other Path →"
        />
      )}

      {step === "transition" && (
        <PathTransition key="transition" onContinue={handleNext} />
      )}

      {step === "pathB-0" && (
        <MomentJourneyCard
          key="pathB-0"
          moment={pathBMoments[0]}
          currentIndex={0}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="3 Months Later →"
        />
      )}

      {step === "pathB-1" && (
        <MomentJourneyCard
          key="pathB-1"
          moment={pathBMoments[1]}
          currentIndex={1}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="1 Year Later →"
        />
      )}

      {step === "pathB-2" && (
        <MomentJourneyCard
          key="pathB-2"
          moment={pathBMoments[2]}
          currentIndex={2}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="3 Years Later →"
        />
      )}

      {step === "pathB-3" && (
        <MomentJourneyCard
          key="pathB-3"
          moment={pathBMoments[3]}
          currentIndex={3}
          totalMoments={4}
          onNext={handleNext}
          showNextButton={true}
          nextButtonText="Compare Both Paths →"
        />
      )}

      {step === "comparison" && (
        <ComparisonScreen
          key="comparison"
          pathA={simulations.pathA}
          pathB={simulations.pathB}
          onContinue={handleNext}
        />
      )}

      {step === "flashcards" && (
        <FlashcardViewer
          key="flashcards"
          flashcards={flashcards}
          onComplete={onContinue}
        />
      )}
    </AnimatePresence>
  )
}
