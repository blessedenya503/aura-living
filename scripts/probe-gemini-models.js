const fs = require("fs");
const path = require("path");
const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf-8");
const key = env.match(/GEMINI_API_KEY\s*=\s*(\S+)/)[1];
const prompt = "round frosted white cosmetic cream jar with silver screw lid, closed, studio packshot, white background, no text";
const base = "https://generativelanguage.googleapis.com/v1beta/models/";
async function post(model, body) {
  const r = await fetch(`${base}${model}${body.instances ? ":predict" : ":generateContent"}?key=${key}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(90000),
  });
  const t = await r.text();
  console.log(model, r.status, r.ok ? "OK " + t.length + " bytes" : t.replace(/\s+/g, " ").slice(0, 220));
}
(async () => {
  const list = await fetch(`${base}?key=${key}&pageSize=200`).then((r) => r.json());
  if (list.error) { console.log("LIST ERROR", list.error.code, list.error.message); return; }
  const names = (list.models || []).map((m) => m.name.replace("models/", "")).filter((n) => /image|imagen/i.test(n));
  console.log("image-capable models:", names.join(", "));
  for (const n of names) {
    if (/imagen/i.test(n)) await post(n, { instances: [{ prompt }], parameters: { sampleCount: 1 } });
    else await post(n, { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["TEXT", "IMAGE"] } });
  }
})();
