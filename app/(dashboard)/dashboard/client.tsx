"use client";

import Link from "next/link";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type { Account, Transaction } from "@/lib/schema";

interface DashboardClientProps {
  greeting: string;
  firstname: string;
  accounts: (Omit<Account, "balance"> & { balance: string })[];
  primaryAccountId: string;
  transactions: (Omit<Transaction, "amount" | "createdAt"> & { amount: string; createdAt: string })[];
  totalCredits: number;
  totalDebits: number;
}

export function DashboardClient({
  greeting,
  firstname,
  accounts,
  primaryAccountId,
  transactions,
  totalCredits,
  totalDebits,
}: DashboardClientProps) {
  const primaryAccount = accounts.find((a) => a.id === primaryAccountId) || accounts[0];

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-medium">
          {greeting}, {firstname}
        </h1>
        <p className="text-sm text-text-secondary mt-1">Here&apos;s your financial overview</p>
      </div>

      {/* Balance Card */}
      <BalanceCard
        accountNumber={primaryAccount.accountNumber}
        accountType={primaryAccount.accountType as "savings" | "current"}
        balance={Number(primaryAccount.balance)}
        currency={primaryAccount.currency ?? "NGN"}
      />

      {/* Quick Stats — side by side on mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center">
              <TrendingUp size={13} className="text-[#4CAF82]" />
            </div>
            <span className="text-xs text-[#8A8682]">Total Credits</span>
          </div>
          <p className="text-lg font-semibold text-[#4CAF82]">{formatCurrency(totalCredits)}</p>
          <p className="text-[10px] text-[#555250] mt-0.5">This month</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#E05252]/10 flex items-center justify-center">
              <TrendingDown size={13} className="text-[#E05252]" />
            </div>
            <span className="text-xs text-[#8A8682]">Total Debits</span>
          </div>
          <p className="text-lg font-semibold text-[#E05252]">{formatCurrency(totalDebits)}</p>
          <p className="text-[10px] text-[#555250] mt-0.5">This month</p>
        </div>
      </div>

      {/* Spending Chart */}
      <SpendingChart
        data={[
          { label: "Aug", amount: 45000 },
          { label: "Sep", amount: 62000 },
          { label: "Oct", amount: 38000 },
          { label: "Nov", amount: 71000 },
          { label: "Dec", amount: 55000 },
          { label: "Jan", amount: 89000, isCurrentMonth: true },
        ]}
        title="Monthly Spending (6 months)"
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions — table scrolls on mobile */}
      <div className="rounded-xl border border-[#2A2A2A] overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left px-4 py-3 text-xs text-[#555250] font-medium uppercase tracking-wider">Transaction</th>
              <th className="text-right px-4 py-3 text-xs text-[#555250] font-medium uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <TransactionRow
                  key={t.id}
                  date={t.createdAt}
                  description={t.description}
                  reference={t.reference}
                  amount={t.amount}
                  type={t.type as "credit" | "debit"}
                  status={t.status as "completed" | "pending" | "failed"}
                />
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-sm text-[#8A8682] text-center py-8">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
