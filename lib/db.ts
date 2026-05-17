import { Pool, QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | null;
}

let pool: Pool | null = null;

if (connectionString) {
  if (process.env.NODE_ENV === "development") {
    if (!global.pgPool) {
      global.pgPool = new Pool({ connectionString });
    }
    pool = global.pgPool;
  } else {
    pool = new Pool({ connectionString });
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
