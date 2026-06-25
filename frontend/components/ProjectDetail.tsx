"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { proxiedImageUrl, type PortfolioProject } from "../lib/content";

interface Particle {
  left: string;
  top: string;
  delay: string;
  duration: string;
}

export default function ProjectDetail({ project }: { project: PortfolioProject }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 4}s`,
      }))
    );
  }, []);

  const year = new Date(project.created_at).getFullYear();

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white overflow-x-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-zinc-900/10 dark:bg-white/10 rounded-full animate-float pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/#portfolio"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Portfolio</span>
          </Link>
          <span className="text-zinc-500 text-sm">{year}</span>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-center mb-20">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/5 border-zinc-900/10 dark:bg-white/5 border dark:border-white/10 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>{project.role}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {project.title}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.stack.map((tech) => (
                    <span key={tech} className="px-4 py-2 rounded-xl bg-zinc-900/5 border-zinc-900/10 text-zinc-700 hover:bg-zinc-900/10 hover:border-zinc-900/20 dark:bg-white/5 border dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:border-white/20 text-sm transition-all duration-300 hover:scale-105">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                  {project.cover_image_url ? (
                    <Image
                      src={proxiedImageUrl(project.cover_image_url) ?? ""}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white">
                      <span className="text-6xl font-bold">{project.title.slice(0, 1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Quick Links
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/5 border border-zinc-900/5 dark:bg-white/5 dark:border-white/5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Featured</p>
                <h3 className="mt-2 text-lg font-semibold">{project.featured ? "Yes" : "No"}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/5 border border-zinc-900/5 dark:bg-white/5 dark:border-white/5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Sort Order</p>
                <h3 className="mt-2 text-lg font-semibold">{project.sort_order}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/5 border border-zinc-900/5 dark:bg-white/5 dark:border-white/5">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Slug</p>
                <h3 className="mt-2 text-lg font-semibold">{project.slug}</h3>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              {project.live_url ? (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Live Project
                  </span>
                </a>
              ) : null}
              {project.repo_url ? (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full border-2 border-zinc-900/20 text-zinc-900 hover:bg-zinc-900/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 font-semibold transition-all duration-300 hover:scale-105"
                >
                  View Repository
                </a>
              ) : null}
              <Link
                href="/#contact"
                className="px-8 py-4 rounded-full border-2 border-zinc-900/20 text-zinc-900 hover:bg-zinc-900/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 font-semibold transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-zinc-900/10 dark:border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">
          <p>© {year} Abdullah Khan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

