import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 text-zinc-900 dark:text-white">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-zinc-900/10 bg-white/70 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="relative">
          <p className="font-mono text-sm uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">404</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            The page you&apos;re looking for does not exist or has moved. Let&apos;s get you back to the portfolio.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-black"
            >
              Return home
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border border-zinc-900/15 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              Contact me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
