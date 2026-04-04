
"use client";
import { useEffect, useRef, useState } from "react";

// Define your key section colors here (in order of appearance)
const SECTION_COLORS = [
  { id: "home", color: "#0a0a0a" },
  { id: "projects", color: "#181c24" },
  { id: "skills", color: "#11181f" },
  { id: "testimonials", color: "#19141d" },
  { id: "contact", color: "#ffffff" },
];

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]) {
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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(colorA, colorB, t) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  return rgbToHex([
    Math.round(lerp(rgbA[0], rgbB[0], t)),
    Math.round(lerp(rgbA[1], rgbB[1], t)),
    Math.round(lerp(rgbA[2], rgbB[2], t)),
  ]);
}

export default function GlobalBackground() {
  const [bgColor, setBgColor] = useState(SECTION_COLORS[0].color);

  useEffect(() => {
    function onScroll() {
      const sections = SECTION_COLORS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { id: s.id, top: rect.top, height: rect.height };
      });
      let idx = 0;
      for (let i = 0; i < sections.length - 1; ++i) {
        if (sections[i] && sections[i + 1] && sections[i + 1].top > window.innerHeight * 0.2) {
          idx = i;
          break;
        }
        idx = i + 1;
      }
      // Interpolate between idx and idx+1
      const curr = sections[idx];
      const next = sections[idx + 1];
      let t = 0;
      if (curr && next) {
        const start = curr.top;
        const end = next.top;
        t = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - start) / (end - start)));
      }
      const color = next ? lerpColor(SECTION_COLORS[idx].color, SECTION_COLORS[idx + 1].color, t) : SECTION_COLORS[idx].color;
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

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <img
        src="/my_pictures/front_pose.jpg"
        alt="background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
          opacity: 0.6,
          transition: "background 0.5s cubic-bezier(.4,0,.2,1)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
