# AURA — Next.js 15 E-Commerce & Multi-Supplier Dropshipping Platform

A modern, full-stack, high-conversion direct-to-consumer (D2C) e-commerce storefront and private administration portal designed for viral beauty, health, and medical-grade skincare brands.

---

## ✨ Features Overview

### 🛍️ Customer Storefront (`/`)
* **Hero Trends Showcase:** Dynamic viral trend spotlight with Framer Motion blend effects, TikTok branding, and real-time statistics.
* **Animated Glitch Text:** Authentic viral TikTok chromatic glitch effect (`#FE2C55`, `#25F4EE`, `#FFFFFF`).
* **Live Gemini AI Search (`⌘K`):** Natural language ingredient search, formula analysis, and zero-state curated bestsellers.
* **AURA DermAI Skin Matcher:** 1-tap clinical skin goal diagnosis and automated routine duo recommendation.
* **Clinical Before/After Slider:** Dual-layer interactive drag/split-screen clinical efficacy evidence slider.
* **Multi-Currency Engine:** Instant real-time conversion rates across USD, EUR, GBP, CAD, AUD, NGN, and JPY.
* **Night Recovery Sweep:** Ambient day/night circadian theme switch.
* **Customer Authentication Portal (`/login`):** Split-screen customer account portal with Google & GitHub social logins.
* **Express Order Tracking (`/track-order`):** Multi-carrier parcel timeline lookup with real-time status updates.

### 🛡️ Private Owner Command Portal (`/owner-portal`)
* **Live Revenue & Profit Dashboard:** Real-time Gross Revenue, Supplier Wholesale Costs, Net Profit, and Margin % calculations.
* **Amazon Prime Direct Portal:** Real-time Amazon US product search powered by Rainforest API (live ASINs, Prime seller prices, customer ratings, 1-click catalog import).
* **Alibaba Dropshipping Center:** Direct sourcing directory for Trade Assurance OEM skincare formulas and high-margin beauty tools.
* **CJdropshipping Live Gateway:** Live API v2.0 integration with factory wholesale rates, inventory lookup, and automated warehouse fulfillment mapping.
* **Interactive Packshot Studio:** In-browser image editor with lighting matrices, rotation, luxury badge stamping, and Gemini AI image generation.
* **Clinical Slideshow Manager:** Dynamic Before & After slide creator with live image upload and instrument metrics tracking.
* **Customer Order & Dispatch Management:** Real-time order fulfillment status updater (Processing, In Transit, Delivered) with tracking number generator.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Components & Primitives:** [shadcn/ui](https://ui.shadcn.com/)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/)
* **Amazon Data:** [Rainforest API](https://www.rainforestapi.com/)
* **Fulfillment:** [CJdropshipping API v2.0](https://developers.cjdropshipping.com/)
* **Language:** TypeScript

---

## 🛠️ Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aura-skincare-ecommerce.git
cd aura-skincare-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your respective API keys:
```env
# Admin Authentication
ADMIN_EMAIL=owner@auraliving.store
ADMIN_PASSWORD=SkinCare2026!
ADMIN_SESSION_SECRET=your_super_secret_session_key

# Live Dropship & Data APIs
CJ_API_KEY=your_cj_api_key_here
RAINFOREST_API_KEY=your_rainforest_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Payment Integration (Optional)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser:
* **Storefront:** [http://localhost:3000](http://localhost:3000)
* **Customer Login:** [http://localhost:3000/login](http://localhost:3000/login)
* **Owner Portal:** [http://localhost:3000/owner-portal](http://localhost:3000/owner-portal)
  *(Default Credentials: `owner@auraliving.store` / `SkinCare2026!`)*

---

## 📂 Project Structure

```
├── data/                    # Persistent local uploads and media cache
├── src/
│   ├── app/                 # Next.js 15 App Router pages & API routes
│   │   ├── api/             # Backend routes (Amazon, CJ, Store, Media, Auth)
│   │   ├── login/           # Customer account authentication portal
│   │   ├── owner-portal/    # Private store management dashboard
│   │   ├── track-order/     # Customer courier tracking page
│   │   └── page.tsx         # Main storefront home page
│   ├── components/          # Composite feature components (Hero, Navbar, Studio, etc.)
│   │   └── ui/              # shadcn atomic UI primitives (GlitchText, Typewriter, etc.)
│   ├── context/             # React Context providers (CartContext, Currency, Theme)
│   ├── data/                # Store catalog database & initial products
│   └── lib/                 # Utility helpers, API clients, and auth tokens
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS theme configurations
└── tsconfig.json            # TypeScript compiler configuration
```

---

## 📄 License
MIT License. Free for commercial and personal use.
