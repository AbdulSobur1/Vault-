"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeftRight, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import type { Account } from "@/lib/schema";

interface TransferClientProps {
  accounts: (Omit<Account, "balance"> & { balance: string })[];
}

interface VerifiedAccount {
  accountNumber: string;
  accountType: string;
  accountName: string;
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

  // Recipient verification state
  const [verifying, setVerifying] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<VerifiedAccount | null>(null);
  const [verifyError, setVerifyError] = useState("");

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === fromAccountId);
  const balance = selectedAccount ? parseFloat(selectedAccount.balance) : 0;
  const transferAmount = parseFloat(amount) || 0;
  const exceedsBalance = transferAmount > balance;
  const isOwnAccount = !!(verifiedAccount && selectedAccount?.accountNumber === verifiedAccount.accountNumber);

  // Amount input validation (FIX 9)
  const handleAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace","Delete","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","."];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if ((val.match(/\./g) || []).length > 1) return;
    if (val.includes(".") && val.split(".")[1].length > 2) return;
    setAmount(val);
  }, []);

  // Verify recipient account
  const verifyRecipient = useCallback(async (accountNumber: string) => {
    if (accountNumber.length !== 10) {
      setVerifiedAccount(null);
      setVerifyError("");
      return;
    }

    setVerifying(true);
    setVerifyError("");

    try {
      const res = await fetch(`/api/accounts/verify?accountNumber=${accountNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setVerifyError(data.error || "Account not found. Check the number and try again.");
        setVerifiedAccount(null);
      } else {
        setVerifiedAccount(data);

        // Check self-transfer
        if (selectedAccount?.accountNumber === data.accountNumber) {
          setVerifyError("You cannot transfer to your own account.");
        }
      }
    } catch {
      setVerifyError("Failed to verify account. Please try again.");
      setVerifiedAccount(null);
    }

    setVerifying(false);
  }, [selectedAccount]);

  // Handle account number change
  const handleAccountNumberChange = useCallback((value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setToAccountNumber(digits);

    // Auto-verify when 10 digits entered
    if (digits.length === 10) {
      verifyRecipient(digits);
    } else {
      setVerifiedAccount(null);
      setVerifyError("");
    }
  }, [verifyRecipient]);

  // Handle from account change - re-verify if we already have a verified recipient
  const handleFromAccountChange = useCallback((value: string) => {
    setFromAccountId(value);

    // Re-check self-transfer if we have a verified recipient
    const newAccount = accounts.find((a) => a.id === value);
    if (verifiedAccount && newAccount?.accountNumber === verifiedAccount.accountNumber) {
      setVerifyError("You cannot transfer to your own account.");
    } else if (verifiedAccount) {
      setVerifyError("");
    }
  }, [accounts, verifiedAccount]);

  // Open confirmation modal
  const handleReviewTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fromAccountId || !toAccountNumber || !amount) {
      setError("All fields are required.");
      return;
    }

    if (transferAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (exceedsBalance) {
      setError("Insufficient funds.");
      return;
    }

    if (!verifiedAccount) {
      setError("Please verify the recipient account first.");
      return;
    }

    if (isOwnAccount) {
      setError("You cannot transfer to your own account.");
      return;
    }

    setShowConfirm(true);
  };

  // Execute transfer after confirmation
  const handleConfirmTransfer = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");

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
            <h2 className="text-xl font-medium mb-2">Transfer Completed</h2>
            <p className="text-sm text-text-secondary mb-2">
              Transaction Reference: <span className="font-mono text-text-primary">{success.reference}</span>
            </p>
            <p className="text-sm text-text-secondary mb-6">
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
                setVerifiedAccount(null);
                setVerifyError("");
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
        <p className="text-sm text-text-secondary mt-1">Send money to another Vaulté account</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowLeftRight className="h-5 w-5 text-accent-gold" />
            New Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReviewTransfer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccountId} onValueChange={handleFromAccountChange}>
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
                <p className="text-xs text-text-secondary">Available Balance: {formatCurrency(balance)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAccount">Recipient Account Number</Label>
              <Input
                id="toAccount"
                placeholder="Enter 10-digit account number"
                value={toAccountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                maxLength={10}
                required
                className={verifiedAccount ? "border-success/50 focus-visible:ring-success" : verifyError ? "border-red-500/50 focus-visible:ring-red-500" : ""}
              />
              {/* Verification status */}
              {verifying && (
                <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Verifying account...
                </div>
              )}
              {verifiedAccount && !verifyError && (
                <div className="flex items-center gap-1.5 text-xs text-success mt-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="font-medium">{verifiedAccount.accountName}</span>
                  <span className="text-text-secondary">— {verifiedAccount.accountType} Account</span>
                </div>
              )}
              {verifyError && (
                <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {verifyError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onKeyDown={handleAmountKeyDown}
                onChange={handleAmountChange}
                required
              />
              {exceedsBalance && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Insufficient funds
                </p>
              )}
              {transferAmount > 0 && !exceedsBalance && selectedAccount && (
                <p className="text-xs text-text-secondary mt-1">
                  Balance after transfer: {formatCurrency(balance - transferAmount)}
                </p>
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
              disabled={loading || !fromAccountId || !toAccountNumber || !amount || exceedsBalance || !!verifyError || !verifiedAccount || isOwnAccount}
            >
              {loading ? "Processing..." : "Review Transfer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="rounded-lg border border-border bg-bg-surface p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Amount</span>
                <span className="text-lg font-medium">{formatCurrency(transferAmount)}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Recipient</span>
                <span className="text-sm font-medium">{verifiedAccount?.accountName || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Account</span>
                <span className="text-sm font-mono font-medium">{toAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">From</span>
                <span className="text-sm font-medium">{selectedAccount?.accountType} Account</span>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Narration</span>
                  <span className="text-sm text-right max-w-[200px] truncate">{description}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="accent" className="flex-1" onClick={handleConfirmTransfer}>
                Confirm Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
