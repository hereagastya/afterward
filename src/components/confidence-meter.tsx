import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AnalysisResult, DualPathSimulation } from "@/lib/types";
import { MysticalBookViewer } from "@/components/simulation/mystical-book-viewer";

interface ConfidenceMeterProps {
  analysis: AnalysisResult;
  simulations?: DualPathSimulation | null;
  onContinue: () => void;
  onCheckout: () => void;
}

export function ConfidenceMeter({ analysis, simulations, onContinue, onCheckout }: ConfidenceMeterProps) {
  const {
    clarityScore,
    fearLevel,
    logicLevel,
    gutLevel,
    redFlags,
    prediction,
    predictionConfidence,
    reasoning,
    emotionalState,
  } = analysis;

  const searchParams = useSearchParams();
  const isPaid = searchParams?.get("payment") === "success" || (analysis && analysis.isLocked === false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 border border-purple-500/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-[var(--font-playfair)] text-white mb-3">
                Your Decision DNA 🧬
              </h2>
              {emotionalState && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-purple-300 text-sm italic"
                >
                  {emotionalState}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Limited view – always visible */}
          <div className="text-center mb-6">
            <p className="text-lg text-white">Clarity: {clarityScore}%</p>
            <p className="text-sm text-gray-300">
              Fear: {fearLevel}% | Logic: {logicLevel}% | Gut: {gutLevel}%
            </p>
          </div>

          {/* Full content – behind paywall */}
          <div className="relative">
            <div className={isPaid ? "" : "blur-sm opacity-50"}>
              {/* Red Flags */}
              {redFlags && redFlags.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-4"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">Red Flags</h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Prediction */}
              {prediction && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-4 text-center"
                >
                  <p className="text-purple-400 text-sm font-mono">
                    Prediction: {prediction.toUpperCase()} ({predictionConfidence}%)
                  </p>
                  {reasoning && <p className="text-gray-300 italic mt-1">{reasoning}</p>}
                </motion.div>
              )}

              {/* Timeline Preview (only when not paid) */}
              {!isPaid && simulations && (
                <div className="pointer-events-none select-none my-6 w-full h-[320px] overflow-hidden relative rounded-xl border border-purple-500/10">
                  <div className="scale-75 origin-top -mt-10">
                    <MysticalBookViewer
                      simulations={simulations}
                      onComplete={() => {}}
                      interactive={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Paywall overlay */}
            {!isPaid && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center max-w-sm border border-purple-500/30">
                  <h2 className="text-2xl font-bold mb-3 text-white">Unlock your full simulation</h2>
                  <p className="text-gray-200 mb-4 text-sm">
                    Full psychological breakdown, predicted choice, red flags, 6‑month & 1‑year scenarios for both paths, and trade‑offs.
                  </p>
                  <button
                    onClick={onCheckout}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition"
                  >
                    Continue & Pay
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Continue button – only after payment */}
          {isPaid && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center"
            >
              <button onClick={onContinue} className="btn-mystical w-full text-lg py-4">
                Let’s see if we’re right →
              </button>
              <p className="text-gray-500 text-xs mt-3">Generating your timelines...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
