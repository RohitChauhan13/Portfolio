import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Layers3, Rocket, Sparkles, Target } from "lucide-react";
import ProjectImage from "@/components/project-image";
import { SiteNav } from "@/components/site-nav";
import { getProfile, getProject } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  if (!project) redirect("/");
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
        <Link href="/projects" className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm font-black text-primary transition hover:text-accent">
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <section className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{project.status}</Badge>
              {project.role && <Badge>{project.role}</Badge>}
            </div>
            <h1 className="mt-6 max-w-5xl break-words text-5xl font-black leading-none text-primary sm:text-7xl lg:text-8xl">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-2xl font-bold leading-9 text-ink">{project.shortDescription}</p>
            {project.createdFor && (
              <div className="mt-6 flex gap-3 rounded-md border border-border bg-surface p-4">
                <Target className="mt-1 shrink-0 text-accent" size={20} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">Built for</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-primary">{project.createdFor}</p>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && <External href={project.liveUrl} label="Live site" primary />}
              {project.demoUrl && <External href={project.demoUrl} label="Demo video" />}
              {project.githubUrl && <External href={project.githubUrl} label="GitHub" />}
              {project.storeUrl && <External href={project.storeUrl} label="Store link" />}
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-md border border-border bg-surface shadow-panel">
              <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="aspect-[4/3] w-full object-cover" />
              <div className="grid gap-4 border-t border-border p-5">
                <Info icon={<Layers3 size={18} />} label="Role" value={project.role} />
                <Info icon={<Rocket size={18} />} label="Status" value={project.status} />
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <MetricCard label="Project type" value={project.status} />
          <MetricCard label="Contribution" value={project.role || "Add role in admin"} />
          <MetricCard label="Stack size" value={`${project.techStack.length || 0} technologies`} />
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-md border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="text-accent" size={22} />
              <h2 className="text-3xl font-black text-primary">Case Study</h2>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-lg font-bold leading-9 text-ink">{project.caseStudy || "Add the project story from admin."}</p>
          </section>

          <section className="rounded-md border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-2xl font-black text-primary">Technology Stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.length > 0 ? (
                project.techStack.map((tech) => (
                  <span key={tech} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-black text-primary">{tech}</span>
                ))
              ) : (
                <p className="text-sm font-bold leading-6 text-ink">Add technologies from admin.</p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-md border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-accent" size={24} />
            <h2 className="text-3xl font-black text-primary">Impact</h2>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {(project.impact.length > 0 ? project.impact : ["Add impact points from admin."]).map((item) => (
              <li className="flex gap-3 rounded-md border border-border bg-background px-4 py-4 text-sm font-bold leading-6 text-ink" key={item}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

function Badge({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "accent" }) {
  return (
    <span className={tone === "accent" ? "rounded-full bg-accent px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white" : "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-primary"}>
      {children}
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">{label}</p>
      <p className="mt-3 text-xl font-black leading-7 text-primary">{value}</p>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">{icon}</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">{label}</p>
        <p className="mt-1 text-sm font-bold leading-6 text-primary">{value || "Add in admin"}</p>
      </div>
    </div>
  );
}

function External({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={primary ? "focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-button-text transition hover:bg-primary/90" : "focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-black text-primary transition hover:border-primary"}>
      {label}
      <ExternalLink size={16} />
    </Link>
  );
}
