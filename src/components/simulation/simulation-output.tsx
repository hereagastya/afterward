"use client"

import { useState } from "react"
import { DualPathSimulation } from "@/lib/types"
import { JourneyLanding } from "./journey-landing"
import { MysticalBookViewer } from "./mystical-book-viewer"

interface SimulationOutputProps {
  simulations: DualPathSimulation
  onContinue: () => void
}

export function SimulationOutput({ simulations, onContinue }: SimulationOutputProps) {
  const [showLanding, setShowLanding] = useState(true)

  if (showLanding) {
    return <JourneyLanding onBegin={() => setShowLanding(false)} />
  }

  return (
    <MysticalBookViewer 
      simulations={simulations}
      onComplete={onContinue}
    />
  )
}
