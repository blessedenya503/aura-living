const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/DATABASE_URL=(.+)/);
if (!match) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}
const dbUrl = match[1].trim();
console.log("Testing Neon connection with URL:", dbUrl.replace(/:[^:]*@/, ':***@'));

const sql = neon(dbUrl);

async function main() {
  try {
    const result = await sql`SELECT 1 as connected, NOW() as current_time, version() as pg_version`;
    console.log("Neon Postgres Connection Successful!");
    console.log("Result:", result);
  } catch (err) {
    console.error("Neon Connection Error:", err);
  }
}

main();
