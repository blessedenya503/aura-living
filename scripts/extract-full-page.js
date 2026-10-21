const fs = require("fs");
const readline = require("readline");

async function extractFull() {
  const fileStream = fs.createReadStream("C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript_full.jsonl");
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const l of rl) {
    if (l.includes("src/app/page.tsx") || l.includes("src\\\\app\\\\page.tsx")) {
      const o = JSON.parse(l);
      if (o.tool_calls) {
        for (const c of o.tool_calls) {
          if (c.args?.TargetFile?.includes("src") && c.args?.TargetFile?.includes("page.tsx")) {
            console.log("Found full page.tsx, length:", c.args.CodeContent?.length);
            let code = c.args.CodeContent;
            if (code.startsWith('"')) code = JSON.parse(code);
            fs.writeFileSync("C:/Users/Blessed/Desktop/PrepPulse/src/app/page.tsx", code, "utf8");
            console.log("Successfully written full untruncated page.tsx!");
          }
        }
      }
    }
  }
}

extractFull();
