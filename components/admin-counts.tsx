import Link from "next/link";

type AdminCard = {
  key: string;
  title: string;
  href: string;
  text: string;
};

export function AdminCounts({ cards, counts }: { cards: AdminCard[]; counts: Record<string, number> }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ key, title, href, text }) => (
        <Link className="rounded-md border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-panel" href={href} key={href}>
          <p className="text-3xl font-black text-accent">{counts[key] ?? 0}</p>
          <h2 className="mt-3 text-xl font-black text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink">{text}</p>
        </Link>
      ))}
    </div>
  );
}
