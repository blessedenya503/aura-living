const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function syncToNeon() {
  const env = fs.readFileSync(".env.local", "utf8");
  const m = env.match(/DATABASE_URL_UNPOOLED=(.+)/) || env.match(/DATABASE_URL=(.+)/);
  if (!m) {
    console.error("No database URL found in .env.local");
    return;
  }
  const dbUrl = m[1].trim();
  const sql = neon(dbUrl);

  const localDb = JSON.parse(fs.readFileSync("src/data/store-db.json", "utf8"));
  console.log(`Pushing clean authentic catalog (${localDb.products.length} products) to Neon cloud database...`);

  await sql.query(
    "INSERT INTO store_state (key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()",
    ["current_store_db", JSON.stringify(localDb)]
  );

  const check = await sql.query(
    "SELECT json_array_length((data->>'products')::json) as count FROM store_state WHERE key = $1",
    ["current_store_db"]
  );

  console.log(`✓ Neon cloud database updated successfully! Active authentic product count in Neon: ${check[0]?.count}`);
}

syncToNeon().catch((err) => {
  console.error("Neon database sync failed:", err.message);
  process.exit(1);
});
