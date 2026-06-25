import Link from "next/link";
import { LOCAL_PROFILE_BUNDLE, LOCAL_PROJECTS, LOCAL_SKILLS, LOCAL_TESTIMONIALS, parsePersonProfile } from "../../lib/content";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-lg backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[var(--text-strong)]">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const profile = parsePersonProfile(LOCAL_PROFILE_BUNDLE.person);

  const groupedSkills = LOCAL_SKILLS.reduce<Record<string, string[]>>((acc, skill) => {
    const bucket = acc[skill.category] ?? [];
    bucket.push(skill.name);
    acc[skill.category] = bucket;
    return acc;
  }, {});

  return (
    <div className="min-h-screen px-4 py-6 text-[var(--text-strong)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Local Admin Dashboard</p>
              <h1 className="mt-2 font-display text-4xl">Source-controlled content overview</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--text-body)]">
                This dashboard is read-only in the deployed frontend. Update the repo files directly for portfolio content, and use the backend only for chat.
              </p>
            </div>
            <Link href="/" className="rounded-full bg-[var(--btn-primary-bg)] px-4 py-2 text-sm text-[var(--btn-primary-fg)] transition hover:scale-[1.01]">
              Back home
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Projects" value={`${LOCAL_PROJECTS.length}`} />
          <StatCard label="Skills" value={`${LOCAL_SKILLS.length}`} />
          <StatCard label="Testimonials" value={`${LOCAL_TESTIMONIALS.length}`} />
          <StatCard label="Hero image" value={LOCAL_PROFILE_BUNDLE.hero_image_url ? "Local" : "Missing"} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Profile</p>
            <h2 className="mt-2 font-display text-3xl">{profile.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{profile.role} · {profile.location}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--text-body)]">{profile.about}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-[var(--card-border)] px-3 py-2">{profile.email}</span>
              <span className="rounded-full border border-[var(--card-border)] px-3 py-2">GitHub</span>
              <span className="rounded-full border border-[var(--card-border)] px-3 py-2">LinkedIn</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Data locations</p>
            <h2 className="mt-2 font-display text-3xl">Where to update content</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-body)]">
              <li><span className="font-semibold">Hero / profile:</span> `frontend/lib/content.ts`</li>
              <li><span className="font-semibold">Hero image:</span> `frontend/public/my_pictures/side_pose.jpg`</li>
              <li><span className="font-semibold">Projects / skills:</span> `frontend/lib/content.ts`</li>
              <li><span className="font-semibold">Blogs:</span> `frontend/app/blogs/local-posts.ts` and `frontend/public/blogs/`</li>
              <li><span className="font-semibold">Chat knowledge:</span> `backend/knowledge/`</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Projects</p>
            <div className="mt-4 space-y-4">
              {LOCAL_PROJECTS.map((project) => (
                <article key={project.slug} className="rounded-2xl border border-[var(--card-border)] bg-white/60 p-4 dark:bg-black/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{project.role}</p>
                    </div>
                    <span className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs">{project.sort_order}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{project.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((stackItem) => (
                      <span key={stackItem} className="rounded-full border border-[var(--card-border)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                        {stackItem}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Skills</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <div key={category} className="rounded-2xl border border-[var(--card-border)] bg-white/60 p-4 dark:bg-black/20">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">{category}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span key={skill} className="rounded-full border border-[var(--card-border)] px-2.5 py-1 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Testimonials</p>
              <div className="mt-4 rounded-2xl border border-dashed border-[var(--card-border)] bg-white/50 p-6 text-sm text-[var(--text-muted)] dark:bg-black/20">
                No testimonial records are stored locally yet. Add them in `frontend/lib/content.ts` if you want the public site to show them.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
