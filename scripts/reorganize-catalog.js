const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

const db = JSON.parse(fs.readFileSync('src/data/store-db.json', 'utf8'));

// Reorganize products properly
const updates = [];

db.products.forEach((p) => {
  const origCat = p.category;

  // 1. Cleansers and washes
  if (/cleanser|face wash|body wash|cleansing|micellar|towelettes|eraser|wipes/i.test(p.name)) {
    p.category = "Gentle Cleansers & Masks";
  }
  // 2. Sunscreens and SPF
  else if (/spf|sunscreen|mineral spf/i.test(p.name)) {
    p.category = "Sunscreen & Daily Defense";
  }
  // 3. Hair & Scalp
  else if (/headband|hair|curl|shampoo|conditioner|scalp|forming cream/i.test(p.name)) {
    p.category = "Hair & Scalp Care";
  }
  // 4. Fragrance & Colognes
  else if (/cologne|perfume|eau de parfum|eau de toilette/i.test(p.name)) {
    p.category = "Luxury Fragrances & Colognes";
  }
  // 5. Body care, massage oils, belly butter
  else if (/body lotion|body cream|body repair|massage|belly butter|foot leg|hand cream|hands/i.test(p.name)) {
    p.category = "Radiant Body Care";
  }
  // 6. Barrier relief, eczema, scars, pimple patches, healing jelly
  else if (/itch|scar|pimple patch|healing jelly|barrier|relief|spot corrector/i.test(p.name)) {
    p.category = "Barrier Repair & Relief";
  }
  // 7. Serums, toners, dark spot corrector serums, retinol serums, vitamin c serums
  else if (/serum|toner|peptides|vitamin c serum|retinol serum|pdrn/i.test(p.name)) {
    p.category = "Active Serums & Toners";
  }
  // 8. Anti-aging specific creams
  else if (/anti-aging|anti-wrinkle|wrinkle|collagen daily|cellular hyaluron|rejuveness|youth/i.test(p.name)) {
    p.category = "Anti-Aging & Q10";
  }
  // 9. Makeup accessories / brushes / pencils / lipsticks -> Radiant Body Care or Gentle Cleansers & Masks
  else if (/eyebrow|brow|eyeliner|mascara|lipstick|sponge|brush|palette|foundation|skin tint/i.test(p.name)) {
    p.category = "Radiant Body Care";
  }

  if (p.category !== origCat) {
    updates.push({ id: p.id, name: p.name, from: origCat, to: p.category });
  }
});

fs.writeFileSync('src/data/store-db.json', JSON.stringify(db, null, 2), 'utf-8');
console.log(`Re-categorized ${updates.length} products.`);

const sql = neon(
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Fb6OUhGzewd5@ep-muddy-cell-b4fiylwx-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
);

(async () => {
  await sql`
    INSERT INTO store_state (key, data, updated_at)
    VALUES ('current_store_db', ${JSON.stringify(db)}, NOW())
    ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
  `;
  console.log('Neon database successfully updated and synchronized with reorganized catalog!');
})().catch(console.error);
