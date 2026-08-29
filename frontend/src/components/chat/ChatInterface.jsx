import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import QuestionInput from "./QuestionInput";

export default function ChatInterface({ messages, asking, askError, onAsk }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard glow className="flex flex-col h-[560px] p-5">
        <div className="flex-1 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet to-brown flex items-center justify-center shadow-[0_0_36px_-6px_rgba(139,92,246,0.7)] mb-4"
              >
                <Sparkles size={22} className="text-white" />
              </motion.div>
              <p className="font-display text-xl font-semibold">Your knowledge is ready.</p>
              <p className="text-sm text-text-soft mt-1">What would you like to discover?</p>
              <SuggestedQuestions onSelect={onAsk} />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {asking && (
                <div className="flex items-center gap-1.5 text-text-faint text-sm pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce [animation-delay:-0.1s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" />
                </div>
              )}
              {askError && <p className="text-danger text-sm">{askError}</p>}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-white/5">
          <QuestionInput onSend={onAsk} disabled={asking} loading={asking} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
