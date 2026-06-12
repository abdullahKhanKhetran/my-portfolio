"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { playClick } from "../lib/sounds";
import { blogPosts } from "./blogData";

const GLOW = "#34d399"; // emerald — the blog's signature accent

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BlogList() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white px-4 sm:px-6 lg:px-8 pt-12 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-mono text-sm text-emerald-600/90 dark:text-emerald-400/80 tracking-wider mb-4">
            ~/blogs
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Field{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              Notes
            </span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Long-form notes from the workbench — building software, testing AI
            tooling, and whatever else survives contact with production.
          </p>
        </motion.header>

        {/* Posts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {posts.map((post, index) => (
            <motion.article key={post.slug} variants={itemVariants}>
              <Link
                href={`/blogs/${post.slug}`}
                onClick={() => playClick()}
                className="group relative block rounded-3xl overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid var(--card-border)",
                  transition: "box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 60px 0 ${GLOW}25, 0 24px 50px rgba(0,0,0,0.45)`;
                  el.style.transform = "translateY(-5px)";
                  el.style.borderColor = `${GLOW}40`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--card-border)";
                }}
              >
                <div className="grid md:grid-cols-[1fr_260px]">
                  {/* Text */}
                  <div className="p-6 sm:p-8 flex flex-col gap-4 relative">
                    {/* Ghost index number */}
                    <span
                      aria-hidden
                      className="absolute top-4 right-6 font-mono text-6xl font-bold text-zinc-900/[0.05] dark:text-white/[0.04] select-none md:right-4"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-3 font-mono text-xs tracking-wider">
                      <time dateTime={post.date} className="text-emerald-600 dark:text-emerald-400/90">
                        {post.displayDate}
                      </time>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{post.readTime}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-emerald-900 dark:group-hover:text-emerald-50 transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.68rem] px-2.5 py-1 rounded-full"
                          style={{
                            background: `${GLOW}14`,
                            color: "var(--accent-emerald)",
                            border: `1px solid ${GLOW}2e`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Read post
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Cover */}
                  <div className="relative h-48 md:h-auto md:min-h-full order-first md:order-none">
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent md:from-transparent md:to-black/30" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
