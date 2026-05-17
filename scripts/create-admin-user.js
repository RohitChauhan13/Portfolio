const { randomBytes, scryptSync } = require("crypto");
const { existsSync, readFileSync } = require("fs");
const { Pool } = require("pg");

function loadEnv(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    env[key] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
  return env;
}

const env = {
  ...(existsSync(".env") ? loadEnv(".env") : {}),
  ...(existsSync(".env.local") ? loadEnv(".env.local") : {}),
  ...process.env
};

const connectionString = env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required in environment to run this script.");
  process.exit(1);
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/create-admin-user.js <email> <password>");
  process.exit(1);
}

const pool = new Pool({ connectionString });

function hashPassword(password, salt) {
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(() => pool.end());
