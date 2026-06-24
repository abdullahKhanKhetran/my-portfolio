import type { BlogPost } from "../../lib/content";
import { readFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: "testing-claude-fable-5-on-a-real-project",
    title: "Testing Claude Fable 5 on a Real Project: ARIC",
    excerpt:
      "Benchmarks and greenfield demos measure raw generation. I wanted to know how Fable 5 behaves when dropped into an existing codebase with real constraints — so I let it loose on ARIC, my MCP-based agent project.",
    date: "2026-06-12",
    display_date: "June 12, 2026",
    read_time: "7 min read",
    tags: ["AI", "Claude", "Agents", "MCP", "Dev Tools"],
    cover: "/blogs/Testing%20fable%205/OIF.webp",
    content: "",
  },
];

async function readLocalBlogContent(): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "blogs",
    "Testing fable 5",
    "testing fable 5 on real project.txt",
  );
  return readFile(filePath, "utf-8");
}

export async function getLocalBlogPosts(): Promise<BlogPost[]> {
  const content = await readLocalBlogContent();
  return LOCAL_BLOG_POSTS.map((post) => ({
    ...post,
    content,
  }));
}

export async function getLocalBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getLocalBlogPosts();
  return posts.find((post) => post.slug === slug);
}
