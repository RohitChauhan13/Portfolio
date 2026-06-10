import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectImage from "@/components/project-image";
import { ProjectsPageMotion } from "@/components/projects-page-motion";
import { SectionHeading } from "@/components/section-heading";
import { SiteNav } from "@/components/site-nav";
import { getProfile, getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = pageMetadata({
  title: "Projects",
  description: "Project case studies, shipped apps, and production engineering work by Rohit Chauhan.",
  path: "/projects"
});

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Rohit Chauhan",
    description: "Case studies, shipped apps, and practical engineering work.",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/projects/${project.slug}`),
      name: project.title,
      description: project.shortDescription
    }))
  };

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav profile={profile} />
      <ProjectsPageMotion className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="projects-page-heading">
          <SectionHeading eyebrow="Projects" title="Case studies, shipped apps, and practical engineering work." />
        </div>
        <div className="project-list-grid mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id}
              className="project-list-card focus-ring group flex flex-col gap-4 rounded-md border border-border bg-surface p-6 shadow-sm md:flex-row"
            >
              <div className="h-36 w-full md:h-28 md:w-44 flex-shrink-0 overflow-hidden rounded-md border border-border bg-background">
                <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="project-list-image h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">{project.status}</p>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-black text-primary">{project.title}</h2>
                  <ArrowRight className="mt-1 shrink-0 text-accent opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" size={20} />
                </div>
                <p className="mt-3 leading-7 text-ink">{project.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span className="project-list-chip rounded-md border border-border bg-background px-2.5 py-1 text-xs font-bold text-ink" key={tech}>{tech}</span>
                ))}
              </div>
              </div>
            </Link>
          ))}
        </div>
      </ProjectsPageMotion>
    </main>
  );
}
