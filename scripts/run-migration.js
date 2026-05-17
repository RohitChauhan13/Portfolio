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
    const value = rest.join("=").trim().replace(/^"|"$/g, "");
    env[key] = value;
  }
  return env;
}

const env = {
  ...(existsSync(".env") ? loadEnv(".env") : {}),
  ...(existsSync(".env.local") ? loadEnv(".env.local") : {}),
  ...process.env
};
const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Set it in .env or environment.");
  process.exit(1);
}

const sql = readFileSync("supabase/schema.sql", "utf-8");
const pool = new Pool({ connectionString: databaseUrl });

(async () => {
  const client = await pool.connect();
  try {
    console.log("Running schema migration...");
    await client.query(sql);
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message || error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
