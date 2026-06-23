import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "../../../components/ProjectDetail";
import { getProjectBySlug } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return {
    title: project ? `${project.title} | Abdullah Khan` : "Project | Abdullah Khan",
    description: project?.summary || "Project Portfolio",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
