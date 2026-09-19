"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Centre-line trace of the real signature in public/images/my_signature.jpg.
   `len` is each stroke's drawn length in viewBox units — it only splits the
   timing so the pen keeps an even speed from one stroke to the next. To retrace
   the signature later, replace this array and VIEW_BOX together. */
const SIGNATURE_STROKES: ReadonlyArray<{ d: string; len: number }> = [
  { d: "M11.92 27.94C1.53 28.53 -1.19 48.58 7.94 49.7C15.69 50.65 19.4 38.48 21.84 33.73C22.02 33.38 22.65 33.33 22.71 32.94C23.03 31.17 22.82 29.34 22.95 27.55C22.96 27.37 26.69 18.75 24.8 14.71C22.89 10.61 21.09 25.16 22.9 26.73", len: 97.2 },
  { d: "M5.59 41.73C8.82 37.48 15.64 22.25 15.98 17.1", len: 31.7 },
  { d: "M12.78 28.14C15.46 28.85 19.16 34.14 18.23 28.53C16.79 19.88 18.67 22.04 16.02 19.34", len: 21 },
  { d: "M18.33 31.41C18.56 32.14 18.79 32.86 19.01 33.59", len: 2.5 },
  { d: "M25.92 29.31C31.22 31.24 22.31 33.5 23.96 36.95C25.16 39.48 27.33 33.97 27.55 32.1", len: 19.9 },
  { d: "M27.78 29.87C30.49 28.82 30.59 27.32 32.61 25.5", len: 7.8 },
  { d: "M30.2 29.15C30.56 35.89 34.48 31.51 34.7 27.84C34.87 24.92 36.07 14.03 34.15 12.49", len: 29.1 },
  { d: "M34.08 12.75C32.63 14.07 32.69 20.28 34.38 21.73", len: 10.3 },
  { d: "M34.84 28.07C35.63 28.58 36.05 29.9 37.16 29.74C38.88 29.5 41.9 23.12 41.07 21.5C40.17 19.74 37.28 24.77 39.18 26.46", len: 22.1 },
  { d: "M39.45 28.08C45.35 32.25 47.27 10.48 46.14 7.36C45.06 4.37 43.06 16.05 45.36 18.13", len: 40.4 },
  { d: "M45.63 22.65C50.24 25.03 46.82 23.95 50.29 20.13", len: 8.6 },
  { d: "M50.29 5.33C50.25 6.46 49.48 6.4 49.42 7.45C49.15 11.91 49.91 15.78 50.43 20C50.5 20.54 51.41 20.6 51.96 20.58C53.44 20.55 52.82 19.27 54.05 18.36C57.37 15.94 54 21.54 57.19 15.61C57.26 15.48 57.41 15.38 57.56 15.37C58.47 15.27 60.15 15.18 60.56 13.99C61.02 12.69 60.89 11.24 61.31 9.93C63.05 4.36 65.8 19.4 66.67 8.17", len: 46.4 },
  { d: "M50.43 6.38C52.44 7.75 52.53 13.69 50.5 15.26", len: 10.3 },
  { d: "M54.31 18.1C54.18 13.54 57.88 8.47 57.45 15.16", len: 12 },
  { d: "M60.59 2.78C60.8 9.58 59.72 7.48 61.04 9.87", len: 7.4 },
  { d: "M66.63 2.68l.06 0", len: 0.6 },
  { d: "M66.61 11.11C69.83 14.49 66.85 11.25 67.65 24.28", len: 13.7 },
  { d: "M67.75 25.43C68.15 31.45 67.93 37.18 68.99 42.9", len: 18.6 },
  { d: "M72.16 17.29C72.38 18.74 72.59 20.18 72.81 21.63", len: 4.8 },
  { d: "M72.94 22.78C73.13 26.63 74.28 31.92 74.02 35.85", len: 13.8 },
  { d: "M74.35 33.4C75.92 32.15 75.06 29.03 76.8 28.17C78.76 27.19 79.32 31.93 80.97 30.42C82.41 29.1 82.35 27.77 83.34 25.96C83.66 25.36 85.77 26.76 86.73 26.05C89.72 23.85 92.48 21.37 95.36 19.03", len: 35.4 },
  { d: "M83.73 25.55C83.77 25.05 83.81 24.55 83.85 24.06", len: 1.7 },
  { d: "M32.29 46.43C40.49 41.29 52.43 34.28 62.64 35.99C64.94 36.37 66.1 38.1 68.1 39.01", len: 44.6 },
  { d: "M40.3 41.34C41.66 38.26 49.24 34.88 51.01 33.85C66.51 24.89 80.64 18.14 97.41 10.91", len: 74.7 },
];

const VIEW_BOX = "0 0 100 52.35";
const STROKE_WIDTH = 1.67;

/* The strokes are fragments of one continuous pen path, not 24 separate pen
   lifts, so easing each fragment would stack up 24 false decelerations. Instead
   every stroke runs linearly and the hand's acceleration is applied once across
   the whole signature: starts from rest, flows through the middle, settles. */
const pace = (p: number) => p * p * (3 - 2 * p);

const TOTAL_LENGTH = SIGNATURE_STROKES.reduce((sum, stroke) => sum + stroke.len, 0);

/* Where each stroke starts and how long it runs, as fractions of the whole
   draw. Fixed by the path data, so it is worked out once rather than per render. */
const STROKE_TIMING = SIGNATURE_STROKES.map((stroke, i) => {
  const before = SIGNATURE_STROKES.slice(0, i).reduce((sum, s) => sum + s.len, 0);
  const from = pace(before / TOTAL_LENGTH);
  return { from, span: pace((before + stroke.len) / TOTAL_LENGTH) - from };
});

interface AnimatedSignatureProps {
  /** Seconds the whole signature takes to draw. */
  duration?: number;
  /** Seconds to wait before the pen starts. */
  delay?: number;
  className?: string;
}

export default function AnimatedSignature({
  duration = 2.2,
  delay = 0.15,
  className,
}: AnimatedSignatureProps) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox={VIEW_BOX}
      role="img"
      aria-label="Abdullah Khan"
      className={className}
      style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
    >
      <g fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
        {SIGNATURE_STROKES.map((stroke, i) => (
          <motion.path
            key={i}
            d={stroke.d}
            // pathLength normalises the dash values to 1, so the undrawn state is
            // already correct in the server-rendered markup — no measuring pass,
            // and no frame where a finished signature flashes before JS runs.
            pathLength={1}
            // opacity holds each stroke hidden until its turn: a round linecap
            // on a zero-length dash paints a dot, so every unstarted stroke
            // would otherwise sit on the page as a speck ahead of the pen.
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: duration * STROKE_TIMING[i].span,
                      delay: delay + duration * STROKE_TIMING[i].from,
                      ease: "linear",
                    },
                    opacity: { duration: 0, delay: delay + duration * STROKE_TIMING[i].from },
                  }
            }
          />
        ))}
      </g>
    </svg>
  );
}
