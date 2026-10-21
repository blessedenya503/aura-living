// Probe image providers with a hard timeout
const prompt = "round frosted white cosmetic cream jar with silver screw lid, closed, studio packshot, white background, no text";
const tests = {
  pollinations_flux: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=5&nologo=true&model=flux`,
  pollinations_default: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=5&nologo=true`,
  pollinations_turbo: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=5&nologo=true&model=turbo`,
};
(async () => {
  for (const [k, url] of Object.entries(tests)) {
    const t0 = Date.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
      const buf = Buffer.from(await res.arrayBuffer());
      console.log(k, res.status, res.headers.get("content-type"), buf.length, ((Date.now() - t0) / 1000).toFixed(1) + "s");
    } catch (e) {
      console.log(k, "ERR", e.name, ((Date.now() - t0) / 1000).toFixed(1) + "s");
    }
  }
})();
