import { markMessageRead, saveAchievement, saveEducation, saveExperience, saveProfile, saveProject, saveSkill } from "@/app/actions";
import { AdminAiField } from "./admin-ai-field";
import { ChoiceSelect, DatePickerField, MultiChoiceSelect } from "./admin-choice-fields";
import { DeleteButton } from "./delete-button";
import { PendingSubmitButton } from "./pending-submit-button";

export { DeleteButton };

type Row = Record<string, unknown>;

const inputClass = "h-10 w-full min-w-0 rounded-md border border-border bg-field px-3 text-sm text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";
const textClass = "min-h-24 w-full min-w-0 rounded-md border border-border bg-field px-3 py-2 text-sm leading-6 text-field-foreground outline-none transition placeholder:text-field-muted focus:border-primary";
const labelClass = "grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-ink";

const projectStatusOptions = ["Production", "Case study", "Project", "Draft", "Archived"];
const roleOptions = ["Hybrid App Developer", "Full Stack Developer", "Hybrid App Developer / Full Stack Developer", "React Native Developer", "Frontend Developer", "Backend Developer"];
const techOptions = ["React Native", "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "REST APIs", "Redux", "MySQL", "PostgreSQL", "Firebase", "Supabase", "Tailwind CSS", "Java", "JMeter"];
const skillNameOptions = ["React Native", "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "REST APIs", "Redux", "MySQL", "PostgreSQL", "Firebase", "Supabase", "Tailwind CSS", "Java", "JMeter", "Git", "GitHub"];
const skillCategoryOptions = ["Mobile", "Frontend", "Backend", "Database", "Languages", "Tools"];
const proficiencyOptions = ["60", "65", "70", "75", "80", "85", "90", "95", "100"];
const locationOptions = ["Sangli, Maharashtra, India", "Sangli, Maharashtra", "Remote", "Hybrid", "Onsite"];
const openToOptions = ["Remote, hybrid, and onsite roles", "Remote roles", "Hybrid roles", "Onsite roles", "Freelance projects", "Internship opportunities"];
const institutionOptions = ["Institute of Management & Rural Development Administration"];
const degreeOptions = ["Bachelor of Computer Applications", "BCA", "Higher Secondary Certificate", "Secondary School Certificate"];
const yearOptions = ["2022", "2023", "2024", "2025", "2026", "2027", "Present"];
const gradeOptions = ["A+ Grade", "A Grade", "First Class with Distinction", "First Class", "Completed"];
const achievementDateOptions = ["2024", "2025", "2026", "2025-2026", "Present"];

export function ProjectForm({ row }: { row?: Row }) {
  return (
    <form action={saveProject} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="title" label="Title" row={row} enhance tone="project" />
        <Field name="slug" label="Slug" row={row} />
      </div>
      <Field name="short_description" label="Short description" row={row} enhance tone="project" />
      <Text name="case_study" label="Case study" row={row} enhance tone="project" />
      <Field name="created_for" label="Created for" row={row} enhance tone="project" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="role" label="Role" row={row} options={roleOptions} />
        <Select name="status" label="Status" row={row} options={projectStatusOptions} />
      </div>
      <MultiSelect name="tech_stack" label="Tech stack" row={row} options={techOptions} />
      <Text name="impact" label="Impact, comma or line separated" row={row} enhance tone="project" />
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
    <form action={saveProfile} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Full name" row={row} />
        <Field name="public_name" label="Public name" row={row} />
        <Field name="headline" label="Headline" row={row} enhance tone="profile" />
        <Field name="email" label="Email" row={row} type="email" />
        <Field name="phone" label="Phone" row={row} />
        <Select name="location" label="Location" row={row} options={locationOptions} />
      </div>
      <Text name="summary" label="Summary" row={row} enhance tone="profile" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="github_url" label="GitHub URL" row={row} />
        <Field name="linkedin_url" label="LinkedIn URL" row={row} />
        <Field name="instagram_url" label="Instagram URL" row={row} />
        <Field name="resume_url" label="Resume URL" row={row} />
        <div className="grid gap-1">
          <Field name="avatar_url" label="Avatar URL" row={row} />
          <p className="text-xs font-bold leading-5 text-ink">Google Drive links work when the file is shared as Anyone with the link can view.</p>
        </div>
        <Select name="open_to" label="Open to" row={row} options={openToOptions} />
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
    <form action={saveSkill} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="name" label="Name" row={row} options={skillNameOptions} />
        <Select name="category" label="Category" row={row} options={skillCategoryOptions} />
        <Select name="proficiency" label="Proficiency" row={row} options={proficiencyOptions} />
      </div>
      <AdminTail row={row} visibility />
    </form>
  );
}

export function ExperienceForm({ row }: { row?: Row }) {
  return (
    <form action={saveExperience} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="role" label="Role" row={row} options={roleOptions} />
        <Field name="company" label="Company" row={row} />
        <Select name="location" label="Location" row={row} options={locationOptions} />
        <Field name="start_date" label="Start date" row={row} type="date" />
        <Field name="end_date" label="End date" row={row} type="date" />
      </div>
      <Text name="summary" label="Summary" row={row} enhance tone="experience" />
      <Text name="highlights" label="Highlights" row={row} enhance tone="experience" />
      <MultiSelect name="tech_stack" label="Tech stack" row={row} options={techOptions} />
      <AdminTail row={row} currentName="is_current" currentLabel="Current role" />
    </form>
  );
}

export function EducationForm({ row }: { row?: Row }) {
  return (
    <form action={saveEducation} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <Select name="institution" label="Institution" row={row} options={institutionOptions} />
      <Select name="degree" label="Degree" row={row} options={degreeOptions} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="location" label="Location" row={row} options={locationOptions} />
        <Select name="start_year" label="Start year" row={row} options={yearOptions} />
        <Select name="end_year" label="End year" row={row} options={yearOptions} />
        <Select name="grade" label="Grade" row={row} options={gradeOptions} />
      </div>
      <Text name="highlights" label="Highlights" row={row} enhance tone="education" />
      <AdminTail row={row} featured={false} />
    </form>
  );
}

export function AchievementForm({ row }: { row?: Row }) {
  return (
    <form action={saveAchievement} className="grid min-w-0 gap-3 rounded-md border border-border bg-surface p-4">
      <input type="hidden" name="id" defaultValue={String(row?.id ?? "")} />
      <Field name="title" label="Title" row={row} enhance tone="achievement" />
      <Select name="date" label="Date" row={row} options={achievementDateOptions} />
      <Text name="description" label="Description" row={row} enhance tone="achievement" />
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

type AiTone = "profile" | "project" | "experience" | "education" | "achievement" | "skill";

function Field({ name, label, row, type = "text", enhance = false, tone = "profile" }: { name: string; label: string; row?: Row; type?: string; enhance?: boolean; tone?: AiTone }) {
  const value = type === "date" ? dateInputValue(row?.[name]) : String(row?.[name] ?? "");
  if (type === "date") return <DatePickerField name={name} label={label} value={value} />;
  if (enhance) return <AdminAiField name={name} label={label} defaultValue={value} tone={tone} type={type} />;

  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} name={name} type={type} defaultValue={value} />
    </label>
  );
}

function dateInputValue(value: unknown) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = String(value);
  const isoDate = text.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (isoDate) return isoDate;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function Text({ name, label, row, enhance = false, tone = "profile" }: { name: string; label: string; row?: Row; enhance?: boolean; tone?: AiTone }) {
  const value = row?.[name];
  const display = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  if (enhance) return <AdminAiField name={name} label={label} defaultValue={display} tone={tone} multiline />;

  return (
    <label className={labelClass}>
      {label}
      <textarea className={textClass} name={name} defaultValue={display} />
    </label>
  );
}

function Select({ name, label, row, options }: { name: string; label: string; row?: Row; options: string[] }) {
  const value = String(row?.[name] ?? "");

  return <ChoiceSelect name={name} label={label} value={value} options={options} />;
}

function MultiSelect({ name, label, row, options }: { name: string; label: string; row?: Row; options: string[] }) {
  const value = row?.[name];
  const selected = (Array.isArray(value) ? value : [value])
    .flatMap((item) => String(item ?? "").split(/\n|,/))
    .map((item) => item.trim())
    .filter(Boolean);

  return <MultiChoiceSelect name={name} label={label} values={selected} options={options} />;
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
