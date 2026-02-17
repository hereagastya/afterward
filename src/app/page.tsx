"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QuestionFlow } from "@/components/simulation/question-flow"
import { DualPathSimulation } from "@/components/simulation/dual-path-simulation"
import { FlashcardViewer } from "@/components/simulation/flashcard-viewer"
import { DecisionPrompt } from "@/components/simulation/decision-prompt"
import { SaveConfirmation } from "@/components/simulation/save-confirmation"
import { FeedbackPopup } from "@/components/feedback-popup"
import { Navbar } from "@/components/navbar"
import { 
  FlowState, 
  QuestionAnswer, 
  DualPathSimulationData, 
  FlashcardSet,
  UserChoice 
} from "@/lib/types"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"

import { Loader2, Target, Zap, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { simulationLoadingMessages } from "@/lib/constants/loading-messages"

// ─── Decision Graveyard data ────────────────────────────────────────────────
const tickerRow1 = [
  "Should I leave my startup?",
  "Should I tell her how I feel?",
  "Should I move to NYC?",
  "Should I drop out?",
  "Should I take the remote job?",
  "Should I break up before college?",
  "Should I go freelance?",
  "Should I buy Bitcoin now?",
  "Should I move back home?",
  "Should I confront my boss?",
  "Should I adopt a child alone?",
  "Should I forgive them?",
]

const tickerRow2 = [
  "Should I accept the promotion?",
  "Should I end this friendship?",
  "Should I go back to school?",
  "Should I sell the house?",
  "Should I change my career at 40?",
  "Should I say yes to the proposal?",
  "Should I quit medicine?",
  "Should I move abroad alone?",
  "Should I invest my savings?",
  "Should I take the sabbatical?",
  "Should I open the restaurant?",
  "Should I have the surgery?",
]

// ─── How It Works data ──────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: Target,
    title: "Describe your decision",
    desc: "We ask 4 pointed questions that surface what you're actually afraid of.",
  },
  {
    num: "02",
    icon: Zap,
    title: "See both futures",
    desc: "Interactive timelines showing Month 3, Year 1, Year 3 for each path.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Choose with clarity",
    desc: "No validation, no hype. Just the uncomfortable truth of both paths.",
  },
]

export default function Home() {
  // Flow state
  const [flowState, setFlowState] = useState<FlowState>("input")
  const [decision, setDecision] = useState("")
  const [answers, setAnswers] = useState<QuestionAnswer[]>([])
  const [simulations, setSimulations] = useState<DualPathSimulationData | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardSet | null>(null)
  const [userChoice, setUserChoice] = useState<UserChoice | null>(null)
  const [error, setError] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [savedDecisionId, setSavedDecisionId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Hero textarea ref
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Parallax orb state
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 })

  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  // ─── Draft restoration ──────────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const draft = localStorage.getItem("decision_draft")
      if (draft) {
        setDecision(draft)
        setFlowState("questions")
        localStorage.removeItem("decision_draft")
      }
    } else if (isLoaded && !isSignedIn) {
      const draft = localStorage.getItem("decision_draft")
      if (draft) {
        setDecision(draft)
      }
    }
  }, [isLoaded, isSignedIn])

  // ─── Loading message cycling ────────────────────────────────────────────
  useEffect(() => {
    if (flowState === "simulating") {
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % simulationLoadingMessages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [flowState])

  // ─── Cursor parallax (hero orbs) ───────────────────────────────────────
  useEffect(() => {
    if (flowState !== "input") return
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      setOrbOffset({ x: dx * 30, y: dy * 30 })
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [flowState])

  // ─── Scroll reveal (Intersection Observer) ─────────────────────────────
  useEffect(() => {
    if (flowState !== "input") return
    const els = document.querySelectorAll(".scroll-reveal")
    if (!els.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [flowState])

  // ─── Handlers (unchanged) ──────────────────────────────────────────────
  const handleStartFlow = async (query: string) => {
    if (!isSignedIn) {
      localStorage.setItem("decision_draft", query)
      openSignIn({
        appearance: {
          elements: {
            footerAction: { display: "none" },
          },
        },
      })
      return
    }
    setDecision(query)
    setError("")
    setFlowState("questions")
  }

  const handleQuestionsComplete = async (completedAnswers: QuestionAnswer[]) => {
    setAnswers(completedAnswers)
    setFlowState("simulating")

    try {
      const res = await fetch("/api/simulate-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers: completedAnswers }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate simulations")
      }

      const data = await res.json()
      setSimulations(data)
      setFlowState("simulation")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate simulations")
      setFlowState("questions")
    }
  }

  const handleSimulationComplete = async () => {
    setFlowState("simulating")

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers, simulations }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate flashcards")
      }

      const data = await res.json()
      setFlashcards(data)
      setFlowState("flashcards")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate flashcards")
      setFlowState("simulation")
    }
  }

  const handleFlashcardsComplete = () => {
    setFlowState("decision")
  }

  const handleDecision = async (choice: UserChoice) => {
    setUserChoice(choice)

    if (isSignedIn && simulations && flashcards) {
      try {
        const res = await fetch("/api/save-decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            decision,
            answers,
            simulations,
            flashcards,
            userChoice: choice,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          if (res.status === 429 && data.error === "rate_limit_exceeded") {
            setError(data.message)
            return
          }
          console.error("Failed to save decision")
          setError(data.error || "Failed to save decision. Please check your connection.")
          return
        }

        const data = await res.json()
        if (data.decisionId) {
          setSavedDecisionId(data.decisionId)
        }
      } catch (err) {
        console.error("Save error:", err)
        setError("Network error. Could not save decision.")
        return
      }
    }

    setFlowState("saved")

    setTimeout(() => {
      setShowFeedback(true)
    }, 2000)
  }

  const handleReset = () => {
    setFlowState("input")
    setDecision("")
    setAnswers([])
    setSimulations(null)
    setFlashcards(null)
    setUserChoice(null)
    setError("")
    setSavedDecisionId(null)
    setShowFeedback(false)
  }

  const handleBackToQuestions = () => {
    setFlowState("questions")
  }

  const handleSubmitHero = useCallback(() => {
    if (!decision.trim()) return
    handleStartFlow(decision)
  }, [decision, isSignedIn])

  const fillTextarea = (text: string) => {
    setDecision(text)
    textareaRef.current?.focus()
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--bg-base)] relative overflow-x-hidden">
      <Navbar />

      <div className="relative w-full">
        <AnimatePresence mode="wait">
          {/* ═══════════════ INPUT STATE — Dark Oracle Homepage ═══════════════ */}
          {flowState === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* ─── HERO SECTION ─────────────────────────────────────────── */}
              <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 noise-overlay scanlines overflow-hidden">
                {/* Orb 1: moves OPPOSITE to cursor */}
                <div
                  className="pointer-events-none absolute w-[700px] h-[700px] rounded-full opacity-100"
                  style={{
                    background: "radial-gradient(circle, rgba(124,92,191,0.12) 0%, transparent 70%)",
                    left: "50%",
                    top: "40%",
                    transform: `translate(calc(-50% + ${-orbOffset.x}px), calc(-50% + ${-orbOffset.y}px))`,
                    transition: "transform 0.3s ease-out",
                  }}
                />
                {/* Orb 2: moves WITH cursor, smaller & slower */}
                <div
                  className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-100"
                  style={{
                    background: "radial-gradient(circle, rgba(157,125,232,0.08) 0%, transparent 70%)",
                    left: "55%",
                    top: "35%",
                    transform: `translate(calc(-50% + ${orbOffset.x * 0.5}px), calc(-50% + ${orbOffset.y * 0.5}px))`,
                    transition: "transform 0.5s ease-out",
                  }}
                />

                {/* Content (above overlays) */}
                <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                  {/* Welcome message or pill label */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {isLoaded && user ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-[var(--font-dm-mono)] tracking-widest uppercase mb-8">
                        Welcome back, {user.firstName || user.username}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-[var(--font-dm-mono)] tracking-widest uppercase mb-8">
                        AI-Powered Decision Clarity
                      </span>
                    )}
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    className="font-[var(--font-playfair)] text-[var(--text-primary)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight mb-8"
                  >
                    Regret is better
                    <br />
                    <span
                      className="font-[var(--font-playfair)] italic gradient-text-oracle inline-block mt-1"
                      style={{
                        fontSize: "110%",
                        filter: "drop-shadow(0 0 30px rgba(124,92,191,0.3))",
                      }}
                    >
                      simulated.
                    </span>
                  </motion.h1>

                  {/* Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.6 }}
                    className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12"
                  >
                    Logic lies. Emotion doesn&apos;t.
                    <br className="hidden sm:block" />
                    Experience the future consequences of your choice before you make it.
                  </motion.p>

                  {/* Textarea + Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.6 }}
                    className="w-full max-w-[680px]"
                  >
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        className="oracle-textarea"
                        placeholder="e.g. Should I quit my job to start a bakery?"
                        value={decision}
                        onChange={e => setDecision(e.target.value.slice(0, 300))}
                        rows={4}
                      />
                      <span className="absolute bottom-3 right-4 text-[var(--text-muted)] text-xs font-[var(--font-dm-mono)]">
                        {decision.length} / 300
                      </span>
                    </div>

                    <button
                      onClick={handleSubmitHero}
                      disabled={!decision.trim()}
                      className="shimmer-btn mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white font-bold tracking-[0.2em] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_60px_rgba(124,92,191,0.5)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                      SIMULATE REGRET
                    </button>

                    {error && (
                      <p className="text-red-400 mt-4 text-sm text-center">{error}</p>
                    )}
                  </motion.div>
                </div>
              </section>

              {/* ─── DECISION GRAVEYARD ────────────────────────────────────── */}
              <section className="relative py-16 px-6 overflow-hidden">
                <p className="text-center text-[var(--text-muted)] text-[10px] font-[var(--font-dm-mono)] tracking-[0.35em] uppercase mb-8">
                  Being simulated right now
                </p>

                {/* Row 1 — scrolling left */}
                <div className="ticker-mask mb-4 overflow-hidden">
                  <div className="ticker-left flex gap-3 w-max">
                    {[...tickerRow1, ...tickerRow1].map((d, i) => (
                      <button
                        key={`r1-${i}`}
                        onClick={() => fillTextarea(d)}
                        className="shrink-0 px-5 py-2.5 rounded-full bg-[rgba(124,92,191,0.08)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm whitespace-nowrap hover:border-[var(--border-glow)] hover:text-[var(--text-primary)] transition-all duration-300 cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2 — scrolling right */}
                <div className="ticker-mask overflow-hidden">
                  <div className="ticker-right flex gap-3 w-max">
                    {[...tickerRow2, ...tickerRow2].map((d, i) => (
                      <button
                        key={`r2-${i}`}
                        onClick={() => fillTextarea(d)}
                        className="shrink-0 px-5 py-2.5 rounded-full bg-[rgba(124,92,191,0.08)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm whitespace-nowrap hover:border-[var(--border-glow)] hover:text-[var(--text-primary)] transition-all duration-300 cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
              <section className="relative py-24 px-6">
                <div className="max-w-5xl mx-auto">
                  <div className="scroll-reveal text-center mb-16">
                    <p className="text-[var(--text-muted)] text-[10px] font-[var(--font-dm-mono)] tracking-[0.35em] uppercase mb-4">
                      How it works
                    </p>
                    <h2 className="font-[var(--font-playfair)] text-[var(--text-primary)] text-3xl md:text-4xl font-light">
                      Three steps to clarity
                    </h2>
                  </div>

                  <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map(step => {
                      const Icon = step.icon
                      return (
                        <div
                          key={step.num}
                          className="oracle-card relative rounded-2xl p-8 bg-[rgba(15,15,20,0.6)] backdrop-blur-sm border border-[rgba(124,92,191,0.1)] overflow-hidden"
                        >
                          {/* Top accent line */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c5cbf] to-transparent" />

                          <span className="block font-[var(--font-dm-mono)] text-[#2a2535] text-5xl font-bold mb-6">
                            {step.num}
                          </span>
                          <div className="w-10 h-10 rounded-lg bg-[rgba(124,92,191,0.12)] flex items-center justify-center mb-5">
                            <Icon className="w-5 h-5 text-[var(--accent-glow)]" />
                          </div>
                          <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-3">
                            {step.title}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* ─── SOCIAL PROOF STRIP ────────────────────────────────────── */}
              <section className="scroll-reveal py-16 px-6">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[var(--text-muted)] font-[var(--font-dm-mono)] text-sm tracking-wide">
                  <span>
                    <strong className="text-[var(--text-secondary)]">2,847</strong> decisions simulated
                  </span>
                  <span className="hidden sm:inline text-[var(--text-muted)]">·</span>
                  <span>
                    <strong className="text-[var(--text-secondary)]">1,203</strong> regrets avoided
                  </span>
                  <span className="hidden sm:inline text-[var(--text-muted)]">·</span>
                  <span>
                    <strong className="text-[var(--text-secondary)]">4,912</strong> paths explored
                  </span>
                </div>
              </section>

              {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
              <section className="relative py-32 px-6 overflow-hidden">
                {/* Background orb */}
                <div className="pointer-events-none absolute w-[600px] h-[600px] rounded-full left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4" style={{ background: "radial-gradient(circle, rgba(124,92,191,0.1) 0%, transparent 70%)" }} />

                <div className="scroll-reveal relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                  <h2 className="font-[var(--font-playfair)] text-[var(--text-primary)] text-4xl md:text-5xl font-light leading-tight mb-6">
                    Stop guessing.
                    <br />
                    <span className="gradient-text-oracle">Start seeing.</span>
                  </h2>
                  <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-md">
                    Your future self already knows. Time to listen.
                  </p>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" })
                      setTimeout(() => textareaRef.current?.focus(), 600)
                    }}
                    className="shimmer-btn px-10 py-4 rounded-xl bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white font-bold tracking-[0.15em] text-sm hover:shadow-[0_0_60px_rgba(124,92,191,0.5)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  >
                    Simulate your first decision →
                  </button>
                </div>
              </section>

              {/* ─── FOOTER SPACER ─────────────────────────────────────────── */}
              <div className="h-8" />
            </motion.div>
          )}

          {/* ═══════════════ QUESTIONS STATE ═══════════════ */}
          {flowState === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center min-h-screen p-6 md:p-24"
            >
              <QuestionFlow
                decision={decision}
                onComplete={handleQuestionsComplete}
                onBack={handleReset}
              />
            </motion.div>
          )}

          {/* ═══════════════ SIMULATING STATE (Loading) ═══════════════ */}
          {flowState === "simulating" && (
            <motion.div
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-screen space-y-6 p-6"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] flex items-center justify-center"
              >
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-[var(--text-primary)] text-xl font-light">
                  {simulationLoadingMessages[messageIndex]}
                </p>
                <p className="text-[var(--text-muted)] text-sm">Usually takes 10-15 seconds</p>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ SIMULATION STATE ═══════════════ */}
          {flowState === "simulation" && simulations && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center min-h-screen p-6 md:p-24"
            >
              <DualPathSimulation
                simulations={simulations}
                onContinue={handleSimulationComplete}
              />
            </motion.div>
          )}

          {/* ═══════════════ FLASHCARDS STATE ═══════════════ */}
          {flowState === "flashcards" && flashcards && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center min-h-screen p-6 md:p-24"
            >
              <FlashcardViewer
                flashcards={flashcards}
                onComplete={handleFlashcardsComplete}
              />
            </motion.div>
          )}

          {/* ═══════════════ DECISION STATE ═══════════════ */}
          {flowState === "decision" && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center min-h-screen p-6 md:p-24"
            >
              <DecisionPrompt
                onDecide={handleDecision}
                isAuthenticated={isSignedIn || false}
              />
            </motion.div>
          )}

          {/* ═══════════════ SAVED STATE ═══════════════ */}
          {flowState === "saved" && userChoice && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center min-h-screen p-6 md:p-24"
            >
              <SaveConfirmation
                decision={decision}
                userChoice={userChoice}
                onStartNew={handleReset}
                onViewDashboard={() => router.push("/dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback Popup */}
      {savedDecisionId && (
        <FeedbackPopup
          decisionId={savedDecisionId}
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </main>
  )
}
