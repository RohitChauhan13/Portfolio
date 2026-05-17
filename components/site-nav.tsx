import Link from "next/link";
import { Download, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" }
];

export function SiteNav({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur">
      <nav className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-3 sm:px-6 md:h-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-4 md:py-0 lg:px-8">
        <div className="order-2 -mx-1 min-w-0 overflow-x-auto px-1 md:order-1 md:mx-0 md:overflow-visible md:px-0">
          <div className="flex min-w-max items-center justify-center gap-2 md:min-w-0 md:gap-6">
            {links.map((link) => (
              <Link className="focus-ring rounded-md px-2.5 py-2 text-sm font-bold text-ink transition hover:bg-surface hover:text-primary md:px-0 md:py-0" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="order-1 flex items-center justify-end gap-2 md:order-2 md:gap-3">
          <div className="flex items-center gap-2">
            {profile.githubUrl && (
              <Link className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-primary transition hover:border-primary" href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={18} />
              </Link>
            )}
            {profile.instagramUrl && (
              <Link className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-primary transition hover:border-primary" href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </Link>
            )}
            {profile.linkedinUrl && (
              <Link className="focus-ring hidden h-10 w-10 place-items-center rounded-md border border-border bg-surface text-primary transition hover:border-primary sm:grid" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </Link>
            )}
            <ThemeToggle />
          </div>
          <Link className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-primary transition hover:border-primary" href="/#contact" aria-label="Contact">
            <Mail size={17} />
          </Link>
          <Link className="focus-ring grid h-10 w-10 place-items-center rounded-md bg-accent text-white transition hover:bg-accent/90 sm:hidden" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Download resume">
            <Download size={18} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
