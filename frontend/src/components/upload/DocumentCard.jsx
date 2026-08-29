import { motion } from "framer-motion";
import { FileText, X, ArrowRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import GradientButton from "../ui/GradientButton";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentCard({ file, onRemove, onConfirm, error }) {
  const ext = file.name.split(".").pop().toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-violet/25 to-brown/25 border border-white/10 flex items-center justify-center">
            <FileText size={20} className="text-violet" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-faint font-mono">
              <span>{ext}</span>
              <span>·</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          </div>
          <button
            onClick={onRemove}
            aria-label="Remove file"
            className="text-text-faint hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <div className="mt-4">
          <GradientButton onClick={onConfirm} className="w-full">
            {error ? "Retry processing" : "Process document"}
            <ArrowRight size={15} />
          </GradientButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
