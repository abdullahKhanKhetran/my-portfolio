"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { playSwish, playClick } from "../lib/sounds";
import { proxiedImageUrl, type PortfolioProject } from "../lib/content";

const PROJECT_GLOWS = ["#8b5cf6", "#f59e0b", "#06b6d4", "#10b981"];

interface CarouselCardProps {
  project: PortfolioProject;
  glow: string;
  offset: number;
  onClick?: () => void;
}

function getProjectImage(project: PortfolioProject) {
  return proxiedImageUrl(project.cover_image_url);
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

const CarouselCard = memo(function CarouselCard({ project, glow, offset, onClick }: CarouselCardProps) {
  const isCenter = offset === 0;

  const inner = (
    <div
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid var(${isCenter ? "--card-border-strong" : "--card-border"})`,
        borderRadius: 20,
        boxShadow: isCenter
          ? `0 0 70px 0 ${glow}40, 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`
          : `0 0 20px 0 ${glow}15, 0 8px 24px rgba(0,0,0,0.3)`,
        padding: "1.5rem",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 opacity-[0.08] blur-2xl scale-110 z-0">
        {getProjectImage(project) ? (
          <Image src={getProjectImage(project)!} alt="" fill unoptimized style={{ objectFit: "cover" }} />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(circle at 20% 20%, ${glow}66, transparent 40%), radial-gradient(circle at 80% 0%, ${glow}33, transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.05))`,
            }}
          />
        )}
      </div>

      <div className="relative z-10 flex h-full flex-col gap-3">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${glow}20, ${glow}08)`,
            border: `1px solid ${glow}40`,
            flexShrink: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: glow,
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          {project.title.slice(0, 2).toUpperCase()}
        </div>

        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", color: glow, textTransform: "uppercase", marginBottom: 4 }}>
            {new Date(project.created_at).getFullYear()}
          </p>
          <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.2 }}>
            {project.title}
          </h3>
          <p style={{ fontSize: "0.75rem", color: glow, marginTop: 4 }}>{project.role}</p>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.7, flex: 1 }}>
          {project.summary}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.stack.slice(0, 3).map((stackItem) => (
            <span key={stackItem} style={{ fontSize: "0.7rem", fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: `${glow}18`, color: glow, border: `1px solid ${glow}30` }}>
              {stackItem}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>+{project.stack.length - 3}</span>
          )}
        </div>

        {project.live_url && isCenter && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: glow, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em" }}>
            <span>Open project</span>
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
        cursor: "pointer",
      }}
      onClick={!isCenter ? onClick : undefined}
    >
      {isCenter ? (
        <Link href={`/projects/${project.slug}`} onClick={() => playClick()}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
});

export default function PortfolioSection({ projects, isVisible = false }: { projects: PortfolioProject[]; isVisible?: boolean }) {
  const [view, setView] = useState<"carousel" | "grid">("carousel");
  const [active, setActive] = useState(0);

  const visibleProjects = projects.length ? projects : [];

  const prev = () => {
    if (!visibleProjects.length) return;
    playSwish();
    setActive((i) => (i - 1 + visibleProjects.length) % visibleProjects.length);
  };
  const next = () => {
    if (!visibleProjects.length) return;
    playSwish();
    setActive((i) => (i + 1) % visibleProjects.length);
  };

  return (
    <section id="portfolio" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
              Featured Projects
            </h2>
            <p className="text-zinc-500 text-sm mt-1 tracking-widest uppercase">Live data from Supabase</p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl border border-zinc-900/10 bg-zinc-900/5 dark:border-white/10 dark:bg-white/5">
            <button
              onClick={() => { playClick(); setView("carousel"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "carousel" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}
            >
              Tiles
            </button>
            <button
              onClick={() => { playClick(); setView("grid"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "grid" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}
            >
              Grid
            </button>
          </div>
        </div>

        {view === "carousel" && visibleProjects.length > 0 && (
          <>
            <div className="relative mx-auto" style={{ height: 380, maxWidth: 900, perspective: "1200px" }}>
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
                  const idx = (active + offset + visibleProjects.length) % visibleProjects.length;
                  return (
                    <CarouselCard
                      key={visibleProjects[idx].id}
                      project={visibleProjects[idx]}
                      glow={PROJECT_GLOWS[idx % PROJECT_GLOWS.length]}
                      offset={offset}
                      onClick={offset === -1 ? prev : offset === 1 ? next : undefined}
                    />
                  );
                })}
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-zinc-900/20 text-zinc-900/50 hover:text-zinc-900 hover:border-zinc-900/50 dark:border-white/15 dark:text-white/60 dark:hover:text-white dark:hover:border-white/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                ←
              </button>
              <div className="flex gap-2">
                {visibleProjects.map((project, i) => (
                  <button
                    key={project.id}
                    onClick={() => { playSwish(); setActive(i); }}
                    style={{
                      width: active === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: active === i ? PROJECT_GLOWS[active % PROJECT_GLOWS.length] : "var(--dot)",
                      border: "none",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-zinc-900/20 text-zinc-900/50 hover:text-zinc-900 hover:border-zinc-900/50 dark:border-white/15 dark:text-white/60 dark:hover:text-white dark:hover:border-white/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                →
              </button>
            </div>
          </>
        )}

        {view === "grid" && visibleProjects.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            animate="visible"
            initial="hidden"
          >
            {visibleProjects.map((project, index) => (
              <motion.div key={project.id} variants={cardVariants}>
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => playClick()}
                  className="relative rounded-2xl overflow-hidden flex flex-col items-center group block"
                  style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid var(--card-border)",
                    padding: "1.75rem",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px 0 ${PROJECT_GLOWS[index % PROJECT_GLOWS.length]}35, 0 20px 40px rgba(0,0,0,0.4)`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.08] blur-lg scale-110 z-0">
                    {project.cover_image_url ? (
                      <Image src={proxiedImageUrl(project.cover_image_url) ?? ""} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${PROJECT_GLOWS[index % PROJECT_GLOWS.length]}25, transparent)` }} />
                    )}
                  </div>

                  <div className="relative z-10 w-full flex flex-col gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900/10 dark:bg-white/10 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center font-bold text-lg text-zinc-900 dark:text-white">
                      {project.title.slice(0, 1)}
                    </div>

                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", color: PROJECT_GLOWS[index % PROJECT_GLOWS.length], textTransform: "uppercase", marginBottom: 4 }}>
                        {new Date(project.created_at).getFullYear()}
                      </p>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{project.title}</h3>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">{project.summary}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: `${PROJECT_GLOWS[index % PROJECT_GLOWS.length]}18`, color: PROJECT_GLOWS[index % PROJECT_GLOWS.length], border: `1px solid ${PROJECT_GLOWS[index % PROJECT_GLOWS.length]}30` }}
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
