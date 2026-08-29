import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadZone from "./UploadZone";
import DocumentCard from "./DocumentCard";
import ProcessingPipeline from "./ProcessingPipeline";

export default function UploadFlow({ onUpload, uploadState, uploadError }) {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleConfirm() {
    if (selectedFile) await onUpload(selectedFile);
  }

  function handleRemove() {
    setSelectedFile(null);
  }

  return (
    <AnimatePresence mode="wait">
      {!selectedFile && (
        <motion.div key="zone" exit={{ opacity: 0 }}>
          <UploadZone onFileSelected={setSelectedFile} />
        </motion.div>
      )}

      {selectedFile && (uploadState === "idle" || uploadState === "error") && (
        <motion.div key="card" exit={{ opacity: 0 }}>
          <DocumentCard
            file={selectedFile}
            onRemove={handleRemove}
            onConfirm={handleConfirm}
            error={uploadState === "error" ? uploadError : ""}
          />
        </motion.div>
      )}

      {selectedFile && uploadState === "uploading" && (
        <motion.div key="pipeline" exit={{ opacity: 0 }}>
          <ProcessingPipeline status="running" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
