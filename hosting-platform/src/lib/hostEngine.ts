import fs from "fs/promises";
import path from "path";

export interface RealHostedSite {
  slug: string;
  domain: string;
  title: string;
  type: string;
  phpVersion: string;
  status: "active" | "deploying" | "stopped";
  createdAt: string;
  storageBytes: number;
}

const BASE_DIR = path.join(process.cwd(), "hosted-sites");
const REGISTRY_FILE = path.join(BASE_DIR, "registry.json");

// Helper to ensure base directory and registry exist
export async function initHostEngine() {
  try {
    await fs.mkdir(BASE_DIR, { recursive: true });
    try {
      await fs.access(REGISTRY_FILE);
    } catch {
      // Create initial seed registry with sample working sites
      const seedSites: RealHostedSite[] = [
        {
          slug: "crypto-portal",
          domain: "crypto-portal.novahost.local",
          title: "Apex Crypto Live Portal",
          type: "Static HTML5 & JS",
          phpVersion: "LiteSpeed Static",
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
          storageBytes: 14200,
        },
        {
          slug: "cyber-agency",
          domain: "cyber-agency.novahost.local",
          title: "Veloce Creative Agency",
          type: "Static HTML5 & Tailwind",
          phpVersion: "LiteSpeed Static",
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
          storageBytes: 11800,
        },
      ];
      await fs.writeFile(REGISTRY_FILE, JSON.stringify(seedSites, null, 2), "utf8");

      // Create site 1: crypto-portal
      const cryptoDir = path.join(BASE_DIR, "crypto-portal", "public_html");
      await fs.mkdir(cryptoDir, { recursive: true });
      await fs.writeFile(
        path.join(cryptoDir, "index.html"),
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Crypto Live Portal</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="badge">LIVE HOSTED ON NOVAHOST</div>
    <h1>Apex Crypto Terminal</h1>
    <p>Real website physically hosted on your own machine's disk.</p>
    <div class="stats">
      <div class="stat-box">
        <span>Bitcoin (BTC)</span>
        <strong>$89,420.50</strong>
        <span class="green">+4.8%</span>
      </div>
      <div class="stat-box">
        <span>Ethereum (ETH)</span>
        <strong>$3,240.10</strong>
        <span class="green">+6.2%</span>
      </div>
    </div>
    <button onclick="alert('Hello from your hosted website!')">Test Interactive JS</button>
  </div>
</body>
</html>`,
        "utf8"
      );

      await fs.writeFile(
        path.join(cryptoDir, "style.css"),
        `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #090a12;
  color: #f1f2f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.card {
  background: #131424;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 40px;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.badge {
  display: inline-block;
  background: rgba(108,92,231,0.2);
  color: #a29bfe;
  border: 1px solid rgba(108,92,231,0.4);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}
h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 900; }
p { color: #8a8d9e; font-size: 14px; margin-bottom: 24px; }
.stats { display: flex; gap: 12px; margin-bottom: 24px; }
.stat-box {
  flex: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-box strong { font-size: 18px; color: #fff; }
.green { color: #10b981; font-size: 12px; font-weight: bold; }
button {
  background: #6c5ce7;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
}
button:hover { background: #5844e3; }`,
        "utf8"
      );

      // Create site 2: cyber-agency
      const agencyDir = path.join(BASE_DIR, "cyber-agency", "public_html");
      await fs.mkdir(agencyDir, { recursive: true });
      await fs.writeFile(
        path.join(agencyDir, "index.html"),
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Veloce Digital Agency</title>
  <style>
    body { margin:0; font-family:sans-serif; background:#0e0f1a; color:#fff; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; text-align:center;}
    h1 { font-size: 42px; background: linear-gradient(135deg, #fff, #6c5ce7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
    p { color: #9ca3af; max-width: 400px; line-height: 1.6; }
    .tag { color: #00cec9; font-weight: bold; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;}
  </style>
</head>
<body>
  <div class="tag">Next-Gen Digital Studio</div>
  <h1>We Build Modern Cloud Experiences.</h1>
  <p>Proudly hosted on custom NovaHost bare-metal architecture with 99.99% uptime guarantee.</p>
</body>
</html>`,
        "utf8"
      );
    }
  } catch (err) {
    console.error("Init host engine error:", err);
  }
}

// Get all sites from registry
export async function getHostedSites(): Promise<RealHostedSite[]> {
  await initHostEngine();
  try {
    const raw = await fs.readFile(REGISTRY_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Create a new real site on disk
export async function createHostedSite(name: string, type: string): Promise<RealHostedSite> {
  await initHostEngine();
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const siteDir = path.join(BASE_DIR, slug, "public_html");
  await fs.mkdir(siteDir, { recursive: true });

  // Generate real default index.html and style.css
  await fs.writeFile(
    path.join(siteDir, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="badge">HOSTED ON NOVAHOST</div>
    <h1>Welcome to ${name}</h1>
    <p>This is a live site running directly from your hard drive via NovaHost engine.</p>
    <a href="#" class="btn" onclick="alert('Site is live and responding!')">Learn More</a>
  </div>
</body>
</html>`,
    "utf8"
  );

  await fs.writeFile(
    path.join(siteDir, "style.css"),
    `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #0b0c14;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.container {
  text-align: center;
  background: #131424;
  padding: 48px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.badge {
  display: inline-block;
  background: rgba(16,185,129,0.1);
  color: #10b981;
  border: 1px solid rgba(16,185,129,0.3);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}
h1 { margin: 0 0 12px 0; font-size: 32px; font-weight: 900; }
p { color: #9ca3af; margin-bottom: 24px; }
.btn {
  background: #6c5ce7;
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: bold;
}
.btn:hover { background: #5844e3; }`,
    "utf8"
  );

  const newSite: RealHostedSite = {
    slug,
    domain: `${slug}.novahost.local`,
    title: name,
    type: type || "Static HTML5",
    phpVersion: type.includes("Node") ? "Node 20 LTS" : "LiteSpeed Static",
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    storageBytes: 4200,
  };

  const sites = await getHostedSites();
  const updated = [newSite, ...sites.filter((s) => s.slug !== slug)];
  await fs.writeFile(REGISTRY_FILE, JSON.stringify(updated, null, 2), "utf8");

  return newSite;
}

// Delete a site from disk
export async function deleteHostedSite(slug: string): Promise<boolean> {
  try {
    const sites = await getHostedSites();
    const updated = sites.filter((s) => s.slug !== slug);
    await fs.writeFile(REGISTRY_FILE, JSON.stringify(updated, null, 2), "utf8");

    const siteDir = path.join(BASE_DIR, slug);
    await fs.rm(siteDir, { recursive: true, force: true });
    return true;
  } catch (err) {
    console.error("Delete site error:", err);
    return false;
  }
}

// List real files in a site's public_html
export async function getRealSiteFiles(slug: string) {
  const publicDir = path.join(BASE_DIR, slug, "public_html");
  try {
    await fs.mkdir(publicDir, { recursive: true });
    const entries = await fs.readdir(publicDir, { withFileTypes: true });

    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(publicDir, entry.name);
        const stats = await fs.stat(fullPath);
        return {
          id: entry.name,
          name: entry.name,
          type: entry.isDirectory() ? "folder" : "file",
          path: `/public_html/${entry.name}`,
          size: `${(stats.size / 1024).toFixed(1)} KB`,
          modified: stats.mtime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      })
    );
    return files;
  } catch (err) {
    console.error("Get files error:", err);
    return [];
  }
}

// Read single file content from disk
export async function readRealFileContent(slug: string, fileName: string): Promise<string> {
  const filePath = path.join(BASE_DIR, slug, "public_html", fileName);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

// Save single file content to disk
export async function saveRealFileContent(slug: string, fileName: string, content: string): Promise<boolean> {
  const filePath = path.join(BASE_DIR, slug, "public_html", fileName);
  try {
    await fs.writeFile(filePath, content, "utf8");
    return true;
  } catch (err) {
    console.error("Save file error:", err);
    return false;
  }
}

// Create new file on disk
export async function createRealFile(slug: string, fileName: string, content: string): Promise<boolean> {
  const filePath = path.join(BASE_DIR, slug, "public_html", fileName);
  try {
    await fs.writeFile(filePath, content || "", "utf8");
    return true;
  } catch (err) {
    console.error("Create file error:", err);
    return false;
  }
}

// Delete file from disk
export async function deleteRealFile(slug: string, fileName: string): Promise<boolean> {
  const filePath = path.join(BASE_DIR, slug, "public_html", fileName);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    console.error("Delete file error:", err);
    return false;
  }
}
