import Link from "next/link";
import { ArrowRight, Award, BriefcaseBusiness, CheckCircle2, Download, GraduationCap, MapPin, Rocket, Server, Smartphone, Star, Trophy } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ProfileAvatar } from "@/components/profile-avatar";
import { SectionHeading } from "@/components/section-heading";
import { SiteNav } from "@/components/site-nav";
import ProjectImage from "@/components/project-image";
import { getAchievements, getEducation, getExperience, getProfile, getProjects, getSkills } from "@/lib/data";
import { pageMetadata, profileJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    description: profile.summary,
    path: "/",
    image: profile.avatarUrl
  });
}

export default async function HomePage() {
  const [profile, skills, projects, experience, education, achievements] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
    getEducation(),
    getAchievements()
  ]);
  const featuredSkills = skills.filter((skill) => skill.isFeatured);
  const heroSkills = featuredSkills.length ? featuredSkills : skills;
  const projectRail = projects.length > 1 ? [...projects, ...projects] : projects;
  const jsonLd = [websiteJsonLd(), profileJsonLd(profile, skills, projects)];

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav profile={profile} />
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-x-0 top-0 h-px bg-primary/30" />
        <div className="mx-auto grid w-full max-w-7xl items-start gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)] lg:gap-10 lg:px-8 lg:py-12">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 text-xs font-black text-primary sm:text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-button-text">1</span>
              <span className="min-w-0 leading-5">year professional experience since May 2025</span>
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] text-primary sm:text-7xl">
              {profile.publicName}
            </h1>
            <p className="mt-4 max-w-3xl text-2xl font-black leading-tight text-foreground sm:text-4xl">{profile.headline}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink">{profile.summary}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-black text-button-text transition hover:bg-primary/90" href="#work">
                Explore work
                <ArrowRight size={17} />
              </Link>
              <Link className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 text-sm font-black text-primary transition hover:border-primary" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download size={17} />
                Resume
              </Link>
            </div>
            <div className="mt-7 grid gap-3 text-sm font-bold text-ink sm:grid-cols-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2"><MapPin size={17} className="text-accent" />{profile.location}</span>
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2"><BriefcaseBusiness size={17} className="text-accent" />{profile.openTo}</span>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 lg:pt-5">
            <div className="overflow-hidden rounded-md border border-border bg-surface shadow-panel">
              <div className="grid gap-0 sm:grid-cols-[0.62fr_1fr]">
                <div className="bg-muted p-3">
                  <ProfileAvatar name={profile.publicName} avatarUrl={profile.avatarUrl} className="mx-auto aspect-[4/5] h-auto w-full max-w-64 sm:max-w-none" priority />
                </div>
                <div className="grid content-between gap-5 p-5">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">Now building</p>
                      <Rocket size={18} className="text-primary" />
                    </div>
                    <p className="mt-4 text-2xl font-black leading-tight text-primary sm:text-3xl">Mobile apps, APIs, and tools that survive real users.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard value="10k+" label="users/downloads" />
                    <MetricCard value="15+" label="backend flows" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-accent">
                    <Server size={15} />
                    Stack in motion
                  </div>
                  <p className="mt-3 text-2xl font-black leading-tight text-primary">React Native, backend APIs, and admin tools in one delivery loop.</p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-md bg-background text-accent sm:grid">
                  <Smartphone size={24} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {heroSkills.slice(0, 6).map((skill) => (
                  <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-black text-primary" key={skill.id}>{skill.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="work">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Selected work" title="Production-first projects with real business outcomes." text="All projects are visible here in one smooth horizontal rail. Open any card for the full case study." />
            <Link className="focus-ring inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-black text-primary transition hover:border-primary" href="/projects">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="project-rail mt-10 overflow-hidden">
            <div className="project-rail-track flex w-max gap-5">
              {projectRail.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={`${project.id}-${index}`}
                className="focus-ring w-[17rem] shrink-0 rounded-md border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-panel sm:w-[19rem]"
              >
                <div className="overflow-hidden rounded-md border border-border bg-background">
                  <ProjectImage imageUrl={project.imageUrl} title={project.title} alt={project.title} className="h-32 w-full object-cover" />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-md bg-background px-3 py-1 text-xs font-black text-accent">{project.status}</span>
                  <Star size={18} className="text-accent" />
                </div>
                <h3 className="mt-3 text-xl font-black text-primary">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink">{project.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-bold text-ink" key={tech}>{tech}</span>
                  ))}
                </div>
              </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-16 sm:px-6 lg:px-8" id="skills">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Skills" title="A practical stack for mobile products and backend systems." text="Grouped around the work recruiters actually care about: shipping apps, integrating APIs, managing data, and debugging production issues." />
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <div className="rounded-md border border-border bg-background p-4" key={skill.id}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black text-primary">{skill.name}</p>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-accent">{skill.category}</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="experience">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHeading eyebrow="Experience" title="Full-stack delivery inside real product work." />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
            {experience.map((job) => (
              <article className="rounded-md border border-border bg-surface p-6 shadow-sm" key={job.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h3 className="text-2xl font-black text-primary">{job.role}</h3>
                    <p className="mt-1 font-bold text-ink">{job.company} - {job.location}</p>
                  </div>
                  <p className="text-sm font-black text-accent">May 12, 2025 - Present</p>
                </div>
                <p className="mt-5 leading-7 text-ink">{job.summary}</p>
                <ul className="mt-5 grid gap-3">
                  {job.highlights.map((item) => (
                    <li className="flex gap-3 text-sm leading-6 text-ink" key={item}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <div className="rounded-md border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-accent">Proof</p>
                  <h3 className="mt-2 text-2xl font-black text-primary">Education and wins</h3>
                </div>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-background text-accent">
                  <Trophy size={24} />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {education.map((item) => (
                  <article className="rounded-md border border-border bg-background p-4" key={item.id}>
                    <div className="flex gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface text-primary">
                        <GraduationCap size={21} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black leading-6 text-primary">{item.degree}</p>
                        <p className="mt-1 text-sm leading-6 text-ink">{item.institution}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-black text-accent">{item.grade}</span>
                          <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-ink">{item.startYear}-{item.endYear}</span>
                          <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-ink">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {achievements.filter((item) => item.isFeatured).map((item) => (
                  <article className="rounded-md border border-border bg-background p-4" key={item.id}>
                    <div className="flex gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface text-accent">
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-primary">{item.title}</p>
                          {item.date && <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-black text-accent">{item.date}</span>}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-ink">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-8" id="contact">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.78fr_1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Let's talk about the next product to ship." text="Have a role, project, or collaboration in mind? Send a quick note and I'll get back to you soon." />
            <div className="mt-8 space-y-3 text-sm font-bold text-ink">
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.location}</p>
            </div>
          </div>
          <div className="rounded-md border border-border bg-background p-6 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
      <p className="text-2xl font-black leading-none text-primary">{value}</p>
      <p className="mt-2 text-xs font-black leading-5 text-ink">{label}</p>
    </div>
  );
}
