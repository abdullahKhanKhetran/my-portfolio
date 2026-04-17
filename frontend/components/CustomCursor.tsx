"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    let rafId: number;
    const animate = () => {
      cursorX.current += (mouseX.current - cursorX.current) * 0.15;
      cursorY.current += (mouseY.current - cursorY.current) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = cursorX.current + "px";
        cursorRef.current.style.top = cursorY.current + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = mouseX.current + "px";
        dotRef.current.style.top = mouseY.current + "px";
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 border-2 border-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="fixed w-3 h-3 bg-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
    </>
  );
}
