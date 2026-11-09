const fs = require('fs');

let content = fs.readFileSync('src/lib/weekly-tiktok.ts', 'utf8');

// Replace inflated view counts with clean genuine badges
content = content.replace(/views:\s*"[0-9.]+[BMK]?\s*Views"/gi, 'views: "Viral Favorite"');
content = content.replace(/heroHighlight:\s*"4.8 Billion TikTok Sensation\."/gi, 'heroHighlight: "Original COSRX Snail Mucin."');
content = content.replace(/trendHook:\s*"Dermatologists & Beauty Creators Swear By It"/gi, 'trendHook: "Overnight Barrier Slugging Essential"');
content = content.replace(/trendHook:\s*"Dermatologist #1 Body & Face Texture Fix"/gi, 'trendHook: "Smoothing Rough & Bumpy Skin Fix"');

fs.writeFileSync('src/lib/weekly-tiktok.ts', content, 'utf8');
console.log('Cleaned up weekly-tiktok.ts views and claims!');
