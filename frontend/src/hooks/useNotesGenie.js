import { useState, useCallback } from "react";
import { uploadDocument, askQuestion } from "../api/notesApi";

export function useNotesGenie() {
  const [docInfo, setDocInfo] = useState(null);
  const [uploadState, setUploadState] = useState("idle"); // idle | uploading | success | error
  const [uploadError, setUploadError] = useState("");

  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");

  const upload = useCallback(async (file) => {
    setUploadState("uploading");
    setUploadError("");
    try {
      const result = await uploadDocument(file);
      setDocInfo({
        filename: result.filename,
        fileType: result.file_type,
        sizeBytes: result.size_bytes,
        characterCount: result.character_count,
        message: result.message,
      });
      setUploadState("success");
      setMessages([]);
      return true;
    } catch (err) {
      setUploadError(err.message);
      setUploadState("error");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setDocInfo(null);
    setUploadState("idle");
    setUploadError("");
    setMessages([]);
    setAskError("");
  }, []);

  const ask = useCallback(async (question) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, id: crypto.randomUUID(), timestamp: Date.now() },
    ]);
    setAsking(true);
    setAskError("");

    try {
      const result = await askQuestion(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setAskError(err.message);
    } finally {
      setAsking(false);
    }
  }, []);

  return {
    docInfo,
    uploadState,
    uploadError,
    upload,
    reset,
    messages,
    asking,
    askError,
    ask,
    isReady: uploadState === "success" && !!docInfo,
  };
}
