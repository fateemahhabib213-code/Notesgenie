import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import SourceCard from "./SourceCard";
import StatusDot from "../ui/StatusDot";
import ReactMarkdown from "react-markdown";

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%] text-right">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-[11px] text-text-faint">{formatTime(message.timestamp)}</span>
            <span className="text-[11px] text-text-soft font-medium">You</span>
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <User size={11} className="text-text-soft" />
            </span>
          </div>
          <div className="inline-block px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-left rounded-2xl rounded-br-md bg-gradient-to-r from-violet to-brown text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.6)]">
            {message.content}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet to-brown flex items-center justify-center">
            <Sparkles size={11} className="text-white" />
          </span>
          <span className="text-[11px] font-mono tracking-wide text-text-soft">
            NOTESGENIE AI
          </span>
          <StatusDot color="success" />
          <span className="text-[11px] text-text-faint ml-auto">
            {formatTime(message.timestamp)}
          </span>
        </div>
            <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed">
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-lg font-semibold text-white mb-3">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-base font-semibold text-white mb-2 mt-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-semibold text-white mb-2 mt-3">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="mb-3 last:mb-0 text-text-soft">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc pl-5 mb-3 space-y-1 text-text-soft">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal pl-5 mb-3 space-y-1 text-text-soft">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="pl-1">
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-white">
          {children}
        </strong>
      ),
      code: ({ children }) => (
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-violet-200">
          {children}
        </code>
      ),
    }}
  >
    {message.content}
  </ReactMarkdown>
</div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-mono tracking-wide text-text-faint mb-2 uppercase">
              Evidence &amp; Sources
            </p>
            <div className="flex flex-col gap-1.5">
              {message.sources.map((s, idx) => (
                <SourceCard source={s} index={idx} key={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
