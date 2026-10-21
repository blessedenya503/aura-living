const fs = require("fs");
const readline = require("readline");

async function extractAllUntruncated() {
  const fullLog = "C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript_full.jsonl";
  const fileStream = fs.createReadStream(fullLog);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const l of rl) {
    try {
      const o = JSON.parse(l);
      if (o.tool_calls) {
        for (const c of o.tool_calls) {
          if (c.name === "write_to_file" && c.args?.TargetFile && c.args?.CodeContent) {
            let target = c.args.TargetFile;
            if (target.startsWith('"') && target.endsWith('"')) {
              try { target = JSON.parse(target); } catch (e) { target = target.slice(1, -1); }
            }
            target = target.replace(/\\/g, "/");
            if (target.includes("Anti Project/")) {
              const rel = target.split("Anti Project/")[1];
              let code = c.args.CodeContent;
              if (typeof code === "string" && code.startsWith('"') && code.endsWith('"')) {
                try { code = JSON.parse(code); } catch (e) {}
              }
              const dest = "C:/Users/Blessed/Desktop/PrepPulse/" + rel;
              fs.mkdirSync(require("path").dirname(dest), { recursive: true });
              fs.writeFileSync(dest, code, "utf8");
              console.log("Restored untruncated:", rel, "Bytes:", code.length);
            }
          }
        }
      }
    } catch (err) {}
  }
}

extractAllUntruncated();
