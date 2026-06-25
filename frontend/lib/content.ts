export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  live_url?: string | null;
  repo_url?: string | null;
  cover_image_url?: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string | null;
}

export interface PortfolioSkill {
  id: number;
  category: string;
  name: string;
  proficiency?: number | null;
  sort_order: number;
}

export interface PortfolioTestimonial {
  id: number;
  author_name: string;
  author_role?: string | null;
  company?: string | null;
  quote: string;
  avatar_url?: string | null;
  sort_order: number;
}

export interface ProfileBundle {
  person: string;
  resume: string;
  hero_image_url?: string | null;
}

export interface PersonProfile {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  about: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  display_date: string;
  read_time: string;
  tags: string[];
  cover: string;
  content: string;
}

export const LOCAL_PROFILE_BUNDLE: ProfileBundle = {
  person: `# Person

## Basics
- Name: Muhammad Abdullah Khan
- Location: Islamabad, Pakistan
- Role: Full Stack AI Engineer
- Email: abdullahkhitran2005@gmail.com
- LinkedIn: https://www.linkedin.com/in/abdullah-khan-845607362
- GitHub: https://github.com/abdullahKhanKhetran

## About Me
I am a Full Stack AI Engineer who builds production-ready applications that combine intelligent automation with solid backend and mobile architecture. I enjoy working across the stack, especially on products that need FastAPI, Django, PostgreSQL, Supabase, Flutter, and modern frontend tools like Next.js and React.

I like solving real-world problems with AI, RAG pipelines, embeddings, vector search, MCP-based tooling, and clean API design. My focus is on building systems that are scalable, reliable, and easy to maintain in production.
`,
  resume: `Full Stack AI Engineer focused on backend systems, mobile apps, and AI-assisted product engineering. Experienced with FastAPI, Django, PostgreSQL, Supabase, Flutter, React, Next.js, Redis, Docker, AWS, MCP, and RAG workflows.`,
  hero_image_url: "/my_pictures/side_pose.jpg",
};

export const LOCAL_PROJECTS: PortfolioProject[] = [
  {
    id: 1,
    slug: "ilearn",
    title: "ILearn",
    summary: "AI-powered student management system with RAG-enabled academic querying.",
    role: "Full Stack AI Engineer",
    stack: ["React", "MVC", "Supabase", "FastAPI", "RAG", "DeepSeek LLM"],
    live_url: null,
    repo_url: null,
    cover_image_url: "/app_icons/ilearn_icon.png",
    featured: true,
    sort_order: 1,
    created_at: "2026-06-24T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "insightops",
    title: "InsightOps",
    summary: "MCP-powered incident resolution and debugging assistant.",
    role: "Full Stack AI Engineer",
    stack: ["Node.js", "FastAPI", "MCP", "Redis", "PostgreSQL", "Docker", "AWS"],
    live_url: null,
    repo_url: null,
    cover_image_url: "/app_icons/insightops_icon.png",
    featured: true,
    sort_order: 2,
    created_at: "2026-06-24T00:00:00.000Z",
  },
  {
    id: 3,
    slug: "talentforge",
    title: "TalentForge",
    summary: "AI-powered HR management system with anomaly detection and performance prediction.",
    role: "Full Stack AI Engineer",
    stack: ["Flutter", "FastAPI", "Django", "PostgreSQL", "Celery", "Redis", "Docker"],
    live_url: null,
    repo_url: null,
    cover_image_url: "/app_icons/alnoor_cloth_house_icon.png",
    featured: true,
    sort_order: 3,
    created_at: "2026-06-24T00:00:00.000Z",
  },
  {
    id: 4,
    slug: "classmind",
    title: "ClassMind",
    summary: "Academic administration platform with real-time sync and offline-first support.",
    role: "Full Stack Engineer",
    stack: ["Flutter", "Supabase", "PostgreSQL", "Clean Architecture", "BLoC", "Provider"],
    live_url: null,
    repo_url: null,
    cover_image_url: "/app_icons/class_mind_icon.png",
    featured: true,
    sort_order: 4,
    created_at: "2026-06-24T00:00:00.000Z",
  },
  {
    id: 5,
    slug: "welogs",
    title: "Welogs",
    summary: "Supabase-backed Flutter blogging app with clean architecture, BLoC, and personalized feeds.",
    role: "Mobile App Engineer",
    stack: ["Flutter", "Supabase", "Clean Architecture", "BLoC", "Multi-user", "Personalized Feed"],
    live_url: null,
    repo_url: null,
    cover_image_url: "/app_icons/welogs_icon.png",
    featured: true,
    sort_order: 5,
    created_at: "2026-06-24T00:00:00.000Z",
  },
];

export const LOCAL_SKILLS: PortfolioSkill[] = [
  { id: 1, category: "Frontend", name: "Next.js", proficiency: 90, sort_order: 1 },
  { id: 2, category: "Frontend", name: "React", proficiency: 90, sort_order: 2 },
  { id: 3, category: "Frontend", name: "Tailwind", proficiency: 85, sort_order: 3 },
  { id: 4, category: "Backend", name: "FastAPI", proficiency: 95, sort_order: 4 },
  { id: 5, category: "Backend", name: "Django", proficiency: 90, sort_order: 5 },
  { id: 6, category: "Backend", name: "PostgreSQL", proficiency: 90, sort_order: 6 },
  { id: 7, category: "Backend", name: "Redis", proficiency: 80, sort_order: 7 },
  { id: 8, category: "Backend", name: "Supabase", proficiency: 90, sort_order: 8 },
  { id: 9, category: "Mobile", name: "Flutter", proficiency: 95, sort_order: 9 },
  { id: 10, category: "AI", name: "RAG", proficiency: 90, sort_order: 10 },
  { id: 11, category: "AI", name: "MCP", proficiency: 85, sort_order: 11 },
  { id: 12, category: "AI", name: "LangChain", proficiency: 80, sort_order: 12 },
  { id: 13, category: "DevOps", name: "Docker", proficiency: 85, sort_order: 13 },
  { id: 14, category: "DevOps", name: "AWS", proficiency: 80, sort_order: 14 },
];

export const LOCAL_TESTIMONIALS: PortfolioTestimonial[] = [];

export function parsePersonProfile(person: string): PersonProfile {
  const grab = (label: string) => {
    const match = person.match(new RegExp(`- ${label}:\\s*(.+)`));
    return match?.[1]?.trim() ?? "";
  };

  const aboutMatch = person.match(/## About Me\n([\s\S]*?)\n## /);
  const about = aboutMatch?.[1]?.trim().replace(/\n\n+/g, " ") ?? "";

  return {
    name: grab("Name"),
    role: grab("Role"),
    location: grab("Location"),
    email: grab("Email"),
    linkedin: grab("LinkedIn"),
    github: grab("GitHub"),
    about,
  };
}

export function proxiedImageUrl(url?: string | null): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith("/")) {
    return url;
  }

  return `/api/media/proxy?url=${encodeURIComponent(url)}`;
}

export function absoluteProxiedImageUrl(url?: string | null, baseUrl?: string): string | null {
  const proxied = proxiedImageUrl(url);
  if (!proxied) {
    return null;
  }

  if (!baseUrl) {
    return proxied;
  }

  return new URL(proxied, baseUrl).toString();
}

export async function getProjects() {
  return LOCAL_PROJECTS;
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getSkills() {
  return LOCAL_SKILLS;
}

export async function getTestimonials() {
  return LOCAL_TESTIMONIALS;
}

export async function getProfileBundle() {
  return LOCAL_PROFILE_BUNDLE;
}
