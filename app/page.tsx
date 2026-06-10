import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, Award, CheckCircle2, Github, GraduationCap, Instagram, Linkedin, Mail, MapPin, Phone, Trophy } from "lucide-react";
import HeroImage from "@/Image/HeroImage-Photoroom.png";
import { ContactForm } from "@/components/contact-form";
import { ExperienceMotion } from "@/components/experience-motion";
import { HeroIntroMotion } from "@/components/hero-intro-motion";
import { HeroNav } from "@/components/hero-nav";
import { HeroTechField } from "@/components/hero-tech-field";
import { ProjectCarousel } from "@/components/project-carousel";
import { SectionHeading } from "@/components/section-heading";
import { SkillsMotion } from "@/components/skills-motion";
import { getAchievements, getEducation, getExperience, getProfile, getProjects, getSkills } from "@/lib/data";
import { experienceYearUnit, formatExperienceYears, getProfessionalExperienceYears, PROFESSIONAL_EXPERIENCE_START_LABEL } from "@/lib/experience-duration";
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
  const jsonLd = [websiteJsonLd(), profileJsonLd(profile, skills, projects)];
  const experienceYears = getProfessionalExperienceYears();
  const experienceYearsLabel = formatExperienceYears(experienceYears);
  const experienceUnit = experienceYearUnit(experienceYearsLabel);
  const featuredAchievements = achievements
    .filter((item) => item.isFeatured)
    .map((item) =>
      item.id === "one-year-production"
        ? {
            ...item,
            title: `${experienceYearsLabel} ${experienceUnit} of professional product work`,
            description: `Completed ${experienceYearsLabel} ${experienceUnit} of hands-on React Native and full-stack development from ${PROFESSIONAL_EXPERIENCE_START_LABEL}.`,
            date: new Date().getUTCFullYear().toString()
          }
        : item
    );

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative min-h-screen overflow-hidden bg-background text-primary">
        <HeroTechField />
        <HeroIntroMotion className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="flex h-14 items-center justify-between gap-6">
            <Link href="/" className="hero-nav-item focus-ring text-xl font-black italic tracking-tight text-primary">
              {"<"} Rohit dev {"/>"}
            </Link>
            <HeroNav />
          </header>

          <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)]">
            <div className="max-w-xl">
              <p className="hero-copy-item text-base font-bold text-ink">Hey !</p>
              <h1 className="hero-name mt-2 text-4xl font-black leading-none text-primary sm:text-5xl">
                <span className="sr-only">I&apos;m {profile.publicName}</span>
                <span aria-hidden="true">{animatedName(`I'm ${profile.publicName}`)}</span>
              </h1>
              <p className="hero-copy-item mt-3 text-xl font-bold text-ink">{profile.headline}</p>
              <p className="hero-copy-item mt-5 max-w-lg text-sm font-semibold leading-7 text-ink">{profile.summary}</p>
              <div className="hero-copy-item mt-6 flex flex-wrap items-center gap-3">
                {profile.githubUrl && <HeroSocial href={profile.githubUrl} label="GitHub"><Github size={18} /></HeroSocial>}
                {profile.instagramUrl && <HeroSocial href={profile.instagramUrl} label="Instagram"><Instagram size={18} /></HeroSocial>}
                {profile.linkedinUrl && <HeroSocial href={profile.linkedinUrl} label="LinkedIn"><Linkedin size={18} /></HeroSocial>}
                <HeroSocial href="#contact" label="Contact"><Mail size={18} /></HeroSocial>
              </div>
              <div className="hero-copy-item mt-7 flex flex-wrap gap-3">
                <Link className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-button-text shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  View Resume
                </Link>
                <Link className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 text-sm font-black text-primary transition hover:border-primary" href="#work">
                  See Work
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="hero-copy-item mt-7 inline-flex max-w-full items-center gap-3 rounded-md bg-primary/5 px-3 py-2 text-sm font-bold text-primary">
                <MapPin size={16} className="shrink-0 text-accent" />
                {profile.location}
              </div>
            </div>

            <div className="hero-art relative mx-auto w-full max-w-[620px]">
              <Image src={HeroImage} alt="Developer sitting beside a computer desk" priority className="h-auto w-full object-contain" />
            </div>
          </div>
        </HeroIntroMotion>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="work">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Selected work" title="Production-first projects with real business outcomes." text="Move through a cinematic project stage with depth, motion, and direct access to each case study." />
            <Link className="focus-ring inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-black text-primary transition hover:border-primary" href="/projects">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <ProjectCarousel projects={projects} />
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-16 sm:px-6 lg:px-8" id="skills">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Skills" title="A practical stack for mobile products and backend systems." text="Grouped around the work recruiters actually care about: shipping apps, integrating APIs, managing data, and debugging production issues." />
          <SkillsMotion className="skills-perspective grid gap-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <div className="skill-card rounded-md border border-border bg-background p-4 shadow-sm" key={skill.id}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black text-primary">{skill.name}</p>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-accent">{skill.category}</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="skill-bar h-2 rounded-full bg-accent" data-level={skill.proficiency} />
                </div>
              </div>
            ))}
          </SkillsMotion>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="experience">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHeading eyebrow="Experience" title="Full-stack delivery inside real product work." />
          <ExperienceMotion className="experience-perspective mt-10 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
            {experience.map((job) => (
              <article className="experience-card rounded-md border border-border bg-surface p-6 shadow-sm" key={job.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h3 className="text-2xl font-black text-primary">{job.role}</h3>
                    <p className="mt-1 font-bold text-ink">{job.company} - {job.location}</p>
                  </div>
                  <p className="text-sm font-black text-accent">{PROFESSIONAL_EXPERIENCE_START_LABEL} - Present</p>
                </div>
                <p className="mt-5 leading-7 text-ink">{job.summary}</p>
                <ul className="mt-5 grid gap-3">
                  {job.highlights.map((item) => (
                    <li className="experience-highlight flex gap-3 text-sm leading-6 text-ink" key={item}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <div className="proof-card rounded-md border border-border bg-surface p-6 shadow-sm">
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
                  <article className="proof-item rounded-md border border-border bg-background p-4" key={item.id}>
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

                {featuredAchievements.map((item) => (
                  <article className="proof-item rounded-md border border-border bg-background p-4" key={item.id}>
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
          </ExperienceMotion>
        </div>
      </section>

      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-8" id="contact">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.78fr_1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Let's talk about the next product to ship." text="Have a role, project, or collaboration in mind? Send a quick note and I'll get back to you soon." />
            <div className="mt-8 space-y-3 text-sm font-bold text-ink">
              <a className="flex items-center gap-3 transition hover:text-primary" href={`mailto:${profile.email}`}>
                <Mail size={17} className="shrink-0 text-accent" />
                {profile.email}
              </a>
              <a className="flex items-center gap-3 transition hover:text-primary" href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>
                <Phone size={17} className="shrink-0 text-accent" />
                {profile.phone}
              </a>
              <p className="flex items-center gap-3">
                <MapPin size={17} className="shrink-0 text-accent" />
                {profile.location}
              </p>
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

function HeroSocial({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label} className="focus-ring grid h-9 w-9 place-items-center rounded-md bg-primary text-button-text shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-accent">
      {children}
    </Link>
  );
}

function animatedName(name: string) {
  return name.split("").map((letter, index) => (
    <span className="hero-name-letter inline-block" key={`${letter}-${index}`}>
      {letter === " " ? "\u00A0" : letter}
    </span>
  ));
}
