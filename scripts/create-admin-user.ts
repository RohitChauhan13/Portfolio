import { randomBytes, scryptSync } from "crypto";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required in environment to run this script.");
  process.exit(1);
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: ts-node scripts/create-admin-user.ts <email> <password>");
  process.exit(1);
}

const pool = new Pool({ connectionString });

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

async function main() {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  await pool.query(
    `INSERT INTO public.admin_users (email, password_hash, password_salt, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, true, now(), now())
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, password_salt = EXCLUDED.password_salt, is_active = true, updated_at = now();`,
    [email.toLowerCase(), passwordHash, salt]
  );

  console.log(`Admin user created/updated: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => pool.end());
