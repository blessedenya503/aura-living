# 🚀 NovaHost — Modern Web & Cloud Hosting Platform (Hostinger Alternative)

A complete, high-performance web hosting platform and proprietary control panel (**NovaPanel** — an **hPanel** equivalent), engineered with Next.js 16, TypeScript, Tailwind CSS, and Lucide icons.

---

## 🌟 Live Demo & Quick Start

The platform is running locally at:
* **Storefront & Domain Search:** [http://localhost:3005](http://localhost:3005)
* **NovaPanel (hPanel Control Center):** [http://localhost:3005/panel](http://localhost:3005/panel)

To run anytime:
```bash
# From workspace root:
npm run dev:hosting

# Or directly inside the hosting-platform folder:
cd hosting-platform
npm run dev
```

---

## 🏗️ Architecture & Modules

### 1. Storefront & Domain Engine (`/`)
* **Hero with Live Promo Strip:** Real-time discount banner and Trustpilot trust scores.
* **Interactive Domain Availability Search:** Real-time domain lookups across `.com`, `.io`, `.tech`, `.store`, `.net`, `.online` with pricing calculation, status tags, and instant cart selection.
* **Tiered Hosting Pricing Matrix:** Toggle between **Monthly**, **12 Months (Save 40%)**, and **48 Months (Save 75% - Best Value)** across Single Web, Premium Cloud, Business Managed, and Cloud KVM VPS.
* **Performance Benchmarks Table:** Compares NovaHost (LiteSpeed + NVMe + NovaPanel) vs legacy cPanel hosts (Apache + HDDs + bloated cPanel).
* **Global Datacenter Edge Map:** Interactive node selector (Ashburn US, Frankfurt EU, London UK, Singapore, Tokyo, São Paulo) with live ping metrics.

### 2. NovaPanel (The "hPanel" Control Center) (`/panel`)
Hostinger's primary competitive advantage is their custom control panel (**hPanel**). NovaPanel provides all core features:
* **Overview / Dashboard:** Active website health, Let's Encrypt SSL status, server IPv4, NVMe disk usage, bandwidth, nameserver details, and quick launcher cards.
* **Websites & Virtual Hosts:** Manage multiple websites (`novashop-prod.com`, `api-backend.novahost.cloud`, `creative-portfolio.dev`), switch PHP/Node runtimes (PHP 8.1, 8.2, 8.3 / Node 20 LTS, 22 LTS), and create new domains.
* **Web File Manager & In-Browser Code Editor:** Browse files and directories (`/public_html`, `index.html`, `style.css`, `.htaccess`, `wp-config.php`), open files into an in-browser code editor, edit code, and save changes.
* **Databases Studio:** Provision MySQL 8.0 and PostgreSQL 16 databases, assign users, and execute queries in the interactive SQL console with live table results.
* **1-Click Auto App Installer:** Deploy **WordPress 6.7**, **Next.js 15**, **Node.js Express**, **Laravel 11**, and **Python Flask** with a simulated real-time terminal streaming deployment stages.
* **DNS Zone Editor:** Complete Anycast DNS management (A, AAAA, CNAME, MX, TXT) with add/delete validation.
* **SSL & Security Hub:** 1-Click Let's Encrypt certificate issuance, Force HTTPS (301 redirect), LiteSpeed Cache (LSCache) toggle, and Edge DDoS mitigation.
* **Real-Time Resource Telemetry:** Live gauges for CPU cores, Physical RAM allocation, NVMe storage, and filesystem Inodes, plus active Linux daemon process inspection.
* **Custom Domain Email Accounts:** Create branded mailboxes (`admin@domain.com`, `support@domain.com`) with quota trackers and webmail shortcut.
* **Billing & Invoices:** Manage subscription tiers, auto-renewal schedules, and download PDF receipts.

---

## 🔌 Scaling to Commercial Production

To launch NovaHost as a commercial hosting company:
1. **Server Provisioning:** Connect backend API routes to Hetzner/OVH/Linode APIs or Docker/LXD containers with cgroups memory/CPU limits.
2. **Reverse Proxy:** Run Traefik or OpenLiteSpeed as edge reverse proxies with automated ACME (Let's Encrypt) issuance.
3. **Domain Registrar:** Integrate Namecheap, Enom, or OpenSRS REST APIs for live domain registration.
4. **Billing:** Integrate Stripe Subscriptions or WHMCS/FOSSBilling webhooks for automatic customer provisioning.
