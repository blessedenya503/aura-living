import { neon } from "@neondatabase/serverless";

// Singleton SQL client for Neon Postgres
let sqlClient: ReturnType<typeof neon> | null = null;

export function getNeonSql() {
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!dbUrl) {
    return null;
  }
  if (!sqlClient) {
    sqlClient = neon(dbUrl);
  }
  return sqlClient;
}
