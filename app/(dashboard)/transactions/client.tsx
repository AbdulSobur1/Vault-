"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { TransactionReceipt } from "@/components/dashboard/TransactionReceipt";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Account } from "@/lib/schema";

interface Transaction {
  id: string;
  amount: string;
  description: string | null;
  reference: string;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  createdAt: string;
  accountId: string;
  // Optional receipt enrichment fields
  accountNumber?: string;
  accountType?: string;
  counterpartyName?: string | null;
  counterpartyAccount?: string | null;
}

interface TransactionsClientProps {
  accounts: (Omit<Account, "balance"> & { balance: string })[];
  userName: string;
}

export function TransactionsClient({ accounts, userName }: TransactionsClientProps) {
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const handleSelectTransaction = async (txn: Transaction) => {
    setSelectedTransaction(txn); // show sheet immediately with basic data

    // Then enrich with full details
    try {
      const res = await fetch(`/api/transactions/${txn.id}`);
      const full = await res.json();
      setSelectedTransaction(full); // update with counterparty info
    } catch {
      // Sheet already shows basic data — fail silently
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Transactions</h1>
        <p className="text-sm text-[#8A8682] mt-1">View your transaction history</p>
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
      <div className="rounded-lg border border-[#2A2A2A] bg-[#111113]">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#8A8682]">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-[#2A2A2A]">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                date={t.createdAt}
                description={t.description}
                reference={t.reference}
                amount={t.amount}
                type={t.type as "credit" | "debit"}
                status={t.status as "completed" | "pending" | "failed"}
                onClick={() => handleSelectTransaction(t)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[#8A8682]">No transactions found</div>
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
        <span className="text-sm text-[#8A8682]">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={transactions.length < 10}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Receipt sheet — rendered outside the list, overlays everything */}
      <TransactionReceipt
        transaction={selectedTransaction}
        userName={userName}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
