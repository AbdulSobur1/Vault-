"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

interface BalanceCardProps {
  accountNumber: string;
  accountType: "savings" | "current";
  balance: number;
  currency?: string;
}

function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function BalanceCard({
  accountNumber,
  accountType,
  balance,
  currency = "NGN",
}: BalanceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl border border-[#2A2A2A] bg-[#161616] p-6">
      {/* Top row: account type badge + currency tag */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#8A8682]">
          {accountType === "savings" ? "Savings Account" : "Current Account"}
        </span>
        <span className="text-[10px] font-medium tracking-widest text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-2.5 py-0.5">
          {currency}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-5">
        <p className="text-xs text-[#555250] mb-1 tracking-wide">Available Balance</p>
        <p className="text-3xl font-semibold text-[#C9A84C] tracking-tight leading-none">
          {formatNGN(balance)}
        </p>
      </div>

      {/* Account number row with copy button */}
      <div className="flex items-center gap-2 mb-6 group">
        <p className="text-sm text-[#8A8682] font-mono tracking-widest">
          {accountNumber.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}
        </p>
        <button
          onClick={handleCopy}
          aria-label="Copy account number"
          className="flex items-center gap-1 text-[11px] text-[#555250] hover:text-[#C9A84C] transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#4CAF82]" />
              <span className="text-[#4CAF82]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2A2A2A] mb-5" />

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Link href="/fund" className="flex-1 sm:flex-none">
          <button className="w-full sm:w-auto h-9 px-5 rounded-md border border-[#C9A84C] text-[#C9A84C] text-sm font-medium tracking-wide hover:bg-[#C9A84C]/10 transition-colors">
            Fund Account
          </button>
        </Link>
        <Link href="/transfer" className="flex-1 sm:flex-none">
          <button className="w-full sm:w-auto h-9 px-5 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium tracking-wide hover:bg-[#b8973d] transition-colors">
            Transfer
          </button>
        </Link>
      </div>
    </div>
  );
}
