import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import AnimatedBackground from "./components/ui/AnimatedBackground";
import Sidebar from "./components/layout/Sidebar";
import MobileTopBar from "./components/layout/MobileTopBar";
import Header from "./components/layout/Header";
import UploadFlow from "./components/upload/UploadFlow";
import ChatInterface from "./components/chat/ChatInterface";
import IntelligencePanel from "./components/panels/IntelligencePanel";
import DocumentView from "./components/panels/DocumentView";
import HowItWorks from "./components/panels/HowItWorks";

import { useNotesGenie } from "./hooks/useNotesGenie";

export default function App() {
  const [activeView, setActiveView] = useState("ask");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    docInfo,
    uploadState,
    uploadError,
    upload,
    reset,
    messages,
    asking,
    askError,
    ask,
    isReady,
  } = useNotesGenie();

  function handleChangeView(view) {
    setActiveView(view);
    setMobileSidebarOpen(false);
  }

  function handleReplace() {
    reset();
    setActiveView("ask");
  }

  return (
    <div className="min-h-screen flex">
      <AnimatedBackground />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 h-screen sticky top-0">
        <Sidebar activeView={activeView} onChangeView={handleChangeView} isReady={isReady} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 border-r border-white/10 bg-bg-elevated lg:hidden"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-text-faint"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <Sidebar
                activeView={activeView}
                onChangeView={handleChangeView}
                isReady={isReady}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar onOpenSidebar={() => setMobileSidebarOpen(true)} />

        <div className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8">
          <AnimatePresence mode="wait">
            {activeView === "ask" && (
              <motion.div
                key="ask"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-[1fr_280px] gap-8 items-start"
              >
                <div className="min-w-0">
                  <Header />
                  {isReady ? (
                    <ChatInterface
                      messages={messages}
                      asking={asking}
                      askError={askError}
                      onAsk={ask}
                    />
                  ) : (
                    <UploadFlow
                      onUpload={upload}
                      uploadState={uploadState}
                      uploadError={uploadError}
                    />
                  )}
                </div>
                <div className="hidden lg:block">
                  <IntelligencePanel docInfo={docInfo} isReady={isReady} />
                </div>
              </motion.div>
            )}

            {activeView === "document" && (
              <motion.div
                key="document"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DocumentView docInfo={docInfo} onReplace={handleReplace} />
              </motion.div>
            )}

            {activeView === "how" && (
              <motion.div
                key="how"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HowItWorks />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
