import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { hasDatabaseEnv, query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const countQueries = {
  profile: "SELECT COUNT(*) AS count FROM profile",
  projects: "SELECT COUNT(*) AS count FROM projects",
  skills: "SELECT COUNT(*) AS count FROM skills",
  experience: "SELECT COUNT(*) AS count FROM experience",
  education: "SELECT COUNT(*) AS count FROM education",
  achievements: "SELECT COUNT(*) AS count FROM achievements",
  messages: "SELECT COUNT(*) AS count FROM contact_messages WHERE read_at IS NULL"
} as const;

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseEnv()) {
    return jsonNoStore({
      dbAvailable: false,
      counts: Object.fromEntries(Object.keys(countQueries).map((key) => [key, 0]))
    });
  }

  const entries = await Promise.all(
    Object.entries(countQueries).map(async ([key, sql]) => {
      try {
        const { rows } = await query(sql);
        return [key, Number(rows[0]?.count ?? 0)] as const;
      } catch {
        return [key, 0] as const;
      }
    })
  );

  return jsonNoStore({ dbAvailable: true, counts: Object.fromEntries(entries) });
}

function jsonNoStore(body: unknown) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate"
    }
  });
}
