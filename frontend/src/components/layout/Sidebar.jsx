import { motion } from "framer-motion";
import { MessageSquare, FileText, Compass, Sparkles, ShieldCheck } from "lucide-react";
import StatusDot from "../ui/StatusDot";

const NAV_ITEMS = [
  { id: "ask", label: "Ask AI", icon: MessageSquare },
  { id: "document", label: "My Document", icon: FileText },
  { id: "how", label: "How It Works", icon: Compass },
];

export default function Sidebar({ activeView, onChangeView, isReady }) {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-brown flex items-center justify-center shadow-[0_4px_16px_-2px_rgba(139,92,246,0.6)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            NotesGenie
          </span>
        </div>
        <div className="mb-8 ml-1">
          <span className="text-[10px] tracking-widest text-text-faint font-mono uppercase">
            AI Document Intelligence
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const disabled = item.id === "document" && !isReady;
            return (
              <button
                key={item.id}
                onClick={() => !disabled && onChangeView(item.id)}
                disabled={disabled}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  isActive ? "text-white" : "text-text-soft hover:text-text"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet/25 to-brown/25 border border-white/10 shadow-[0_0_20px_-4px_rgba(139,92,246,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={17} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <StatusDot color="success" />
          <span className="text-[11px] font-mono tracking-wide text-text-soft">
            AI SYSTEM ONLINE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-faint">
          <ShieldCheck size={12} />
          <span>Your document is private</span>
        </div>
      </div>
    </div>
  );
}
