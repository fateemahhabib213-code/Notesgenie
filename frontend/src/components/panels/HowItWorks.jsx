import { motion } from "framer-motion";
import {
  Upload,
  Scissors,
  Cpu,
  Database,
  MessageSquare,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const INDEXING = [
  { icon: Upload, title: "Upload", desc: "You add a PDF or TXT file." },
  { icon: Scissors, title: "Chunk", desc: "Split into ~500-token pieces, 50-token overlap." },
  { icon: Cpu, title: "Embed", desc: "Each chunk becomes a vector via OpenAI." },
  { icon: Database, title: "Store", desc: "Vectors are saved in ChromaDB." },
];

const QUERYING = [
  { icon: MessageSquare, title: "Question", desc: "You ask something about the document." },
  { icon: Cpu, title: "Embed", desc: "The question is embedded the same way." },
  { icon: Search, title: "Retrieve", desc: "The top 3 most relevant chunks are found." },
  { icon: Sparkles, title: "Answer", desc: "OpenAI answers using only those chunks." },
];

function Flow({ steps }) {
  return (
    <div className="grid sm:grid-cols-4 gap-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet/25 to-brown/25 border border-white/10 flex items-center justify-center mb-3">
              <Icon size={16} className="text-violet" />
            </div>
            <p className="font-medium text-sm mb-1">{step.title}</p>
            <p className="text-xs text-text-faint leading-relaxed">{step.desc}</p>
            {i < steps.length - 1 && (
              <ArrowRight
                size={14}
                className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-text-faint z-10"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div>
        <h2 className="font-display text-2xl font-semibold mb-1">How NotesGenie works</h2>
        <p className="text-sm text-text-soft max-w-lg">
          A retrieval-augmented generation (RAG) pipeline grounds every answer
          in your actual document — no hallucinated facts.
        </p>
      </div>

      <GlassCard className="p-5">
        <p className="text-[11px] font-mono uppercase tracking-wide text-text-faint mb-4">
          When you upload
        </p>
        <Flow steps={INDEXING} />
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] font-mono uppercase tracking-wide text-text-faint mb-4">
          When you ask a question
        </p>
        <Flow steps={QUERYING} />
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] font-mono uppercase tracking-wide text-text-faint mb-2">
          Why answers stay grounded
        </p>
        <p className="text-sm text-text-soft leading-relaxed">
          The AI is instructed to answer only using the retrieved chunks. If
          the answer isn&apos;t in your document, it says so instead of
          guessing — that&apos;s what keeps every answer trustworthy.
        </p>
      </GlassCard>
    </motion.div>
  );
}
