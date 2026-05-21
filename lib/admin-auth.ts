import "server-only";
import { cookies } from "next/headers";
import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { query, hasDatabaseEnv } from "@/lib/db";

const cookieName = "rohit_admin";

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function createSessionToken(email: string, passwordHash: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.DATABASE_URL ?? "local-admin-session";
  return createHmac("sha256", secret).update(`${email}:${passwordHash}`).digest("hex");
}

async function getAdminUser(email: string) {
  try {
    const { rows } = await query("SELECT email, password_hash, password_salt, is_active FROM admin_users WHERE email = $1 LIMIT 1", [email]);
    return rows[0] as { email: string; password_hash: string; password_salt: string; is_active: boolean } | undefined;
  } catch {
    return undefined;
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    if (!hasDatabaseEnv()) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await getAdminUser(normalizedEmail);
    if (!user || !user.is_active) return false;
    const typedHash = hashPassword(password, user.password_salt);
    if (typedHash.length !== user.password_hash.length) return false;
    return timingSafeEqual(Buffer.from(typedHash), Buffer.from(user.password_hash));
  } catch {
    return false;
  }
}

export async function isAdminAuthed() {
  try {
    if (!hasDatabaseEnv()) return false;

    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(cookieName)?.value;
    if (!cookieValue) return false;

    const [email, token] = cookieValue.split(":");
    if (!email || !token) return false;

    const user = await getAdminUser(email);
    if (!user || !user.is_active) return false;

    const expected = createSessionToken(email, user.password_hash);
    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expected);
    return tokenBuffer.length === expectedBuffer.length && timingSafeEqual(tokenBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function createAdminSession(email: string, password: string) {
  try {
    if (!hasDatabaseEnv()) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await getAdminUser(normalizedEmail);
    if (!user || !user.is_active) return false;

    const typedHash = hashPassword(password, user.password_salt);
    if (typedHash.length !== user.password_hash.length) return false;
    if (!timingSafeEqual(Buffer.from(typedHash), Buffer.from(user.password_hash))) return false;

    const cookieStore = await cookies();
    const token = createSessionToken(normalizedEmail, user.password_hash);
    cookieStore.set(cookieName, `${normalizedEmail}:${token}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60
    });
    return true;
  } catch {
    return false;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/rohit/admin",
    maxAge: 0
  });
}
