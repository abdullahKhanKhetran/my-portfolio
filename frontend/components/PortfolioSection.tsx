"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { playSwish, playClick } from "../lib/sounds";
import { projects } from "./portfolioData";

const PROJECT_GLOWS = ["#8b5cf6", "#f59e0b", "#06b6d4"];

function getProjectSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Carousel Card ─── */
interface CarouselCardProps {
  project: (typeof projects)[0];
  glow: string;
  offset: number;
  onClick?: () => void;
}

function CarouselCard({ project, glow, offset, onClick }: CarouselCardProps) {
  const isCenter = offset === 0;
  const slug = getProjectSlug(project.name);

  const inner = (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(255,255,255,${isCenter ? 0.12 : 0.05})`,
        borderRadius: 20,
        boxShadow: isCenter
          ? `0 0 70px 0 ${glow}40, 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`
          : `0 0 20px 0 ${glow}15, 0 8px 24px rgba(0,0,0,0.3)`,
        padding: "1.75rem",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Blurred bg */}
      <div className="absolute inset-0 opacity-[0.08] blur-2xl scale-110 z-0">
        <Image src={project.icon} alt="" fill style={{ objectFit: "cover" }} />
      </div>

      <div className="relative z-10 flex flex-col gap-3 h-full">
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            overflow: "hidden",
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${glow}40`,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <Image src={project.icon} alt={project.name} fill style={{ objectFit: "contain", padding: 8 }} />
        </div>

        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", color: glow, textTransform: "uppercase", marginBottom: 4 }}>
            {project.year}
          </p>
          <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.35rem", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
            {project.name}
          </h3>
        </div>

        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, flex: 1 }}>
          {project.description}
        </p>

        {/* Tech */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} style={{ fontSize: "0.7rem", fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: `${glow}18`, color: glow, border: `1px solid ${glow}30` }}>
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>+{project.tech.length - 3}</span>
          )}
        </div>

        {isCenter && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: glow, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}>
            <span>View Project</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      animate={{
        scale: isCenter ? 1 : 0.82,
        opacity: isCenter ? 1 : 0.48,
        x: offset * 310,
        zIndex: isCenter ? 3 : 1,
        rotateY: offset * -5,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{
        position: "absolute",
        width: 300,
        left: "50%",
        marginLeft: -150,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        cursor: isCenter ? "pointer" : "pointer",
      }}
      onClick={!isCenter ? onClick : undefined}
    >
      {isCenter ? (
        <Link href={`/projects/${slug}`} onClick={() => playClick()}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function PortfolioSection({ isVisible = false }: { isVisible?: boolean }) {
  const [view, setView] = useState<"carousel" | "grid">("carousel");
  const [active, setActive] = useState(0);

  const prev = () => {
    playSwish();
    setActive((i) => (i - 1 + projects.length) % projects.length);
  };
  const next = () => {
    playSwish();
    setActive((i) => (i + 1) % projects.length);
  };

  return (
    <section id="portfolio" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header + toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-12 gap-4">
          <div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              Featured Projects
            </h2>
            <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase">Tap a card to explore</p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
            <button
              onClick={() => { playClick(); setView("carousel"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "carousel" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
            >
              Tiles
            </button>
            <button
              onClick={() => { playClick(); setView("grid"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "grid" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Carousel view */}
        {view === "carousel" && (
          <>
            <div
              className="relative mx-auto"
              style={{ height: 380, maxWidth: 900, perspective: "1200px" }}
            >
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
                {[-1, 0, 1].map((offset) => {
                  const idx = (active + offset + projects.length) % projects.length;
                  return (
                    <CarouselCard
                      key={idx}
                      project={projects[idx]}
                      glow={PROJECT_GLOWS[idx]}
                      offset={offset}
                      onClick={offset === -1 ? prev : offset === 1 ? next : undefined}
                    />
                  );
                })}
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 hover:scale-110"
              >
                ←
              </button>
              <div className="flex gap-2">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { playSwish(); setActive(i); }}
                    style={{
                      width: active === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: active === i ? PROJECT_GLOWS[active] : "rgba(255,255,255,0.2)",
                      border: "none",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 hover:scale-110"
              >
                →
              </button>
            </div>
          </>
        )}

        {/* Grid view */}
        {view === "grid" && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            animate="visible"
            initial="hidden"
          >
            {projects.map((project, index) => (
              <motion.div key={project.name} variants={cardVariants}>
                <Link
                  href={`/projects/${getProjectSlug(project.name)}`}
                  onClick={() => playClick()}
                  className="relative rounded-2xl overflow-hidden flex flex-col items-center group block"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "1.75rem",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px 0 ${PROJECT_GLOWS[index]}35, 0 20px 40px rgba(0,0,0,0.4)`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Blurred bg */}
                  <div className="absolute inset-0 opacity-[0.08] blur-lg scale-110 z-0">
                    <Image src={project.icon} alt="" fill style={{ objectFit: "cover" }} />
                  </div>

                  <div className="relative z-10 w-full flex flex-col gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Image src={project.icon} alt={project.name} fill style={{ objectFit: "contain", padding: 8 }} />
                    </div>

                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", color: PROJECT_GLOWS[index], textTransform: "uppercase", marginBottom: 4 }}>
                        {project.year}
                      </p>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: `${PROJECT_GLOWS[index]}18`, color: PROJECT_GLOWS[index], border: `1px solid ${PROJECT_GLOWS[index]}30` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
