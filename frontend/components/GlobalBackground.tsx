"use client";
import { useEffect, useRef, useState } from "react";

interface SectionColor {
  id: string;
  color: string;
}

const SECTION_COLORS: SectionColor[] = [
  { id: "home", color: "#0a0a0a" },
  { id: "portfolio", color: "#181c24" },
  { id: "skills", color: "#11181f" },
  { id: "testimonials", color: "#19141d" },
  { id: "contact", color: "#0d0d14" },
];

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]: number[]): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(colorA: string, colorB: string, t: number): string {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  return rgbToHex([
    Math.round(lerp(rgbA[0], rgbB[0], t)),
    Math.round(lerp(rgbA[1], rgbB[1], t)),
    Math.round(lerp(rgbA[2], rgbB[2], t)),
  ]);
}

const CHARS = "01{}=>;#/<>[]()abcdefABCDEF".split("");

export default function GlobalBackground() {
  const [bgColor, setBgColor] = useState(SECTION_COLORS[0].color);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onScroll() {
      const sections = SECTION_COLORS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { id: s.id, top: rect.top, height: rect.height };
      }).filter((s): s is { id: string; top: number; height: number } => s !== null);

      if (sections.length === 0) return;

      let idx = 0;
      for (let i = 0; i < sections.length - 1; ++i) {
        const currentSection = sections[i];
        const nextSection = sections[i + 1];
        if (currentSection && nextSection && nextSection.top > window.innerHeight * 0.2) {
          idx = i;
          break;
        }
        idx = i + 1;
      }

      const curr = sections[idx];
      const next = sections[idx + 1];
      let t = 0;

      if (curr && next) {
        const start = curr.top;
        const end = next.top;
        t = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - start) / (end - start)));
      }

      const color = next
        ? lerpColor(SECTION_COLORS[idx].color, SECTION_COLORS[idx + 1].color, t)
        : SECTION_COLORS[idx].color;

      setBgColor(color);
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const charSize = 14;
    let columns: number[] = [];

    function init() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Array(Math.floor(canvas.width / charSize)).fill(0);
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0,255,70,1)";
      ctx.font = `${charSize}px monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * charSize, columns[i] * charSize);

        if (columns[i] * charSize > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function handleResize() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      init();
    }

    init();
    draw();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {/* Base color lerping between sections */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
          transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 0,
        }}
      />

      {/* Matrix rain canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: "var(--matrix-opacity, 0.09)" as React.CSSProperties["opacity"],
          zIndex: 1,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>

      {/* Subtle noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 2,
        }}
      />
    </div>
  );
}
