import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BriefcaseBusiness, Home, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false
  }
};

const helpfulLinks = [
  { href: "/#work", label: "Work", icon: BriefcaseBusiness },
  { href: "/projects", label: "Projects", icon: Search },
  { href: "/rohit/admin", label: "Admin", icon: ArrowLeft }
];

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-4xl overflow-hidden rounded-md border border-border bg-surface shadow-panel">
        <div className="grid gap-0 lg:grid-cols-[0.75fr_1fr]">
          <div className="relative min-h-72 border-b border-border bg-primary p-8 text-button-text lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.2),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <Link href="/" className="focus-ring inline-flex w-fit items-center gap-3 rounded-sm">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-white/15 text-sm font-black text-white">RC</span>
                <span className="text-sm font-black text-white/85">Rohit Chauhan</span>
              </Link>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/65">Page missing</p>
                <h1 className="mt-4 text-7xl font-black leading-none text-white">404</h1>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Not found</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-primary sm:text-4xl">
              This page is not available.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink">
              The link may be wrong, the server may be running an older build, or the page may have moved. The admin panel is available at <span className="font-black text-primary">/rohit/admin</span>.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-button-text transition hover:bg-primary/90">
                <Home size={17} />
                Home
              </Link>
              <Link href="/rohit/admin" className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-field px-4 text-sm font-black text-primary transition hover:border-primary">
                Admin panel
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {helpfulLinks.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring rounded-md border border-border bg-background p-4 transition hover:border-primary">
                  <item.icon className="text-accent" size={19} />
                  <p className="mt-3 text-sm font-black text-primary">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
