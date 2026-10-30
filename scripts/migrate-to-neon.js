const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read .env.local for DATABASE_URL
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/DATABASE_URL=(.+)/);
if (!match) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}
const dbUrl = match[1].trim();

const sql = neon(dbUrl);

// Helper for query with retry
async function queryWithRetry(fn, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Query failed (${err.message}). Retrying in 1.5s...`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function migrate() {
  console.log("Starting Neon Postgres Schema Setup & Data Migration...");

  // 1. Create tables
  await queryWithRetry(() => sql`
    CREATE TABLE IF NOT EXISTS store_settings (
      id VARCHAR(64) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log(" Table 'store_settings' ready.");

  await queryWithRetry(() => sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(128) PRIMARY KEY,
      brand VARCHAR(128),
      title TEXT NOT NULL,
      category VARCHAR(128),
      price NUMERIC(10,2),
      compare_at_price NUMERIC(10,2),
      in_stock BOOLEAN DEFAULT TRUE,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log(" Table 'products' ready.");

  await queryWithRetry(() => sql`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(128) PRIMARY KEY,
      customer_email VARCHAR(255),
      customer_name VARCHAR(255),
      total_paid_usd NUMERIC(10,2),
      payment_status VARCHAR(64),
      fulfillment_status VARCHAR(64),
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log(" Table 'orders' ready.");

  await queryWithRetry(() => sql`
    CREATE TABLE IF NOT EXISTS clinical_cases (
      id VARCHAR(128) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log(" Table 'clinical_cases' ready.");

  await queryWithRetry(() => sql`
    CREATE TABLE IF NOT EXISTS store_state (
      key VARCHAR(64) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log(" Table 'store_state' ready.");

  // 2. Read local store-db.json
  const storeDbPath = path.join(__dirname, '..', 'src', 'data', 'store-db.json');
  if (!fs.existsSync(storeDbPath)) {
    console.error("store-db.json not found at:", storeDbPath);
    return;
  }

  const localDb = JSON.parse(fs.readFileSync(storeDbPath, 'utf8'));

  // 3. Save full store_state snapshot for instant single-query reads
  console.log(" Saving full store state snapshot to 'store_state'...");
  await queryWithRetry(() => sql`
    INSERT INTO store_state (key, data, updated_at)
    VALUES ('current_store_db', ${JSON.stringify(localDb)}, NOW())
    ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
  `);
  console.log(" Full store state snapshot saved.");

  // 4. Migrate Settings
  if (localDb.settings) {
    await queryWithRetry(() => sql`
      INSERT INTO store_settings (id, data, updated_at)
      VALUES ('main_settings', ${JSON.stringify(localDb.settings)}, NOW())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
    `);
    console.log(" Migrated store settings.");
  }

  // 5. Migrate Clinical Cases
  if (Array.isArray(localDb.clinicalCases) && localDb.clinicalCases.length > 0) {
    for (const c of localDb.clinicalCases) {
      await queryWithRetry(() => sql`
        INSERT INTO clinical_cases (id, data, updated_at)
        VALUES (${c.id}, ${JSON.stringify(c)}, NOW())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
      `);
    }
    console.log(` Migrated ${localDb.clinicalCases.length} clinical study cases.`);
  }

  // 6. Migrate Orders
  if (Array.isArray(localDb.orders) && localDb.orders.length > 0) {
    for (const o of localDb.orders) {
      await queryWithRetry(() => sql`
        INSERT INTO orders (id, customer_email, customer_name, total_paid_usd, payment_status, fulfillment_status, data, created_at, updated_at)
        VALUES (
          ${o.id},
          ${o.customerEmail || ''},
          ${o.customerName || ''},
          ${o.totalPaidUsd || 0},
          ${o.paymentStatus || 'Paid'},
          ${o.fulfillmentStatus || 'Unfulfilled'},
          ${JSON.stringify(o)},
          ${o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
      `);
    }
    console.log(` Migrated ${localDb.orders.length} orders.`);
  }

  // 7. Migrate Products
  if (Array.isArray(localDb.products) && localDb.products.length > 0) {
    console.log(` Migrating ${localDb.products.length} products to Neon...`);
    const chunkSize = 10;
    for (let i = 0; i < localDb.products.length; i += chunkSize) {
      const chunk = localDb.products.slice(i, i + chunkSize);
      for (const p of chunk) {
        await queryWithRetry(() => sql`
          INSERT INTO products (id, brand, title, category, price, compare_at_price, in_stock, data, updated_at)
          VALUES (
            ${p.id},
            ${p.brand || 'Unbranded'},
            ${p.title || ''},
            ${p.category || 'General'},
            ${p.price || 0},
            ${p.compareAtPrice || 0},
            ${p.inStock !== false},
            ${JSON.stringify(p)},
            NOW()
          )
          ON CONFLICT (id) DO UPDATE 
            SET brand = EXCLUDED.brand,
                title = EXCLUDED.title,
                category = EXCLUDED.category,
                price = EXCLUDED.price,
                compare_at_price = EXCLUDED.compare_at_price,
                in_stock = EXCLUDED.in_stock,
                data = EXCLUDED.data,
                updated_at = NOW();
        `);
      }
      process.stdout.write(`  Processed ${Math.min(i + chunkSize, localDb.products.length)} / ${localDb.products.length} products...\r`);
    }
    console.log(`\n Successfully migrated all ${localDb.products.length} products to Neon!`);
  }

  // 8. Verify counts
  const prodCount = await queryWithRetry(() => sql`SELECT COUNT(*)::int as count FROM products`);
  const orderCount = await queryWithRetry(() => sql`SELECT COUNT(*)::int as count FROM orders`);
  const settingsCount = await queryWithRetry(() => sql`SELECT COUNT(*)::int as count FROM store_settings`);
  const casesCount = await queryWithRetry(() => sql`SELECT COUNT(*)::int as count FROM clinical_cases`);
  const stateCount = await queryWithRetry(() => sql`SELECT COUNT(*)::int as count FROM store_state`);

  console.log("\n================ NEON DATABASE STATUS ================");
  console.log(` Products in Neon:       ${prodCount[0].count}`);
  console.log(` Orders in Neon:         ${orderCount[0].count}`);
  console.log(` Settings in Neon:       ${settingsCount[0].count}`);
  console.log(` Clinical Cases in Neon: ${casesCount[0].count}`);
  console.log(` Store State Snapshots:  ${stateCount[0].count}`);
  console.log("======================================================");
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
