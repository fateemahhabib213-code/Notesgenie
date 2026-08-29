import { Menu, Sparkles } from "lucide-react";

export default function MobileTopBar({ onOpenSidebar }) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet to-brown flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="font-display font-semibold text-sm">NotesGenie</span>
      </div>
      <button
        onClick={onOpenSidebar}
        aria-label="Open menu"
        className="text-text-soft hover:text-text"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
