"use client"

import { DualPathSimulation } from "@/lib/types"
import { JourneyLanding } from "./journey-landing"
import { BookViewer } from "./book-viewer"
import { useState } from "react"

interface SimulationOutputProps {
  simulations: DualPathSimulation
  onContinue: () => void
}

export function SimulationOutput({ simulations, onContinue }: SimulationOutputProps) {
  const [showLanding, setShowLanding] = useState(true)

  if (showLanding) {
    return (
      <JourneyLanding onBegin={() => setShowLanding(false)} />
    )
  }

  return (
    <BookViewer 
      simulations={simulations} 
      onComplete={onContinue}
    />
  )
}
