const fs = require('fs');

async function testAPIs() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const rfMatch = env.match(/RAINFOREST_API_KEY=(.+)/);
  const cjMatch = env.match(/CJ_API_KEY=(.+)/);
  const rfKey = rfMatch ? rfMatch[1].trim() : '';
  const cjKey = cjMatch ? cjMatch[1].trim() : '';

  console.log('RF Key present:', !!rfKey);
  console.log('CJ Key present:', !!cjKey);

  // Test Rainforest
  try {
    const res = await fetch(`https://api.rainforestapi.com/request?api_key=${rfKey}&type=search&amazon_domain=amazon.com&search_term=nivea`);
    const data = await res.json();
    console.log('Rainforest status:', res.status);
    console.log('Rainforest response:', JSON.stringify(data.request_info || data));
  } catch (err) {
    console.log('Rainforest err:', err.message);
  }

  // Test CJ
  try {
    const cjRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: cjKey })
    });
    const cjData = await cjRes.json();
    console.log('CJ status:', cjRes.status);
    console.log('CJ response:', JSON.stringify(cjData));
  } catch (err) {
    console.log('CJ err:', err.message);
  }
}

testAPIs();
