"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { playClick } from "../lib/sounds";
import { BlogPost } from "./blogData";
import BlogContent from "./BlogContent";

const GLOW = "#34d399";

export default function BlogDetail({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/blogs"
            onClick={() => playClick()}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group font-mono text-sm"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            cd ~/blogs
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm tracking-wider mb-6">
            <time dateTime={post.date} className="text-emerald-600 dark:text-emerald-400">
              {post.displayDate}
            </time>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">{post.readTime}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">Abdullah Khan</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.7rem] px-3 py-1 rounded-full"
                style={{
                  background: `${GLOW}14`,
                  color: "var(--accent-emerald)",
                  border: `1px solid ${GLOW}2e`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative group mb-14"
        >
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: `linear-gradient(120deg, ${GLOW}, #22d3ee)` }}
          />
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <BlogContent content={post.content} />
        </motion.div>

        {/* Footer CTA */}
        <motion.footer
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-10 border-t border-zinc-900/10 dark:border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-mono text-sm text-zinc-500">
              <span className="text-emerald-600/90 dark:text-emerald-400/80">$</span> thanks for reading
              <span className="cursor-blink text-emerald-600 dark:text-emerald-400">_</span>
            </p>
            <div className="flex gap-3">
              <Link
                href="/blogs"
                onClick={() => playClick()}
                className="px-6 py-3 rounded-full border border-zinc-900/20 text-zinc-900 hover:bg-zinc-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10 text-sm font-semibold transition-all duration-300 hover:scale-105"
              >
                More posts
              </Link>
              <Link
                href="/#contact"
                onClick={() => playClick()}
                className="px-6 py-3 rounded-full text-sm font-semibold text-black transition-all duration-300 hover:scale-105"
                style={{ background: `linear-gradient(120deg, ${GLOW}, #22d3ee)` }}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </motion.footer>
      </article>
    </div>
  );
}
