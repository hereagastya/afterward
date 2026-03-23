"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QuestionFlow } from "@/components/simulation/question-flow"
import { SimulationOutput } from "@/components/simulation/simulation-output"
import { DecisionPrompt } from "@/components/simulation/decision-prompt"
import { SaveConfirmation } from "@/components/simulation/save-confirmation"
import { FeedbackPopup } from "@/components/feedback-popup"
import { LimitPopup } from "@/components/limit-popup"
import { Navbar } from "@/components/navbar"
import { UpgradeModal } from "@/components/upgrade-modal"
import { ConfidenceMeter } from "@/components/confidence-meter"
import { PredictionResult } from "@/components/prediction-result"
import { analyzeAnswers } from "@/lib/analyze-answers"
import { ReplayOptInModal } from "@/components/replay-opt-in-modal"
import { 
  FlowState, 
  QuestionAnswer, 
  DualPathSimulationData, 
  FlashcardSet,
  UserChoice,
  AnalysisResult
} from "@/lib/types"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"

import { Target, Zap, Sparkles } from "lucide-react"
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
  const [showLimitPopup, setShowLimitPopup] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showReplayOptIn, setShowReplayOptIn] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [showPredictionResult, setShowPredictionResult] = useState(false)

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

  // ─── Handlers ──────────────────────────────────────────────────────────
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

  const handleQuestionsComplete = (completedAnswers: QuestionAnswer[]) => {
    setAnswers(completedAnswers)
    
    // Generate analysis immediately
    const analysisResult = analyzeAnswers(completedAnswers, decision)
    setAnalysis(analysisResult)
    
    // Show analysis screen
    setFlowState("analysis")
  }

  const handleContinueFromAnalysis = async () => {
    setFlowState("simulating")

    try {
      // 1. Generate simulations
      const simRes = await fetch("/api/simulate-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers }),
      })

      if (simRes.status === 429) {
        setShowUpgradeModal(true)
        setFlowState("input")
        return
      }

      if (!simRes.ok) {
        const errorData = await simRes.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate simulations")
      }

      const simData = await simRes.json()
      setSimulations(simData)

      // 2. Generate flashcards
      const flashRes = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, answers, simulations: simData }),
      })

      if (!flashRes.ok) {
        const errorData = await flashRes.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate flashcards")
      }

      const flashData = await flashRes.json()
      setFlashcards(flashData)

      // Now go to journey with both simulations AND flashcards ready
      setFlowState("simulation")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate simulations")
      setFlowState("questions")
    }
  }

  const handleJourneyComplete = () => {
    setFlowState("decision")
  }

  const handleDecision = async (choice: UserChoice) => {
    setUserChoice(choice)

    // Check if prediction was correct
    if (analysis && (choice === 'go' || choice === 'stay')) {
      setShowPredictionResult(true)
    }

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
            analysis
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
          setShowReplayOptIn(true)
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
    setAnalysis(null)
    setShowPredictionResult(false)
    setError("")
    setSavedDecisionId(null)
    setShowFeedback(false)
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
      {flowState !== "simulation" && <Navbar />}

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

              {/* ─── LIVE DEMO SECTION ──────────────────────────────────── */}
              <section className="relative py-24 px-6 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
                
                <div className="max-w-6xl mx-auto relative z-10">
                  {/* Section header */}
                  <div className="scroll-reveal text-center mb-16">
                    <p className="text-[var(--text-muted)] text-[10px] font-[var(--font-dm-mono)] tracking-[0.35em] uppercase mb-4">
                      See it in action
                    </p>
                    <h2 className="font-[var(--font-playfair)] text-[var(--text-primary)] text-3xl md:text-5xl font-light mb-6">
                      This is what you'll see
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                      A real example: <span className="text-white">"Should I quit my job to start a bakery?"</span>
                    </p>
                  </div>

                  {/* Split comparison cards */}
                  <div className="scroll-reveal grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                    
                    {/* LEFT: If You Go */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative oracle-card rounded-2xl p-8 bg-[rgba(15,15,20,0.8)] backdrop-blur-sm border border-green-500/20 hover:border-green-500/40 transition-all">
                        {/* Badge */}
                        <div className="text-center mb-8">
                          <span className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-mono uppercase tracking-wider">
                            If You Go
                          </span>
                        </div>

                        {/* Timeline moments */}
                        <div className="space-y-6">
                          {/* NOW */}
                          <div className="border-l-2 border-green-500/30 pl-6 hover:border-green-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Now</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">The Leap</h4>
                            <p className="text-gray-400 leading-relaxed">
                              You quit today. Heart racing. No safety net left.
                            </p>
                          </div>

                          {/* 3 MONTHS */}
                          <div className="border-l-2 border-green-500/30 pl-6 hover:border-green-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">3 Months</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">The Grind</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Flour under nails. 4am starts. Barely breaking even.
                            </p>
                          </div>

                          {/* 1 YEAR */}
                          <div className="border-l-2 border-green-500/30 pl-6 hover:border-green-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">1 Year</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">Finding Rhythm</h4>
                            <p className="text-gray-400 leading-relaxed">
                              First profit month. Regulars know your name. Exhausted but alive.
                            </p>
                          </div>

                          {/* 3 YEARS */}
                          <div className="border-l-2 border-green-500/30 pl-6 hover:border-green-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">3 Years</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">Established</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Two locations. Featured in local press. You own something.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: If You Stay */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative oracle-card rounded-2xl p-8 bg-[rgba(15,15,20,0.8)] backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all">
                        {/* Badge */}
                        <div className="text-center mb-8">
                          <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-mono uppercase tracking-wider">
                            If You Stay
                          </span>
                        </div>

                        {/* Timeline moments */}
                        <div className="space-y-6">
                          {/* NOW */}
                          <div className="border-l-2 border-blue-500/30 pl-6 hover:border-blue-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Now</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">The Safe Choice</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Another Monday. Same desk. Paycheck clears Friday.
                            </p>
                          </div>

                          {/* 3 MONTHS */}
                          <div className="border-l-2 border-blue-500/30 pl-6 hover:border-blue-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">3 Months</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">Quiet Erosion</h4>
                            <p className="text-gray-400 leading-relaxed">
                              You stopped baking at home. Too tired. Too numb.
                            </p>
                          </div>

                          {/* 1 YEAR */}
                          <div className="border-l-2 border-blue-500/30 pl-6 hover:border-blue-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">1 Year</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">Comfortable Regret</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Promotion came. More money, less life. You wonder 'what if.'
                            </p>
                          </div>

                          {/* 3 YEARS */}
                          <div className="border-l-2 border-blue-500/30 pl-6 hover:border-blue-500/60 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">3 Years</span>
                              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                            </div>
                            <h4 className="text-white font-semibold text-xl mb-2">The Settled Life</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Good salary. Empty Sundays. That bakery dream feels like another life.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="scroll-reveal text-center">
                    <p className="text-gray-400 mb-6 text-lg">
                      See your own decision play out like this
                    </p>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        setTimeout(() => textareaRef.current?.focus(), 600)
                      }}
                      className="shimmer-btn px-10 py-4 rounded-xl bg-gradient-to-r from-[#7c5cbf] to-[#9d7de8] text-white font-semibold tracking-[0.15em] text-base hover:shadow-[0_0_50px_rgba(124,92,191,0.6)] transition-all cursor-pointer"
                    >
                      Try Your Decision →
                    </button>
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

          {/* ═══════════════ ANALYSIS STATE ═══════════════ */}
          {flowState === "analysis" && analysis && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ConfidenceMeter 
                analysis={analysis}
                onContinue={handleContinueFromAnalysis}
              />
            </motion.div>
          )}

          {/* ═══════════════ SIMULATING STATE — Mystical Loading ═══════════════ */}
          {flowState === "simulating" && (
            <motion.div
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
            >
              {/* Background gradient orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-[800px] h-[800px] bg-purple-500 rounded-full blur-3xl"
                />
              </div>

              {/* Animated gradient line */}
              <div className="relative z-10 w-full max-w-md mb-12">
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                  />
                </div>
              </div>

              {/* Witty loading text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-center space-y-4 px-6"
                >
                  <p className="text-2xl md:text-3xl font-[var(--font-playfair)] text-white">
                    {simulationLoadingMessages[messageIndex]}
                  </p>
                  <p className="text-gray-500 text-sm font-mono">
                    Simulating your regret...
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══════════════ SIMULATION STATE (NEW JOURNEY) ═══════════════ */}
          {flowState === "simulation" && simulations && flashcards && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SimulationOutput
                simulations={simulations}
                flashcards={flashcards}
                onContinue={handleJourneyComplete}
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

      {/* Rate Limit Popup */}
      <LimitPopup
        isOpen={showLimitPopup}
        onClose={() => setShowLimitPopup(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Replay Opt-in Modal */}
      <ReplayOptInModal
        isOpen={showReplayOptIn}
        onClose={() => setShowReplayOptIn(false)}
        decisionId={savedDecisionId || ''}
        decision={decision}
        userChoice={userChoice || 'go'}
      />

      {/* Prediction Result Popup */}
      {showPredictionResult && analysis && userChoice && userChoice !== 'undecided' && (
        <PredictionResult
          wasCorrect={analysis.prediction === userChoice}
          prediction={analysis.prediction}
          actualChoice={userChoice}
          reasoning={analysis.reasoning}
        />
      )}
    </main>
  )
}