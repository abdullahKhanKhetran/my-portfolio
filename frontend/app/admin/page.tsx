"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TabKey = "projects" | "skills" | "testimonials" | "messages" | "knowledge";

type Project = {
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
};

type Skill = {
  id: number;
  category: string;
  name: string;
  proficiency?: number | null;
  sort_order: number;
};

type Testimonial = {
  id: number;
  author_name: string;
  author_role?: string | null;
  company?: string | null;
  quote: string;
  avatar_url?: string | null;
  sort_order: number;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
};

type KnowledgeFile = {
  path: string;
  content: string;
};

type ProjectForm = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string;
  live_url: string;
  repo_url: string;
  cover_image_url: string;
  featured: boolean;
  sort_order: number;
};

type SkillForm = {
  category: string;
  name: string;
  proficiency: number | "";
  sort_order: number;
};

type TestimonialForm = {
  author_name: string;
  author_role: string;
  company: string;
  quote: string;
  avatar_url: string;
  sort_order: number;
};

type CloudinaryUploadResult = {
  secure_url?: string;
  url?: string;
  public_id?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
const TOKEN_STORAGE_KEY = "portfolio-admin-token";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "testimonials", label: "Testimonials" },
  { key: "messages", label: "Messages" },
  { key: "knowledge", label: "Knowledge" },
];

const emptyProjectForm: ProjectForm = {
  slug: "",
  title: "",
  summary: "",
  role: "",
  stack: "",
  live_url: "",
  repo_url: "",
  cover_image_url: "",
  featured: true,
  sort_order: 0,
};

const emptySkillForm: SkillForm = {
  category: "",
  name: "",
  proficiency: 80,
  sort_order: 0,
};

const emptyTestimonialForm: TestimonialForm = {
  author_name: "",
  author_role: "",
  company: "",
  quote: "",
  avatar_url: "",
  sort_order: 0,
};

export default function AdminPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<string[]>([]);
  const [currentKnowledge, setCurrentKnowledge] = useState<KnowledgeFile | null>(null);

  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [projectEditId, setProjectEditId] = useState<number | null>(null);

  const [skillForm, setSkillForm] = useState<SkillForm>(emptySkillForm);
  const [skillEditId, setSkillEditId] = useState<number | null>(null);

  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonialForm);
  const [testimonialEditId, setTestimonialEditId] = useState<number | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [knowledgePath, setKnowledgePath] = useState("person.md");
  const [knowledgeDraft, setKnowledgeDraft] = useState("");

  const authHeaders = useMemo<Record<string, string>>(() => {
    if (!adminToken) return {} as Record<string, string>;
    return { "X-Admin-Token": adminToken };
  }, [adminToken]);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
    if (savedToken) {
      setAdminToken(savedToken);
      setTokenInput(savedToken);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!adminToken) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  useEffect(() => {
    if (!currentKnowledge) return;
    setKnowledgePath(currentKnowledge.path);
    setKnowledgeDraft(currentKnowledge.content);
  }, [currentKnowledge]);

  async function apiFetch(path: string, init?: RequestInit) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      setAdminToken("");
      throw new Error("Admin token rejected");
    }

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || response.statusText);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadAll() {
    setLoading(true);
    setStatus("Loading admin data...");
    try {
      const [projectsRes, skillsRes, testimonialsRes, messagesRes, knowledgeRes] = await Promise.all([
        apiFetch("/admin/projects"),
        apiFetch("/admin/skills"),
        apiFetch("/admin/testimonials"),
        apiFetch("/admin/messages"),
        apiFetch("/admin/knowledge/files"),
      ]);

      setProjects(projectsRes);
      setSkills(skillsRes);
      setTestimonials(testimonialsRes);
      setMessages(messagesRes);
      setKnowledgeFiles(knowledgeRes.files ?? []);
      if (!currentKnowledge && knowledgeRes.files?.length) {
        await loadKnowledgeFile(knowledgeRes.files[0]);
      }
      setStatus("Admin data loaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function loadKnowledgeFile(path: string) {
    setKnowledgePath(path);
    const doc = await apiFetch(`/admin/knowledge/${encodeURIComponent(path)}`);
    setCurrentKnowledge(doc);
    setKnowledgeDraft(doc.content);
  }

  async function uploadAvatar(file: File) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary upload settings are missing in frontend/.env");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setIsUploadingAvatar(true);
    setStatus("Uploading testimonial avatar...");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as CloudinaryUploadResult;
      if (!response.ok) {
        throw new Error(payload?.secure_url ? "Upload failed" : "Cloudinary upload failed");
      }

      const uploadedUrl = payload.secure_url ?? payload.url;
      if (!uploadedUrl) {
        throw new Error("Cloudinary did not return an image URL");
      }

      setTestimonialForm((current) => ({ ...current, avatar_url: uploadedUrl }));
      setStatus("Testimonial avatar uploaded.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleAvatarFile(file: File | null) {
    if (!file) return;
    try {
      await uploadAvatar(file);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to upload avatar");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenInput.trim());
    setAdminToken(tokenInput.trim());
    setStatus("Signed in.");
  }

  function resetProjectForm() {
    setProjectForm(emptyProjectForm);
    setProjectEditId(null);
  }

  function resetSkillForm() {
    setSkillForm(emptySkillForm);
    setSkillEditId(null);
  }

  function resetTestimonialForm() {
    setTestimonialForm(emptyTestimonialForm);
    setTestimonialEditId(null);
  }

  function beginEditProject(project: Project) {
    setProjectEditId(project.id);
    setProjectForm({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      role: project.role,
      stack: project.stack.join(", "),
      live_url: project.live_url ?? "",
      repo_url: project.repo_url ?? "",
      cover_image_url: project.cover_image_url ?? "",
      featured: project.featured,
      sort_order: project.sort_order,
    });
    setActiveTab("projects");
  }

  function beginEditSkill(skill: Skill) {
    setSkillEditId(skill.id);
    setSkillForm({
      category: skill.category,
      name: skill.name,
      proficiency: skill.proficiency ?? "",
      sort_order: skill.sort_order,
    });
    setActiveTab("skills");
  }

  function beginEditTestimonial(testimonial: Testimonial) {
    setTestimonialEditId(testimonial.id);
    setTestimonialForm({
      author_name: testimonial.author_name,
      author_role: testimonial.author_role ?? "",
      company: testimonial.company ?? "",
      quote: testimonial.quote,
      avatar_url: testimonial.avatar_url ?? "",
      sort_order: testimonial.sort_order,
    });
    setActiveTab("testimonials");
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...projectForm,
      stack: projectForm.stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      live_url: projectForm.live_url || null,
      repo_url: projectForm.repo_url || null,
      cover_image_url: projectForm.cover_image_url || null,
    };
    const method = projectEditId ? "PUT" : "POST";
    const path = projectEditId ? `/admin/projects/${projectEditId}` : "/admin/projects";
    await apiFetch(path, { method, body: JSON.stringify(body) });
    resetProjectForm();
    await loadAll();
  }

  async function saveSkill(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...skillForm,
      proficiency: skillForm.proficiency === "" ? null : Number(skillForm.proficiency),
    };
    const method = skillEditId ? "PUT" : "POST";
    const path = skillEditId ? `/admin/skills/${skillEditId}` : "/admin/skills";
    await apiFetch(path, { method, body: JSON.stringify(body) });
    resetSkillForm();
    await loadAll();
  }

  async function saveTestimonial(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...testimonialForm,
      author_role: testimonialForm.author_role || null,
      company: testimonialForm.company || null,
      avatar_url: testimonialForm.avatar_url || null,
    };
    const method = testimonialEditId ? "PUT" : "POST";
    const path = testimonialEditId ? `/admin/testimonials/${testimonialEditId}` : "/admin/testimonials";
    await apiFetch(path, { method, body: JSON.stringify(body) });
    resetTestimonialForm();
    await loadAll();
  }

  async function saveKnowledge(e: React.FormEvent) {
    e.preventDefault();
    const updated = await apiFetch(`/admin/knowledge/${encodeURIComponent(knowledgePath)}`, {
      method: "PUT",
      body: JSON.stringify({ content: knowledgeDraft }),
    });
    setCurrentKnowledge(updated);
    setStatus("Knowledge file saved.");
    await loadAll();
  }

  async function updateMessageStatus(message: Message, statusValue: string) {
    await apiFetch(`/admin/messages/${message.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: statusValue }),
    });
    await loadAll();
  }

  async function deleteEntity(path: string) {
    await apiFetch(path, { method: "DELETE" });
    await loadAll();
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-[var(--background)]" />;
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--text-strong)]">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
          <form onSubmit={handleLogin} className="w-full rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Admin Access</p>
            <h1 className="mt-3 font-display text-3xl">Portfolio Control Room</h1>
            <p className="mt-3 text-sm text-[var(--text-body)]">
              Enter the admin token to unlock the CRUD dashboard for projects, skills, testimonials, messages, and knowledge.
            </p>
            <label className="mt-6 block text-sm font-medium">Admin token</label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--text-faint)] dark:bg-black/30"
              placeholder="Enter admin token"
            />
            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[var(--btn-primary-bg)] px-4 py-3 font-medium text-[var(--btn-primary-fg)] transition-transform hover:scale-[1.01]"
            >
              Sign In
            </button>
            {status ? <p className="mt-4 text-sm text-[var(--text-muted)]">{status}</p> : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-strong)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Admin Dashboard</p>
              <h1 className="mt-2 font-display text-4xl">Manage your portfolio data</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--text-body)]">
                Use this panel to create, edit, and remove content across the portfolio and knowledge base.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={loadAll} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10">
                Refresh
              </button>
              <button
                onClick={() => {
                  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
                  setAdminToken("");
                }}
                className="rounded-full bg-[var(--btn-primary-bg)] px-4 py-2 text-sm text-[var(--btn-primary-fg)] transition hover:scale-[1.01]"
              >
                Sign Out
              </button>
            </div>
          </div>
          {status ? <p className="mt-4 text-sm text-[var(--text-muted)]">{status}</p> : null}
        </header>

        <nav className="flex flex-wrap gap-2 rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm transition ${activeTab === tab.key ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)]" : "text-[var(--text-body)] hover:bg-black/5 dark:hover:bg-white/10"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? <p className="text-sm text-[var(--text-muted)]">Loading...</p> : null}

        {activeTab === "projects" ? (
          <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <form onSubmit={saveProject} className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <h2 className="font-display text-2xl">Projects</h2>
              <div className="mt-4 grid gap-3">
                <input value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="slug" />
                <input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="title" />
                <input value={projectForm.role} onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="role" />
                <textarea value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} className="min-h-28 rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="summary" />
                <input value={projectForm.stack} onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="stack, comma separated" />
                <input value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="live url" />
                <input value={projectForm.repo_url} onChange={(e) => setProjectForm({ ...projectForm, repo_url: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="repo url" />
                <input value={projectForm.cover_image_url} onChange={(e) => setProjectForm({ ...projectForm, cover_image_url: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="cover image url" />
                <div className="flex items-center gap-3">
                  <input id="project-featured" type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                  <label htmlFor="project-featured" className="text-sm">Featured</label>
                </div>
                <input type="number" value={projectForm.sort_order} onChange={(e) => setProjectForm({ ...projectForm, sort_order: Number(e.target.value) })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="sort order" />
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" className="rounded-full bg-[var(--btn-primary-bg)] px-5 py-3 text-sm text-[var(--btn-primary-fg)]">{projectEditId ? "Update" : "Create"}</button>
                <button type="button" onClick={resetProjectForm} className="rounded-full border border-[var(--card-border)] px-5 py-3 text-sm">Reset</button>
              </div>
            </form>

            <div className="grid gap-4">
              {projects.map((project) => (
                <article key={project.id} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{project.slug}</p>
                      <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-body)]">{project.summary}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">{project.stack.join(" • ")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => beginEditProject(project)} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs">Edit</button>
                      <button onClick={() => deleteEntity(`/admin/projects/${project.id}`)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-500">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "skills" ? (
          <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <form onSubmit={saveSkill} className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <h2 className="font-display text-2xl">Skills</h2>
              <div className="mt-4 grid gap-3">
                <input value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="category" />
                <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="name" />
                <input type="number" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value === "" ? "" : Number(e.target.value) })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="proficiency" />
                <input type="number" value={skillForm.sort_order} onChange={(e) => setSkillForm({ ...skillForm, sort_order: Number(e.target.value) })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="sort order" />
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" className="rounded-full bg-[var(--btn-primary-bg)] px-5 py-3 text-sm text-[var(--btn-primary-fg)]">{skillEditId ? "Update" : "Create"}</button>
                <button type="button" onClick={resetSkillForm} className="rounded-full border border-[var(--card-border)] px-5 py-3 text-sm">Reset</button>
              </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <article key={skill.id} className="rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{skill.category}</p>
                  <h3 className="mt-1 text-lg font-semibold">{skill.name}</h3>
                  <p className="mt-2 text-sm text-[var(--text-body)]">Proficiency: {skill.proficiency ?? "-"}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => beginEditSkill(skill)} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs">Edit</button>
                    <button onClick={() => deleteEntity(`/admin/skills/${skill.id}`)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-500">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "testimonials" ? (
          <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <form onSubmit={saveTestimonial} className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <h2 className="font-display text-2xl">Testimonials</h2>
              <div className="mt-4 grid gap-3">
                <input value={testimonialForm.author_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, author_name: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="author name" />
                <input value={testimonialForm.author_role} onChange={(e) => setTestimonialForm({ ...testimonialForm, author_role: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="author role" />
                <input value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="company" />
                <textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} className="min-h-32 rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="quote" />
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    void handleAvatarFile(e.dataTransfer.files?.[0] ?? null);
                  }}
                  className="rounded-3xl border border-dashed border-[var(--card-border)] bg-white/70 p-4 dark:bg-black/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Avatar upload</p>
                      <p className="text-xs text-[var(--text-muted)]">Drop an image here or browse from your device.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs transition hover:bg-black/5 dark:hover:bg-white/10"
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? "Uploading..." : "Browse"}
                    </button>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void handleAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  {testimonialForm.avatar_url ? (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-white/80 p-3 dark:bg-black/30">
                      <img src={testimonialForm.avatar_url} alt="testimonial avatar preview" className="h-14 w-14 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">Uploaded URL</p>
                        <p className="truncate text-sm">{testimonialForm.avatar_url}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-[var(--text-muted)]">No avatar uploaded yet.</p>
                  )}
                </div>
                <input type="number" value={testimonialForm.sort_order} onChange={(e) => setTestimonialForm({ ...testimonialForm, sort_order: Number(e.target.value) })} className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm dark:bg-black/30" placeholder="sort order" />
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" className="rounded-full bg-[var(--btn-primary-bg)] px-5 py-3 text-sm text-[var(--btn-primary-fg)]">{testimonialEditId ? "Update" : "Create"}</button>
                <button type="button" onClick={resetTestimonialForm} className="rounded-full border border-[var(--card-border)] px-5 py-3 text-sm">Reset</button>
              </div>
            </form>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Current preview</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-black/5">
                    {testimonialForm.avatar_url ? (
                      <img src={testimonialForm.avatar_url} alt="testimonial preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">Preview</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{testimonialForm.author_name || "Preview name"}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{testimonialForm.author_role || "Role"}{testimonialForm.company ? ` • ${testimonialForm.company}` : ""}</p>
                    <p className="mt-2 text-sm text-[var(--text-body)] line-clamp-3">{testimonialForm.quote || "Your testimonial text will appear here after upload and form entry."}</p>
                  </div>
                </div>
              </div>
              {testimonials.map((testimonial) => (
                <article key={testimonial.id} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
                  <p className="text-sm text-[var(--text-body)]">{testimonial.quote}</p>
                  <div className="mt-4 flex flex-col gap-1 text-sm">
                    <span className="font-semibold">{testimonial.author_name}</span>
                    <span className="text-[var(--text-muted)]">{testimonial.author_role ?? ""} {testimonial.company ? `• ${testimonial.company}` : ""}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => beginEditTestimonial(testimonial)} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs">Edit</button>
                    <button onClick={() => deleteEntity(`/admin/testimonials/${testimonial.id}`)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-500">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "messages" ? (
          <section className="grid gap-4">
            {messages.map((message) => (
              <article key={message.id} className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{message.status}</p>
                    <h3 className="mt-1 text-lg font-semibold">{message.subject}</h3>
                    <p className="mt-1 text-sm text-[var(--text-body)]">{message.name} • {message.email}</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--text-body)]">{message.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateMessageStatus(message, "read")} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs">Mark read</button>
                    <button onClick={() => updateMessageStatus(message, "resolved")} className="rounded-full border border-[var(--card-border)] px-4 py-2 text-xs">Resolve</button>
                    <button onClick={() => deleteEntity(`/admin/messages/${message.id}`)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs text-red-500">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === "knowledge" ? (
          <section className="grid gap-6 xl:grid-cols-[280px_1fr]">
            <aside className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-lg backdrop-blur-xl">
              <h2 className="font-display text-2xl">Knowledge Files</h2>
              <div className="mt-4 grid gap-2">
                {knowledgeFiles.map((file) => (
                  <button
                    key={file}
                    onClick={() => loadKnowledgeFile(file)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${knowledgePath === file ? "border-transparent bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)]" : "border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/10"}`}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={saveKnowledge} className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Edit Markdown</p>
                  <h2 className="mt-1 font-display text-2xl">{knowledgePath}</h2>
                </div>
                <input value={knowledgePath} onChange={(e) => setKnowledgePath(e.target.value)} className="w-full rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3 text-sm lg:max-w-md dark:bg-black/30" placeholder="path inside knowledge/" />
              </div>
              <textarea
                value={knowledgeDraft}
                onChange={(e) => setKnowledgeDraft(e.target.value)}
                className="mt-4 min-h-[32rem] w-full rounded-[1.5rem] border border-[var(--card-border)] bg-white/80 px-4 py-4 font-mono text-sm leading-6 dark:bg-black/30"
                placeholder="Markdown content"
              />
              <div className="mt-4 flex gap-3">
                <button type="submit" className="rounded-full bg-[var(--btn-primary-bg)] px-5 py-3 text-sm text-[var(--btn-primary-fg)]">Save</button>
                <button
                  type="button"
                  onClick={() => currentKnowledge && setKnowledgeDraft(currentKnowledge.content)}
                  className="rounded-full border border-[var(--card-border)] px-5 py-3 text-sm"
                >
                  Revert
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </div>
  );
}


