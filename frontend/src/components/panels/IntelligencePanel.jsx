import { motion } from "framer-motion";
import { Database, Cpu, ArrowRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import StatusDot from "../ui/StatusDot";

const PIPELINE = ["Question", "Embedding", "Top-3 Retrieval", "OpenAI", "Grounded Answer"];

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IntelligencePanel({ docInfo, isReady }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Database size={13} className="text-violet" />
          <p className="text-[11px] font-mono tracking-wide text-text-faint uppercase">
            Document Insights
          </p>
        </div>

        {isReady ? (
          <div className="flex flex-col gap-2.5 text-xs">
            <Row label="Name" value={docInfo.filename} truncate />
            <Row label="Type" value={docInfo.fileType?.replace(".", "").toUpperCase()} />
            <Row label="Size" value={formatBytes(docInfo.sizeBytes)} />
            <Row label="Characters" value={docInfo.characterCount?.toLocaleString()} />
            <div className="flex items-center justify-between pt-1">
              <span className="text-text-faint">Status</span>
              <span className="flex items-center gap-1.5 text-success">
                <StatusDot color="success" /> Ready
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-faint">No document loaded yet.</p>
        )}
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3.5">
          <Cpu size={13} className="text-brown" />
          <p className="text-[11px] font-mono tracking-wide text-text-faint uppercase">
            RAG Pipeline
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {PIPELINE.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="text-xs text-text-soft font-mono">{step}</span>
              {i < PIPELINE.length - 1 && (
                <ArrowRight size={11} className="text-text-faint ml-auto" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Row({ label, value, truncate }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-text-faint shrink-0">{label}</span>
      <span className={`text-text font-mono ${truncate ? "truncate max-w-[140px]" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}
