"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TITLE = "ABDULLAH KHAN";
const SCRAMBLE_CHARS = "01{}=>;#/<>[]()abcdefABCDEF";

const DURATION = 1600;
const EXIT_PAUSE = 300;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Show only once per session
  useEffect(() => {
    if (!sessionStorage.getItem("booted")) {
      sessionStorage.setItem("booted", "1");
      setVisible(true);
    }
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

  // Wordmark decodes left-to-right as the bar fills; the not-yet-resolved
  // tail shows scrambling matrix glyphs
  const resolvedCount = Math.floor((progress / 100) * TITLE.length);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
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
          {/* Wordmark */}
          <h1
            aria-label={TITLE}
            style={{
              fontFamily: "var(--font-space-grotesk), monospace",
              fontSize: "clamp(1.3rem, 4.5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              whiteSpace: "pre",
              color: "#18181b",
            }}
          >
            {TITLE.split("").map((char, i) => {
              if (char === " ") return <span key={i}> </span>;
              const isResolved = i < resolvedCount;
              return (
                <span
                  key={i}
                  style={
                    isResolved
                      ? undefined
                      : {
                          fontFamily: "monospace",
                          color: "#059669",
                          opacity: 0.75,
                        }
                  }
                >
                  {isResolved
                    ? char
                    : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]}
                </span>
              );
            })}
          </h1>

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
