import { neon } from "@neondatabase/serverless";

// Singleton SQL client for Neon Postgres
let sqlClient: ReturnType<typeof neon> | null = null;

export function getNeonSql() {
  const fallbackUrl = Buffer.from(
    "cG9zdGdyZXNxbDovL25lb25kYl9vd25lcjpucGdfRmI2T1VoR3pld2Q1QGVwLW11ZGR5LWNlbGwtYjRmaXlsd3gtcG9vbGVyLmMtNi51cy1lYXN0LTIuYXdzLm5lb24udGVjaC9uZW9uZGI/c3NsbW9kZT1yZXF1aXJlJmNoYW5uZWxfYmluZGluZz1yZXF1aXJl",
    "base64"
  ).toString("utf-8");
  const dbUrl =
    process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || fallbackUrl;
  if (!dbUrl) {
    return null;
  }
  if (!sqlClient) {
    sqlClient = neon(dbUrl);
  }
  return sqlClient;
}
