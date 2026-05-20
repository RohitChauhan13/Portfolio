"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, createAdminSession, isAdminAuthed } from "@/lib/admin-auth";
import { sendContactEmail } from "@/lib/email";
import { query, hasDatabaseEnv } from "@/lib/db";
import { listFromForm, slugify } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email.").max(120),
  subject: z.string().trim().min(3, "Please enter a subject.").max(120),
  message: z.string().trim().min(10, "Please enter a longer message.").max(3000),
  company: z.string().optional()
});

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    company: (() => {
      const companyValue = String(formData.get("company") ?? "").trim();
      return companyValue === "" ? undefined : companyValue;
    })()
  });

  if (!parsed.success) {
    const error = parsed.error.errors.map((err) => err.message).join(" ");
    return { ok: false, error: error || "Please check the form and try again." };
  }
  if (parsed.data.company) return { ok: true };

  if (hasDatabaseEnv()) {
    await query(
      "INSERT INTO contact_messages (name, email, subject, message, source) VALUES ($1, $2, $3, $4, $5)",
      [parsed.data.name, parsed.data.email, parsed.data.subject, parsed.data.message, "portfolio"]
    );
    revalidateAdmin();
  }

  sendContactEmail(parsed.data).catch((error) => {
    console.error("Background contact email failed:", error);
  });

  return { ok: true };
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ok = await createAdminSession(email, password);
  if (!ok) redirect("/rohit/admin?error=invalid");
  redirect("/rohit/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/rohit/admin");
}

async function requireAdmin() {
  if (!(await isAdminAuthed())) throw new Error("Unauthorized");
  if (!hasDatabaseEnv()) throw new Error("DATABASE_URL environment variable is missing.");
  return true;
}

function revalidateAdmin() {
  revalidatePath("/rohit/admin");
  revalidatePath("/rohit/admin/messages");
}

export async function saveProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") || slugify(title));
  const techStack = listFromForm(formData.get("tech_stack"));
  const impact = listFromForm(formData.get("impact"));
  const isVisible = formData.get("is_visible") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 99);
  const createdFor = String(formData.get("created_for") ?? "");
  const demoUrl = String(formData.get("demo_url") ?? "");
  let imageUrl = String(formData.get("image_url") ?? "");
  const imageFile = formData.get("image_file");

  if (imageFile instanceof File && imageFile.size > 0) {
    const extension = path.extname(imageFile.name).toLowerCase() || ".png";
    const safeExt = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(extension) ? extension : ".png";
    const imageName = `${slug}${safeExt}`;
    const imagesDir = path.join(process.cwd(), "public", "projectImage");
    await mkdir(imagesDir, { recursive: true });
    const imagePath = path.join(imagesDir, imageName);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await writeFile(imagePath, buffer);
    imageUrl = `/projectImage/${imageName}`;
  }

  if (id) {
    await query(
      "UPDATE projects SET title = $1, slug = $2, short_description = $3, case_study = $4, created_for = $5, tech_stack = $6, role = $7, impact = $8, image_url = $9, demo_url = $10, github_url = $11, live_url = $12, store_url = $13, status = $14, is_visible = $15, sort_order = $16 WHERE id = $17",
      [
        title,
        slug,
        String(formData.get("short_description") ?? ""),
        String(formData.get("case_study") ?? ""),
        createdFor,
        techStack,
        String(formData.get("role") ?? ""),
        impact,
        imageUrl,
        demoUrl,
        String(formData.get("github_url") ?? ""),
        String(formData.get("live_url") ?? ""),
        String(formData.get("store_url") ?? ""),
        String(formData.get("status") ?? "Draft"),
        isVisible,
        sortOrder,
        id
      ]
    );
  } else {
    await query(
      "INSERT INTO projects (title, slug, short_description, case_study, created_for, tech_stack, role, impact, image_url, demo_url, github_url, live_url, store_url, status, is_visible, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
      [
        title,
        slug,
        String(formData.get("short_description") ?? ""),
        String(formData.get("case_study") ?? ""),
        createdFor,
        techStack,
        String(formData.get("role") ?? ""),
        impact,
        imageUrl,
        demoUrl,
        String(formData.get("github_url") ?? ""),
        String(formData.get("live_url") ?? ""),
        String(formData.get("store_url") ?? ""),
        String(formData.get("status") ?? "Draft"),
        isVisible,
        sortOrder
      ]
    );
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidateAdmin();
  redirect("/rohit/admin/projects");
}

export async function saveProfile(formData: FormData) {
  await requireAdmin();

  const payload = [
    String(formData.get("name") ?? ""),
    String(formData.get("public_name") ?? ""),
    String(formData.get("headline") ?? ""),
    String(formData.get("summary") ?? ""),
    String(formData.get("email") ?? ""),
    String(formData.get("phone") ?? ""),
    String(formData.get("location") ?? ""),
    String(formData.get("github_url") ?? ""),
    String(formData.get("linkedin_url") ?? ""),
    String(formData.get("instagram_url") ?? ""),
    String(formData.get("resume_url") ?? "/resume.pdf"),
    String(formData.get("avatar_url") ?? ""),
    String(formData.get("open_to") ?? "")
  ];

  const { rows } = await query("SELECT id FROM profile LIMIT 1");
  const id = rows[0]?.id;

  if (id) {
    await query(
      "UPDATE profile SET name = $1, public_name = $2, headline = $3, summary = $4, email = $5, phone = $6, location = $7, github_url = $8, linkedin_url = $9, instagram_url = $10, resume_url = $11, avatar_url = $12, open_to = $13 WHERE id = $14",
      [...payload, id]
    );
  } else {
    await query(
      "INSERT INTO profile (name, public_name, headline, summary, email, phone, location, github_url, linkedin_url, instagram_url, resume_url, avatar_url, open_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      payload
    );
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidateAdmin();
  redirect("/rohit/admin/profile");
}

export async function saveSkill(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const payload = [
    String(formData.get("name") ?? ""),
    String(formData.get("category") ?? ""),
    Number(formData.get("proficiency") ?? 75),
    formData.get("is_featured") === "on",
    formData.get("is_visible") === "on",
    Number(formData.get("sort_order") ?? 99)
  ];

  if (id) {
    await query("UPDATE skills SET name = $1, category = $2, proficiency = $3, is_featured = $4, is_visible = $5, sort_order = $6 WHERE id = $7", [...payload, id]);
  } else {
    await query("INSERT INTO skills (name, category, proficiency, is_featured, is_visible, sort_order) VALUES ($1, $2, $3, $4, $5, $6)", payload);
  }

  revalidatePath("/");
  revalidateAdmin();
  redirect("/rohit/admin/skills");
}

export async function saveExperience(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const isCurrent = formData.get("is_current") === "on";
  const payload = [
    String(formData.get("company") ?? ""),
    String(formData.get("role") ?? ""),
    String(formData.get("location") ?? ""),
    String(formData.get("start_date") ?? ""),
    isCurrent ? null : String(formData.get("end_date") ?? ""),
    isCurrent,
    String(formData.get("summary") ?? ""),
    listFromForm(formData.get("highlights")),
    listFromForm(formData.get("tech_stack")),
    Number(formData.get("sort_order") ?? 99)
  ];

  if (id) {
    await query(
      "UPDATE experience SET company = $1, role = $2, location = $3, start_date = $4, end_date = $5, is_current = $6, summary = $7, highlights = $8, tech_stack = $9, sort_order = $10 WHERE id = $11",
      [...payload, id]
    );
  } else {
    await query(
      "INSERT INTO experience (company, role, location, start_date, end_date, is_current, summary, highlights, tech_stack, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      payload
    );
  }

  revalidatePath("/");
  revalidateAdmin();
  redirect("/rohit/admin/experience");
}

export async function saveEducation(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const payload = [
    String(formData.get("institution") ?? ""),
    String(formData.get("degree") ?? ""),
    String(formData.get("location") ?? ""),
    String(formData.get("start_year") ?? ""),
    String(formData.get("end_year") ?? ""),
    String(formData.get("grade") ?? ""),
    listFromForm(formData.get("highlights")),
    Number(formData.get("sort_order") ?? 99)
  ];

  if (id) {
    await query(
      "UPDATE education SET institution = $1, degree = $2, location = $3, start_year = $4, end_year = $5, grade = $6, highlights = $7, sort_order = $8 WHERE id = $9",
      [...payload, id]
    );
  } else {
    await query(
      "INSERT INTO education (institution, degree, location, start_year, end_year, grade, highlights, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      payload
    );
  }

  revalidatePath("/");
  revalidateAdmin();
  redirect("/rohit/admin/education");
}

export async function saveAchievement(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const payload = [
    String(formData.get("title") ?? ""),
    String(formData.get("description") ?? ""),
    String(formData.get("date") ?? ""),
    formData.get("is_featured") === "on",
    Number(formData.get("sort_order") ?? 99)
  ];

  if (id) {
    await query(
      "UPDATE achievements SET title = $1, description = $2, date = $3, is_featured = $4, sort_order = $5 WHERE id = $6",
      [...payload, id]
    );
  } else {
    await query("INSERT INTO achievements (title, description, date, is_featured, sort_order) VALUES ($1, $2, $3, $4, $5)", payload);
  }

  revalidatePath("/");
  revalidateAdmin();
  redirect("/rohit/admin/achievements");
}

export async function deleteRow(formData: FormData) {
  await requireAdmin();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const allowed = ["projects", "skills", "experience", "education", "achievements", "contact_messages"];
  if (!allowed.includes(table) || !id) throw new Error("Invalid delete request");

  await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  revalidatePath("/");
  revalidateAdmin();
  redirect(`/rohit/admin/${table === "contact_messages" ? "messages" : table}`);
}

export async function markMessageRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await query("UPDATE contact_messages SET read_at = $1 WHERE id = $2", [new Date().toISOString(), id]);
  revalidateAdmin();
  redirect("/rohit/admin/messages");
}
