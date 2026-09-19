"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSignature from "./AnimatedSignature";

// Long enough for the signature to finish being written before the loader lifts.
const DURATION = 2400;
const EXIT_PAUSE = 400;
const SIGNATURE_DELAY = 0.15;
const SIGNATURE_DURATION = 2.2;

export default function LoadingScreen() {
  // Default to visible so the very first paint (SSR + hydration) is the
  // loader, not the page underneath — avoids a flash of home page content
  // before the loading screen appears.
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // Show only once per session
  useEffect(() => {
    if (sessionStorage.getItem("booted")) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem("booted", "1");
  }, []);

  // Progress driver: eased 0 → 100, then fade out
  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    let done: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        done = setTimeout(() => setVisible(false), EXIT_PAUSE);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          id="app-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.25rem",
            padding: "1rem",
          }}
        >
          {/* Signature writes itself while the bar fills */}
          <div style={{ width: "clamp(200px, 46vw, 300px)", color: "#18181b" }}>
            <AnimatedSignature delay={SIGNATURE_DELAY} duration={SIGNATURE_DURATION} />
          </div>

          {/* Loading bar */}
          <div style={{ width: "min(320px, 72vw)" }}>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: "#e4e4e7",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #059669, #22c55e)",
                  boxShadow: "0 0 12px rgba(5,150,105,0.55)",
                  transition: "width 90ms linear",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                fontFamily: "monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#71717a",
              }}
            >
              <span>loading portfolio</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "#059669" }}>
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
