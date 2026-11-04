"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ShieldCheck,
  Ship,
  Sparkles,
  RefreshCw,
  MessageCircle,
  FileText,
  ChevronRight,
  Headphones,
  CheckCircle2,
  Lock,
  Clock,
} from "lucide-react";
import {
  ExpandableTabs,
  type ExpandableTabsItem,
} from "@/components/ui/expandable-tabs";

function HelpRowItem({
  icon: Icon,
  label,
  sublabel,
  href,
  onClick,
}: {
  icon: any;
  label: string;
  sublabel?: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100/80 cursor-pointer">
      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#002B7F] flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate">{label}</p>
        {sublabel && <p className="text-[10px] text-slate-500 truncate">{sublabel}</p>}
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full">
      {content}
    </button>
  );
}

function HelpRowList({ children }: { children: React.ReactNode }) {
  return <div className="flex w-[16.5rem] sm:w-[20rem] max-w-[88vw] flex-col gap-1 p-1">{children}</div>;
}

export function StorefrontFloatingHelp() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const helpItems: ExpandableTabsItem[] = [
    {
      id: "support",
      label: "Help & FAQ",
      icon: <HelpCircle className="h-4 w-4" />,
      content: (
        <HelpRowList>
          <div className="px-3 pt-1 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customer Concierge
            </span>
          </div>
          <HelpRowItem
            icon={Headphones}
            label="WhatsApp Concierge"
            sublabel="+234 814 624 3788 (Chat directly on WhatsApp)"
            href="https://wa.me/2348146243788?text=Hello%20AURA%2C%20I%20have%20a%20question%20about%20a%20skincare%20product"
          />
          <HelpRowItem
            icon={MessageCircle}
            label="Skincare & Routine FAQ"
            sublabel="Usage instructions, batch codes & authenticity"
            onClick={() => {
              const el = document.getElementById("faq-section");
              el?.scrollIntoView({ behavior: "smooth" });
              setActiveTab(null);
            }}
          />
          <HelpRowItem
            icon={FileText}
            label="Return & Refund Policy"
            sublabel="Hassle-free guarantee on unopened items"
          />
        </HelpRowList>
      ),
    },
    {
      id: "shipping",
      label: "Delivery & Dispatch",
      icon: <Ship className="h-4 w-4" />,
      content: (
        <HelpRowList>
          <div className="px-3 pt-1 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Nigeria Nationwide Logistics
            </span>
          </div>
          <HelpRowItem
            icon={Ship}
            label="Track Existing Order"
            sublabel="Real-time dispatch & rider status"
            href="/track-order"
          />
          <HelpRowItem
            icon={Clock}
            label="Delivery Timelines"
            sublabel="1–2 business days Lagos/Abuja • 2–4 days nationwide"
          />
          <HelpRowItem
            icon={ShieldCheck}
            label="Damaged / Loss Protection"
            sublabel="Full replacement insurance option"
          />
        </HelpRowList>
      ),
    },
    {
      id: "guarantee",
      label: "Authenticity",
      icon: <ShieldCheck className="h-4 w-4" />,
      content: (
        <HelpRowList>
          <div className="px-3 pt-1 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quality Assurance
            </span>
          </div>
          <HelpRowItem
            icon={CheckCircle2}
            label="100% Original Products"
            sublabel="Direct from verified brand supply chains"
          />
          <HelpRowItem
            icon={Lock}
            label="Paystack Encrypted"
            sublabel="Cards, bank transfer & USSD"
          />
          <HelpRowItem
            icon={Sparkles}
            label="Batch Verification"
            sublabel="Inspect lot number on every bottle"
          />
        </HelpRowList>
      ),
    },
  ];

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end">
      <ExpandableTabs
        items={helpItems}
        value={activeTab}
        onValueChange={setActiveTab}
        className="shadow-2xl border-slate-300 bg-white/95 backdrop-blur-md"
        classNames={{
          tab: "text-slate-900 hover:text-black dark:text-slate-900",
          icon: "text-slate-900 dark:text-slate-900",
          label: "text-slate-900 font-bold dark:text-slate-900",
          pill: "bg-slate-200/80 text-slate-900",
        }}
      />
    </div>
  );
}

export default StorefrontFloatingHelp;
