export interface HostingPlan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  fourYearPrice: number;
  renewalPrice: number;
  discountPct: number;
  features: string[];
  specs: {
    websites: string;
    storage: string;
    bandwidth: string;
    ram: string;
    cpu: string;
    backup: string;
    ssl: string;
  };
  highlight?: boolean;
}

export const HOSTING_PLANS: HostingPlan[] = [
  {
    id: "single",
    name: "Single Web",
    tagline: "Ideal solution for beginners and simple personal sites.",
    monthlyPrice: 9.99,
    yearlyPrice: 3.49,
    fourYearPrice: 2.49,
    renewalPrice: 4.99,
    discountPct: 75,
    features: [
      "1 Website",
      "50 GB NVMe Storage",
      "100 GB Bandwidth (~10k visits/mo)",
      "Free Unlimited SSL",
      "Weekly Backups",
      "1 Email Account",
      "99.9% Uptime Guarantee",
    ],
    specs: {
      websites: "1",
      storage: "50 GB NVMe",
      bandwidth: "100 GB",
      ram: "512 MB",
      cpu: "1 Core",
      backup: "Weekly",
      ssl: "Free Let's Encrypt",
    },
  },
  {
    id: "premium",
    name: "Premium Cloud",
    badge: "Most Popular",
    tagline: "Everything you need to create fast, scalable websites.",
    monthlyPrice: 12.99,
    yearlyPrice: 5.49,
    fourYearPrice: 3.99,
    renewalPrice: 7.99,
    discountPct: 70,
    highlight: true,
    features: [
      "100 Websites",
      "100 GB NVMe Storage",
      "Unlimited Bandwidth",
      "Free Domain ($9.99 value)",
      "Free Unlimited SSL",
      "Daily & On-Demand Backups",
      "Free Email (100 Mailboxes)",
      "LiteSpeed Web Server + LSCache",
      "WordPress 1-Click Staging",
    ],
    specs: {
      websites: "100",
      storage: "100 GB NVMe",
      bandwidth: "Unlimited",
      ram: "1.5 GB",
      cpu: "2 Cores",
      backup: "Daily + On-Demand",
      ssl: "Free Lifetime",
    },
  },
  {
    id: "business",
    name: "Business Managed",
    badge: "Best for E-Commerce",
    tagline: "Maximum performance and dedicated resources for heavy traffic.",
    monthlyPrice: 16.99,
    yearlyPrice: 8.99,
    fourYearPrice: 6.99,
    renewalPrice: 12.99,
    discountPct: 60,
    features: [
      "100 Websites",
      "200 GB NVMe Storage",
      "Unlimited Bandwidth (~100k visits/mo)",
      "Free Domain + Dedicated IPv4",
      "Daily Automated Backups",
      "Cloudflare CDN with Railgun",
      "Enhanced DDoS Protection",
      "WordPress Staging & AI Creator",
      "Priority 24/7 VIP Support",
    ],
    specs: {
      websites: "100",
      storage: "200 GB NVMe",
      bandwidth: "Unlimited",
      ram: "3 GB",
      cpu: "4 Cores",
      backup: "Daily Realtime",
      ssl: "Wildcard SSL",
    },
  },
  {
    id: "vps",
    name: "Cloud KVM VPS",
    badge: "Developers",
    tagline: "Dedicated compute power, kernel control, and root access.",
    monthlyPrice: 24.99,
    yearlyPrice: 16.99,
    fourYearPrice: 12.99,
    renewalPrice: 19.99,
    discountPct: 50,
    features: [
      "Dedicated KVM Virtualization",
      "8 GB RAM + 4 vCPU Cores",
      "150 GB NVMe Gen4 Storage",
      "Full Root SSH Access",
      "Docker & Kubernetes Ready",
      "Dedicated Static IPv4 & IPv6",
      "Automated Snapshots",
      "Custom OS: Ubuntu, AlmaLinux, Debian",
    ],
    specs: {
      websites: "Unlimited",
      storage: "150 GB NVMe Gen4",
      bandwidth: "8 TB High-Speed",
      ram: "8 GB Dedicated",
      cpu: "4 vCPU Dedicated",
      backup: "Weekly Snapshots",
      ssl: "Self-Managed / Certbot",
    },
  },
];

export interface Website {
  id: string;
  slug: string;
  domain: string;
  title?: string;
  type: string;
  phpVersion: string;
  status: "active" | "deploying" | "maintenance" | "suspended";
  sslActive: boolean;
  ip: string;
  storageUsedMB: number;
  bandwidthUsedGB: number;
  createdAt: string;
}

export const INITIAL_WEBSITES: Website[] = [
  {
    id: "site-1",
    slug: "crypto-portal",
    domain: "crypto-portal.novahost.local",
    title: "Apex Crypto Live Portal",
    type: "Static HTML5 & JS",
    phpVersion: "LiteSpeed Static",
    status: "active",
    sslActive: true,
    ip: "127.0.0.1",
    storageUsedMB: 14.2,
    bandwidthUsedGB: 1.4,
    createdAt: "2026-11-08",
  },
  {
    id: "site-2",
    slug: "cyber-agency",
    domain: "cyber-agency.novahost.local",
    title: "Veloce Creative Agency",
    type: "Static HTML5 & Tailwind",
    phpVersion: "LiteSpeed Static",
    status: "active",
    sslActive: true,
    ip: "127.0.0.1",
    storageUsedMB: 11.8,
    bandwidthUsedGB: 0.8,
    createdAt: "2026-11-08",
  },
];

export interface DnsRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT";
  name: string;
  content: string;
  ttl: number;
}

export const INITIAL_DNS_RECORDS: DnsRecord[] = [
  { id: "dns-1", type: "A", name: "@", content: "185.199.108.153", ttl: 3600 },
  { id: "dns-2", type: "CNAME", name: "www", content: "novashop-prod.com", ttl: 3600 },
  { id: "dns-3", type: "MX", name: "@", content: "mail.novahost.cloud", ttl: 14400 },
  { id: "dns-4", type: "TXT", name: "@", content: "v=spf1 include:_spf.novahost.cloud ~all", ttl: 3600 },
  { id: "dns-5", type: "CNAME", name: "cdn", content: "cloudflare.novahost.net", ttl: 1800 },
];

export interface DatabaseRecord {
  id: string;
  name: string;
  user: string;
  host: string;
  sizeMB: number;
  tablesCount: number;
  engine: "MySQL 8.0" | "PostgreSQL 16";
}

export const INITIAL_DATABASES: DatabaseRecord[] = [
  {
    id: "db-1",
    name: "nova_wp_shop",
    user: "u849204_admin",
    host: "localhost:3306",
    sizeMB: 38.6,
    tablesCount: 24,
    engine: "MySQL 8.0",
  },
  {
    id: "db-2",
    name: "nova_analytics_db",
    user: "u849204_pgapp",
    host: "localhost:5432",
    sizeMB: 112.4,
    tablesCount: 16,
    engine: "PostgreSQL 16",
  },
];

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  size: string;
  modified: string;
  content?: string;
}

export const INITIAL_FILES: FileItem[] = [
  { id: "f-1", name: "public_html", type: "folder", path: "/public_html", size: "4.2 MB", modified: "Nov 08, 2026" },
  { id: "f-2", name: ".htaccess", type: "file", path: "/public_html/.htaccess", size: "1.2 KB", modified: "Nov 02, 2026", content: `# NovaHost Apache / LiteSpeed Configuration\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# Gzip Compression\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript\n</IfModule>` },
  { id: "f-3", name: "index.html", type: "file", path: "/public_html/index.html", size: "3.4 KB", modified: "Nov 07, 2026", content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Welcome to NovaShop</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="hero">\n    <h1>Fast, Modern Storefront</h1>\n    <p>Powered by NovaHost LiteSpeed Cloud Infrastructure</p>\n    <a href="#shop" class="cta-btn">Browse Catalog</a>\n  </div>\n</body>\n</html>` },
  { id: "f-4", name: "style.css", type: "file", path: "/public_html/style.css", size: "2.1 KB", modified: "Nov 07, 2026", content: `body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  background: #0f101d;\n  color: #ffffff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n.hero {\n  text-align: center;\n}\n.cta-btn {\n  background: #6c5ce7;\n  color: #fff;\n  padding: 12px 24px;\n  border-radius: 8px;\n  text-decoration: none;\n  font-weight: 600;\n}` },
  { id: "f-5", name: "wp-config.php", type: "file", path: "/public_html/wp-config.php", size: "4.8 KB", modified: "Nov 01, 2026", content: `<?php\ndefine( 'DB_NAME', 'nova_wp_shop' );\ndefine( 'DB_USER', 'u849204_admin' );\ndefine( 'DB_PASSWORD', '••••••••••••••••' );\ndefine( 'DB_HOST', 'localhost:3306' );\ndefine( 'DB_CHARSET', 'utf8mb4' );\n$table_prefix = 'wp_';\ndefine( 'WP_DEBUG', false );\nif ( ! defined( 'ABSPATH' ) ) {\n  define( 'ABSPATH', __DIR__ . '/' );\n}\nrequire_once ABSPATH . 'wp-settings.php';` },
  { id: "f-6", name: "logs", type: "folder", path: "/logs", size: "18.4 MB", modified: "Nov 08, 2026" },
  { id: "f-7", name: "error.log", type: "file", path: "/logs/error.log", size: "14.2 KB", modified: "Nov 08, 2026", content: `[2026-11-08 22:14:02] [notice] LiteSpeed/2.4.1 initialized successfully.\n[2026-11-08 22:15:30] [info] Auto SSL Let's Encrypt certificate verified for novashop-prod.com.\n[2026-11-08 23:01:14] [notice] LSCache hit ratio: 94.6% across 14,208 requests.` },
];
