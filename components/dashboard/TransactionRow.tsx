"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface TransactionRowProps {
  date: Date | string;
  description: string | null;
  reference: string;
  amount: string;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
}

export function TransactionRow({
  date,
  description,
  reference,
  amount,
  type,
  status,
}: TransactionRowProps) {
  const isCredit = type === "credit";

  const statusVariant = {
    completed: "success" as const,
    pending: "warning" as const,
    failed: "danger" as const,
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-surface dark:hover:bg-dark-card rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full ${
            isCredit ? "bg-success/10" : "bg-danger/10"
          }`}
        >
          {isCredit ? (
            <ArrowUpRight className="h-4 w-4 text-success" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-danger" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{description || "Transfer"}</p>
          <p className="text-xs text-muted">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-sm font-medium ${
              isCredit ? "text-success" : "text-danger"
            }`}
          >
            {isCredit ? "+" : "−"}
            {formatCurrency(parseFloat(amount))}
          </p>
          <p className="text-xs text-muted font-mono">{reference.slice(0, 8)}...</p>
        </div>
        <Badge variant={statusVariant[status]}>{status}</Badge>
      </div>
    </div>
  );
}
