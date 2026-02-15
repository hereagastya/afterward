import { DualPathSimulationData } from "@/lib/types"
import { TimelineView } from "./timeline-view"

interface DualPathSimulationProps {
  simulations: DualPathSimulationData
  onContinue: () => void
}

export function DualPathSimulation({ simulations, onContinue }: DualPathSimulationProps) {
  return <TimelineView simulation={simulations} onReflect={onContinue} />
}
