"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, Trash2, Calendar, LayoutDashboard } from "lucide-react"
import { CheckInForm } from "@/components/dashboard/check-in-form"
import { CheckInTimeline } from "@/components/dashboard/check-in-timeline"
// check-in-form and check-in-timeline might need styling updates too, but assuming they inherit global styles nicely for now.

interface DecisionDetail {
  id: string
  query: string
  context: string
  userChoice: string
  status: string
  createdAt: string
  simulations: any[]
  flashcards: any[]
  checkIns: any[]
}

export default function DecisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
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
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
         <div className="relative">
             <div className="absolute inset-0 bg-[var(--accent-primary)] blur-3xl opacity-20 animate-pulse" />
             <Loader2 className="w-10 h-10 text-[var(--accent-glow)] animate-spin relative z-10" />
        </div>
      </div>
    )
  }
  
  const isGo = decision.userChoice === "go"

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-24 relative overflow-hidden">
       {/* Ambient Glow */}
       <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />

      {/* Nav */}
      <div className="border-b border-white/5 bg-[var(--bg-base)]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <button 
            onClick={handleDelete}
            className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all p-2 rounded-lg"
            title="Delete Decision"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-12 relative z-20">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <span className="text-xs font-[var(--font-mono)] text-gray-500 uppercase tracking-wider backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {new Date(decision.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
             
             <div className={cn(
                 "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider",
                 isGo ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
             )}>
                 <span className={cn("w-1.5 h-1.5 rounded-full", isGo ? "bg-emerald-500" : "bg-indigo-500")} />
                 Decision: {isGo ? "Went For It" : "Stayed Put"}
             </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-playfair)] text-white leading-[1.1]">
            {decision.query}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`mr-8 pb-4 text-sm font-[var(--font-sans)] tracking-wide transition-colors relative ${
              activeTab === "checkin" ? "text-white font-medium" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Reality Check
            {activeTab === "checkin" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-glow)] shadow-[0_0_10px_#9d7de8]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`mr-8 pb-4 text-sm font-[var(--font-sans)] tracking-wide transition-colors relative ${
              activeTab === "simulation" ? "text-white font-medium" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Original Simulation
            {activeTab === "simulation" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-glow)] shadow-[0_0_10px_#9d7de8]" />
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
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"
            >
              <div>
                <h3 className="text-xl font-[var(--font-playfair)] text-white mb-8 flex items-center">
                   <div className="p-2 bg-white/5 rounded-lg mr-3 border border-white/10">
                      <LayoutDashboard className="w-5 h-5 text-[var(--accent-glow)]" />
                   </div>
                  Internal Reality Check
                </h3>
                <CheckInForm 
                  decisionId={decision.id}
                  currentStatus={decision.status}
                  onCheckInComplete={handleCheckInComplete}
                />
              </div>
              
              <div className="relative">
                 {/* Decor line */}
                 <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent -ml-12" />
                 
                <h3 className="text-xl font-[var(--font-playfair)] text-white mb-8 flex items-center">
                    <div className="p-2 bg-white/5 rounded-lg mr-3 border border-white/10">
                        <Calendar className="w-5 h-5 text-[var(--accent-glow)]" />
                    </div>
                    Timeline
                </h3>
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
               {/* Placeholder for future detailed simulation view */}
               <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
                  <h3 className="text-2xl font-[var(--font-playfair)] text-white mb-4">Original Data Archived</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The detailed simulation pathway and flashcards are archived. We're building a new viewer for this data.
                  </p>
                  <span className="inline-block mt-6 px-4 py-1.5 bg-[var(--bg-elevated)] rounded-full text-xs font-mono text-[var(--accent-glow)] border border-[var(--border-subtle)]">
                      COMING SOON
                  </span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}
