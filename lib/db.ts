import { Pool, QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;
const defaultPoolMax = process.env.NODE_ENV === "production" ? 1 : 5;
const configuredPoolMax = Number(process.env.DATABASE_POOL_MAX);
const poolMax = Number.isFinite(configuredPoolMax) && configuredPoolMax > 0 ? configuredPoolMax : defaultPoolMax;

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | null;
}

let pool: Pool | null = null;

if (connectionString) {
  const poolConfig = {
    connectionString,
    max: poolMax,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000
  };

  if (process.env.NODE_ENV === "development") {
    if (!global.pgPool) {
      global.pgPool = new Pool(poolConfig);
    }
    pool = global.pgPool;
  } else {
    pool = new Pool(poolConfig);
  }
}

export function hasDatabaseEnv() {
  return Boolean(connectionString);
}

export function getDb() {
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is missing");
  return db.query<T>(text, params);
}
