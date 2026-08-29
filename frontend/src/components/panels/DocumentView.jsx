import { motion } from "framer-motion";
import { FileText, RefreshCw } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import GradientButton from "../ui/GradientButton";
import StatusDot from "../ui/StatusDot";

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentView({ docInfo, onReplace }) {
  if (!docInfo) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-text-soft text-sm">No document uploaded yet.</p>
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard glow className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-violet/25 to-brown/25 border border-white/10 flex items-center justify-center">
            <FileText size={24} className="text-violet" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-lg truncate">{docInfo.filename}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-success">
              <StatusDot color="success" />
              Knowledge base ready
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Type" value={docInfo.fileType?.replace(".", "").toUpperCase()} />
          <Stat label="Size" value={formatBytes(docInfo.sizeBytes)} />
          <Stat label="Characters" value={docInfo.characterCount?.toLocaleString()} />
          <Stat label="Vector store" value="ChromaDB" />
        </div>

        <GradientButton variant="ghost" onClick={onReplace}>
          <RefreshCw size={14} />
          Replace document
        </GradientButton>
      </GlassCard>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-mono uppercase tracking-wide text-text-faint mb-1">
        {label}
      </p>
      <p className="text-sm font-medium truncate">{value || "—"}</p>
    </div>
  );
}
