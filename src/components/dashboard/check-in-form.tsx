"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

interface CheckInFormProps {
  decisionId: string
  currentStatus: string
  onCheckInComplete: (checkIn: any) => void
}

export function CheckInForm({ decisionId, currentStatus, onCheckInComplete }: CheckInFormProps) {
  const [reflection, setReflection] = useState("")
  const [status, setStatus] = useState(currentStatus || "active")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reflection.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/decisions/${decisionId}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reflection,
          status
        })
      })

      if (!res.ok) throw new Error("Failed to check in")

      const data = await res.json()
      onCheckInComplete(data.checkIn)
      setReflection("")
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">How is it going? (Be honest)</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="I'm feeling..."
          className="w-full h-32 bg-[#1a1a1e] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#8B6FD4]/50 resize-none transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Current Status</label>
        <div className="flex flex-wrap gap-2">
          {["active", "resolved", "regret", "glad"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                status === s
                  ? "bg-[#8B6FD4]/20 border-[#8B6FD4] text-[#B794F4]"
                  : "bg-transparent border-gray-700 text-gray-500 hover:border-gray-500"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !reflection.trim()}
        className="w-full bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-xl py-6 hover:shadow-[0_0_20px_rgba(139,111,212,0.3)] transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Record Check-in
            <Send className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  )
}
