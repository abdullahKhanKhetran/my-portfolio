import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "../../../components/BlogDetail";
import { absoluteProxiedImageUrl, getBlogBySlug } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  return {
    title: post ? `${post.title} | Abdullah Khan` : "Blog | Abdullah Khan",
    description: post?.excerpt || "Blog post by Abdullah Khan",
    openGraph: post
      ? {
          title: post.title,
          description: post.excerpt,
          type: "article",
          publishedTime: post.date,
          images: absoluteProxiedImageUrl(post.cover) ? [{ url: absoluteProxiedImageUrl(post.cover)! }] : undefined,
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
