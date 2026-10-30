const http = require('http');
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
const sql = neon(dbUrl);

function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function testE2E() {
  console.log("================ STARTING END-TO-END NEON TESTS ================\n");

  // Wait 3 seconds for Next.js server to be fully ready
  await new Promise(r => setTimeout(r, 3000));

  // Test 1: Customer Storefront API (/api/store)
  console.log("TEST 1: Testing Customer Storefront API (http://localhost:3003/api/store)...");
  const storeRes = await requestJson('http://localhost:3003/api/store');
  if (storeRes.status !== 200 || !storeRes.json?.products) {
    throw new Error(`Storefront API failed: status ${storeRes.status}`);
  }
  console.log(`✓ Storefront API returned ${storeRes.json.products.length} products.`);
  console.log(`✓ Store Name: "${storeRes.json.settings.storeName}"`);
  console.log(`✓ Announcement: "${storeRes.json.settings.announcementText}"\n`);

  // Test 2: Direct Neon Postgres Query
  console.log("TEST 2: Testing direct queries to Neon Postgres...");
  const neonProducts = await sql`SELECT COUNT(*)::int as count FROM products`;
  const neonSettings = await sql`SELECT data FROM store_settings WHERE id = 'main_settings'`;
  console.log(`✓ Neon 'products' table row count: ${neonProducts[0].count}`);
  console.log(`✓ Neon 'store_settings' store name: "${neonSettings[0].data.storeName}"`);
  console.log(`✓ Neon linked bank account: "${neonSettings[0].data.linkedBank?.bankName || 'N/A'}"\n`);

  // Test 3: Checkout and Persistence into Neon
  console.log("TEST 3: Testing End-to-End Checkout Mutation & Persistence to Neon...");
  const sampleCheckoutPayload = {
    customerName: "Neon Integration Tester",
    customerEmail: "neon.test@auraliving.store",
    shippingAddress: "100 Neon Way, Cloud Valley",
    city: "San Francisco",
    country: "United States",
    postalCode: "94105",
    currency: "USD",
    paymentMethod: "Stripe Card",
    items: [
      {
        productId: storeRes.json.products[0].id,
        variantName: "Standard",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: storeRes.json.products[0].price
      }
    ]
  };

  const checkoutRes = await requestJson('http://localhost:3003/api/checkout', {
    method: 'POST'
  }, sampleCheckoutPayload);

  if (checkoutRes.status !== 200 || !checkoutRes.json?.success) {
    throw new Error(`Checkout failed: status ${checkoutRes.status}, data: ${JSON.stringify(checkoutRes)}`);
  }

  const createdOrderId = checkoutRes.json.order.id;
  console.log(`✓ Checkout successful! Order generated: ${createdOrderId}`);

  // Test 4: Verify Order was persisted to Neon
  console.log("TEST 4: Verifying order exists in Neon Database snapshot...");
  const dbState = await sql`SELECT data FROM store_state WHERE key = 'current_store_db'`;
  const foundOrder = dbState[0].data.orders.find(o => o.id === createdOrderId);

  if (!foundOrder) {
    throw new Error(`Order ${createdOrderId} was not found in Neon store_state!`);
  }
  console.log(`✓ Found newly created order ${createdOrderId} in Neon PostgreSQL!`);
  console.log(`  Customer: ${foundOrder.customerName} (${foundOrder.customerEmail})`);
  console.log(`  Total Paid: $${foundOrder.totalPaidUsd}`);

  // Clean up test order from Neon
  console.log("\nTEST 5: Cleaning up test order from Neon...");
  dbState[0].data.orders = dbState[0].data.orders.filter(o => o.id !== createdOrderId);
  await sql`
    UPDATE store_state
    SET data = ${JSON.stringify(dbState[0].data)}, updated_at = NOW()
    WHERE key = 'current_store_db';
  `;
  console.log("✓ Test order cleaned up successfully.");

  console.log("\n================ ALL NEON TESTS PASSED END-TO-END! ================");
}

testE2E().catch(err => {
  console.error("End-to-End Test Failed:", err);
  process.exit(1);
});
