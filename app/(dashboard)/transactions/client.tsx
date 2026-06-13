"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Account } from "@/lib/schema";

interface Transaction {
  id: string;
  amount: string;
  description: string | null;
  reference: string;
  type: string;
  status: string;
  createdAt: string;
}

interface TransactionsClientProps {
  accounts: (Omit<Account, "balance"> & { balance: string })[];
}

export function TransactionsClient({ accounts }: TransactionsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedAccountId, setSelectedAccountId] = useState(
    searchParams.get("accountId") || accounts[0]?.id || ""
  );
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async () => {
    if (!selectedAccountId) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        accountId: selectedAccountId,
        page: page.toString(),
        limit: "10",
      });
      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }

      const res = await fetch(`/api/transactions?${params}`);
      const data = await res.json();

      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId, typeFilter, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Transactions</h1>
        <p className="text-sm text-text-secondary mt-1">View your transaction history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedAccountId} onValueChange={(v) => { setSelectedAccountId(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.accountType} - {account.accountNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="credit">Credits</SelectItem>
            <SelectItem value="debit">Debits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="rounded-lg border border-border bg-bg-elevated">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-secondary">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-border">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                date={t.createdAt}
                description={t.description}
                reference={t.reference}
                amount={t.amount}
                type={t.type as "credit" | "debit"}
                status={t.status as "completed" | "pending" | "failed"}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-text-secondary">No transactions found</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <span className="text-sm text-text-secondary">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={transactions.length < 10}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
