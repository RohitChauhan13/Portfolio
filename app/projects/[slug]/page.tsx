import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Layers3 } from "lucide-react";
import ProjectImage from "@/components/project-image";
import { SiteNav } from "@/components/site-nav";
import { getProfile, getProject, getProjects } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return pageMetadata({
      title: "Project",
      description: "Project case study by Rohit Chauhan.",
      path: `/projects/${slug}`
    });
  }

  return pageMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
    image: project.imageUrl,
    type: "article"
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, project] = await Promise.all([getProfile(), getProject(slug)]);
  if (!project) notFound();
  const jsonLd = [
    projectJsonLd(project, profile),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.title, path: `/projects/${project.slug}` }
    ])
  ];

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav profile={profile} />
      <article className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/projects" className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm font-black text-primary">
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <section className="mt-8 overflow-hidden rounded-md border border-border bg-surface shadow-panel">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <p className="rounded-md bg-background px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-accent">{project.status}</p>
                {project.createdFor && <p className="rounded-md border border-border px-3 py-1.5 text-xs font-black text-primary">{project.createdFor}</p>}
              </div>
              <h1 className="mt-6 max-w-full break-words text-4xl font-black leading-tight text-primary sm:text-6xl lg:text-7xl">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-xl leading-8 text-ink">{project.shortDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl && <External href={project.demoUrl} label="Demo video" />}
                {project.liveUrl && <External href={project.liveUrl} label="Live site" />}
                {project.githubUrl && <External href={project.githubUrl} label="GitHub" />}
                {project.storeUrl && <External href={project.storeUrl} label="Store link" />}
              </div>
            </div>
            <div className="border-t border-border bg-background p-5 lg:border-l lg:border-t-0">
              <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="aspect-[4/3] w-full rounded-md border border-border object-cover" />
              <div className="mt-4 rounded-md bg-primary p-4 text-white">
                <div className="flex items-center gap-3">
                  <Layers3 className="text-accent" size={22} />
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-white/70">Project snapshot</p>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-white/90">{project.role || "Role details can be added from admin."}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 rounded-md border border-border bg-surface p-5 shadow-sm sm:grid-cols-3">
          <Info label="Role" value={project.role} />
          <Info label="Stack" value={project.techStack.join(", ")} />
          <Info label="Status" value={project.status} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-md border border-border bg-surface p-6">
            <h2 className="text-3xl font-black text-primary">What we did</h2>
            <p className="mt-4 leading-8 text-ink">{project.caseStudy}</p>
          </section>
          <section className="rounded-md border border-border bg-surface p-6">
            <h2 className="text-2xl font-black text-primary">Skills required</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-md border border-border bg-background px-3 py-1 text-sm font-bold text-ink">{tech}</span>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-md border border-border bg-surface p-6">
          <h2 className="text-3xl font-black text-primary">Impact</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {project.impact.map((item) => (
              <li className="flex gap-3 rounded-md bg-background px-4 py-4 text-sm font-bold leading-6 text-ink" key={item}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-primary">{value || "Add in admin"}</p>
    </div>
  );
}

function External({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-button-text">
      {label}
      <ExternalLink size={16} />
    </Link>
  );
}
