"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface BalanceCardProps {
  accountNumber: string;
  accountType: string;
  balance: string;
}

export function BalanceCard({ accountNumber, accountType, balance }: BalanceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated text-text-primary p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {accountType} Account
        </span>
        <span className="text-xs font-mono text-text-secondary">{accountNumber}</span>
      </div>

      <div className="mb-2">
        <p className="text-xs text-text-secondary mb-1">Available Balance</p>
        <p className="text-3xl font-medium text-accent-gold">
          {formatCurrency(parseFloat(balance))}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 text-text-primary hover:bg-white/10"
          asChild
        >
          <Link href="/transfer">Fund Account</Link>
        </Button>
        <Button
          variant="accent"
          size="sm"
          asChild
        >
          <Link href="/transfer">Transfer</Link>
        </Button>
      </div>
    </div>
  );
}
