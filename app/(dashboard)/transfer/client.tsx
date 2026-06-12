"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeftRight, CheckCircle } from "lucide-react";
import type { Account } from "@/lib/schema";

interface TransferClientProps {
  accounts: (Omit<Account, "balance"> & { balance: string })[];
}

export function TransferClient({ accounts }: TransferClientProps) {
  const { toast } = useToast();
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ reference: string; newBalance: string } | null>(null);

  const selectedAccount = accounts.find((a) => a.id === fromAccountId);
  const balance = selectedAccount ? parseFloat(selectedAccount.balance) : 0;
  const transferAmount = parseFloat(amount) || 0;
  const exceedsBalance = transferAmount > balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fromAccountId || !toAccountNumber || !amount) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (transferAmount <= 0) {
      setError("Amount must be greater than zero.");
      setLoading(false);
      return;
    }

    if (exceedsBalance) {
      setError("Insufficient balance.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAccountId, toAccountNumber, amount, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transfer failed");
        setLoading(false);
        return;
      }

      setSuccess({ reference: data.reference, newBalance: data.newBalance });
      toast({
        title: "Transfer successful",
        description: `Reference: ${data.reference}`,
        variant: "success",
      });
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-medium mb-2">Transfer Completed</h2>              <p className="text-sm text-text-secondary mb-2">
              Transaction Reference: <span className="font-mono text-text-primary">{success.reference}</span>
            </p>              <p className="text-sm text-text-secondary mb-6">
              New Balance: <span className="font-medium text-text-primary">{formatCurrency(parseFloat(success.newBalance))}</span>
            </p>
            <Button
              variant="accent"
              onClick={() => {
                setSuccess(null);
                setAmount("");
                setToAccountNumber("");
                setDescription("");
                setFromAccountId("");
              }}
            >
              Make Another Transfer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium">Transfer</h1>
        <p className="text-sm text-text-secondary mt-1">Send money to another account</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowLeftRight className="h-5 w-5 text-accent-gold" />
            New Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountType} - {account.accountNumber} ({formatCurrency(parseFloat(account.balance))})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAccount && (
                <p className="text-xs text-text-secondary">Balance: {formatCurrency(balance)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAccount">Recipient Account Number</Label>
              <Input
                id="toAccount"
                placeholder="Enter 10-digit account number"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {exceedsBalance && (
                <p className="text-xs text-red-500">Amount exceeds available balance</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Narration</Label>
              <Input
                id="description"
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="accent"
              disabled={loading || !fromAccountId || !toAccountNumber || !amount || exceedsBalance}
            >
              {loading ? "Processing..." : "Send Transfer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
