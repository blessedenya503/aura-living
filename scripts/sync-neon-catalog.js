const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function syncToNeon() {
  const env = fs.readFileSync(".env.local", "utf8");
  const m = env.match(/DATABASE_URL=(.+)/) || env.match(/DATABASE_URL_UNPOOLED=(.+)/);
  if (!m) {
    console.error("No database URL found in .env.local");
    return;
  }
  const dbUrl = m[1].trim();
  const sql = neon(dbUrl);

  const localDb = JSON.parse(fs.readFileSync("src/data/store-db.json", "utf8"));
  // Never sync simulated Sophia Laurent test orders
  localDb.orders = (localDb.orders || []).filter(
    (o) => o.customerName !== "Sophia Laurent" && o.customerEmail !== "sophia.l@aura-skincare.com"
  );

  const existing = await sql.query("SELECT data FROM store_state WHERE key = $1 LIMIT 1", ["current_store_db"]);
  if (existing && existing.length > 0 && existing[0].data) {
    const remoteOrders = (existing[0].data.orders || []).filter(
      (o) => o.customerName !== "Sophia Laurent" && o.customerEmail !== "sophia.l@aura-skincare.com"
    );
    localDb.orders = remoteOrders;
  }

  console.log(
    `Pushing clean catalog (${localDb.products.length} products, ${localDb.orders.length} real orders) to Neon cloud database...`
  );

  await sql.query(
    "INSERT INTO store_state (key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()",
    ["current_store_db", JSON.stringify(localDb)]
  );

  const check = await sql.query(
    "SELECT json_array_length((data->>'products')::json) as pcount, json_array_length((data->>'orders')::json) as ocount FROM store_state WHERE key = $1",
    ["current_store_db"]
  );

  console.log(
    `✓ Neon cloud database updated! Products: ${check[0]?.pcount}, Real Orders: ${check[0]?.ocount}`
  );
}

syncToNeon().catch((err) => {
  console.error("Neon database sync failed:", err.message);
  process.exit(1);
});
