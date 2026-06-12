import { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPost } from "../../../components/blogData";
import BlogDetail from "../../../components/BlogDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: post ? `${post.title} | Abdullah Khan` : "Blog | Abdullah Khan",
    description: post?.excerpt || "Blog post by Abdullah Khan",
    openGraph: post
      ? {
          title: post.title,
          description: post.excerpt,
          type: "article",
          publishedTime: post.date,
          images: [{ url: post.cover }],
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link href="/blogs" className="text-emerald-400 hover:underline font-mono text-sm">
          cd ~/blogs
        </Link>
      </div>
    );
  }

  return <BlogDetail post={post} />;
}
