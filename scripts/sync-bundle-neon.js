const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function syncNeon() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/DATABASE_URL=(.+)/);
  if (!m) return console.log('No DB URL');
  const url = m[1].trim();
  const sql = neon(url);
  const localDb = JSON.parse(fs.readFileSync('src/data/store-db.json', 'utf8'));
  const elNino = localDb.products.find((p) => p.id === 'bundle-el-nino');
  if (!elNino) {
    console.log('No elNino bundle in local store-db.json');
    return;
  }
  const dbRows = await sql`SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1`;
  if (dbRows.length) {
    const neonDb = dbRows[0].data;
    const idx = neonDb.products.findIndex((p) => p.id === 'bundle-el-nino');
    if (idx >= 0) {
      neonDb.products[idx] = elNino;
    } else {
      neonDb.products.unshift(elNino);
    }
    await sql`UPDATE store_state SET data = ${JSON.stringify(neonDb)}, updated_at = NOW() WHERE key = 'current_store_db'`;
    console.log('Successfully synced bundle-el-nino to Neon DB! Total Neon products:', neonDb.products.length);
  }
}

syncNeon().catch(err => console.error('Error:', err.message));
