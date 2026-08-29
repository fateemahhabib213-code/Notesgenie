import { useRef, useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

export default function QuestionInput({ onSend, disabled, loading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className={`flex items-end gap-2 rounded-2xl border bg-white/[0.04] backdrop-blur-xl p-2 pl-4 transition-shadow ${
        disabled
          ? "border-white/5"
          : "border-white/10 focus-within:border-violet/40 focus-within:shadow-[0_0_24px_-6px_rgba(139,92,246,0.5)]"
      }`}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={
          disabled ? "Upload a document first" : "Ask anything about your document…"
        }
        className="flex-1 resize-none bg-transparent text-sm py-2 outline-none placeholder:text-text-faint disabled:cursor-not-allowed max-h-[120px]"
      />
      {!disabled && (
        <span className="hidden sm:flex items-center text-[10px] font-mono text-text-faint px-1.5 py-1 rounded-md border border-white/10 mb-1.5">
          Enter ↵
        </span>
      )}
      <button
        onClick={handleSend}
        disabled={disabled || loading || !value.trim()}
        aria-label="Send question"
        className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-r from-violet to-brown text-white flex items-center justify-center shadow-[0_4px_16px_-4px_rgba(139,92,246,0.6)] disabled:opacity-30 disabled:shadow-none transition-all active:translate-y-px"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
      </button>
    </div>
  );
}
