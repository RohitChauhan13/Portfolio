import Link from "next/link";
import { loginAdmin, logoutAdmin } from "@/app/actions";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasDatabaseEnv, query } from "@/lib/db";

const cards = [
  ["Profile", "/rohit/admin/profile", "Edit contact details, social links, headline, and Instagram."],
  ["Projects", "/rohit/admin/projects", "Add case studies, production apps, links, and impact."],
  ["Skills", "/rohit/admin/skills", "Edit skill groups, proficiency, and featured items."],
  ["Experience", "/rohit/admin/experience", "Maintain company work, highlights, and tech stacks."],
  ["Education", "/rohit/admin/education", "Update degree, grade, and academic proof."],
  ["Achievements", "/rohit/admin/achievements", "Keep recruiter-facing proof fresh."],
  ["Messages", "/rohit/admin/messages", "Read messages from the contact form."]
];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const authed = await isAdminAuthed();
  const { error } = await searchParams;
  if (!authed) return <AdminLogin error={error} />;

  const dbAvailable = hasDatabaseEnv();
  const counts = dbAvailable
    ? await Promise.all([
        countRows("profile"),
        countRows("projects"),
        countRows("skills"),
        countRows("experience"),
        countRows("education"),
        countRows("achievements"),
        countRows("contact_messages")
      ])
    : [0, 0, 0, 0, 0, 0, 0];

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Admin panel</p>
            <h1 className="mt-2 text-4xl font-black text-primary">Portfolio control room</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex h-10 items-center rounded-md border border-border bg-field px-4 text-sm font-black text-primary">
              View public site
            </Link>
            <form action={logoutAdmin}>
              <button className="h-10 rounded-md border border-border bg-field px-4 text-sm font-black text-primary">Logout</button>
            </form>
          </div>
        </div>
        {!dbAvailable && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
            DATABASE_URL is missing. Add it to `.env.local` before editing live data.
          </div>
        )}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(([title, href, text], index) => (
            <Link className="rounded-md border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-panel" href={href} key={href}>
              <p className="text-3xl font-black text-accent">{counts[index]}</p>
              <h2 className="mt-3 text-xl font-black text-primary">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink">{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function AdminLogin({ error }: { error?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <form action={loginAdmin} className="w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-panel">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Rohit admin</p>
        <h1 className="mt-3 text-3xl font-black text-primary">Admin login</h1>
        {error && <p className="mt-4 rounded-md bg-danger-surface p-3 text-sm font-bold text-danger">Invalid email or password.</p>}
        <label className="mt-5 block text-sm font-black text-primary">
          Email
          <input name="email" type="email" required className="mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-field-foreground outline-none focus:border-primary" />
        </label>
        <label className="mt-4 block text-sm font-black text-primary">
          Password
          <input name="password" type="password" required className="mt-2 h-12 w-full rounded-md border border-border bg-field px-4 text-field-foreground outline-none focus:border-primary" />
        </label>
        <button className="mt-5 h-12 w-full rounded-md bg-primary px-5 text-sm font-black text-button-text">Open admin</button>
      </form>
    </main>
  );
}

async function countRows(table: string) {
  try {
    const { rows } = await query(`SELECT COUNT(*) AS count FROM ${table}`);
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}
