"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { detectDevice, DeviceType } from "@/lib/device-detection";

const KeyboardShortcutHint = () => {
  const [device, setDevice] = useState<DeviceType>("unknown");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setDevice(detectDevice());

    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show on mobile
  if (device === "mobile" || device === "unknown") {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
        >
          <div className="bg-white/40 backdrop-blur-lg border border-white/60 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm text-slate-700">
            <span className="text-xs">Use</span>
            {device === "mac" ? (
              <>
                <kbd className="px-2 py-1 bg-white/60 border border-white/80 rounded text-xs font-medium shadow-sm">
                  ⌘
                </kbd>
                <span className="text-xs">+</span>
                <kbd className="px-2 py-1 bg-white/60 border border-white/80 rounded text-xs font-medium shadow-sm">
                  K
                </kbd>
              </>
            ) : (
              <>
                <kbd className="px-2 py-1 bg-white/60 border border-white/80 rounded text-xs font-medium shadow-sm">
                  Ctrl
                </kbd>
                <span className="text-xs">+</span>
                <kbd className="px-2 py-1 bg-white/60 border border-white/80 rounded text-xs font-medium shadow-sm">
                  K
                </kbd>
              </>
            )}
            <span className="text-xs">to search</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutHint;
