import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

// Allow safe exploration and editing within the project workspace
const PROJECT_ROOT = path.resolve(process.cwd());

function isSafePath(targetPath: string): boolean {
  const resolved = path.resolve(targetPath);
  return resolved.startsWith(PROJECT_ROOT);
}

// Tree builder (limited depth and filtering heavy folders)
function getDirectoryTree(dirPath: string, relativeRoot = "", depth = 0, maxDepth = 4): any[] {
  if (depth > maxDepth) return [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const items: any[] = [];

    // Filter out node_modules, .git, .next, etc.
    const ignored = new Set([
      "node_modules",
      ".next",
      ".git",
      ".vscode",
      ".gemini",
      "dist",
      "build",
      ".turbo",
    ]);

    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativeRoot, entry.name).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          path: relPath,
          type: "directory",
          children: getDirectoryTree(fullPath, relPath, depth + 1, maxDepth),
        });
      } else {
        const stats = fs.statSync(fullPath);
        items.push({
          name: entry.name,
          path: relPath,
          type: "file",
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        });
      }
    }

    // Sort: directories first, then alphabetically
    return items.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const filePath = searchParams.get("path");

  // 1. Get file tree
  if (action === "tree") {
    const tree = getDirectoryTree(PROJECT_ROOT);
    return NextResponse.json({ success: true, tree });
  }

  // 2. Read specific file
  if (action === "read" && filePath) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (!isSafePath(fullPath)) {
      return NextResponse.json({ error: "Access denied: Path outside workspace" }, { status: 403 });
    }

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      return NextResponse.json({ success: true, path: filePath, content });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
}

export async function POST(req: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, path: filePath, content, prompt, systemPrompt } = body;

    // 1. Save file content directly
    if (action === "save" && filePath && typeof content === "string") {
      const fullPath = path.join(PROJECT_ROOT, filePath);
      if (!isSafePath(fullPath)) {
        return NextResponse.json({ error: "Access denied: Path outside workspace" }, { status: 403 });
      }

      // Ensure directory exists
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, "utf-8");

      return NextResponse.json({
        success: true,
        message: `File "${filePath}" saved successfully.`,
        savedAt: new Date().toISOString(),
      });
    }

    // 2. Create new file or folder
    if (action === "create" && filePath) {
      const fullPath = path.join(PROJECT_ROOT, filePath);
      if (!isSafePath(fullPath)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      if (body.type === "directory") {
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content || "", "utf-8");
      }

      return NextResponse.json({ success: true, message: `Created ${filePath}` });
    }

    // 3. Antigravity AI Code Assist (Powered by Gemini)
    if (action === "ai_assist" && prompt) {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!geminiKey) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not configured in .env.local" },
          { status: 400 }
        );
      }

      const activeFileContext = filePath && typeof content === "string"
        ? `\n\n--- ACTIVE FILE: ${filePath} ---\n\`\`\`\n${content.slice(0, 15000)}\n\`\`\``
        : "";

      const aiPrompt = `${systemPrompt || "You are Antigravity AI Assistant, an elite code editor and architect built into AURA Skincare Owner Portal."}
User Query: ${prompt}
${activeFileContext}

Give clean, precise code snippets, fixes, diffs, or architecture recommendations. Be direct and helpful.`;

      // Try modern available models in order of capability and speed
      const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"];
      let answer = "";
      let lastError = "";

      for (const model of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: aiPrompt }] }],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 2500,
                },
              }),
              signal: AbortSignal.timeout(15000),
            }
          );

          if (response.ok) {
            const data = await response.json();
            answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (answer) break;
          } else {
            const errData = await response.json().catch(() => ({}));
            lastError = errData?.error?.message || `HTTP ${response.status}`;
          }
        } catch (fetchErr: any) {
          lastError = fetchErr?.message || "Timeout connecting to Gemini";
        }
      }

      if (!answer) {
        return NextResponse.json(
          { error: lastError || "No response generated from Gemini AI engine." },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, answer });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
