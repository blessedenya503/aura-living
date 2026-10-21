const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function run() {
  const fileStream = fs.createReadStream("C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript.jsonl");
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesMap = new Map();

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === "write_to_file" && call.args?.TargetFile && call.args?.CodeContent) {
            let targetFile = call.args.TargetFile;
            // TargetFile is like "\"c:\\\\Users\\\\Blessed\\\\Desktop\\\\Anti Project\\\\package.json\""
            targetFile = JSON.parse(targetFile).replace(/\\/g, "/");
            let code = call.args.CodeContent;
            // Code is a JSON-encoded string
            code = JSON.parse(code);

            if (targetFile.includes("Anti Project/")) {
              const rel = targetFile.split("Anti Project/")[1];
              if (rel) {
                filesMap.set(rel, code);
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  console.log("Successfully extracted " + filesMap.size + " clean files from transcript.");
  const outDir = "C:/Users/Blessed/Desktop/PrepPulse";

  for (const [relPath, content] of filesMap.entries()) {
    const fullDest = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, content, "utf8");
    console.log("Extracted:", relPath);
  }
}

run();
