"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DecisionInputProps {
  onSimulate: (query: string) => void
  isSimulating: boolean
  initialValue?: string
}

export function DecisionInput({ onSimulate, isSimulating, initialValue = "" }: DecisionInputProps) {
  const [query, setQuery] = useState(initialValue)

  // Sync state if initialValue changes (e.g. loaded from draft)
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue)
    }
  }, [initialValue])

  const handleSubmit = () => {
    if (!query.trim()) return
    onSimulate(query)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-normal text-center text-gray-500 tracking-wide">
          What are you hesitating about?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="e.g. Should I quit my job to start a bakery?"
          className="min-h-[160px] text-lg p-6 bg-[#111113] border border-[#2a2a2e] rounded-2xl text-white placeholder:text-[#4a4a50] resize-none focus-visible:ring-0 focus-visible:border-[#8B6FD4] focus-visible:shadow-[0_0_15px_rgba(139,111,212,0.15)] transition-all duration-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-right text-xs text-[#4a4a50] font-mono">
          {query.length} / 300 CHARACTERS
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button 
            size="lg" 
            className="w-full sm:w-auto px-10 py-7 text-base font-bold tracking-widest bg-gradient-to-r from-[#8B6FD4] to-[#B794F4] text-white rounded-xl shadow-[0_0_20px_rgba(139,111,212,0.3)] hover:shadow-[0_0_30px_rgba(139,111,212,0.5)] hover:scale-[1.02] transition-all duration-200 border-none"
            onClick={handleSubmit}
            disabled={isSimulating || !query.trim()}
        >
            {isSimulating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SIMULATING...
                </>
            ) : (
                "SIMULATE REGRET"
            )}
        </Button>
      </CardFooter>
    </Card>
  )
}
