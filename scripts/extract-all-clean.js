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
            try {
              if (targetFile.startsWith('"')) targetFile = JSON.parse(targetFile);
            } catch (e) {}
            targetFile = targetFile.replace(/\\/g, "/");

            let code = call.args.CodeContent;
            try {
              if (code.startsWith('"')) code = JSON.parse(code);
            } catch (e) {
              // fallback
              if (code.startsWith('"') && code.endsWith('"')) {
                code = code.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"');
              }
            }

            if (targetFile.includes("Anti Project/")) {
              const rel = targetFile.split("Anti Project/")[1];
              if (rel) {
                filesMap.set(rel, code);
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  console.log("Found " + filesMap.size + " files from transcript.");
  const outDir = "C:/Users/Blessed/Desktop/PrepPulse";

  for (const [relPath, content] of filesMap.entries()) {
    const fullDest = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, content, "utf8");
    console.log("Restored:", relPath);
  }
}

run();
