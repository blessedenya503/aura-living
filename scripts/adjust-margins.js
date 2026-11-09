const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function syncAndAdjustMargins() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/DATABASE_URL=(.+)/);
  if (!m) return console.log('No DATABASE_URL found');
  const sql = neon(m[1].trim());

  // Fetch current db from Neon
  const rows = await sql`SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1`;
  if (!rows || !rows.length || !rows[0].data) {
    console.log('No store_state in Neon');
    return;
  }

  const db = rows[0].data;
  console.log(`Current Neon products count: ${db.products.length}`);

  // Set storeName to 'AURA'
  db.settings.storeName = 'AURA';
  console.log('Set storeName to: AURA');

  // Adjust each product's profit margin to 25% - 30%
  // Margin = (Price - Cost) / Price
  // If Margin is 25%: Price = Cost / (1 - 0.25) = Cost / 0.75 = Cost * 1.333
  // If Margin is 28%: Price = Cost / (1 - 0.28) = Cost / 0.72 = Cost * 1.388
  // If Margin is 30%: Price = Cost / (1 - 0.30) = Cost / 0.70 = Cost * 1.428
  let adjustedCount = 0;
  db.products.forEach((p, idx) => {
    let cost = Number(p.supplierCost);
    if (!cost || cost <= 0 || isNaN(cost)) {
      // If supplierCost was missing or 0, deduce from existing price assuming ~50%
      cost = Number((p.price * 0.72).toFixed(2));
      p.supplierCost = cost;
    }

    // Assign a healthy competitive margin between 25% and 30% (average ~27.5%)
    // Deterministic spread based on index
    const marginPercent = 25 + (idx % 6); // 25%, 26%, 27%, 28%, 29%, 30%
    const newPrice = Number((cost / (1 - (marginPercent / 100))).toFixed(2));
    const compareAt = Number((newPrice * 1.25).toFixed(2));

    p.price = newPrice;
    p.compareAtPrice = compareAt;
    adjustedCount++;
  });

  console.log(`Adjusted ${adjustedCount} products to 25%-30% margin.`);

  // Write back to Neon
  await sql`
    UPDATE store_state 
    SET data = ${JSON.stringify(db)}, updated_at = NOW()
    WHERE key = 'current_store_db'
  `;

  // Also update local store-db.json
  fs.writeFileSync('src/data/store-db.json', JSON.stringify(db, null, 2), 'utf8');

  console.log('Successfully updated Neon DB and local store-db.json!');
}

syncAndAdjustMargins();
