import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function SourceCard({ source, index }) {
  const [open, setOpen] = useState(false);
  const score = Math.round(source.score * 100);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-mono text-[11px] w-5 h-5 shrink-0 rounded-full bg-gradient-to-br from-violet to-brown text-white flex items-center justify-center">
          {index + 1}
        </span>
        <span className="text-xs text-text-soft font-mono">chunk {source.chunk_id}</span>
        <span className="flex-1" />
        <span className="text-[11px] font-mono text-violet">{score}% match</span>
        <ChevronDown
          size={14}
          className={`text-text-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3.5 pb-3.5 pt-0.5">
              <div className="rounded-lg border-l-2 border-violet bg-black/20 p-3 font-mono text-xs text-text-soft leading-relaxed">
                {source.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
