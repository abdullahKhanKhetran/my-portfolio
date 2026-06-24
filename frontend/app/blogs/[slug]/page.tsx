import type { Metadata } from "next";
import BlogDetail from "../../../components/BlogDetail";
import { absoluteProxiedImageUrl, getBlogBySlug } from "../../../lib/content";
import { getLocalBlogPost } from "../local-posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogBySlug(slug).catch(() => undefined)) ?? (await getLocalBlogPost(slug));
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
  const post = (await getBlogBySlug(slug).catch(() => undefined)) ?? (await getLocalBlogPost(slug));

  if (!post) {
    throw new Error("Blog post not found");
  }

  return <BlogDetail post={post} />;
}
