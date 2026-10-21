const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function extract() {
  const logFile = "C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript.jsonl";
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesMap = new Map();

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === "write_to_file" && call.args && call.args.TargetFile && call.args.CodeContent) {
            let cleanPath = call.args.TargetFile.replace(/^["']|["']$/g, "").replace(/\\\\/g, "/");
            let content = call.args.CodeContent;
            if (content.startsWith('"') && content.endsWith('"')) {
              try {
                content = JSON.parse(content);
              } catch (e) {}
            }
            if (cleanPath.includes("Anti Project/")) {
              const rel = cleanPath.split("Anti Project/")[1];
              if (rel) {
                filesMap.set(rel, content);
              }
            }
          }
        }
      }
    } catch (err) {}
  }

  console.log("Found " + filesMap.size + " files from PrepPulse session.");
  const outDir = "C:/Users/Blessed/Desktop/PrepPulse";
  fs.mkdirSync(outDir, { recursive: true });

  for (const [relPath, content] of filesMap.entries()) {
    const fullDest = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, content, "utf8");
    console.log("Restored:", relPath);
  }

  console.log("PrepPulse restored successfully to " + outDir);
}

extract();
