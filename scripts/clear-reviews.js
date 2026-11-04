const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbPath = 'src/data/store-db.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log('Current userReviews locally:', db.userReviews ? db.userReviews.length : 0);
  db.userReviews = [];
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Local store-db.json userReviews cleared to []');

  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/DATABASE_URL=(.+)/);
  if (!m) {
    console.log('No DATABASE_URL found in .env.local');
    return;
  }

  const sql = neon(m[1].trim());
  const rows = await sql`SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1`;
  if (rows && rows.length > 0 && rows[0].data) {
    const neonDb = rows[0].data;
    console.log('Neon userReviews count:', neonDb.userReviews ? neonDb.userReviews.length : 0);
    neonDb.userReviews = [];
    await sql`UPDATE store_state SET data = ${JSON.stringify(neonDb)}, updated_at = NOW() WHERE key = 'current_store_db'`;
    console.log('Neon database userReviews successfully reset to []');
  }
}

main().catch(console.error);
