"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { playSwish } from "../lib/sounds";
import type { PortfolioTestimonial } from "../lib/content";

interface CardProps {
  t: PortfolioTestimonial;
  offset: number;
  onClick?: () => void;
}

const DEFAULT_GLOWS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

const TestimonialCard = memo(function TestimonialCard({ t, offset, onClick }: CardProps) {
  const isCenter = offset === 0;
  const glow = DEFAULT_GLOWS[offset === 0 ? 0 : offset < 0 ? 1 : 2];

  return (
    <motion.div
      animate={{
        scale: isCenter ? 1 : 0.82,
        opacity: isCenter ? 1 : 0.48,
        x: offset * 320,
        zIndex: isCenter ? 3 : 1,
        rotateY: offset * -6,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{
        position: "absolute",
        width: 320,
        left: "50%",
        marginLeft: -160,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      }}
      onClick={!isCenter ? onClick : undefined}
      className={!isCenter ? "cursor-pointer" : ""}
    >
      <div
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid var(${isCenter ? "--card-border-strong" : "--card-border"})`,
          borderRadius: 20,
          boxShadow: isCenter
            ? `0 0 60px 0 ${glow}35, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
            : `0 0 20px 0 ${glow}15, 0 8px 24px rgba(0,0,0,0.3)`,
          padding: "2rem",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "5rem",
            lineHeight: 0.7,
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 700,
            color: glow,
            opacity: 0.6,
            userSelect: "none",
          }}
        >
          &ldquo;
        </div>

        <p
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontSize: "0.95rem",
            fontWeight: 300,
            lineHeight: 1.85,
            letterSpacing: "-0.01em",
            color: "var(--text-secondary)",
            flex: 1,
          }}
        >
          {t.quote}
        </p>

        <div style={{ display: "flex", gap: 3 }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: glow, fontSize: "0.85rem" }}>★</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--divider)" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${glow}80, ${glow}30)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "white",
              border: `1px solid ${glow}50`,
              flexShrink: 0,
            }}
          >
            {t.author_name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-strong)" }}>
              {t.author_name}
            </p>
            <p style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 400, fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.02em" }}>
              {t.author_role ?? ""}{t.company ? ` · ${t.company}` : ""}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const OFFSETS = [-1, 0, 1] as const;

export default function TestimonialsSection({ testimonials, isVisible = false }: { testimonials: PortfolioTestimonial[]; isVisible?: boolean }) {
  const [active, setActive] = useState(0);
  const visibleTestimonials = testimonials.length ? testimonials : [];

  const prev = () => {
    if (!visibleTestimonials.length) return;
    playSwish();
    setActive((i) => (i - 1 + visibleTestimonials.length) % visibleTestimonials.length);
  };
  const next = () => {
    if (!visibleTestimonials.length) return;
    playSwish();
    setActive((i) => (i + 1) % visibleTestimonials.length);
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-zinc-900 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
          What People Say
        </h2>
        <p className="text-center text-zinc-500 mb-16 text-sm tracking-widest uppercase">
          Local notes from the repo
        </p>

        {visibleTestimonials.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-zinc-900/10 bg-zinc-900/5 px-6 py-10 text-center text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Testimonials will appear here once they are added to the local site data.
          </div>
        ) : (
          <>
            <div className="relative mx-auto" style={{ height: 420, maxWidth: 900, perspective: "1200px" }}>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next();
                  if (info.offset.x > 60) prev();
                }}
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                {OFFSETS.map((offset) => {
                  const idx = (active + offset + visibleTestimonials.length) % visibleTestimonials.length;
                  return (
                    <TestimonialCard
                      key={visibleTestimonials[idx].id}
                      t={visibleTestimonials[idx]}
                      offset={offset}
                      onClick={offset === -1 ? prev : offset === 1 ? next : undefined}
                    />
                  );
                })}
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <button onClick={prev} className="w-10 h-10 rounded-full border border-zinc-900/20 text-zinc-900/50 hover:text-zinc-900 hover:border-zinc-900/50 dark:border-white/15 dark:text-white/60 dark:hover:text-white dark:hover:border-white/40 flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Previous">
                ←
              </button>

              <div className="flex gap-2">
                {visibleTestimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { playSwish(); setActive(i); }}
                    style={{
                      width: active === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: active === i ? DEFAULT_GLOWS[active % DEFAULT_GLOWS.length] : "var(--dot)",
                      border: "none",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button onClick={next} className="w-10 h-10 rounded-full border border-zinc-900/20 text-zinc-900/50 hover:text-zinc-900 hover:border-zinc-900/50 dark:border-white/15 dark:text-white/60 dark:hover:text-white dark:hover:border-white/40 flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Next">
                →
              </button>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}

