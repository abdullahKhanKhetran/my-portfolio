import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

/* Drop a new PDF at this path with the same name and the site picks it up on the
   next build. The URL carries a hash of the file's bytes so a replaced resume
   never gets served from a visitor's cache. */
const RESUME_FILE = "Abdullah_Khan_Resume.pdf";

function resumeUrl() {
  const absolute = path.join(process.cwd(), "public", "docs", RESUME_FILE);

  let bytes: Buffer;
  try {
    bytes = readFileSync(absolute);
  } catch {
    throw new Error(
      `Resume not found at public/docs/${RESUME_FILE}. Put the PDF there using exactly that filename, or update RESUME_FILE in app/resume/page.tsx.`
    );
  }

  const version = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  return `/docs/${RESUME_FILE}?v=${version}`;
}

const RESUME_URL = resumeUrl();

export const metadata: Metadata = {
  title: "Resume | Abdullah Khan",
  description: "View and download Abdullah Khan's resume.",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-zinc-500">
              Resume
            </p>
            <h1
              className="text-3xl font-bold text-zinc-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", letterSpacing: "-0.02em" }}
            >
              Abdullah Khan
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline"
            >
              Open in new tab
            </a>
            <a
              href={RESUME_URL}
              download={RESUME_FILE}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-fg)" }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border shadow-2xl shadow-black/20"
          style={{ borderColor: "var(--card-border)", background: "#ffffff" }}
        >
          <iframe
            src={RESUME_URL}
            title="Abdullah Khan - Resume"
            className="h-[80vh] min-h-[700px] w-full"
            style={{ border: "none", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
