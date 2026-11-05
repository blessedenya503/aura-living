const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function checkNeon() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/DATABASE_URL=(.+)/);
  if (!m) return console.log('No DB URL');
  const url = m[1].trim();
  const sql = neon(url);
  try {
    const rows = await sql`SELECT key, updated_at FROM store_state LIMIT 5`;
    console.log('Neon store_state rows:', rows);
    const dbRows = await sql`SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1`;
    if (dbRows.length) {
      console.log('Neon products count:', dbRows[0].data?.products?.length);
      console.log('Neon store name:', dbRows[0].data?.settings?.storeName);
    }
  } catch (err) {
    console.error('Neon query error:', err.message);
  }
}

checkNeon();
