const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function purgeNonSkincare() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/DATABASE_URL=(.+)/);
  if (!m) return console.log('No DATABASE_URL found');
  const sql = neon(m[1].trim());

  const rows = await sql`SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1`;
  if (!rows || !rows.length || !rows[0].data) {
    return console.log('No store_state in Neon');
  }

  const db = rows[0].data;
  console.log(`Original total products: ${db.products.length}`);

  // Disallowed categories
  const excludedCategories = [
    'Hair & Scalp Care',
    'Luxury Fragrances & Colognes',
  ];

  // Specific keyword check to purge hair dryers, laser caps, bonnets, perfumes, colognes
  const nonSkincareKeywords = [
    'hair',
    'laser',
    'dryer',
    'bonnet',
    'perfume',
    'cologne',
    'eau de',
    'fragrance',
    'scalp',
    'shampoo',
    'conditioner',
    'towel wrap',
    'hair remover',
    'edt',
    'edp',
    'club de nuit',
    'armaf'
  ];

  const filtered = db.products.filter(p => {
    if (excludedCategories.includes(p.category)) return false;
    const nameLower = (p.name || '').toLowerCase();
    const tagLower = (p.tagline || '').toLowerCase();
    
    // Check if name has non-skincare keywords (unless it's skin-safe facial care)
    for (const kw of nonSkincareKeywords) {
      if (nameLower.includes(kw) || tagLower.includes(kw)) {
        return false;
      }
    }
    return true;
  });

  console.log(`Remaining pure skincare products: ${filtered.length}`);
  db.products = filtered;

  // Persist to Neon
  await sql`
    UPDATE store_state 
    SET data = ${JSON.stringify(db)}, updated_at = NOW()
    WHERE key = 'current_store_db'
  `;

  // Persist to local JSON files
  fs.writeFileSync('src/data/store-db.json', JSON.stringify(db, null, 2), 'utf8');
  console.log('Successfully purged all hair, perfume, and non-skincare items from Neon and store-db.json!');
}

purgeNonSkincare();
