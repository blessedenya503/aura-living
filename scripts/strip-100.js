const fs = require('fs');
function edit(file, pairs) {
  let s = fs.readFileSync(file, 'utf8'), c = 0;
  for (const [a, b] of pairs) { const parts = s.split(a); if (parts.length > 1) { c += parts.length - 1; s = parts.join(b); } }
  fs.writeFileSync(file, s); console.log(file, c);
}
edit('src/context/CartContext.tsx', [[' • 100% GENUINE AUTHENTIC FORMULAS', ' • FREE SHIPPING OVER $35']]);
edit('src/app/layout.tsx', [
  ['AURA SKIN — 100% Authentic COSRX, CeraVe, Anua & La Roche-Posay', 'AURA SKIN — COSRX, CeraVe, Anua & La Roche-Posay'],
  ['AURA SKIN — 100% Authentic Skincare Formulations', 'AURA SKIN — Premium Skincare, Shipped Worldwide'],
]);
edit('src/components/AuraAiChatModal.tsx', [[' 100% authentic dermatological advice.', '']]);
edit('src/components/ProductModal.tsx', [['<span>100% Authentic Formula</span>', '<span>Factory-Sealed Formula</span>']]);
for (const f of ['src/data/store-db.json', 'src/data/products.ts']) {
  edit(f, [
    ['100% Authentic • Tracked Express Delivery', 'Tracked Express Delivery'],
    ['100% authentic, factory-sealed and shipped with tracking.', 'Factory-sealed and shipped with tracking.'],
    ['100% Authentic', 'Authentic'], ['100% authentic', 'authentic'],
    ['100% Genuine', 'Genuine'], ['100% genuine', 'genuine'],
  ]);
}
