"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AntigravityEditor from "@/components/AntigravityEditor";
import {
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Plus,
  Trash2,
  Save,
  LogOut,
  Sparkles,
  Settings,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Droplets,
  Edit2,
  Search,
  UploadCloud,
  Check,
  Tag,
  FlaskConical,
  ShoppingBag,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity,
  Users,
  Compass,
} from "lucide-react";
import { Product, ProductCategory, CATEGORIES } from "@/data/products";
import { CustomerOrder, StoreSettings } from "@/lib/store-db";

interface DashboardMetrics {
  totalRevenueUsd: number;
  totalSupplierCostUsd: number;
  totalNetProfitUsd: number;
  averageMarginPercent: number;
  totalOrders: number;
  unfulfilledCount: number;
}

interface BrandCatalogItem {
  id: string;
  sku: string;
  brand: string;
  name: string;
  tagline: string;
  size: string;
  skinType: string;
  category: Exclude<ProductCategory, "All">;
  suggestedRetailPrice: number;
  supplierCost: number;
  compareAtPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  shortDescription: string;
  keyIngredients: string[];
  benefits: string[];
  image: string;
  isAlreadyUploaded?: boolean;
}

const POPULAR_BRANDS = [
  "All Brands",
  "NIVEA",
  "Eucerin",
  "Avène",
  "CeraVe",
  "La Roche-Posay",
  "Drunk Elephant",
  "The Ordinary",
  "Tatcha",
  "Bioderma",
  "Glow Recipe",
  "Paula's Choice",
  "COSRX",
  "Beauty of Joseon",
  "Neutrogena",
  "Sunday Riley",
];

export default function OwnerPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "brands" | "amazon" | "cj" | "balance" | "catalog" | "orders" | "couriers" | "antigravity" | "analytics" | "settings"
  >("brands");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenueUsd: 0,
    totalSupplierCostUsd: 0,
    totalNetProfitUsd: 0,
    averageMarginPercent: 0,
    totalOrders: 0,
    unfulfilledCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncingWeekly, setIsSyncingWeekly] = useState(false);
  const tabsScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollTabs = (offset: number) => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleTriggerWeeklySync = async () => {
    setIsSyncingWeekly(true);
    try {
      const res = await fetch("/api/admin/weekly-sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("✓ Weekly store sync executed! Next sync scheduled in 7 days.");
        setTimeout(() => setSaveMessage(""), 4000);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Weekly sync failed", err);
    } finally {
      setIsSyncingWeekly(false);
    }
  };
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Brand Search & Import state
  const [brandSearchInput, setBrandSearchInput] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All Brands");
  const [brandResults, setBrandResults] = useState<BrandCatalogItem[]>([]);
  const [isBrandLoading, setIsBrandLoading] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // CJ Dropshipping Direct Live State
  const [cjSearchQuery, setCjSearchQuery] = useState("");
  const [cjResults, setCjResults] = useState<any[]>([]);
  const [isCjLoading, setIsCjLoading] = useState(false);
  const [cjImportingId, setCjImportingId] = useState<string | null>(null);

  // Amazon Prime Direct Live State (Powered by Rainforest API)
  const [amazonSearchQuery, setAmazonSearchQuery] = useState("");
  const [amazonResults, setAmazonResults] = useState<any[]>([]);
  const [isAmazonLoading, setIsAmazonLoading] = useState(false);
  const [amazonImportingAsin, setAmazonImportingAsin] = useState<string | null>(null);

  // Paystack & Account Balance Portal State
  const [balanceData, setBalanceData] = useState<any>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Courier Tracking Hub State
  const [courierDispatchForm, setCourierDispatchForm] = useState({
    orderId: "",
    carrier: "GIG Logistics",
    trackingNumber: "",
    originHub: "Lagos Mainland Central Hub",
  });
  const [courierTestQuery, setCourierTestQuery] = useState("");
  const [courierTestResult, setCourierTestResult] = useState<any>(null);
  const [isCourierTesting, setIsCourierTesting] = useState(false);
  const [isAssigningCourier, setIsAssigningCourier] = useState(false);

  const activeCouriers = [
    {
      id: "gig",
      name: "GIG Logistics",
      region: "Nigeria Nationwide (Lagos, Abuja, PH, Interstate)",
      status: "Connected & Active",
      leadTime: "1–3 Business Days",
      badgeColor: "emerald",
      apiStatus: "Live API Hook Ready",
      trackingPrefix: "GIG-NG",
    },
    {
      id: "dhl",
      name: "DHL Express Nigeria",
      region: "Domestic Priority & International",
      status: "Connected & Active",
      leadTime: "1–2 Business Days",
      badgeColor: "emerald",
      apiStatus: "Live XML/REST Gateway Active",
      trackingPrefix: "DHL-EXP",
    },
    {
      id: "speedaf",
      name: "Speedaf Express",
      region: "E-Commerce Express (Nigeria & Africa)",
      status: "Connected & Active",
      leadTime: "2–4 Business Days",
      badgeColor: "emerald",
      apiStatus: "Waybill Webhook Connected",
      trackingPrefix: "SPF-NG",
    },
    {
      id: "fez",
      name: "Fez Delivery",
      region: "Last-Mile Metro & Inter-City Delivery",
      status: "Connected & Active",
      leadTime: "Same-Day / Next-Day",
      badgeColor: "emerald",
      apiStatus: "Fleet Dispatch Connected",
      trackingPrefix: "FEZ-DS",
    },
    {
      id: "royalmail",
      name: "Royal Mail International",
      region: "UK & European Supplier Dispatch",
      status: "Connected & Active",
      leadTime: "3–6 Business Days",
      badgeColor: "emerald",
      apiStatus: "Global Parcel Gateway Ready",
      trackingPrefix: "RM-INT",
    },
  ];

  // Settlement bank editor state
  const [availableBanks, setAvailableBanks] = useState<{ name: string; code: string; isFintech: boolean }[]>([]);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isAuthorizingBank, setIsAuthorizingBank] = useState(false);
  const [bankError, setBankError] = useState("");
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  const fetchAvailableBanks = async () => {
    try {
      const res = await fetch("/api/admin/paystack-banks", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.banks)) setAvailableBanks(data.banks);
      }
    } catch (err) {
      console.error("Failed to load banks", err);
    }
  };

  const handleAuthorizeBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankError("");
    if (!bankForm.bankCode || bankForm.accountNumber.length !== 10) {
      setBankError("Select a bank and enter a valid 10-digit account number.");
      return;
    }
    setIsAuthorizingBank(true);
    try {
      const res = await fetch("/api/admin/paystack-authorize-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankForm),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSaveMessage(data.message || "Bank account connected.");
        setTimeout(() => setSaveMessage(""), 4000);
        setIsEditingBank(false);
        fetchBalanceData();
      } else {
        setBankError(data.error || "Could not verify this account with Paystack.");
      }
    } catch (err: any) {
      setBankError(err?.message || "Network error while contacting Paystack.");
    } finally {
      setIsAuthorizingBank(false);
    }
  };
  const fetchBalanceData = async () => {
    setIsBalanceLoading(true);
    try {
      const res = await fetch("/api/admin/paystack-balance", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBalanceData(data);
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // Live Catalog Filter & Pagination
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogSupplierFilter, setCatalogSupplierFilter] = useState("All");
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(25);

  const filteredCatalogProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSupplier =
        catalogSupplierFilter === "All" || p.supplierSource === catalogSupplierFilter;
      const q = catalogSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));
      return matchSupplier && matchSearch;
    });
  }, [products, catalogSupplierFilter, catalogSearch]);

  const catalogTotalPages = Math.max(
    1,
    Math.ceil(filteredCatalogProducts.length / catalogPageSize)
  );

  const paginatedCatalogProducts = useMemo(() => {
    const start = (catalogPage - 1) * catalogPageSize;
    return filteredCatalogProducts.slice(start, start + catalogPageSize);
  }, [filteredCatalogProducts, catalogPage, catalogPageSize]);

  // New product manual form state
  const [newProd, setNewProd] = useState({
    brand: "NIVEA",
    name: "",
    tagline: "",
    size: "200ml / 6.7 oz",
    skinType: "All Skin Types",
    category: "Moisturizing Creams" as Exclude<ProductCategory, "All">,
    price: 14.99,
    compareAtPrice: 19.99,
    supplierCost: 4.5,
    keyIngredients: "Glycerin, Panthenol, Jojoba Oil",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    stockLeft: 200,
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/owner-portal/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setSettings(data.settings || null);
        setMetrics(data.metrics || metrics);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrandCatalog = async (query = "") => {
    setIsBrandLoading(true);
    try {
      const url = query
        ? `/api/admin/brands?q=${encodeURIComponent(query)}`
        : "/api/admin/brands";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBrandResults(data.items || []);
      }
    } catch (err) {
      console.error("Brand search error:", err);
    } finally {
      setIsBrandLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchBrandCatalog();
    fetchAvailableBanks();
  }, []);

  const handleBrandSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBrandCatalog(brandSearchInput);
  };

  const handleSelectBrandFilter = (brandName: string) => {
    setSelectedBrandFilter(brandName);
    if (brandName === "All Brands") {
      setBrandSearchInput("");
      fetchBrandCatalog("");
    } else {
      setBrandSearchInput(brandName);
      fetchBrandCatalog(brandName);
    }
  };

  // Upload single brand product to storefront
  const handleUploadSingleItem = async (item: BrandCatalogItem) => {
    setUploadingItemId(item.id);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage(`Uploaded ${item.name} to storefront!`);
        setTimeout(() => setSaveMessage(""), 2500);
        // Refresh both lists
        fetchDashboardData();
        fetchBrandCatalog(brandSearchInput);
      } else {
        alert(data.error || "Failed to upload");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploadingItemId(null);
    }
  };

  // Upload all un-uploaded items in current search results
  const handleUploadAllResults = async () => {
    const unuploaded = brandResults.filter((r) => !r.isAlreadyUploaded);
    if (unuploaded.length === 0) {
      alert("All products in this result set are already on your storefront!");
      return;
    }

    if (
      !confirm(
        `Upload all ${unuploaded.length} verified products from this brand to your storefront?`
      )
    )
      return;

    setIsBrandLoading(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: unuploaded }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage(
          `Successfully uploaded ${data.addedCount} brand products to your storefront!`
        );
        setTimeout(() => setSaveMessage(""), 3000);
        fetchDashboardData();
        fetchBrandCatalog(brandSearchInput);
      }
    } catch {
      alert("Batch upload failed");
    } finally {
      setIsBrandLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/owner-portal/login");
  };

  // Create manual product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setSaveMessage("Product added to catalog!");
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
      }
    } catch {
      alert("Failed to create product");
    }
  };

  // Inline Save Product
  const handleSaveProductEdit = async (product: Product) => {
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "update_product", product }),
      });
      if (res.ok) {
        setEditingProduct(null);
        setSaveMessage(`Updated ${product.name}!`);
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update product (Status " + res.status + ")");
      }
    } catch (err: any) {
      alert("Failed to update product: " + (err?.message || "Network error"));
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from the store?"))
      return;
    try {
      const res = await fetch(
        `/api/admin/dashboard?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setSaveMessage("Product removed from storefront");
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
        fetchBrandCatalog(brandSearchInput);
      }
    } catch {
      alert("Failed to delete product");
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    fulfillmentStatus: CustomerOrder["fulfillmentStatus"],
    trackingNumber?: string
  ) => {
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "update_order",
          orderId,
          fulfillmentStatus,
          trackingNumber,
        }),
      });
      if (res.ok) {
        setSaveMessage(`Order #${orderId} marked as ${fulfillmentStatus}`);
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
      }
    } catch {
      alert("Failed to update order");
    }
  };

  // Clear all simulation orders
  const handleClearOrders = async () => {
    if (!confirm("Are you sure you want to clear all simulation orders and reset store metrics to zero?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_orders" }),
      });
      if (res.ok) {
        setSaveMessage("Simulation orders cleared successfully! Ledger & metrics reset.");
        setTimeout(() => setSaveMessage(""), 3000);
        fetchDashboardData();
        fetchBalanceData();
      } else {
        alert("Failed to clear simulation orders");
      }
    } catch {
      alert("Error clearing simulation orders");
    }
  };

  // Generate Test Order
  const handleSimulateOrder = async () => {
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_sample_order" }),
      });
      if (res.ok) {
        setSaveMessage("Sample skincare order captured!");
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
      }
    } catch {
      alert("Failed to create sample order");
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "update_settings", settings }),
      });
      if (res.ok) {
        setSaveMessage("Storefront settings updated successfully!");
        setTimeout(() => setSaveMessage(""), 2500);
        fetchDashboardData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update settings (Status " + res.status + ")");
      }
    } catch (err: any) {
      alert("Failed to update settings: " + (err?.message || "Network error"));
    }
  };

  // Live CJ Dropshipping Fetcher & Importer
  const handleCjSearch = async (query = cjSearchQuery) => {
    if (!query.trim()) return;
    setIsCjLoading(true);
    try {
      const res = await fetch(`/api/cj?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data.catalog)) {
        setCjResults(data.catalog);
      }
    } catch (err) {
      console.error("Failed to query CJ Dropshipping", err);
    } finally {
      setIsCjLoading(false);
    }
  };

  const handleImportCjProduct = async (item: any) => {
    setCjImportingId(item.cjPid);
    try {
      const retailPrice = Number((item.supplierCost * 2.6).toFixed(2));
      const comparePrice = Number((retailPrice * 1.35).toFixed(2));
      const newProdPayload: Partial<Product> = {
        id: `cj-prod-${item.cjPid}`,
        sku: item.cjSku || `CJ-${item.cjPid.slice(-6)}`,
        cjPid: item.cjPid,
        brand: "CJ Verified Dropship",
        name: item.name,
        tagline: "Direct fulfillment from CJdropshipping US & Global Warehouses",
        size: "Standard Dropship Size",
        skinType: "All Skin Types",
        category: "Moisturizing Creams",
        price: retailPrice,
        compareAtPrice: comparePrice,
        supplierCost: item.supplierCost,
        rating: 4.9,
        reviewCount: Math.floor(120 + Math.random() * 800),
        soldCountText: "Direct CJ Express Delivery (2–4 Days)",
        badge: "CJ Direct Warehouse",
        shortDescription: `${item.name}. Direct warehouse packaging with automated parcel tracking.`,
        keyIngredients: ["Botanical Hydrators", "Pure Emollients", "Ceramides"],
        benefits: ["Direct automated fulfillment", "Fast international courier delivery"],
        image: item.image,
        gallery: [item.image],
        variants: [{ name: "Standard Pack", colorHex: "#002B7F", inStock: true }],
        stockLeft: 240,
        supplierSource: "Amazon Prime Dropship", // standard dropship source flag
      };

      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProdPayload),
      });

      if (res.ok) {
        setSaveMessage(`✓ Imported "${item.name}" from CJ directly to your storefront!`);
        setTimeout(() => setSaveMessage(""), 4000);
        fetchDashboardData();
      } else {
        alert("Failed to import product from CJ");
      }
    } catch (err) {
      alert("Error importing CJ product");
    } finally {
      setCjImportingId(null);
    }
  };

  // Live Amazon Search & Importer (Powered by Rainforest API)
  const handleAmazonSearch = async (query = amazonSearchQuery) => {
    if (!query.trim()) return;
    setIsAmazonLoading(true);
    try {
      const res = await fetch(`/api/admin/amazon?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data.results)) {
        setAmazonResults(data.results);
      }
    } catch (err) {
      console.error("Failed to query Amazon", err);
    } finally {
      setIsAmazonLoading(false);
    }
  };

  const handleImportAmazonProduct = async (item: any) => {
    setAmazonImportingAsin(item.asin);
    try {
      const retailPrice = item.suggestedRetailPrice || Number((item.price / 0.72).toFixed(2));
      const comparePrice = Number((retailPrice * 1.25).toFixed(2));
      const newProdPayload: Partial<Product> = {
        id: `amz-prod-${item.asin}`,
        sku: `AMZ-${item.asin}`,
        brand: item.brand || "Amazon Prime Direct",
        name: item.title,
        tagline: "Authentic Amazon Prime Express Delivery (2–4 Days)",
        size: "Standard Retail Pack",
        skinType: "All Skin Types",
        category: "Moisturizing Creams",
        price: retailPrice,
        compareAtPrice: comparePrice,
        supplierCost: item.price,
        rating: item.rating || 4.8,
        reviewCount: item.ratingsTotal || 150,
        soldCountText: "Amazon Bestseller Catalog",
        badge: item.isPrime ? "Amazon Prime" : "Verified Amazon",
        shortDescription: `${item.title}. Verified authentic batch registered under Amazon Bestseller Catalog (ASIN: ${item.asin}).`,
        keyIngredients: ["Active Skin Emollients", "Ceramides", "Hyaluronic Acid"],
        benefits: ["2–4 Days Express Prime Courier Dispatch", "100% Genuine Guaranteed Formula"],
        image: item.image,
        gallery: [item.image],
        variants: [{ name: "Standard Size", colorHex: "#002B7F", inStock: true }],
        stockLeft: 180,
        supplierSource: "Amazon Prime Dropship",
      };

      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProdPayload),
      });

      if (res.ok) {
        setSaveMessage(`✓ Imported "${item.title.slice(0, 30)}..." from Amazon Prime directly to your storefront!`);
        setTimeout(() => setSaveMessage(""), 4000);
        fetchDashboardData();
      } else {
        alert("Failed to import product from Amazon");
      }
    } catch (err) {
      alert("Error importing Amazon product");
    } finally {
      setAmazonImportingAsin(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#002B7F] to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              AU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  AURA Owner Command
                </span>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.2 rounded-full">
                  LIVE SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Skincare Brand Search &amp; Storefront Importer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Store (:3003)</span>
            </a>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-300 hover:text-rose-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast */}
        {saveMessage && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              ${metrics.totalRevenueUsd.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              From {metrics.totalOrders} customer orders
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Net Profit</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              ${metrics.totalNetProfitUsd.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Margin: {metrics.averageMarginPercent}%
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Orders</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {metrics.unfulfilledCount}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1">
              Requiring carrier dispatch
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Live Storefront SKUs</span>
              <Package className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {products.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active on customer catalog
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs With Scroll Controls & Ruler */}
        <div className="relative border-b border-slate-800/80 pb-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={() => scrollTabs(-280)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
              title="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs Track */}
            <div
              ref={tabsScrollRef}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-950 pb-1"
            >
              {/* TAB: ALIBABA DROPSHIPPING */}
              <button
                onClick={() => setActiveTab("brands")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "brands"
                    ? "bg-orange-600 text-white shadow-md ring-1 ring-orange-400"
                    : "bg-slate-900/90 text-orange-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Package className="w-3.5 h-3.5 text-orange-300" />
                <span>Alibaba Dropshipping</span>
              </button>

              {/* TAB: AMAZON PRIME PORTAL (Powered by Rainforest API) */}
              <button
                onClick={() => {
                  setActiveTab("amazon");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "amazon"
                    ? "bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-600 font-extrabold"
                    : "bg-slate-900/90 text-amber-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Amazon Prime Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </button>

              {/* TAB: CJ DROPSHIPPING LIVE GATEWAY */}
              <button
                onClick={() => {
                  setActiveTab("cj");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "cj"
                    ? "bg-amber-600 text-white shadow-md ring-1 ring-amber-400"
                    : "bg-slate-900/90 text-amber-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-300" />
                <span>CJ Live Dropship</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* TAB: PAYSTACK ACCOUNT BALANCE & PAYOUTS */}
              <button
                onClick={() => {
                  setActiveTab("balance");
                  fetchBalanceData();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "balance"
                    ? "bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400"
                    : "bg-slate-900/90 text-emerald-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                <span>Account Balance &amp; Payouts (₦)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* TAB 2: STORE CATALOG */}
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "catalog"
                    ? "bg-[#002B7F] text-white shadow-sm ring-1 ring-blue-400/50"
                    : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Package className="w-3.5 h-3.5 text-indigo-400" />
                <span>Catalog ({products.length})</span>
              </button>

              {/* TAB 3: CUSTOMER ORDERS */}
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "orders"
                    ? "bg-[#002B7F] text-white shadow-sm ring-1 ring-blue-400/50"
                    : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Orders ({orders.length})</span>
              </button>

              {/* TAB: COURIER TRACKING (GIG, DHL, Speedaf, Fez, Royal Mail) */}
              <button
                onClick={() => setActiveTab("couriers")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "couriers"
                    ? "bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400"
                    : "bg-slate-900/90 text-cyan-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Courier Tracking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* TAB: ANTIGRAVITY STUDIO EDITOR */}
              <button
                onClick={() => setActiveTab("antigravity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "antigravity"
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-400"
                    : "bg-slate-900/90 text-purple-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>Antigravity Editor</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </button>

              {/* TAB: GOOGLE ANALYTICS & TRAFFIC */}
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "analytics"
                    ? "bg-amber-600 text-white shadow-md ring-1 ring-amber-400"
                    : "bg-slate-900/90 text-amber-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Google Analytics</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* TAB 4: STORE SETTINGS */}
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === "settings"
                    ? "bg-[#002B7F] text-white shadow-sm ring-1 ring-blue-400/50"
                    : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </button>
            </div>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={() => scrollTabs(280)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
              title="Scroll Tabs Right (Settings & Antigravity)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Refresh Data Button */}
            <button
              onClick={() => {
                fetchDashboardData();
                fetchBrandCatalog(brandSearchInput);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 border border-slate-800 ml-1"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isLoading || isBrandLoading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {/* Precision Ruler Indicator with Quick Shortcut Anchors */}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-500 font-mono select-none">
            <span
              onClick={() => scrollTabs(-1000)}
              className="cursor-pointer hover:text-amber-400 flex items-center gap-1"
            >
              ← Dropshipping &amp; Orders
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
              <span>|···</span>
              <span>|···</span>
              <span>|···</span>
              <span className="text-slate-400">↔ Drag / Scroll ruler to traverse tabs</span>
              <span>···|</span>
              <span>···|</span>
              <span>···|</span>
            </div>
            <span
              onClick={() => scrollTabs(1000)}
              className="cursor-pointer hover:text-purple-400 flex items-center gap-1 text-right"
            >
              Antigravity &amp; Settings →
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ALIBABA DROPSHIPPING & OEM SOURCING */}
        {/* ======================================================== */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            {/* Alibaba Dropship Header */}
            <div className="bg-linear-to-r from-orange-950/60 via-slate-900 to-slate-900 border border-orange-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-orange-300" />
                    Alibaba Trade Assurance Dropshipping &amp; Verified Sourcing
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Alibaba Dropshipping &amp; Manufacturer Directory
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    Source verified cosmetic formulas, OEM private label manufacturers, and verified suppliers with direct wholesale trade assurance pricing.
                  </p>
                </div>

                {brandResults.filter((r) => !r.isAlreadyUploaded).length > 0 && (
                  <button
                    onClick={handleUploadAllResults}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>
                      Upload All {brandResults.filter((r) => !r.isAlreadyUploaded).length} Products
                    </span>
                  </button>
                )}
              </div>

              {/* Live Search Bar */}
              <form onSubmit={handleBrandSearchSubmit} className="flex gap-2 pt-1.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search brand or active (e.g. Nivea, CeraVe, Retinol)..."
                    value={brandSearchInput}
                    onChange={(e) => setBrandSearchInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBrandLoading}
                  className="px-4 py-2 bg-[#0032A0] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  {isBrandLoading ? "Searching..." : "Search"}
                </button>
              </form>

              {/* Popular Brand Fast-Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Filter:
                </span>
                {POPULAR_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleSelectBrandFilter(brand)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedBrandFilter === brand
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-800/90 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Status Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div>
                Showing <strong>{brandResults.length}</strong> verified brand items
                {brandSearchInput ? ` for "${brandSearchInput}"` : ""}.
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    {brandResults.filter((r) => r.isAlreadyUploaded).length} Live on Store
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>
                    {brandResults.filter((r) => !r.isAlreadyUploaded).length} Ready to Upload
                  </span>
                </span>
              </div>
            </div>

            {/* Brand Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {brandResults.map((item) => {
                const marginPct =
                  item.suggestedRetailPrice > 0
                    ? Math.round(
                        ((item.suggestedRetailPrice - item.supplierCost) /
                          item.suggestedRetailPrice) *
                          100
                      )
                    : 0;

                const isUploading = uploadingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xs hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 p-2 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                          <span className="bg-[#002B7F] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            {item.brand}
                          </span>
                          {item.badge && (
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {item.isAlreadyUploaded && (
                          <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Live on Store</span>
                          </div>
                        )}
                      </div>

                      {/* Header details */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-mono text-[11px] text-slate-500">
                          {item.size}
                        </span>
                        <span className="text-[11px] text-blue-400 font-medium">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {item.tagline}
                      </p>

                      {/* Ingredients chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.keyIngredients.slice(0, 3).map((ing, i) => (
                          <span
                            key={i}
                            className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold font-mono text-white">
                            ${item.suggestedRetailPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            (Cost: ${item.supplierCost.toFixed(2)})
                          </span>
                        </div>
                        <div className="text-[10px] font-bold font-mono text-emerald-400">
                          Profit Margin: +{marginPct}%
                        </div>
                      </div>

                      {item.isAlreadyUploaded ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUploadSingleItem(item)}
                          disabled={isUploading}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0032A0] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploading ? "Uploading..." : "Upload to Store"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: AMAZON PRIME LIVE PORTAL (RAINFOREST API) */}
        {/* ======================================================== */}
        {activeTab === "amazon" && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    Amazon Prime Live Catalog &amp; Dropshipping Portal
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Direct Amazon Prime Bestseller Sourcing
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    Live connected via Rainforest API. Search real-time Amazon US catalogs, verified Prime seller pricing, ASIN registries, and import genuine skincare formulas with 2–4 Day dropship delivery.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    RAINFOREST LIVE CONNECTED
                  </span>
                </div>
              </div>

              {/* Amazon Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAmazonSearch(amazonSearchQuery);
                }}
                className="flex gap-2 pt-1.5"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Amazon Prime (e.g. nivea creme, cerave cleanser, snail mucin, cicaplast)..."
                    value={amazonSearchQuery}
                    onChange={(e) => setAmazonSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAmazonLoading}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isAmazonLoading ? "Querying Amazon..." : "Search Amazon"}
                </button>
              </form>

              {/* Fast keyword filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Popular:
                </span>
                {["nivea creme", "cerave moisturizing cream", "cosrx snail mucin", "la roche posay cicaplast", "beauty of joseon sunscreen", "anua heartleaf"].map(
                  (kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setAmazonSearchQuery(kw);
                        handleAmazonSearch(kw);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-colors shrink-0 cursor-pointer"
                    >
                      {kw}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Amazon Live Grid Results */}
            {isAmazonLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  Connecting to Amazon Prime live catalog...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Querying real-time Prime prices, verified ASINs, customer ratings, and inventory
                </p>
              </div>
            ) : amazonResults.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">
                  {amazonSearchQuery ? `No products found for "${amazonSearchQuery}"` : "Search Amazon Prime Products"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Enter a skincare brand, ASIN, or formula above and press Search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {amazonResults.map((item) => {
                  const retail = item.suggestedRetailPrice || Number((item.price / 0.72).toFixed(2));
                  const marginPct = Math.round(((retail - item.price) / retail) * 100);
                  const isImporting = amazonImportingAsin === item.asin;
                  const isAlreadyImported = products.some(
                    (p) => p.sku === `AMZ-${item.asin}` || p.id === `amz-prod-${item.asin}` || (p.verification?.referenceId && p.verification.referenceId.includes(item.asin))
                  );

                  return (
                    <div
                      key={item.asin}
                      className="bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg relative"
                    >
                      <div>
                        {/* Image stage */}
                        <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800/80">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                            ASIN: {item.asin}
                          </span>

                          {item.isPrime && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-extrabold tracking-wide">
                              PRIME 2-DAY
                            </span>
                          )}

                          {isAlreadyImported && (
                            <div className="absolute top-2 right-2 bg-emerald-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 backdrop-blur-xs">
                              <Check className="w-3 h-3" />
                              <span>Imported</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                          {item.title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-amber-400">★ {item.rating} ({item.ratingsTotal})</span>
                          <span className="text-blue-400 font-medium">Amazon Prime</span>
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold font-mono text-white">
                              ${retail.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              (Prime: ${item.price.toFixed(2)})
                            </span>
                          </div>
                          <div className="text-[10px] font-bold font-mono text-emerald-400">
                            Profit Margin: +{marginPct}%
                          </div>
                        </div>

                        {isAlreadyImported ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Imported</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleImportAmazonProduct(item)}
                            disabled={isImporting}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isImporting ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Importing...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Import to Store</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CJ DROPSHIPPING LIVE GATEWAY */}
        {/* ======================================================== */}
        {activeTab === "cj" && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    CJdropshipping Live Warehouse Catalog
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Direct Warehouse Fulfillment &amp; One-Click Importer
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    Query real-time wholesale supplier inventory, view exact supplier costs, and import products with verified shipping directly to your live storefront.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    CJ API v2.0 CONNECTED
                  </span>
                </div>
              </div>

              {/* CJ Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCjSearch(cjSearchQuery);
                }}
                className="flex gap-2 pt-1.5"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search CJ catalog (e.g. snail essence, cream, serum, gua sha)..."
                    value={cjSearchQuery}
                    onChange={(e) => setCjSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500 shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCjLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isCjLoading ? "Querying CJ..." : "Search CJ"}
                </button>
              </form>

              {/* Fast keyword filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Popular:
                </span>
                {["snail", "hydrating cream", "retinol", "face serum", "sunscreen", "eye cream", "cleanser"].map(
                  (kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setCjSearchQuery(kw);
                        handleCjSearch(kw);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition-colors shrink-0 cursor-pointer"
                    >
                      {kw}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* CJ Live Grid Results */}
            {isCjLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  Connecting to CJdropshipping real-time API...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Fetching live wholesale rates, warehouse inventory, and packaging weights
                </p>
              </div>
            ) : cjResults.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
                <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">
                  {cjSearchQuery ? `No items found for "${cjSearchQuery}"` : "Search CJ Dropshipping Products"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Enter a keyword or click one of the popular tags above to query CJ.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cjResults.map((item) => {
                  const retail = Number((item.supplierCost * 2.6).toFixed(2));
                  const marginPct = Math.round(((retail - item.supplierCost) / retail) * 100);
                  const isImporting = cjImportingId === item.cjPid;
                  const isAlreadyImported = products.some(
                    (p) => p.cjPid === item.cjPid || p.sku === item.cjSku || p.id === `cj-prod-${item.cjPid}`
                  );

                  return (
                    <div
                      key={item.cjPid}
                      className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg relative"
                    >
                      <div>
                        {/* Image stage */}
                        <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800/80 p-2 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                            CJ SKU: {item.cjSku}
                          </span>

                          {isAlreadyImported && (
                            <div className="absolute top-2 right-2 bg-emerald-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 backdrop-blur-xs">
                              <Check className="w-3 h-3" />
                              <span>Imported</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                          {item.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Direct Warehouse Shipping</span>
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold font-mono text-white">
                              ${retail.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              (Wholesale: ${item.supplierCost.toFixed(2)})
                            </span>
                          </div>
                          <div className="text-[10px] font-bold font-mono text-emerald-400">
                            Profit Margin: +{marginPct}%
                          </div>
                        </div>

                        {isAlreadyImported ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Imported</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleImportCjProduct(item)}
                            disabled={isImporting}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isImporting ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Importing...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Import to Store</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: PAYSTACK ACCOUNT BALANCE & NIGERIAN BANK PAYOUTS */}
        {/* ======================================================== */}
        {activeTab === "balance" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Paystack Nigeria Live Settlement Portal
                    </span>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      T+1 Direct Bank Deposit
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Store Revenue &amp; Direct Bank Account Balance
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    All customer checkout payments captured via Paystack (Cards, Bank Transfer, USSD) settle directly into your registered Nigerian bank account without intermediary delays.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchBalanceData}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBalanceLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Balance</span>
                  </button>
                </div>
              </div>

              {/* Status pill strip */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Paystack Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Gateway
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Settlement Payouts:</span>
                  <span className="text-blue-400 font-semibold">Nigerian Banks (NGN ₦)</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Frequency:</span>
                  <span className="text-slate-200 font-semibold">Daily Automatic (05:00 WAT)</span>
                </div>
              </div>
            </div>

            {/* 3 Metric Cards for Naira and USD Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Available Payout in Naira */}
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold text-emerald-400">Available Bank Payout (NGN)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  ₦{(balanceData?.calculatedBalance?.availablePayoutNgn ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Equivalent in USD:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ${(balanceData?.calculatedBalance?.availablePayoutUsd ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card 2: Gross Store Volume */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold text-slate-300">Gross Captured Volume</span>
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  ₦{(balanceData?.calculatedBalance?.grossRevenueNgn ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Gross USD:</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    ${(balanceData?.calculatedBalance?.grossRevenueUsd ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card 3: Pending T+1 Bank Clearing */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold text-slate-300">Pending T+1 Clearing</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                  ₦{(balanceData?.calculatedBalance?.pendingSettlementNgn ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Settlement Vault:</span>
                  <span className="font-mono text-amber-400 font-bold">Next cycle deposit</span>
                </div>
              </div>
            </div>

            {/* Linked Bank Account Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Linked Nigerian Bank Account (Paystack Direct Payout)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your store earnings are transferred automatically to this Nigerian bank account via Paystack settlements.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {balanceData?.linkedBank?.status === "connected" ? (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                      Not connected
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setBankError("");
                      if (!isEditingBank) {
                        const lb = balanceData?.linkedBank;
                        setBankForm({
                          bankName: lb?.bankName || "",
                          bankCode: lb?.bankCode || "",
                          accountNumber: lb?.accountNumber || "",
                          accountName: lb?.accountName || "",
                        });
                      }
                      setIsEditingBank(!isEditingBank);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEditingBank ? "Close Editor" : "Edit Bank Details"}</span>
                  </button>
                </div>
              </div>

              {isEditingBank && (
                <form
                  onSubmit={handleAuthorizeBank}
                  className="bg-slate-950/90 border border-cyan-500/40 p-5 rounded-2xl space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bank or Fintech
                    </label>
                    <select
                      value={bankForm.bankCode}
                      onChange={(e) => {
                        const b = availableBanks.find((x) => x.code === e.target.value);
                        setBankForm({
                          ...bankForm,
                          bankCode: e.target.value,
                          bankName: b?.name || "",
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer"
                      required
                    >
                      <option value="">Select a bank…</option>
                      <optgroup label="Fintechs">
                        {availableBanks
                          .filter((b) => b.isFintech)
                          .map((b, idx) => (
                            <option key={`fintech-${b.code}-${idx}`} value={b.code}>
                              {b.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Commercial banks">
                        {availableBanks
                          .filter((b) => !b.isFintech)
                          .map((b, idx) => (
                            <option key={`comm-${b.code}-${idx}`} value={b.code}>
                              {b.name}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Account Number (10 digits)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={bankForm.accountNumber}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, accountNumber: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder="e.g. 7038703778"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono tracking-widest"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Account Name (filled in by Paystack if verified)
                      </label>
                      <input
                        type="text"
                        value={bankForm.accountName}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, accountName: e.target.value.toUpperCase() })
                        }
                        placeholder="Account owner name"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {bankError && (
                    <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                      {bankError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setIsEditingBank(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAuthorizingBank}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isAuthorizingBank ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with Paystack…</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify &amp; Connect</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Bank Name
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {balanceData?.linkedBank?.bankName || "Not set"}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Account Number
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">
                    {balanceData?.linkedBank?.accountNumber || "Not set"}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Account Beneficiary
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block truncate">
                    {balanceData?.linkedBank?.accountName || "Not set"}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Payout Currency
                  </span>
                  <span className="text-sm font-bold text-emerald-400 mt-1 block font-mono">
                    NGN (₦)
                  </span>
                </div>
              </div>
            </div>

            {/* Paystack Ledger / Recent Settlements Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Recent Customer Transactions &amp; Payout Ledger
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders received through your storefront and captured into your settlement ledger.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {balanceData?.recentTransactions?.length || 0} Transactions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                      <th className="py-2.5 px-3 text-right">Amount (NGN ₦)</th>
                      <th className="py-2.5 px-3 text-right">Net Profit (₦)</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {balanceData?.recentTransactions?.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-white">
                          #{tx.id}
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-medium">
                          {tx.customer}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-200">
                          ${tx.amountUsd?.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          ₦{(tx.amountNgn || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          +₦{(tx.netProfitNgn || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Captured &amp; Settled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LIVE STOREFRONT CATALOG */}
        {/* ======================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Live Storefront Catalog ({products.length} Dropship Products)
                </h3>
                <p className="text-xs text-slate-400">
                  Control stock quantities, retail pricing, supplier costs, and margins from Amazon &amp; Alibaba.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("brands")}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Brands &amp; Alibaba OEM</span>
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#0032A0] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manual Add</span>
                </button>
              </div>
            </div>

            {/* Catalog Search & Supplier Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by SKU, brand, or formula..."
                  value={catalogSearch}
                  onChange={(e) => {
                    setCatalogSearch(e.target.value);
                    setCatalogPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={catalogSupplierFilter}
                  onChange={(e) => {
                    setCatalogSupplierFilter(e.target.value);
                    setCatalogPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-xl focus:outline-hidden cursor-pointer"
                >
                  <option value="All">All Dropship Channels</option>
                  <option value="Amazon Prime Dropship">Amazon Prime Dropship</option>
                  <option value="Alibaba Trade Assurance Dropship">Alibaba Trade Assurance</option>
                </select>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Show:</span>
                  {[25, 50, 100].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setCatalogPageSize(size);
                        setCatalogPage(1);
                      }}
                      className={`px-1.5 py-0.5 rounded font-mono font-semibold cursor-pointer ${
                        catalogPageSize === size
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Product &amp; SKU</th>
                      <th className="p-3.5">Channel / Source</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Retail Price</th>
                      <th className="p-3.5">Supplier Cost</th>
                      <th className="p-3.5">Gross Margin</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedCatalogProducts.map((prod) => {
                      const marginPct =
                        prod.price > 0
                          ? Math.round(
                              ((prod.price - (prod.supplierCost || 0)) / prod.price) *
                                100
                            )
                          : 0;

                      return (
                        <tr
                          key={prod.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="p-3.5 flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 p-0.5 flex items-center justify-center">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 max-w-[220px]">
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                                {prod.brand}
                              </span>
                              <div className="font-bold text-white truncate">
                                {prod.name}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {prod.sku || prod.size}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            {prod.supplierSource === "Amazon Prime Dropship" ? (
                              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Amazon Prime
                              </span>
                            ) : prod.supplierSource === "Alibaba Trade Assurance Dropship" ? (
                              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Alibaba Dropship
                              </span>
                            ) : (
                              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Direct Pharma
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-slate-400 whitespace-nowrap">
                            {prod.category}
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                (prod.stockLeft ?? 100) > 20
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {prod.stockLeft ?? 100} in stock
                            </span>
                          </td>

                          <td className="p-3.5 font-mono font-bold text-white">
                            ${prod.price.toFixed(2)}
                          </td>

                          <td className="p-3.5 font-mono text-slate-400">
                            ${(prod.supplierCost || 0).toFixed(2)}
                          </td>

                          <td className="p-3.5">
                            <span className="text-emerald-400 font-bold font-mono">
                              {marginPct}%
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                title="Remove Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Catalog Pagination Footer */}
              <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/40">
                <div>
                  Showing{" "}
                  <span className="font-bold text-white font-mono">
                    {filteredCatalogProducts.length === 0
                      ? 0
                      : (catalogPage - 1) * catalogPageSize + 1}
                    –{Math.min(catalogPage * catalogPageSize, filteredCatalogProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-white font-mono">
                    {filteredCatalogProducts.length.toLocaleString()}
                  </span>{" "}
                  items
                </div>

                {catalogTotalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                      disabled={catalogPage === 1}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <span className="px-2 font-mono text-xs">
                      Page <strong className="text-white">{catalogPage}</strong> of{" "}
                      <strong className="text-white">{catalogTotalPages}</strong>
                    </span>

                    <button
                      onClick={() => setCatalogPage((p) => Math.min(catalogTotalPages, p + 1))}
                      disabled={catalogPage === catalogTotalPages}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CUSTOMER ORDERS */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Customer Orders &amp; Fulfillment
                </h3>
                <p className="text-xs text-slate-400">
                  Track delivery pipelines, update courier tracking numbers, and view customer manifests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {orders.length > 0 && (
                  <button
                    onClick={handleClearOrders}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear Orders</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-white text-sm">
                        #{ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          ord.fulfillmentStatus === "Delivered"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : ord.fulfillmentStatus === "In Transit"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {ord.fulfillmentStatus}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <strong>{ord.customerName}</strong> ({ord.customerEmail}) •{" "}
                      {ord.city}, {ord.country}
                    </div>

                    {/* Ordered Items summary */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ord.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 px-2.5 py-1 rounded-lg"
                        >
                          {item.quantity}x {item.name} ({item.variantName})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Courier Controls */}
                  <div className="flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-400">Total Customer Paid</div>
                      <div className="text-lg font-bold font-mono text-white">
                        ${ord.totalPaidUsd.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Net Profit: +${ord.netProfitUsd.toFixed(2)}
                      </div>
                    </div>

                    {/* Fulfillment Quick Selector */}
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.fulfillmentStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(
                            ord.id,
                            e.target.value as CustomerOrder["fulfillmentStatus"],
                            ord.trackingNumber
                          )
                        }
                        className="bg-slate-950 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
                      >
                        <option value="Unfulfilled">Unfulfilled</option>
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <Link
                        href={`/track-order?q=${ord.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Customer Tracking Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STORE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === "settings" && settings && (
          <div className="max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">
                Global Storefront Controls
              </h3>
              <p className="text-xs text-slate-400">
                Update store name, announcement bar, and shipping tiers in real-time.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Store Public Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Top Announcement Bar Message
                </label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) =>
                    setSettings({ ...settings, announcementText: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Free Shipping Minimum ($)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThresholdUsd}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        freeShippingThresholdUsd: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Support Concierge Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* TikTok Trending Hero Section Config */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
                  <span className="font-bold text-white text-xs">
                    TikTok Trending Hero Spotlight
                  </span>
                  <span className="bg-[#FE2C55]/20 text-[#FE2C55] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Live on Homepage Hero
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">
                    Select Featured TikTok Viral Product:
                  </label>
                  <select
                    value={settings.tiktokTrendingProductId || "prod-cosrx-28"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tiktokTrendingProductId: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 cursor-pointer text-xs"
                  >
                    <option value="prod-cosrx-28">
                      COSRX Advanced Snail 96 Mucin Essence (4.8B Views)
                    </option>
                    <option value="amz-prod-B00A35SIHE">
                      NIVEA Creme Classic Tin - Viral La Mer Dupe (1.5B Views)
                    </option>
                    <option value="prod-beautyofjoseon-30">
                      Beauty of Joseon Relief Sun Rice + Probiotics (1.9B Views)
                    </option>
                    <option value="prod-anua-32">
                      Anua Heartleaf 77% Soothing Toner (2.4B Views)
                    </option>
                    <option value="prod-larocheposay-22">
                      La Roche-Posay Cicaplast Baume B5+ (3.2B Views)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      TikTok Views Display Text:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4.8B TikTok Views"
                      value={settings.tiktokTrendingViews || "4.8B TikTok Views"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          tiktokTrendingViews: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Viral Tagline / Hashtag:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #TikTokMadeMeBuyIt"
                      value={
                        settings.tiktokTrendingTagline ||
                        "#TikTokMadeMeBuyIt • Viral Glass Skin Sensation"
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          tiktokTrendingTagline: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Automated Weekly Catalog Refresh Engine */}
              <div className="p-4 bg-slate-950/80 border border-blue-900/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">
                      Weekly Catalog Refresh Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ACTIVE (EVERY 7 DAYS)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The storefront automatically audits supplier stock, refreshes exchange rates, and updates trending indicators every week.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Schedule</span>
                    <span className="text-slate-200">
                      {settings.weeklySyncSchedule || "Every Sunday at 00:00 UTC"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Next Scheduled Refresh</span>
                    <span className="text-cyan-400">
                      {settings.nextWeeklySyncAt
                        ? new Date(settings.nextWeeklySyncAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "In 5 days"}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Last refreshed:{" "}
                    {settings.lastWeeklySyncAt
                      ? new Date(settings.lastWeeklySyncAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                  <button
                    type="button"
                    onClick={handleTriggerWeeklySync}
                    disabled={isSyncingWeekly}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingWeekly ? "animate-spin" : ""}`} />
                    <span>{isSyncingWeekly ? "Syncing..." : "Sync Storefront Now"}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#0032A0] hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Storefront Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: GOOGLE ANALYTICS & TRAFFIC */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Google Analytics 4 Active Stream
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">
                    Storefront Traffic &amp; Conversion Analytics
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live Google Tag stream tracking visitor sessions, product clicks, and checkout funnels.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <span>Open GA4 Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Tag Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Measurement ID</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white">G-7JFVGY12S2</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Tracking in Production</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Total Orders Logged</span>
                    <Package className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white">{orders.length} Orders</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    ${metrics.totalRevenueUsd.toLocaleString()} Gross Volume
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Avg Order Value (AOV)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white">
                    ${orders.length > 0 ? (metrics.totalRevenueUsd / orders.length).toFixed(2) : "0.00"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Blended international basket</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Active Net Margin</span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    {metrics.averageMarginPercent}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Target range: 25% – 30%</div>
                </div>
              </div>

              {/* Event Stream Specs & Diagnostic Guide */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Automatic Google Analytics Events Configured
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">gtag.js v4</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-slate-200">page_view</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Fires on every storefront visit, category filter switch, and product detail route.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-slate-200">view_item &amp; add_to_cart</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tracks single items, 2-packs, 3-packs, and El Niño Curated Bundle selections.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-slate-200">begin_checkout &amp; purchase</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Monitors Paystack bank/card conversions and instant checkout transactions.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Real-time visitors, demographics, and search queries can be analyzed live inside Google Analytics.</span>
                  </div>
                  <a
                    href="https://analytics.google.com/analytics/web/#/p430000000/realtime"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>View Real-Time Users</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: COURIER TRACKING HUB */}
        {activeTab === "couriers" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Courier Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-2">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CARRIER DISPATCH &amp; REAL-TIME TRACKING</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Connected Couriers &amp; Logistics Network
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Manage multi-carrier shipping integrations for door-to-door delivery across Lagos, Abuja, all 36 Nigerian states, and international supplier routes.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>5 Couriers Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCouriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
                        <Truck className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{carrier.name}</h4>
                        <span className="text-[11px] text-slate-400 block">{carrier.region}</span>
                      </div>
                    </div>

                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {carrier.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Typical Delivery</span>
                      <span className="font-semibold text-slate-200">{carrier.leadTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Waybill Prefix</span>
                      <span className="font-mono font-bold text-cyan-300">{carrier.trackingPrefix}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-emerald-400/90 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{carrier.apiStatus}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCourierDispatchForm((prev) => ({
                          ...prev,
                          carrier: carrier.name,
                          trackingNumber: `${carrier.trackingPrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
                        }));
                        const el = document.getElementById("dispatch-order-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Use Carrier →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Dispatch & Assign Waybill Tool */}
            <div id="dispatch-order-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-base text-white">
                  Assign Courier &amp; Generate Tracking Waybill
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Select Customer Order
                  </label>
                  <select
                    value={courierDispatchForm.orderId}
                    onChange={(e) => {
                      const oId = e.target.value;
                      const selectedOrder = orders.find((o) => o.id === oId);
                      setCourierDispatchForm((prev) => ({
                        ...prev,
                        orderId: oId,
                        carrier: selectedOrder?.carrier || prev.carrier,
                        trackingNumber: selectedOrder?.trackingNumber || prev.trackingNumber,
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="">-- Choose Order to Dispatch --</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} — {o.customerName} ({o.city}, {o.country}) • {o.fulfillmentStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Assigned Courier
                  </label>
                  <select
                    value={courierDispatchForm.carrier}
                    onChange={(e) =>
                      setCourierDispatchForm((prev) => ({ ...prev, carrier: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    {activeCouriers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.leadTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Waybill / Tracking Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GIG-NG-847291"
                      value={courierDispatchForm.trackingNumber}
                      onChange={(e) =>
                        setCourierDispatchForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const carrierMatch = activeCouriers.find((c) => c.name === courierDispatchForm.carrier);
                        const prefix = carrierMatch ? carrierMatch.trackingPrefix : "TRK";
                        setCourierDispatchForm((prev) => ({
                          ...prev,
                          trackingNumber: `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`,
                        }));
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition-colors cursor-pointer"
                      title="Generate Waybill"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={isAssigningCourier || !courierDispatchForm.orderId}
                    onClick={async () => {
                      if (!courierDispatchForm.orderId) {
                        alert("Please select an order first");
                        return;
                      }
                      setIsAssigningCourier(true);
                      try {
                        const res = await fetch("/api/admin/dashboard", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            type: "update_order",
                            orderId: courierDispatchForm.orderId,
                            carrier: courierDispatchForm.carrier,
                            trackingNumber: courierDispatchForm.trackingNumber || `GIG-${Math.floor(100000 + Math.random() * 900000)}`,
                            fulfillmentStatus: "In Transit",
                          }),
                        });
                        if (res.ok) {
                          setSaveMessage(`✓ Order ${courierDispatchForm.orderId} dispatched with ${courierDispatchForm.carrier}!`);
                          setTimeout(() => setSaveMessage(""), 4000);
                          fetchDashboardData();
                        } else {
                          alert("Failed to assign courier");
                        }
                      } catch {
                        alert("Error connecting to server");
                      } finally {
                        setIsAssigningCourier(false);
                      }
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{isAssigningCourier ? "Dispatching..." : "Dispatch Shipment"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Courier Waybill Lookup & Customer View Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">
                    Test Live Tracking Endpoint (Customer View)
                  </h4>
                </div>
                <Link
                  href="/track-order"
                  target="_blank"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Open Public Tracker</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. AUR-8921) or Waybill code..."
                  value={courierTestQuery}
                  onChange={(e) => setCourierTestQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="button"
                  disabled={isCourierTesting || !courierTestQuery.trim()}
                  onClick={async () => {
                    setIsCourierTesting(true);
                    setCourierTestResult(null);
                    try {
                      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(courierTestQuery.trim())}`);
                      const data = await res.json();
                      setCourierTestResult(data);
                    } catch (err: any) {
                      setCourierTestResult({ error: err?.message || "Failed to fetch tracking data" });
                    } finally {
                      setIsCourierTesting(false);
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  {isCourierTesting ? "Testing..." : "Test Lookup"}
                </button>
              </div>

              {courierTestResult && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
                  {courierTestResult.error ? (
                    <div className="text-rose-400">Error: {courierTestResult.error}</div>
                  ) : (
                    <div className="space-y-1.5 text-slate-300">
                      <div className="text-emerald-400 font-bold">
                        ✓ Courier Status: {courierTestResult.order?.fulfillmentStatus}
                      </div>
                      <div>Carrier: <strong className="text-white">{courierTestResult.order?.carrier}</strong></div>
                      <div>Waybill Tracking: <strong className="text-cyan-300">{courierTestResult.order?.trackingNumber}</strong></div>
                      <div>Destination: <strong className="text-white">{courierTestResult.order?.city}, {courierTestResult.order?.country}</strong></div>
                      <div>Estimated Delivery: <strong className="text-white">{courierTestResult.order?.estimatedDelivery}</strong></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: ANTIGRAVITY STUDIO EDITOR */}
        {activeTab === "antigravity" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  Mini Antigravity Studio &amp; Code Editor
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct live code editing, workspace file tree, Gemini 3.5 Copilot assistance, split-screen storefront preview, and hot reload.
                </p>
              </div>

              {/* Gemini Key Status Badge */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  GEMINI ACTIVE: {(settings as any)?.geminiKeyMasked || "CONFIGURED"}
                </span>
              </div>
            </div>

            <AntigravityEditor />
          </div>
        )}
      </main>

      {/* MANUAL ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Add New Skincare Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Brand
                  </label>
                  <select
                    value={newProd.brand}
                    onChange={(e) =>
                      setNewProd({ ...newProd, brand: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="NIVEA">NIVEA</option>
                    <option value="Eucerin">Eucerin</option>
                    <option value="Avène">Avène</option>
                    <option value="CeraVe">CeraVe</option>
                    <option value="La Roche-Posay">La Roche-Posay</option>
                    <option value="The Ordinary">The Ordinary</option>
                    <option value="Drunk Elephant">Drunk Elephant</option>
                    <option value="Tatcha">Tatcha</option>
                    <option value="Paula's Choice">Paula&apos;s Choice</option>
                    <option value="SkinCeuticals">SkinCeuticals</option>
                    <option value="COSRX">COSRX</option>
                    <option value="Beauty of Joseon">Beauty of Joseon</option>
                    <option value="AURA Exclusive">AURA Exclusive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        category: e.target.value as Exclude<ProductCategory, "All">,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIVEA Cellular Hyaluron Day Cream"
                  value={newProd.name}
                  onChange={(e) =>
                    setNewProd({ ...newProd, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Key Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyaluronic Acid, Vitamin E, Creatine"
                  value={newProd.keyIngredients}
                  onChange={(e) =>
                    setNewProd({ ...newProd, keyIngredients: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.price}
                    onChange={(e) =>
                      setNewProd({ ...newProd, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Supplier Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.supplierCost}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        supplierCost: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.stockLeft}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        stockLeft: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newProd.image}
                  onChange={(e) =>
                    setNewProd({ ...newProd, image: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0032A0] hover:bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Save to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Edit {editingProduct.brand} Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Supplier Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.supplierCost || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        supplierCost: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Stock Units Available
                </label>
                <input
                  type="number"
                  value={editingProduct.stockLeft ?? ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stockLeft: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Image (Web URL or /api/media/ path)
                </label>
                <input
                  type="text"
                  value={editingProduct.image || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono placeholder:text-slate-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProductEdit(editingProduct)}
                  className="px-5 py-2 rounded-xl bg-[#0032A0] hover:bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
