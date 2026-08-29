import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Scissors, Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const STEPS = [
  { label: "Document Analysis", icon: FileSearch },
  { label: "Semantic Chunking", icon: Scissors },
  { label: "AI Embeddings", icon: Cpu },
  { label: "Knowledge Ready", icon: CheckCircle2 },
];

export default function ProcessingPipeline({ status, error }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (status === "done") {
      setStepIndex(STEPS.length - 1);
      return;
    }
    if (status !== "running") return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 2 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard glow className="p-6">
        <p className="text-sm text-text-soft mb-5 font-mono">
          {status === "error" ? "Processing failed" : "Turning your document into knowledge…"}
        </p>
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < stepIndex || status === "done";
            const isActive = i === stepIndex && status === "running";
            const isError = status === "error" && i === stepIndex;

            return (
              <div key={step.label} className="flex items-start gap-3.5">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-gradient-to-br from-violet to-brown border-transparent"
                        : isError
                        ? "border-danger bg-danger/10"
                        : isActive
                        ? "border-violet bg-violet/10 animate-pulse-soft"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {isError ? (
                      <AlertCircle size={14} className="text-danger" />
                    ) : (
                      <Icon
                        size={14}
                        className={isDone ? "text-white" : isActive ? "text-violet" : "text-text-faint"}
                      />
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-px h-8 ${
                        i < stepIndex || status === "done" ? "bg-gradient-to-b from-violet to-brown" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-sm pt-1.5 pb-6 ${
                    isDone ? "text-text" : isActive ? "text-text" : "text-text-faint"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
        {error && <p className="text-danger text-sm -mt-4">{error}</p>}
      </GlassCard>
    </motion.div>
  );
}
