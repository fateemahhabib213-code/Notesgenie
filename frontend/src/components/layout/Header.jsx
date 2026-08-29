import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-mono tracking-wide text-text-soft mb-4"
      >
        <Sparkles size={11} className="text-violet" />
        POWERED BY RAG INTELLIGENCE
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
      >
        Your documents,
        <br />
        but{" "}
        <span className="bg-gradient-to-r from-violet to-brown bg-clip-text text-transparent">
          finally intelligent.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-3 text-sm sm:text-base text-text-soft max-w-md"
      >
        Upload your knowledge. Ask anything. Get answers grounded in your
        actual content.
      </motion.p>
    </div>
  );
}
