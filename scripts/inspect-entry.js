const fs = require("fs");
const readline = require("readline");

async function check() {
  const rl = readline.createInterface({ input: fs.createReadStream("C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript.jsonl") });
  for await (const l of rl) {
    const o = JSON.parse(l);
    if (o.tool_calls) {
      for (const c of o.tool_calls) {
        if (c.name === "write_to_file") {
          console.log("TargetFile:", typeof c.args.TargetFile, JSON.stringify(c.args.TargetFile));
          console.log("CodeContent type:", typeof c.args.CodeContent, "First 50 chars:", JSON.stringify(c.args.CodeContent.slice(0, 50)));
          return;
        }
      }
    }
  }
}
check();
