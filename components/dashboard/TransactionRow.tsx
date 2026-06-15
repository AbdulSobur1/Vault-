"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";

interface TransactionRowProps {
  date: Date | string;
  description: string | null;
  reference: string;
  amount: string;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  onClick?: () => void;
}

export function TransactionRow({
  date,
  description,
  reference,
  amount,
  type,
  onClick,
}: TransactionRowProps) {
  const isCredit = type === "credit";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 sm:px-4 py-4 rounded-lg cursor-pointer hover:bg-[#1C1C1C] transition-colors group"
    >
      {/* Left: icon + description + date */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isCredit ? "bg-[#2D6A4F]/20" : "bg-[#E05252]/10"
          }`}
        >
          {isCredit ? (
            <ArrowDownLeft size={16} className="text-[#4CAF82]" />
          ) : (
            <ArrowUpRight size={16} className="text-[#E05252]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{description || "Transfer"}</p>
          <p className="text-xs text-[#555250] mt-0.5">{formatDate(date)}</p>
        </div>
      </div>

      {/* Right: amount + reference + chevron */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <div className="text-right">
          <p
            className={`text-sm font-semibold whitespace-nowrap ${
              isCredit ? "text-[#4CAF82]" : "text-[#E05252]"
            }`}
          >
            {isCredit ? "+" : "−"}
            {formatCurrency(parseFloat(amount))}
          </p>
          <p className="text-[10px] text-[#555250] font-mono hidden sm:block">{reference}</p>
        </div>
        <ChevronRight size={14} className="text-[#2A2A2A] group-hover:text-[#555250] shrink-0" />
      </div>
    </div>
  );
}
