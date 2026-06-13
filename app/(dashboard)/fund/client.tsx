"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { AmountInput } from "@/components/ui/AmountInput";
import { Wallet, CheckCircle, Banknote, CreditCard as CreditCardIcon } from "lucide-react";

import type { Account } from "@/lib/schema";

const FUNDING_FEE_RATE = 0.015; // 1.5%
const FUNDING_FEE_CAP = 2000; // ₦2,000 cap

const calculateFee = (amount: number) => {
  const fee = Math.min(amount * FUNDING_FEE_RATE, FUNDING_FEE_CAP);
  return { fee, totalDeducted: fee, amountCredited: amount - fee };
};

export function FundClient({ accounts }: { accounts: (Omit<Account, "balance"> & { balance: string })[] }) {
  const { toast } = useToast();
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "card">("bank");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ newBalance: string } | null>(null);
  const [error, setError] = useState("");

  const selectedAccount = accounts.find((a) => a.id === accountId);
  const fundAmount = parseFloat(amount) || 0;
  const feeBreakdown = fundAmount > 0 ? calculateFee(fundAmount) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accountId || !amount) {
      setError("Please select an account and enter an amount.");
      return;
    }

    if (fundAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          amount: fundAmount.toString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Funding failed");
        setLoading(false);
        return;
      }

      setSuccess({ newBalance: data.newBalance || selectedAccount!.balance });
      toast({
        title: "Account funded successfully",
        description: `₦${parseFloat(amount).toLocaleString()} has been added to your account.`,
        variant: "success",
      });
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (success) {
    const grossAmount = fundAmount;
    const finalFee = feeBreakdown?.fee || 0;
    const creditedAmount = feeBreakdown?.amountCredited || grossAmount;

    return (
      <div className="max-w-lg mx-auto mt-12">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-medium mb-2">Account Funded</h2>
            <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2 text-sm text-left mb-6 mx-auto max-w-xs">
              <div className="flex justify-between">
                <span className="text-[#555250]">Amount entered</span>
                <span className="text-white">{formatCurrency(grossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555250]">Processing fee</span>
                <span className="text-[#E05252]">− {formatCurrency(finalFee)}</span>
              </div>
              <div className="border-t border-[#2A2A2A] pt-2 flex justify-between font-medium">
                <span className="text-[#555250]">Credited</span>
                <span className="text-[#4CAF82]">{formatCurrency(creditedAmount)}</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              New Balance: <span className="font-medium text-text-primary">{formatCurrency(parseFloat(success.newBalance))}</span>
            </p>
            <Button
              variant="accent"
              onClick={() => {
                setSuccess(null);
                setAmount("");
                setAccountId("");
              }}
            >
              Fund Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Fund Account</h1>
        <p className="text-sm text-text-secondary mt-1">Add money to your Vaulté account</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-5 w-5 text-accent-gold" />
            Top Up
          </CardTitle>
          <CardDescription>
            This is a simulated top-up for demo purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fundAccount">Select Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose account to fund" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountType} - {account.accountNumber} ({formatCurrency(parseFloat(account.balance))})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <AmountInput
                value={amount}
                onChange={setAmount}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Funding Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("bank")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-colors ${
                    method === "bank"
                      ? "border-accent-gold bg-accent-gold/5 text-accent-gold"
                      : "border-border bg-transparent text-text-secondary hover:border-accent-gold/50"
                  }`}
                >
                  <Banknote className="h-6 w-6" />
                  <span className="font-medium">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-colors ${
                    method === "card"
                      ? "border-accent-gold bg-accent-gold/5 text-accent-gold"
                      : "border-border bg-transparent text-text-secondary hover:border-accent-gold/50"
                  }`}
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <span className="font-medium">Debit Card</span>
                </button>
              </div>
            </div>

            {method === "bank" && (
              <div className="rounded-lg border border-border bg-bg-surface p-4 space-y-2">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Bank Transfer Details</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-text-secondary">Bank:</span> Vaulté Financial Bank</p>
                  <p><span className="text-text-secondary">Account:</span> {selectedAccount?.accountNumber || "Select an account"}</p>
                  <p><span className="text-text-secondary">Name:</span> Your Name</p>
                </div>
                <p className="text-xs text-text-secondary italic mt-2">
                  Simulated — no real transfer will occur.
                </p>
              </div>
            )}

            {method === "card" && (
              <div className="rounded-lg border border-border bg-bg-surface p-4 space-y-3">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Card Details</p>
                <Input placeholder="Card number" value="4242 4242 4242 4242" readOnly className="text-text-secondary" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" value="12/28" readOnly className="text-text-secondary" />
                  <Input placeholder="CVV" value="123" readOnly className="text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary italic">
                  Simulated — no real payment will be processed.
                </p>
              </div>
            )}

            {/* Fee breakdown */}
            {feeBreakdown && fundAmount > 0 && (
              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2 text-xs mt-1">
                <div className="flex justify-between text-[#555250]">
                  <span>Amount entered</span>
                  <span className="text-white">{formatCurrency(fundAmount)}</span>
                </div>
                <div className="flex justify-between text-[#555250]">
                  <span>Processing fee (1.5%, max ₦2,000)</span>
                  <span className="text-[#E05252]">− {formatCurrency(feeBreakdown.fee)}</span>
                </div>
                <div className="border-t border-[#2A2A2A] pt-2 flex justify-between font-medium">
                  <span className="text-[#555250]">You will receive</span>
                  <span className="text-[#4CAF82]">{formatCurrency(feeBreakdown.amountCredited)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="accent"
              disabled={loading || !accountId || !amount || fundAmount <= 0}
            >
              {loading ? "Processing..." : "Complete Funding"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
