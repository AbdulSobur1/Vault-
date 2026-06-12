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
    <div className="space-y-8">
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
        accountType={primaryAccount.accountType}
        balance={primaryAccount.balance}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Credits (Month)</p>
              <p className="text-lg font-medium text-success">{formatCurrency(totalCredits)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Debits (Month)</p>
              <p className="text-lg font-medium text-red-500">{formatCurrency(totalDebits)}</p>
            </div>
          </div>
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

      {/* Recent Transactions */}
      <div className="rounded-lg border border-border bg-bg-elevated">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">Recent Transactions</h3>
          <Link
            href="/transactions"
            className="text-xs text-accent-gold flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
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
            <p className="text-sm text-text-secondary text-center py-8">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
