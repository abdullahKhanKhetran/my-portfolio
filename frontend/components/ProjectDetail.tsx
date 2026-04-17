"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  name: string;
  fullDescription: string;
  icon: string;
  screenshots: string[];
  tech: string[];
  features: string[];
  link: string;
  year: string;
  role: string;
}

interface Particle {
  left: string;
  top: string;
  delay: string;
  duration: string;
}

export default function ProjectDetail({ project }: { project: Project }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 4}s`,
      }))
    );
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full animate-float pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/#portfolio"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Portfolio</span>
          </Link>
          <span className="text-zinc-500 text-sm">{project.year}</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-center mb-20">
              {/* Text Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>{project.role}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {project.name}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8">
                  {project.fullDescription}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src={project.icon}
                    alt={project.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Key Features
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-violet-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Screenshots Gallery */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]"
                >
                  <Image
                    src={screenshot}
                    alt={`${project.name} screenshot ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-medium">Screenshot {index + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Live Project
                </span>
              </a>
              <Link
                href="/#contact"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">
          <p>© {project.year} Abdullah Khan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
