"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export function HeroNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hero-nav-item relative flex items-center gap-2 md:gap-9">
      <nav className="hidden items-center gap-9 text-sm font-black text-primary md:flex">
        {links.map((link) => (
          <Link className="transition hover:text-accent" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-primary transition hover:border-primary md:hidden"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-44 rounded-md border border-border bg-surface p-2 shadow-panel md:hidden">
          {links.map((link) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-black text-primary transition hover:bg-primary/5 hover:text-accent"
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
