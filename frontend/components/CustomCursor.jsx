"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

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

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 border-2 border-black dark:border-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={dotRef}
        className="fixed w-3 h-3 bg-black dark:bg-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
