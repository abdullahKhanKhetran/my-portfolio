"use client";

import { playClick } from "../lib/sounds";

/* Stateless toggle: current theme lives on <html class="dark">, icons swap
   via CSS dark: variants, so there is no hydration mismatch to manage. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    playClick();
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
    window.dispatchEvent(
      new CustomEvent("themechange", { detail: isDark ? "dark" : "light" })
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      className={`flex h-12 w-12 items-center justify-center rounded-tl-[999px] rounded-tr-[14px] rounded-br-[999px] rounded-bl-[14px] bg-white/75 text-zinc-700 shadow-xl shadow-black/10 backdrop-blur-md transition-transform duration-200 hover:scale-105 dark:bg-black/45 dark:text-zinc-200 ${className}`}
    >
      {/* Sun — shown in dark mode (tap for light) */}
      <svg
        className="hidden h-5 w-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon — shown in light mode (tap for dark) */}
      <svg
        className="block h-5 w-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}
