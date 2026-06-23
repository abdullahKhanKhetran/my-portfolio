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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8011/api/v1";
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
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

export function absoluteProxiedImageUrl(url?: string | null): string | null {
  const proxied = proxiedImageUrl(url);
  if (!proxied) {
    return null;
  }

  return new URL(proxied, SITE_BASE).toString();
}

export async function getProjects() {
  return fetchJson<PortfolioProject[]>("/projects");
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getSkills() {
  return fetchJson<PortfolioSkill[]>("/skills");
}

export async function getTestimonials() {
  return fetchJson<PortfolioTestimonial[]>("/testimonials");
}

export async function getProfileBundle() {
  return fetchJson<ProfileBundle>("/profile");
}

export async function getBlogs() {
  return fetchJson<BlogPost[]>("/blogs");
}

export async function getBlogBySlug(slug: string) {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug);
}
