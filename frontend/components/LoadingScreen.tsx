"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick } from "../lib/sounds";

const BOOT_LINES = [
  { text: "> booting portfolio.exe", tag: null, delay: 0 },
  { text: "> loading [next.js]", tag: "OK", delay: 320 },
  { text: "> loading [framer-motion]", tag: "OK", delay: 260 },
  { text: "> loading [components]", tag: "OK", delay: 290 },
  { text: "> calibrating matrix rain", tag: "OK", delay: 350 },
  { text: "> launching interface", tag: "READY", delay: 400 },
];

const CHAR_DELAY = 32;
const TAG_PAUSE = 180;

interface LineState {
  text: string;
  tag: string | null;
  textDone: boolean;
  tagVisible: boolean;
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<LineState[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [phase, setPhase] = useState<"typing" | "tag" | "next" | "done">("typing");
  const [showCursor, setShowCursor] = useState(true);
  const doneRef = useRef(false);

  // Show only once per session
  useEffect(() => {
    if (!sessionStorage.getItem("booted")) {
      sessionStorage.setItem("booted", "1");
      setVisible(true);
    }
  }, []);

  // Blink cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Typewriter engine
  useEffect(() => {
    if (doneRef.current) return;
    if (currentLine >= BOOT_LINES.length) {
      doneRef.current = true;
      setPhase("done");
      setTimeout(() => setVisible(false), 900);
      return;
    }

    const line = BOOT_LINES[currentLine];

    if (phase === "typing") {
      if (currentChar < line.text.length) {
        const t = setTimeout(() => {
          playClick();
          setLines((prev) => {
            const updated = [...prev];
            if (!updated[currentLine]) {
              updated[currentLine] = { text: "", tag: null, textDone: false, tagVisible: false };
            }
            updated[currentLine] = {
              ...updated[currentLine],
              text: line.text.slice(0, currentChar + 1),
            };
            return updated;
          });
          setCurrentChar((c) => c + 1);
        }, CHAR_DELAY);
        return () => clearTimeout(t);
      } else {
        // Text done
        setLines((prev) => {
          const updated = [...prev];
          if (updated[currentLine]) updated[currentLine].textDone = true;
          return updated;
        });
        if (line.tag) {
          const t = setTimeout(() => setPhase("tag"), TAG_PAUSE);
          return () => clearTimeout(t);
        } else {
          const t = setTimeout(() => setPhase("next"), line.delay);
          return () => clearTimeout(t);
        }
      }
    }

    if (phase === "tag") {
      setLines((prev) => {
        const updated = [...prev];
        if (updated[currentLine]) updated[currentLine].tagVisible = true;
        return updated;
      });
      const t = setTimeout(() => setPhase("next"), line.delay);
      return () => clearTimeout(t);
    }

    if (phase === "next") {
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
      setPhase("typing");
    }
  }, [phase, currentLine, currentChar]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#080808",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          {/* Subtle grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "linear-gradient(rgba(0,255,70,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,70,0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              pointerEvents: "none",
            }}
          />

          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 500,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,255,70,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Terminal window */}
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(0,255,70,0.15)",
              boxShadow: "0 0 60px rgba(0,255,70,0.08), 0 24px 60px rgba(0,0,0,0.8)",
              background: "rgba(8,12,8,0.95)",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "rgba(0,255,70,0.04)",
                borderBottom: "1px solid rgba(0,255,70,0.08)",
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 8, fontSize: "0.72rem", color: "rgba(0,255,70,0.4)", fontFamily: "monospace" }}>
                boot — abdullah@portfolio
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem", fontFamily: "monospace", minHeight: 220 }}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.45rem",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontSize: "0.82rem", color: "rgba(0,255,70,0.85)" }}>
                    {line.text}
                  </span>
                  {line.tagVisible && line.tag && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: line.tag === "READY" ? "#28c840" : "rgba(0,255,70,0.6)",
                        border: `1px solid ${line.tag === "READY" ? "#28c840" : "rgba(0,255,70,0.25)"}`,
                        padding: "1px 8px",
                        borderRadius: 4,
                        flexShrink: 0,
                        marginLeft: 16,
                      }}
                    >
                      {line.tag}
                    </motion.span>
                  )}
                </div>
              ))}

              {/* Typing cursor line */}
              {phase !== "done" && currentLine < BOOT_LINES.length && (
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.45rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "rgba(0,255,70,0.85)" }}>
                    {lines[currentLine]?.text ?? ""}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 14,
                      background: showCursor ? "rgba(0,255,70,0.8)" : "transparent",
                      marginLeft: 2,
                      transition: "background 0.1s",
                    }}
                  />
                </div>
              )}

              {/* Final ready message */}
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#28c840",
                    letterSpacing: "0.15em",
                  }}
                >
                  SYSTEM READY
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
