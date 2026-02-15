"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, Trash2, Calendar } from "lucide-react"
import { CheckInForm } from "@/components/dashboard/check-in-form"
import { CheckInTimeline } from "@/components/dashboard/check-in-timeline"
import { Button } from "@/components/ui/button"

interface DecisionDetail {
  id: string
  query: string
  context: string
  userChoice: string
  status: string
  createdAt: string
  simulations: any[] // Using simplified types for now
  flashcards: any[]
  checkIns: any[]
}

export default function DecisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // React.use() unwraps the Promise 
  // Note: in Next.js 15+ params is async, we can use React.use() to unwrap it
  const { id } = use(params)
  
  const [decision, setDecision] = useState<DecisionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "simulation" | "checkin">("checkin")

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await fetch(`/api/decisions/${id}`)
        if (res.ok) {
          const data = await res.json()
          setDecision(data)
        } else {
            // Handle not found
           if(res.status === 404) router.push('/dashboard')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDecision()
  }, [id, router])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this decision simulation? This cannot be undone.")) return

    try {
      const res = await fetch(`/api/decisions/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckInComplete = (newCheckIn: any) => {
    if (decision) {
      setDecision({
        ...decision,
        checkIns: [newCheckIn, ...decision.checkIns]
      })
    }
  }

  if (loading || !decision) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B6FD4] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] pb-24">
      {/* Navbarish */}
      <div className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <button 
            onClick={handleDelete}
            className="text-red-500/50 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
             <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
               {new Date(decision.createdAt).toLocaleDateString()}
             </span>
             <span className="w-1 h-1 rounded-full bg-gray-700" />
             <span className="text-xs font-mono text-[#B794F4] uppercase tracking-wider">
               You chose: {decision.userChoice}
             </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-white leading-tight">
            {decision.query}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`mr-8 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "checkin" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Reality Check
            {activeTab === "checkin" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B6FD4]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`mr-8 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "simulation" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Original Simulation
            {activeTab === "simulation" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B6FD4]" />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "checkin" ? (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <div>
                <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-[#B794F4]" />
                  Internal Reality Check
                </h3>
                <CheckInForm 
                  decisionId={decision.id}
                  currentStatus={decision.status}
                  onCheckInComplete={handleCheckInComplete}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-6">Timeline</h3>
                <CheckInTimeline checkIns={decision.checkIns} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               {/* Add Simulation summary here if needed */}
               <div className="p-8 border border-dashed border-gray-800 rounded-2xl text-center text-gray-500">
                  Detailed view of original simulations and flashcards would be rendered here.
                  <div className="mt-4 text-xs">feature coming soon</div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
