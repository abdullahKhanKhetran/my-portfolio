"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TERMINAL_LINES = [
  "const developer = {",
  '  name: "Abdullah Khan",',
  '  stack: ["Next.js", "Flutter", ".NET"],',
  '  passion: "Building things that matter",',
  "  open_to_work: true,",
  "};",
];

function getLineColor(line: string): string {
  if (line.startsWith("const")) return "text-violet-400";
  if (line.includes("open_to_work")) return "text-violet-400";
  if (line.includes('"Abdullah Khan"') || line.includes('"Building')) return "text-green-300";
  if (line.includes("[") || line.includes("]")) return "text-yellow-300";
  if (line === "};") return "text-zinc-400";
  return "text-zinc-200";
}

function TerminalWindow({ isVisible }: { isVisible: boolean }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (currentLine >= TERMINAL_LINES.length) {
      setDone(true);
      return;
    }

    const line = TERMINAL_LINES[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = (updated[currentLine] ?? "") + line[currentChar];
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [isVisible, currentLine, currentChar]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0d0d0d]/90 backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-zinc-500 text-xs font-mono">portfolio.ts</span>
        </div>

        {/* Code content */}
        <div
          className="p-4 md:p-5 font-mono overflow-auto"
          style={{ fontSize: "clamp(10px, 1.5vw, 13px)", minHeight: "180px" }}
        >
          {displayedLines.map((line, i) => (
            <div key={i} className="leading-relaxed whitespace-pre">
              <span className="text-zinc-600 select-none mr-3 text-[10px]">{String(i + 1).padStart(2, " ")}</span>
              <span className={getLineColor(TERMINAL_LINES[i])}>{line}</span>
            </div>
          ))}

          {!done && currentLine < TERMINAL_LINES.length && (
            <div className="leading-relaxed whitespace-pre">
              <span className="text-zinc-600 select-none mr-3 text-[10px]">{String(currentLine + 1).padStart(2, " ")}</span>
              <span className={getLineColor(TERMINAL_LINES[currentLine])}>
                {displayedLines[currentLine] ?? ""}
              </span>
              <span className="cursor-blink text-green-400">▋</span>
            </div>
          )}

          {done && (
            <div className="leading-relaxed mt-1">
              <span className="text-zinc-600 select-none mr-3 text-[10px]">{String(TERMINAL_LINES.length + 1).padStart(2, " ")}</span>
              <span className="text-green-400 cursor-blink">▋</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface HeroSectionProps {
  isVisible?: boolean;
}

export default function HeroSection({ isVisible = false }: HeroSectionProps) {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-x-clip gap-8 md:gap-16">
      {/* Left: Text */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-start justify-center text-left z-10 order-2 md:order-1"
      >
        <p className="text-xs sm:text-sm font-medium mb-3 text-green-400 uppercase tracking-widest font-mono">
          &gt; Hello, world!
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4 text-white leading-tight">
          I&apos;m Abdullah
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-zinc-300">
          Full Stack Developer
        </h3>
        <p className="max-w-lg text-sm sm:text-base text-zinc-400 mb-6 md:mb-8 leading-relaxed">
          I build web, mobile, and desktop applications with modern tech stacks.
          Specializing in Flutter, .NET, Next.js, React, FastAPI, and Django with
          DevOps expertise.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href="#portfolio"
            className="px-6 sm:px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all duration-300 text-center text-sm sm:text-base btn-hover"
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="px-6 sm:px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 text-center text-sm sm:text-base btn-hover"
          >
            Get In Touch
          </a>
        </div>
      </motion.div>

      {/* Right: Terminal */}
      <div className="flex-1 flex items-center justify-center w-full order-1 md:order-2 max-h-[260px] md:max-h-none">
        <TerminalWindow isVisible={isVisible} />
      </div>
    </div>
  );
}
