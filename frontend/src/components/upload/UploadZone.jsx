import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, AlertCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const ALLOWED_EXTENSIONS = [".pdf", ".txt"];

function isValidFile(file) {
  const name = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function UploadZone({ onFileSelected }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    if (!isValidFile(file)) {
      setError(`"${file.name}" isn't supported. Please upload a PDF or TXT file.`);
      return;
    }
    setError("");
    onFileSelected(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <GlassCard glow className="p-1">
        <div className="rounded-[14px] bg-gradient-to-br from-violet/10 via-transparent to-brown/15 p-1">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-14 text-center cursor-pointer transition-all ${
              error
                ? "border-danger/50 bg-danger/5"
                : dragActive
                ? "border-violet bg-violet/10 scale-[1.01]"
                : "border-white/15 hover:border-violet/40 hover:bg-white/[0.02]"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet/25 to-brown/25 border border-white/10 flex items-center justify-center shadow-[0_0_30px_-4px_rgba(139,92,246,0.5)]">
              <UploadCloud size={26} className="text-violet" />
            </div>
            <div>
              <p className="font-display font-medium text-lg">
                Drop your knowledge here
              </p>
              <p className="text-sm text-text-soft mt-1 max-w-xs mx-auto">
                Upload a PDF or TXT file and let NotesGenie turn it into an
                intelligent knowledge base.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-text-soft">
                PDF
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-text-soft">
                TXT
              </span>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1">
                <AlertCircle size={13} />
                {error}
              </p>
            )}

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
