"use client";

import { formatCurrency, getCurrency } from "@/lib/currencies";

interface WalletCardProps {
  currency: string;
  balance: number;
  balanceUSD: number | null;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function WalletCard({ currency, balance, balanceUSD, isSelected, onClick }: WalletCardProps) {
  const currencyInfo = getCurrency(currency);

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-[#C9A84C] bg-[#C9A84C]/5 shadow-[0_0_0_1px_#C9A84C]"
          : "border-[#2A2A2A] bg-[#161616] hover:border-[#3A3A3A] hover:bg-[#1C1C1C]"
      }`}
    >
      {/* Currency flag + code */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{currencyInfo?.flag}</span>
          <div>
            <p className="text-xs font-semibold text-white tracking-wider">{currency}</p>
            <p className="text-[10px] text-[#555250]">{currencyInfo?.name}</p>
          </div>
        </div>
        {isSelected && <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
      </div>

      {/* Balance */}
      <p className="text-xl font-semibold text-white tracking-tight">{formatCurrency(balance, currency)}</p>

      {/* USD equivalent */}
      {balanceUSD !== null && currency !== "USD" && (
        <p className="text-xs text-[#555250] mt-1">≈ {formatCurrency(balanceUSD, "USD")}</p>
      )}
    </div>
  );
}
