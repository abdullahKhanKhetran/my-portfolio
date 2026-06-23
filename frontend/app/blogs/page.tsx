import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogList from "../../components/BlogList";
import { getBlogs } from "../../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog | Abdullah Khan",
  description:
    "Field notes from Abdullah Khan — building software, testing AI tooling, and lessons from real projects.",
};

export default async function BlogsPage() {
  const posts = await getBlogs();
  if (!posts.length) {
    notFound();
  }
  return <BlogList posts={posts} />;
}
