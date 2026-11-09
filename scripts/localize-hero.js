const fs = require('fs'), path = require('path'), https = require('https');
const P = require('../src/data/store-db.json').products;
const dir = 'public/uploads/products';
const small = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).size < 8000);
console.log('small:', small.map(f => f + ' ' + (fs.statSync(path.join(dir, f)).size)));
function dl(url, dest) { return new Promise(r => https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => { if (res.statusCode !== 200) { res.resume(); return r(false) } const c = []; res.on('data', d => c.push(d)); res.on('end', () => { const b = Buffer.concat(c); fs.writeFileSync(dest, b); r(b.length) }) }).on('error', () => r(false))) }
(async () => {
  // localize hero / weekly tiktok images
  for (const f of ['src/components/Hero.tsx', 'src/lib/weekly-tiktok.ts']) {
    let s = fs.readFileSync(f, 'utf8');
    const urls = [...new Set([...s.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+/g)].map(m => m[0]))];
    for (const u of urls) {
      const id = u.match(/\/I\/([^.]+)\./)[1].replace(/[^A-Za-z0-9-]/g, '');
      const hi = u.replace(/\._[A-Z0-9_,]+_\.(jpg|png)/i, '._AC_SL1000_.$1');
      const dest = path.join('public/uploads', 'hero-' + id + '.jpg');
      let n = await dl(hi, dest); if (!n) n = await dl(u, dest);
      if (n) s = s.split(u).join('/uploads/hero-' + id + '.jpg');
      console.log(f, id, n);
    }
    fs.writeFileSync(f, s);
  }
})();
