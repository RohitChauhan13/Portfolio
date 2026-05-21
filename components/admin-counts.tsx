"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminCard = {
  key: string;
  title: string;
  href: string;
  text: string;
};

type CountsResponse = {
  counts?: Record<string, number>;
};

export function AdminCounts({ cards }: { cards: AdminCard[] }) {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCounts() {
      const response = await fetch("/api/admin/counts", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/rohit/admin";
        return;
      }

      const data = (await response.json()) as CountsResponse;
      if (active) setCounts(data.counts ?? {});
    }

    loadCounts().catch(() => {
      if (active) setCounts({});
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ key, title, href, text }) => (
        <Link className="rounded-md border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-panel" href={href} key={href}>
          <p className="text-3xl font-black text-accent">{counts ? counts[key] ?? 0 : "..."}</p>
          <h2 className="mt-3 text-xl font-black text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink">{text}</p>
        </Link>
      ))}
    </div>
  );
}
