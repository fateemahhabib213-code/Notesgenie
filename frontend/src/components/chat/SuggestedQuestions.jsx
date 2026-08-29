import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const QUESTIONS = [
  "What are the key ideas?",
  "Summarize the most important points.",
  "What information should I pay attention to?",
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mt-5">
      {QUESTIONS.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
          onClick={() => onSelect(q)}
          className="text-left rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet/30 p-3.5 transition-all group"
        >
          <Sparkles size={13} className="text-violet mb-2 opacity-70 group-hover:opacity-100" />
          <p className="text-xs text-text-soft group-hover:text-text leading-relaxed">{q}</p>
        </motion.button>
      ))}
    </div>
  );
}
