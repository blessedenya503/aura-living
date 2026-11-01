const fs = require('fs');

async function testAPIs() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const rfMatch = env.match(/RAINFOREST_API_KEY=(.+)/);
  const rfKey = rfMatch ? rfMatch[1].trim() : '';

  try {
    const res = await fetch(`https://api.rainforestapi.com/request?api_key=${rfKey}&type=search&amazon_domain=amazon.com&search_term=nivea`);
    const data = await res.json();
    console.log('RF success:', data.request_info);
  } catch (err) {
    console.log('RF error cause:', err.cause);
    console.log('RF error message:', err.message);
  }
}

testAPIs();
