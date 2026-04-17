"use client";

import { motion } from "framer-motion";

interface Domain {
  title: string;
  icon: string;
  glow: string;
  description: string;
  skills: string[];
}

const domains: Domain[] = [
  {
    title: "Mobile",
    icon: "📱",
    glow: "#8b5cf6",
    description: "Cross-platform native apps",
    skills: ["Flutter", "Dart", "Firebase", "Supabase", "REST APIs", "Riverpod"],
  },
  {
    title: "Web",
    icon: "🌐",
    glow: "#06b6d4",
    description: "Full-stack web development",
    skills: ["Next.js", "React", "TypeScript", "Django", "FastAPI", ".NET", "PostgreSQL", "DevOps"],
  },
  {
    title: "AI",
    icon: "🤖",
    glow: "#10b981",
    description: "Intelligent systems & automation",
    skills: ["Python", "LangChain", "Ollama", "OpenAI API", "Prompt Eng.", "RAG"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const domainVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SkillsSection({ isVisible = false }: { isVisible?: boolean }) {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-white"
          style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
        >
          Skills & Expertise
        </h2>
        <p className="text-center text-zinc-500 mb-16 text-sm tracking-widest uppercase">
          Three domains. One developer.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          animate={isVisible ? "visible" : "hidden"}
        >
          {domains.map((domain) => (
            <motion.div
              key={domain.title}
              variants={domainVariants}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 20,
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
              }}
              whileHover={{
                boxShadow: `0 0 60px 0 ${domain.glow}30, 0 20px 40px rgba(0,0,0,0.3)`,
                borderColor: `${domain.glow}40`,
                y: -6,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow orb */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${domain.glow}25 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${domain.glow}18`,
                    border: `1px solid ${domain.glow}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                  }}
                >
                  {domain.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "white",
                      lineHeight: 1,
                      marginBottom: 3,
                    }}
                  >
                    {domain.title}
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: domain.glow, fontWeight: 500, letterSpacing: "0.05em" }}>
                    {domain.description}
                  </p>
                </div>
              </div>

              {/* Skills chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {domain.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.3 + si * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background: `${domain.glow}12`,
                      color: "rgba(255,255,255,0.75)",
                      border: `1px solid ${domain.glow}25`,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
