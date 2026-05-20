import { markMessageRead, saveAchievement, saveEducation, saveExperience, saveProfile, saveProject, saveSkill } from "@/app/actions";
import { DeleteButton } from "./delete-button";
import { PendingSubmitButton } from "./pending-submit-button";

export { DeleteButton };

type Row = Record<string, unknown>;

const inputClass = "h-10 rounded-md border border-border bg-field px-3 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";
const textClass = "min-h-24 rounded-md border border-border bg-field px-3 py-2 text-sm leading-6 text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";
const labelClass = "grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-ink";

export function ProjectForm({ row }: { row?: Row }) {
  return (
    <form action={saveProject} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="title" label="Title" row={row} />
        <Field name="slug" label="Slug" row={row} />
      </div>
      <Field name="short_description" label="Short description" row={row} />
      <Text name="case_study" label="Case study" row={row} />
      <Field name="created_for" label="Created for" row={row} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="role" label="Role" row={row} />
        <Field name="status" label="Status" row={row} />
      </div>
      <Text name="tech_stack" label="Tech stack, comma or line separated" row={row} />
      <Text name="impact" label="Impact, comma or line separated" row={row} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="github_url" label="GitHub URL" row={row} />
        <Field name="live_url" label="Live URL" row={row} />
        <Field name="demo_url" label="Demo video URL" row={row} />
        <Field name="store_url" label="Store URL" row={row} />
        <Field name="image_url" label="Image URL" row={row} />
      </div>
      <label className={labelClass}>
        Upload project image
        <input className="rounded-md border border-dashed border-border bg-field px-3 py-2 text-sm text-field-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-black file:text-button-text" name="image_file" type="file" accept="image/*" />
      </label>
      <AdminTail row={row} featured={false} visibility />
    </form>
  );
}

export function ProfileForm({ row }: { row?: Row }) {
  return (
    <form action={saveProfile} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Full name" row={row} />
        <Field name="public_name" label="Public name" row={row} />
        <Field name="headline" label="Headline" row={row} />
        <Field name="email" label="Email" row={row} type="email" />
        <Field name="phone" label="Phone" row={row} />
        <Field name="location" label="Location" row={row} />
      </div>
      <Text name="summary" label="Summary" row={row} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="github_url" label="GitHub URL" row={row} />
        <Field name="linkedin_url" label="LinkedIn URL" row={row} />
        <Field name="instagram_url" label="Instagram URL" row={row} />
        <Field name="resume_url" label="Resume URL" row={row} />
        <div className="grid gap-1">
          <Field name="avatar_url" label="Avatar URL" row={row} />
          <p className="text-xs font-bold leading-5 text-ink">Google Drive links work when the file is shared as Anyone with the link can view.</p>
        </div>
        <Field name="open_to" label="Open to" row={row} />
      </div>
      <div>
        <PendingSubmitButton className="h-10 rounded-md bg-primary px-4 text-sm font-black text-button-text disabled:cursor-not-allowed disabled:opacity-70" pendingChildren="Saving">
          Save profile
        </PendingSubmitButton>
      </div>
    </form>
  );
}

export function SkillForm({ row }: { row?: Row }) {
  return (
    <form action={saveSkill} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" row={row} />
        <Field name="category" label="Category" row={row} />
        <Field name="proficiency" label="Proficiency" row={row} type="number" />
      </div>
      <AdminTail row={row} visibility />
    </form>
  );
}

export function ExperienceForm({ row }: { row?: Row }) {
  return (
    <form action={saveExperience} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="role" label="Role" row={row} />
        <Field name="company" label="Company" row={row} />
        <Field name="location" label="Location" row={row} />
        <Field name="start_date" label="Start date" row={row} type="date" />
        <Field name="end_date" label="End date" row={row} type="date" />
      </div>
      <Text name="summary" label="Summary" row={row} />
      <Text name="highlights" label="Highlights" row={row} />
      <Text name="tech_stack" label="Tech stack" row={row} />
      <AdminTail row={row} currentName="is_current" currentLabel="Current role" />
    </form>
  );
}

export function EducationForm({ row }: { row?: Row }) {
  return (
    <form action={saveEducation} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <Field name="institution" label="Institution" row={row} />
      <Field name="degree" label="Degree" row={row} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="location" label="Location" row={row} />
        <Field name="start_year" label="Start year" row={row} />
        <Field name="end_year" label="End year" row={row} />
        <Field name="grade" label="Grade" row={row} />
      </div>
      <Text name="highlights" label="Highlights" row={row} />
      <AdminTail row={row} featured={false} />
    </form>
  );
}

export function AchievementForm({ row }: { row?: Row }) {
  return (
    <form action={saveAchievement} className="grid gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <Field name="title" label="Title" row={row} />
      <Field name="date" label="Date" row={row} />
      <Text name="description" label="Description" row={row} />
      <AdminTail row={row} />
    </form>
  );
}

export function MessageActions({ id, readAt }: { id: string; readAt: string | null }) {
  return (
    <div className="flex gap-2">
      {!readAt && (
        <form action={markMessageRead}>
          <input type="hidden" name="id" value={id} />
          <PendingSubmitButton className="h-9 rounded-md bg-primary px-3 text-xs font-black text-button-text disabled:cursor-not-allowed disabled:opacity-70" pendingChildren="Saving">
            Mark read
          </PendingSubmitButton>
        </form>
      )}
      <DeleteButton table="contact_messages" id={id} label="message" />
    </div>
  );
}

function Field({ name, label, row, type = "text" }: { name: string; label: string; row?: Row; type?: string }) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} name={name} type={type} defaultValue={String(row?.[name] ?? "")} />
    </label>
  );
}

function Text({ name, label, row }: { name: string; label: string; row?: Row }) {
  const value = row?.[name];
  const display = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return (
    <label className={labelClass}>
      {label}
      <textarea className={textClass} name={name} defaultValue={display} />
    </label>
  );
}

function AdminTail({ row, featured = true, currentName = "is_featured", currentLabel = "Featured", hint, visibility = false }: { row?: Row; featured?: boolean; currentName?: string; currentLabel?: string; hint?: string; visibility?: boolean }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className={labelClass}>
        Sort order
        <input className={inputClass} name="sort_order" type="number" defaultValue={String(row?.sort_order ?? 99)} />
      </label>
      {featured && (
        <div className="grid gap-1">
          <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-field px-3 text-sm font-bold text-primary">
            <input name={currentName} type="checkbox" defaultChecked={Boolean(row?.[currentName])} />
            {currentLabel}
          </label>
          {hint && <p className="max-w-sm text-xs font-bold leading-5 text-ink">{hint}</p>}
        </div>
      )}
      {visibility && (
        <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-field px-3 text-sm font-bold text-primary">
          <input name="is_visible" type="checkbox" defaultChecked={row?.is_visible === undefined ? true : Boolean(row.is_visible)} />
          Visible on site
        </label>
      )}
      <PendingSubmitButton className="h-10 rounded-md bg-primary px-4 text-sm font-black text-button-text disabled:cursor-not-allowed disabled:opacity-70" pendingChildren="Saving">
        Save
      </PendingSubmitButton>
    </div>
  );
}
