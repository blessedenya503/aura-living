const fs = require('fs');
let n = 0;
function edit(file, pairs) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISS', file, a.slice(0, 60)); continue; }
    s = s.split(a).join(b); n++;
  }
  fs.writeFileSync(file, s);
}
const COUNTRIES = ['United States','United Kingdom','Canada','Australia','New Zealand','Ireland','Germany','France','Italy','Spain','Netherlands','Belgium','Sweden','Switzerland','United Arab Emirates','Saudi Arabia','Qatar','India','Singapore','Malaysia','Japan','South Korea','China','Hong Kong','Mexico','Brazil','Nigeria','Ghana','Kenya','South Africa','Uganda','Tanzania','Egypt','Morocco'];
const opts = COUNTRIES.map(c => `                      <option value="${c}">${c}</option>`).join('\n');

// Checkout
let cm = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');
const selStart = cm.indexOf('                      <option value="Nigeria">Nigeria</option>');
const selEnd = cm.indexOf('</select>', selStart);
cm = cm.slice(0, selStart) + '                      <option value="" disabled>Select country</option>\n' + opts + '\n                    ' + cm.slice(selEnd);
fs.writeFileSync('src/components/CheckoutModal.tsx', cm);
edit('src/components/CheckoutModal.tsx', [
  ['useState("Lagos")', 'useState("")'],
  ['useState("101241")', 'useState("")'],
  ['useState("Nigeria")', 'useState("")'],
  ['shippingAddress || "Victoria Island"', 'shippingAddress'],
  ['city: city || "Lagos"', 'city'],
  ['postalCode || "101241"', 'postalCode'],
  ['placeholder="Lagos"', 'placeholder="City"'],
  ['placeholder="101241"', 'placeholder="ZIP / Postal"'],
  ['(Nigeria & Global)', '(Worldwide)'],
  ['Direct payment via Nigerian Bank Transfer (OPay, Access, Zenith, GTB, Kuda, UBA), Visa, Mastercard, Verve & USSD. Your order is verified automatically upon payment.', 'Pay securely with Visa, Mastercard, Verve, bank transfer or local payment options available in your country. Your order is verified automatically upon payment.'],
]);
edit('src/components/CheckoutModal.tsx', [['<select\n                      value={country}', '<select\n                      required\n                      value={country}']]);

edit('src/app/page.tsx', [
  ['How fast is delivery within Nigeria?', 'How fast is delivery worldwide?'],
  ['Orders in Lagos & Abuja typically deliver within 1–2 business days. Delivery to other states across Nigeria takes 2–4 business days via reliable door-to-door couriers with tracking.', 'We ship worldwide with full tracking. Most orders arrive within 2–5 business days in major regions and 5–10 business days for international destinations, delivered door-to-door by reliable couriers.'],
]);
edit('src/app/product/[id]/page.tsx', [['fast tracked delivery in Nigeria & worldwide', 'fast tracked delivery worldwide']]);
edit('src/components/StorefrontFloatingHelp.tsx', [
  ['Nigeria Nationwide Logistics', 'Worldwide Logistics'],
  ['1–2 business days Lagos/Abuja • 2–4 days nationwide', '2–5 days major regions • 5–10 days international'],
]);
edit('src/components/ProductDetailPage.tsx', [['Tracked door delivery (Lagos, Abuja & nationwide)', 'Tracked door delivery worldwide']]);
edit('src/components/CustomerReviewsSection.tsx', [
  ['customers across Nigeria &amp; worldwide', 'customers around the world'],
  ['e.g. Lekki, Lagos or Abuja', 'e.g. London, UK or Toronto, Canada'],
]);
edit('src/lib/email.ts', [['24–48H delivery across Lagos, Abuja, and express international shipping', 'tracked express delivery worldwide']]);
edit('src/lib/email.ts', [['24&ndash;48H delivery across Lagos, Abuja, and express international shipping', 'tracked express delivery worldwide']]);
edit('src/context/CartContext.tsx', [
  ['🚚 FAST 24-48H DISPATCH IN LAGOS & ABUJA • 100% GENUINE AUTHENTIC FORMULAS', '🌍 WORLDWIDE TRACKED SHIPPING • 100% GENUINE AUTHENTIC FORMULAS'],
  ['In Stock in Nigeria', 'In Stock Worldwide'],
  ['storeName: "AURA SKIN NIGERIA"', 'storeName: "AURA SKIN"'],
]);
edit('src/app/api/paystack/verify/route.ts', [
  ['orderPayload?.city || "Lagos"', 'orderPayload?.city || ""'],
  ['orderPayload?.country || "Nigeria"', 'orderPayload?.country || ""'],
]);
edit('src/app/api/reviews/route.ts', [['location?.trim() || "Nigeria"', 'location?.trim() || "Worldwide"']]);

// layout.tsx SEO / branding
let lay = fs.readFileSync('src/app/layout.tsx', 'utf8');
[
  ['AURA SKIN NIGERIA', 'AURA SKIN'],
  ['Aura Skin Nigeria', 'Aura Skin Worldwide'],
  ['"skincare store in Nigeria"', '"authentic skincare store worldwide"'],
  ['"authentic skincare Lagos"', '"authentic skincare worldwide shipping"'],
  ['"buy CeraVe in Nigeria"', '"buy CeraVe online"'],
  ['"La Roche-Posay Nigeria"', '"La Roche-Posay online"'],
  ['"COSRX Snail Mucin Nigeria"', '"COSRX Snail Mucin online"'],
  ['"The Ordinary skincare Nigeria"', '"The Ordinary skincare online"'],
  ['"Korean skincare Nigeria"', '"Korean skincare worldwide"'],
  ['"genuine skincare store Lagos"', '"genuine skincare store online"'],
  ['skincare brands in Nigeria', 'skincare brands worldwide'],
  ['Fast tracked delivery across Nigeria.', 'Fast tracked delivery worldwide.'],
  ['Authentic skincare store in Nigeria', 'Authentic skincare store with worldwide shipping'],
  ['{ "@type": "Country", name: "Nigeria" }', '{ "@type": "Place", name: "Worldwide" }'],
].forEach(([a, b]) => { if (!lay.includes(a)) console.log('MISS layout', a); lay = lay.split(a).join(b); });
fs.writeFileSync('src/app/layout.tsx', lay);

// DB settings
for (const f of ['src/data/store-db.json']) {
  let s = fs.readFileSync(f, 'utf8');
  console.log('store-db settings nigeria refs:', (s.match(/lagos|abuja/gi) || []).length);
}
console.log('edits applied', n);
