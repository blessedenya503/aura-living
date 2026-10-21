const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function extractProperly() {
  const logFile = "C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript_full.jsonl";
  const source = fs.existsSync(logFile) 
    ? logFile 
    : "C:/Users/Blessed/.gemini/antigravity/brain/6ac6a12a-f935-4b99-b375-e39f9e7f4698/.system_generated/logs/transcript.jsonl";

  console.log("Reading from:", source);
  const fileStream = fs.createReadStream(source);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesMap = new Map();

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === "write_to_file" && call.args && call.args.TargetFile && call.args.CodeContent) {
            let targetFile = call.args.TargetFile;
            if (typeof targetFile === "string") {
              targetFile = targetFile.replace(/^["']|["']$/g, "").replace(/\\\\/g, "/");
            }
            let code = call.args.CodeContent;
            // In tool_calls, CodeContent could be an actual string
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
    let finalStr = content;
    // If it was wrapped in JSON string
    if (typeof finalStr === "string" && finalStr.startsWith('"') && finalStr.endsWith('"')) {
      // Decode escaped newlines and quotes manually if JSON.parse fails on unescaped control chars
      try {
        finalStr = JSON.parse(finalStr);
      } catch (e) {
        finalStr = finalStr.slice(1, -1)
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    }
    const fullDest = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, finalStr, "utf8");
    console.log("Properly written:", relPath);
  }
}

extractProperly();
