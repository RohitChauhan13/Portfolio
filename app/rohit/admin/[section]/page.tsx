import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AchievementForm, DeleteButton, EducationForm, ExperienceForm, MessageActions, ProfileForm, ProjectForm, SkillForm } from "@/components/admin-forms";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasDatabaseEnv, query } from "@/lib/db";

const sections = {
  profile: { table: "profile", title: "Profile", singular: "profile", form: ProfileForm },
  projects: { table: "projects", title: "Projects", singular: "project", form: ProjectForm },
  skills: { table: "skills", title: "Skills", singular: "skill", form: SkillForm },
  experience: { table: "experience", title: "Experience", singular: "experience entry", form: ExperienceForm },
  education: { table: "education", title: "Education", singular: "education entry", form: EducationForm },
  achievements: { table: "achievements", title: "Achievements", singular: "achievement", form: AchievementForm }
} as const;

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const isMessagesSection = section === "messages";
  const config = sections[section as keyof typeof sections];
  if (!isMessagesSection && !config) redirect("/");
  if (!(await isAdminAuthed())) redirect("/rohit/admin");
  if (isMessagesSection) return <MessagesPage />;

  const dbAvailable = hasDatabaseEnv();
  const orderClause = config.table === "profile" ? "created_at ASC" : "sort_order ASC";
  const data: Record<string, unknown>[] = dbAvailable ? (await query(`SELECT * FROM ${config.table} ORDER BY ${orderClause}`)).rows as Record<string, unknown>[] : [];
  const Form = config.form;
  const isProfile = config.table === "profile";
  const nextRow = isProfile ? undefined : { sort_order: nextSortOrder(data) };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminHeader title={config.title} />
        {!dbAvailable && <MissingDatabase />}
        <div className={isProfile ? "mt-8" : "mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"}>
          <section>
            <h2 className="text-xl font-black text-primary">{isProfile ? "Edit profile" : "Add new"}</h2>
            <div className="mt-4">
              {isProfile ? <Form row={data[0]} /> : <Form row={nextRow} />}
            </div>
          </section>
          {!isProfile && <section>
            <h2 className="text-xl font-black text-primary">Existing</h2>
            <div className="mt-4 grid gap-4">
              {(data ?? []).map((row) => (
                <details className="rounded-md border border-border bg-surface p-4" key={String(row.id)}>
                  <summary className="cursor-pointer text-base font-black text-primary">{labelFor(row)}</summary>
                  <div className="mt-4">
                    <Form row={row} />
                    <div className="mt-3">
                      <DeleteButton table={config.table} id={String(row.id)} label={config.singular} />
                    </div>
                  </div>
                </details>
              ))}
              {(data ?? []).length === 0 && <p className="rounded-md border border-border bg-surface p-4 text-sm font-bold text-ink">No rows yet.</p>}
            </div>
          </section>}
        </div>
      </div>
    </main>
  );
}

async function MessagesPage() {
  const dbAvailable = hasDatabaseEnv();
  const data: Record<string, unknown>[] = dbAvailable ? (await query("SELECT * FROM contact_messages ORDER BY created_at DESC")).rows as Record<string, unknown>[] : [];

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminHeader title="Messages" />
        {!dbAvailable && <MissingDatabase />}
        <div className="mt-8 grid gap-4">
          {(data ?? []).map((row) => (
            <article className="rounded-md border border-border bg-surface p-5 shadow-sm" key={String(row.id)}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">{row.read_at ? "Read" : "Unread"}</p>
                  <h2 className="mt-2 text-xl font-black text-primary">{String(row.subject)}</h2>
                  <p className="mt-1 text-sm font-bold text-ink">{String(row.name)} - {String(row.email)}</p>
                </div>
                <MessageActions id={String(row.id)} readAt={(row.read_at as string | null) ?? null} />
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-md bg-background p-4 text-sm leading-7 text-ink">{String(row.message)}</p>
            </article>
          ))}
          {(data ?? []).length === 0 && <p className="rounded-md border border-border bg-surface p-4 text-sm font-bold text-ink">No messages yet.</p>}
        </div>
      </div>
    </main>
  );
}

function AdminHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <Link href="/rohit/admin" className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm font-black text-accent">
          <ArrowLeft size={16} />
          Back to admin
        </Link>
        <h1 className="mt-2 text-4xl font-black text-primary">{title}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border bg-field px-4 py-2 text-sm font-black text-primary" href="/rohit/admin">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <Link className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border bg-field px-4 py-2 text-sm font-black text-primary" href="/">
          View site
          <ExternalLink size={15} />
        </Link>
      </div>
    </div>
  );
}

function MissingDatabase() {
  return <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">DATABASE_URL is missing. Add it to `.env.local` before editing live data.</div>;
}

function labelFor(row: Record<string, unknown>) {
  const label = String(row.title ?? row.name ?? row.role ?? row.institution ?? "Untitled");
  return row.is_visible === false ? `${label} (hidden)` : label;
}

function nextSortOrder(rows: Record<string, unknown>[]) {
  const orders = rows.map((row) => Number(row.sort_order)).filter(Number.isFinite);
  return orders.length === 0 ? 1 : Math.max(...orders) + 1;
}
