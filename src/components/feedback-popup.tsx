"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, CheckCircle, Loader2 } from "lucide-react"

interface FeedbackPopupProps {
  decisionId: string
  isOpen: boolean
  onClose: () => void
}

export function FeedbackPopup({ decisionId, isOpen, onClose }: FeedbackPopupProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setError("")
    setStatus("submitting")

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId, rating, feedback: feedback || undefined }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit feedback")
      }

      setStatus("success")
      setTimeout(() => {
        onClose()
        // Reset state after close animation
        setTimeout(() => {
          setRating(0)
          setFeedback("")
          setStatus("idle")
        }, 300)
      }, 1500)
    } catch {
      setError("Failed to submit. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl p-8"
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 111, 212, 0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center py-8 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </motion.div>
                  <p className="text-white text-lg font-medium">Thank you!</p>
                  <p className="text-gray-400 text-sm">Your feedback helps us improve</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      How was your experience?
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Rate this simulation to help us improve
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <Star
                          className="w-10 h-10 transition-colors duration-200"
                          fill={star <= (hoveredStar || rating) ? "#B794F4" : "transparent"}
                          stroke={star <= (hoveredStar || rating) ? "#B794F4" : "#4a4a5a"}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Any additional thoughts? (optional)"
                      rows={3}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B6FD4]/50 transition-all duration-200"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={status === "submitting" || rating === 0}
                    className="w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: rating > 0
                        ? "linear-gradient(135deg, #8B6FD4, #B794F4)"
                        : "rgba(255, 255, 255, 0.1)",
                      boxShadow: rating > 0 ? "0 4px 20px rgba(139, 111, 212, 0.3)" : "none",
                    }}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
