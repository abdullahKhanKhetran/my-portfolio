"use client";

import { playClick } from "../lib/sounds";

export default function MatrixToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    playClick();
    let next = false;
    try {
      const current = localStorage.getItem("matrixRain");
      next = current === "true" ? false : true;
      localStorage.setItem("matrixRain", next ? "true" : "false");
    } catch {
      next = true;
    }

    window.dispatchEvent(
      new CustomEvent("matrixchange", { detail: next })
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle matrix rain"
      className={`flex h-12 min-w-12 items-center justify-center rounded-tl-[14px] rounded-tr-[999px] rounded-br-[14px] rounded-bl-[999px] bg-white/75 px-3 text-zinc-700 shadow-xl shadow-black/10 backdrop-blur-md transition-transform duration-200 hover:scale-105 dark:bg-black/45 dark:text-zinc-200 ${className}`}
    >
      <span className="font-mono text-sm font-bold tracking-[0.18em]">&lt;/&gt;</span>
    </button>
  );
}
