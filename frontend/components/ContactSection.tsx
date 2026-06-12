"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { playClick } from "../lib/sounds";

const LINKS = [
  {
    label: "Send Email",
    href: "mailto:abdullahkhitran2005@gmail.com",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    primary: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdullah-khan-845607362/",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    primary: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/abdullahKhanKhetran",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    primary: false,
  },
];

export default function ContactSection({ isVisible = false }: { isVisible?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 overflow-hidden min-h-[600px]">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
      />

      {/* Side pose cutout — right side */}
      <div
        className="absolute bottom-0 right-0 h-full pointer-events-none select-none hidden md:block"
        style={{ width: "38%", maxWidth: 440 }}
      >
        <div
          className="relative h-full w-full"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 30%, black 80%, transparent 100%), linear-gradient(to top, transparent 0%, black 15%, black 100%)",
            maskComposite: "intersect",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%, black 80%, transparent 100%), linear-gradient(to top, transparent 0%, black 15%, black 100%)",
            WebkitMaskComposite: "source-in",
            opacity: 0.45,
          }}
        >
          <Image
            src="/my_pictures/side_pose.jpg"
            alt="Abdullah Khan"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-900/10 bg-zinc-900/5 dark:border-white/10 dark:bg-white/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Available for work</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", letterSpacing: "-0.02em" }}
          >
            Let&apos;s Build
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Something Great
            </span>
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 300 }}>
            Got a project in mind? Let&apos;s connect and turn your idea into reality.
            I&apos;m always open to interesting work and collaborations.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() => playClick()}
                className="flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105"
                style={
                  link.primary
                    ? {
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: "var(--btn-primary-bg)",
                        color: "var(--btn-primary-fg)",
                        fontSize: "0.9rem",
                      }
                    : {
                        padding: "12px 20px",
                        borderRadius: 12,
                        background: "var(--card-bg)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--card-border)",
                        fontSize: "0.9rem",
                      }
                }
                onMouseEnter={(e) => {
                  if (!link.primary) (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border-strong)";
                }}
                onMouseLeave={(e) => {
                  if (!link.primary) (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)";
                }}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-500 mb-12">
            <span>📍 Pakistan</span>
            <span>✉️ abdullahkhitran2005@gmail.com</span>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-zinc-900/10 dark:border-white/5">
            <p className="text-xs text-zinc-500 dark:text-zinc-600">
              © {currentYear} Abdullah Khan · Full Stack Developer · Built with Next.js
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
