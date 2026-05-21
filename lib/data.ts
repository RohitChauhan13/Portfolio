import "server-only";
import { hasDatabaseEnv, query } from "@/lib/db";
import { achievements as fallbackAchievements, education as fallbackEducation, experience as fallbackExperience, profile as fallbackProfile, projects as fallbackProjects, skills as fallbackSkills } from "@/lib/fallback-data";
import type { Achievement, Education, Experience, Profile, Project, Skill } from "@/lib/types";

function byOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function uniqueBy<T>(items: T[], keyFor: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFor(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function listFromValue(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(/\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function failDatabaseLoad(context: string, error: unknown): never {
  console.error(`Failed to load ${context} from the database:`, error);
  throw error;
}

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    shortDescription: String(row.short_description ?? ""),
    caseStudy: String(row.case_study ?? ""),
    createdFor: String(row.created_for ?? ""),
    techStack: listFromValue(row.tech_stack),
    role: String(row.role ?? ""),
    impact: listFromValue(row.impact),
    imageUrl: String(row.image_url ?? "").endsWith("/projects/default.svg") ? "" : String(row.image_url ?? ""),
    demoUrl: String(row.demo_url ?? ""),
    githubUrl: String(row.github_url ?? ""),
    liveUrl: String(row.live_url ?? ""),
    storeUrl: String(row.store_url ?? ""),
    status: String(row.status ?? ""),
    isFeatured: Boolean(row.is_featured),
    isVisible: row.is_visible === undefined ? true : Boolean(row.is_visible),
    sortOrder: Number(row.sort_order ?? 0)
  };
}

export async function getProfile(): Promise<Profile> {
  if (!hasDatabaseEnv()) return fallbackProfile;

  try {
    const { rows } = await query("SELECT * FROM profile LIMIT 1");
    const data = rows[0];
    if (!data) throw new Error("Profile row is missing");

    return {
      name: String(data.name ?? fallbackProfile.name),
      publicName: String(data.public_name ?? fallbackProfile.publicName),
      headline: String(data.headline ?? fallbackProfile.headline),
      summary: String(data.summary ?? fallbackProfile.summary),
      email: String(data.email ?? fallbackProfile.email),
      phone: String(data.phone ?? fallbackProfile.phone),
      location: String(data.location ?? fallbackProfile.location),
      githubUrl: String(data.github_url ?? fallbackProfile.githubUrl),
      linkedinUrl: String(data.linkedin_url ?? fallbackProfile.linkedinUrl),
      instagramUrl: String(data.instagram_url ?? fallbackProfile.instagramUrl),
      resumeUrl: String(data.resume_url ?? fallbackProfile.resumeUrl),
      avatarUrl: String(data.avatar_url ?? fallbackProfile.avatarUrl),
      openTo: String(data.open_to ?? fallbackProfile.openTo)
    };
  } catch (error) {
    return failDatabaseLoad("profile", error);
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!hasDatabaseEnv()) {
    return uniqueBy(byOrder(fallbackSkills.filter((skill) => skill.isVisible)), (skill) => `${skill.category.trim().toLowerCase()}::${skill.name.trim().toLowerCase()}`);
  }

  try {
    const { rows } = await query("SELECT * FROM skills WHERE is_visible = true ORDER BY sort_order ASC");
    const typedRows = rows as Record<string, unknown>[];
    const mapped = typedRows.map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      category: String(row.category ?? ""),
      proficiency: Number(row.proficiency ?? 0),
      isFeatured: Boolean(row.is_featured),
      isVisible: row.is_visible === undefined ? true : Boolean(row.is_visible),
      sortOrder: Number(row.sort_order ?? 0)
    }));
    return uniqueBy(mapped, (skill) => `${skill.category.trim().toLowerCase()}::${skill.name.trim().toLowerCase()}`);
  } catch (error) {
    return failDatabaseLoad("skills", error);
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!hasDatabaseEnv()) return byOrder(fallbackProjects.filter((project) => project.isVisible));

  try {
    const { rows } = await query("SELECT * FROM projects WHERE is_visible = true ORDER BY sort_order ASC");
    const typedRows = rows as Record<string, unknown>[];
    return typedRows.map(mapProject);
  } catch (error) {
    return failDatabaseLoad("projects", error);
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!hasDatabaseEnv()) {
    return fallbackProjects.find((project) => project.slug === slug && project.isVisible) ?? null;
  }

  try {
    const { rows } = await query("SELECT * FROM projects WHERE slug = $1 AND is_visible = true LIMIT 1", [slug]);
    if (!rows[0]) return null;
    return mapProject(rows[0]);
  } catch (error) {
    return failDatabaseLoad("project", error);
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!hasDatabaseEnv()) return byOrder(fallbackExperience);

  try {
    const { rows } = await query("SELECT * FROM experience ORDER BY sort_order ASC");
    const typedRows = rows as Record<string, unknown>[];
    return typedRows.map((row) => ({
      id: String(row.id),
      company: String(row.company ?? ""),
      role: String(row.role ?? ""),
      location: String(row.location ?? ""),
      startDate: String(row.start_date ?? ""),
      endDate: row.end_date === null ? null : String(row.end_date ?? ""),
      isCurrent: Boolean(row.is_current),
      summary: String(row.summary ?? ""),
      highlights: listFromValue(row.highlights),
      techStack: listFromValue(row.tech_stack),
      sortOrder: Number(row.sort_order ?? 0)
    }));
  } catch (error) {
    return failDatabaseLoad("experience", error);
  }
}

export async function getEducation(): Promise<Education[]> {
  if (!hasDatabaseEnv()) return byOrder(fallbackEducation);

  try {
    const { rows } = await query("SELECT * FROM education ORDER BY sort_order ASC");
    const typedRows = rows as Record<string, unknown>[];
    return typedRows.map((row) => ({
      id: String(row.id),
      institution: String(row.institution ?? ""),
      degree: String(row.degree ?? ""),
      location: String(row.location ?? ""),
      startYear: String(row.start_year ?? ""),
      endYear: String(row.end_year ?? ""),
      grade: String(row.grade ?? ""),
      highlights: listFromValue(row.highlights),
      sortOrder: Number(row.sort_order ?? 0)
    }));
  } catch (error) {
    return failDatabaseLoad("education", error);
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!hasDatabaseEnv()) return byOrder(fallbackAchievements);

  try {
    const { rows } = await query("SELECT * FROM achievements ORDER BY sort_order ASC");
    const typedRows = rows as Record<string, unknown>[];
    return typedRows.map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      description: String(row.description ?? ""),
      date: String(row.date ?? ""),
      isFeatured: Boolean(row.is_featured),
      sortOrder: Number(row.sort_order ?? 0)
    }));
  } catch (error) {
    return failDatabaseLoad("achievements", error);
  }
}
