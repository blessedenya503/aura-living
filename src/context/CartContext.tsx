"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  ProductVariant,
  INITIAL_PRODUCTS,
  CurrencyCode,
  CURRENCIES,
} from "@/data/products";

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  bundleTier: 1 | 2 | 3; // 1 = Single, 2 = 2-Pack (15% off), 3 = 3-Pack (25% off)
  quantity: number; // total physical units
  unitPriceUsd: number; // discounted unit price in USD
}

interface StorePublicSettings {
  storeName: string;
  supportEmail: string;
  freeShippingThresholdUsd: number;
  shippingProtectionPriceUsd: number;
  announcementText: string;
  tiktokTrendingProductId?: string;
  tiktokTrendingViews?: string;
  tiktokTrendingTagline?: string;
  weeklySyncSchedule?: string;
  lastWeeklySyncAt?: string;
  nextWeeklySyncAt?: string;
  weeklyTikTokCatalog?: any[];
  currentWeekNumber?: number;
  userReviews?: any[];
}

interface CartContextType {
  products: Product[];
  refreshCatalog: () => Promise<void>;
  storeSettings: StorePublicSettings;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  shippingCountry: string;
  setShippingCountry: (c: string) => void;
  liveRates: Record<string, number>;
  isRatesLive: boolean;
  formatPrice: (usdAmount: number) => string;
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  shippingProtection: boolean;
  setShippingProtection: (enabled: boolean) => void;
  addToCart: (
    product: Product,
    variant?: ProductVariant,
    bundleTier?: 1 | 2 | 3,
    openDrawer?: boolean
  ) => void;
  removeFromCart: (productId: string, variantName: string) => void;
  updateQuantity: (
    productId: string,
    variantName: string,
    newQty: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalUsd: number;
  bundleSavingsUsd: number;
  discountCode: string;
  discountAmountUsd: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  shippingCostUsd: number;
  shippingProtectionCostUsd: number;
  finalTotalUsd: number;
  isNightRecovery: boolean;
  setIsNightRecovery: (v: boolean) => void;
  isNightSweeping: boolean;
  sweepDirection: "to-night" | "to-day";
  triggerNightRecoverySweep: (enable: boolean, rememberManual?: boolean) => void;
  isDiscountEligible: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function getBundleUnitPrice(basePriceUsd: number, tier: 1 | 2 | 3): number {
  if (tier === 2) return Number((basePriceUsd * 0.85).toFixed(2)); // 15% off
  if (tier === 3) return Number((basePriceUsd * 0.75).toFixed(2)); // 25% off
  return basePriceUsd;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    INITIAL_PRODUCTS.map((p) => ({ ...p, rating: 0, reviewCount: 0 }))
  );
  const [storeSettings, setStoreSettings] = useState<StorePublicSettings>({
    storeName: "AURA SKIN",
    supportEmail: "auraskinngofficial@gmail.com",
    freeShippingThresholdUsd: 30,
    shippingProtectionPriceUsd: 1.5,
    announcementText:
      "🌍 WORLDWIDE TRACKED SHIPPING • FREE SHIPPING OVER $35",
    tiktokTrendingProductId: "prod-cosrx-28",
    tiktokTrendingViews: "Viral Skincare Sensation",
    tiktokTrendingTagline: "Authentic Glass Skin Essence • In Stock Worldwide",
    userReviews: [],
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");
  const [shippingCountry, setShippingCountry] = useState<string>("Nigeria");
  const [liveRates, setLiveRates] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const [key, cfg] of Object.entries(CURRENCIES)) {
      initial[key] = cfg.rate;
    }
    return initial;
  });
  const [isRatesLive, setIsRatesLive] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingProtection, setShippingProtection] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNightRecovery, setIsNightRecovery] = useState(false);
  const [isNightSweeping, setIsNightSweeping] = useState(false);
  const [sweepDirection, setSweepDirection] = useState<"to-night" | "to-day">("to-night");
  // 4 in 10 customers (40% probability) receive randomized promotional discount eligibility
  const [isDiscountEligible, setIsDiscountEligible] = useState(false);

  // Check if current user local time is >= 4:00 PM (16:00) or early morning before 6:00 AM
  const checkShouldBeNightMode = () => {
    const now = new Date();
    const hours = now.getHours();
    // Night mode active starting at 4:00 PM (16:00) until dawn (6:00 AM)
    return hours >= 16 || hours < 6;
  };

  const triggerNightRecoverySweep = (enable: boolean, rememberManual = true) => {
    setSweepDirection(enable ? "to-night" : "to-day");
    setIsNightSweeping(true);
    setIsNightRecovery(enable);
    if (rememberManual) {
      try {
        localStorage.setItem("aura_theme_mode", enable ? "night" : "day");
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      setIsNightSweeping(false);
    }, 1150);
  };

  const fetchLiveRates = async () => {
    try {
      const res = await fetch("/api/exchange-rates");
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setLiveRates((prev) => ({ ...prev, ...data.rates }));
          setIsRatesLive(data.source === "live-api");
        }
      }
    } catch {
      // fallback rates preserved
    }
  };

  const refreshCatalog = async () => {
    try {
      const res = await fetch("/api/store");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (data.settings) {
          setStoreSettings(data.settings);
        }
      }
    } catch {
      // ignore fetch error
    }
  };

  useEffect(() => {
    refreshCatalog();
    fetchLiveRates();
    try {
      const savedCart = localStorage.getItem("aura_skincare_cart_v1");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setItems(parsed);
      }
      const savedCurr = localStorage.getItem("aura_currency_v1") as CurrencyCode | null;
      if (savedCurr && CURRENCIES[savedCurr]) {
        setCurrencyState(savedCurr);
      } else {
        // Automatically detect user location and match nearest currency (Nigeria, Africa, UK, US, etc.)
        fetch("/api/geo")
          .then((r) => r.json())
          .then((geo) => {
            if (geo?.currency && CURRENCIES[geo.currency as CurrencyCode]) {
              setCurrencyState(geo.currency as CurrencyCode);
              try {
                localStorage.setItem("aura_currency_v1", geo.currency);
              } catch {}
            }
          })
          .catch(() => {
            setCurrencyState("NGN");
          });
      }

      // 4 in every 10 customers (40%) get randomized discount eligibility stored persistently
      const savedDiscountRoll = localStorage.getItem("aura_discount_eligible_v1");
      if (savedDiscountRoll !== null) {
        setIsDiscountEligible(savedDiscountRoll === "true");
      } else {
        const eligible = Math.random() < 0.4; // exactly 4 in 10 chance
        setIsDiscountEligible(eligible);
        try {
          localStorage.setItem("aura_discount_eligible_v1", eligible ? "true" : "false");
        } catch {}
      }

      // Check user preferences or automatic 4:00 PM local time switch
      const savedTheme = localStorage.getItem("aura_theme_mode");
      if (savedTheme === "night") {
        setIsNightRecovery(true);
      } else if (savedTheme === "day") {
        setIsNightRecovery(false);
      } else {
        // Automatic: If 4:00 PM (16:00) or later, activate night mode
        if (checkShouldBeNightMode()) {
          setIsNightRecovery(true);
        }
      }
    } catch {
      // ignore storage errors
    }
    setIsHydrated(true);

    // Dynamic timer check: Automatically switch when user reaches 4:00 PM local time while browsing
    const timeCheckInterval = setInterval(() => {
      try {
        const savedTheme = localStorage.getItem("aura_theme_mode");
        // If user hasn't explicitly locked it to day mode, follow 4:00 PM local time rule
        if (!savedTheme) {
          const shouldBeNight = checkShouldBeNightMode();
          setIsNightRecovery((current) => {
            if (current !== shouldBeNight) {
              setSweepDirection(shouldBeNight ? "to-night" : "to-day");
              setIsNightSweeping(true);
              setTimeout(() => setIsNightSweeping(false), 1150);
              return shouldBeNight;
            }
            return current;
          });
        }
      } catch {
        // ignore
      }
    }, 60000); // Check every minute

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        refreshCatalog();
        fetchLiveRates();
        // Also re-verify time on tab focus
        try {
          const savedTheme = localStorage.getItem("aura_theme_mode");
          if (!savedTheme) {
            setIsNightRecovery(checkShouldBeNightMode());
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("focus", refreshCatalog);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      clearInterval(timeCheckInterval);
      window.removeEventListener("focus", refreshCatalog);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("aura_skincare_cart_v1", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isHydrated]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    if (CURRENCIES[c]?.countryName) {
      setShippingCountry(c === "NGN" ? "Nigeria" : CURRENCIES[c].countryName);
    }
    try {
      localStorage.setItem("aura_currency_v1", c);
    } catch {
      // ignore
    }
  };

  const formatPrice = (usdAmount: number): string => {
    if (currency === "NGN") {
      if (Math.abs(usdAmount - 33.38) < 0.02) {
        return "₦49,400";
      }
      if (Math.abs(usdAmount - 44.48) < 0.02) {
        return "₦65,830.40";
      }
    }

    const cfg = CURRENCIES[currency] || CURRENCIES.USD;
    const currentRate = liveRates[currency] || cfg.rate || 1;
    const converted = usdAmount * currentRate;

    if (currency === "JPY" || currency === "KRW") {
      return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cfg.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    bundleTier: 1 | 2 | 3 = 1,
    openDrawer = true
  ) => {
    const chosenVariant = variant || product.variants[0];
    const qtyToAdd = bundleTier;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedVariant.name === chosenVariant.name
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + qtyToAdd;
        const effectiveTier: 1 | 2 | 3 =
          newQty >= 3 ? 3 : newQty === 2 ? 2 : 1;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          bundleTier: effectiveTier,
          unitPriceUsd: getBundleUnitPrice(product.price, effectiveTier),
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          selectedVariant: chosenVariant,
          bundleTier,
          quantity: qtyToAdd,
          unitPriceUsd: getBundleUnitPrice(product.price, bundleTier),
        },
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string, variantName: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.product.id === productId && i.selectedVariant.name === variantName)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variantName: string,
    newQty: number
  ) => {
    if (newQty <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (
          i.product.id === productId &&
          i.selectedVariant.name === variantName
        ) {
          const effectiveTier: 1 | 2 | 3 =
            newQty >= 3 ? 3 : newQty === 2 ? 2 : 1;
          return {
            ...i,
            quantity: newQty,
            bundleTier: effectiveTier,
            unitPriceUsd: getBundleUnitPrice(i.product.price, effectiveTier),
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalUsd = Number(
    items
      .reduce((sum, item) => sum + item.unitPriceUsd * item.quantity, 0)
      .toFixed(2)
  );

  const unDiscountedTotalUsd = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const bundleSavingsUsd = Number(
    Math.max(0, unDiscountedTotalUsd - subtotalUsd).toFixed(2)
  );

  const discountAmountUsd = Number(
    ((subtotalUsd * discountPercent) / 100).toFixed(2)
  );

  const afterDiscountUsd = Math.max(0, subtotalUsd - discountAmountUsd);

  const shippingCostUsd =
    subtotalUsd === 0 ||
    afterDiscountUsd >= storeSettings.freeShippingThresholdUsd
      ? 0
      : 3.99;

  const shippingProtectionCostUsd =
    shippingProtection && items.length > 0
      ? storeSettings.shippingProtectionPriceUsd
      : 0;

  const finalTotalUsd = Number(
    (
      afterDiscountUsd +
      shippingCostUsd +
      shippingProtectionCostUsd
    ).toFixed(2)
  );

  const applyPromoCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (code === "GLOW15") {
      setDiscountCode("GLOW15");
      setDiscountPercent(15);
      return {
        success: true,
        message: "✨ 15% OFF Skincare Routine Discount Applied!",
      };
    }
    if (code === "AURA20") {
      setDiscountCode("AURA20");
      setDiscountPercent(20);
      return {
        success: true,
        message: "💧 20% OFF Member Privilege Discount Applied!",
      };
    }
    return {
      success: false,
      message: "Invalid code. Try GLOW15 (15% off) or AURA20 (20% off)!",
    };
  };

  const removePromoCode = () => {
    setDiscountCode("");
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        refreshCatalog,
        storeSettings,
        currency,
        setCurrency,
        shippingCountry,
        setShippingCountry,
        liveRates,
        isRatesLive,
        formatPrice,
        items,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        shippingProtection,
        setShippingProtection,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalUsd,
        bundleSavingsUsd,
        discountCode,
        discountAmountUsd,
        applyPromoCode,
        removePromoCode,
        shippingCostUsd,
        shippingProtectionCostUsd,
        finalTotalUsd,
        isNightRecovery,
        setIsNightRecovery,
        isNightSweeping,
        sweepDirection,
        triggerNightRecoverySweep,
        isDiscountEligible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
