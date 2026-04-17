"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id: string;
  parallaxOffset?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  id,
  parallaxOffset = 0,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sectionBounds, setSectionBounds] = useState({ top: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(
    scrollY,
    [sectionBounds.top - 800, sectionBounds.top + sectionBounds.height],
    [parallaxOffset, -parallaxOffset]
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const updateBounds = () => {
      if (!sectionRef.current) return;
      const top = sectionRef.current.offsetTop;
      const height = sectionRef.current.offsetHeight;
      setSectionBounds({ top, height });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldParallax = parallaxOffset > 0 && !isMobile;

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={className}
      style={shouldParallax ? { y } : undefined}
    >
      {isValidElement(children)
        ? cloneElement(children as React.ReactElement<{ isVisible?: boolean }>, {
            isVisible,
          })
        : children}
    </motion.section>
  );
}
