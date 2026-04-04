"use client";

import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function AnimatedSection({ children, className = "", id }) {
  const sectionRef = useRef(null);
  const [motionProgress, setMotionProgress] = useState(1);
  const [motionSigned, setMotionSigned] = useState(0);

  const direction = useMemo(() => {
    return ["home", "skills", "contact"].includes(id) ? -1 : 1;
  }, [id]);

  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      if (!sectionRef.current) return;

      if (id === "home" && window.scrollY < 24) {
        setMotionSigned(0);
        setMotionProgress(1);
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const centerDelta = rect.top + rect.height / 2 - viewportH / 2;
      const signed = clamp(centerDelta / viewportH, -1, 1);
      const progress = 1 - clamp(Math.abs(centerDelta) / (viewportH * 0.9), 0, 1);

      setMotionSigned(signed);
      setMotionProgress(progress);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [direction]);

  return (
    <section ref={sectionRef} id={id} className={className}>
      {isValidElement(children)
        ? cloneElement(children, {
            motionSigned,
            motionProgress,
            motionDirection: direction,
          })
        : children}
    </section>
  );
}
