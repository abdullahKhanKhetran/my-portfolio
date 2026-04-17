import { projects } from "../../../components/portfolioData";
import ProjectDetail from "../../../components/ProjectDetail";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project: { name: string }) => ({
    slug: project.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(
    (p: { name: string; description: string }) => p.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
  return {
    title: project ? `${project.name} | Abdullah Khan` : "Project | Abdullah Khan",
    description: project?.description || "Project Portfolio",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(
    (p: { name: string; description: string; fullDescription: string; icon: string; screenshots: string[]; tech: string[]; features: string[]; link: string; year: string; role: string }) => p.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Project not found</h1>
      </div>
    );
  }

  return <ProjectDetail project={project} />;
}