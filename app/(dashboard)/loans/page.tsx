"use client";

import { useState, useEffect } from "react";
import { Landmark, Briefcase, Home, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils";

interface LoanApplication {
  id: string;
  userId: string;
  accountId: string;
  loanType: string;
  amount: string;
  tenure: number;
  purpose: string | null;
  status: string;
  createdAt: string;
}

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: string;
}

const loanTypes = [
  { value: "personal", label: "Personal Loan", icon: Briefcase, rate: "From 12% APR", max: "Up to ₦5,000,000" },
  { value: "business", label: "Business Loan", icon: Landmark, rate: "From 15% APR", max: "Up to ₦50,000,000" },
  { value: "mortgage", label: "Mortgage", icon: Home, rate: "From 9% APR", max: "Up to ₦100,000,000" },
];

const tenureOptions = [3, 6, 12, 18, 24, 36];

export default function LoansPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [purpose, setPurpose] = useState("");
  const [accountId, setAccountId] = useState("");
  const [formError, setFormError] = useState("");

  // Amount validation
  const parsedAmount = parseFloat(amount) || 0;
  const amountError = amount && (isNaN(parsedAmount) || parsedAmount <= 0)
    ? "Amount must be a positive number"
    : amount && parsedAmount < 10000
    ? "Minimum loan amount is ₦10,000"
    : "";

  const amountPattern = {
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowed = ["Backspace","Delete","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","."];
      if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if ((val.match(/\./g) || []).length > 1) return;
      if (val.includes(".") && val.split(".")[1].length > 2) return;
      setAmount(val);
    },
  };

  const statusIcon: Record<string, typeof CheckCircle> = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const statusColor: Record<string, string> = {
    pending: "text-yellow-500",
    approved: "text-success",
    rejected: "text-red-500",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [acctsRes, loansRes] = await Promise.all([
          fetch("/api/accounts"),
          fetch("/api/loans/apply"),
        ]);

        if (acctsRes?.ok) {
          const acctsData = await acctsRes.json();
          if (acctsData.accounts) setAccounts(acctsData.accounts);
        }

        if (loansRes?.ok) {
          const loansData = await loansRes.json();
          if (loansData.applications) setApplications(loansData.applications);
        }
      } catch {}
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!loanType || !amount || !tenure || !accountId) {
      setFormError("All fields are required.");
      return;
    }

    if (parsedAmount < 10000) {
      setFormError("Minimum loan amount is ₦10,000.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanType,
          amount,
          tenure: parseInt(tenure),
          purpose: purpose || undefined,
          accountId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Application failed");
        setSubmitting(false);
        return;
      }

      toast({
        title: "Application Submitted",
        description: data.message || "We will review and respond within 2–3 business days.",
        variant: "success",
      });

      setShowForm(false);
      setLoanType("");
      setAmount("");
      setTenure("");
      setPurpose("");
      setAccountId("");

      // Reload applications
      const loansRes = await fetch("/api/loans/apply");
      if (loansRes.ok) {
        const loansData = await loansRes.json();
        if (loansData.applications) setApplications(loansData.applications);
      }
    } catch {
      setFormError("An unexpected error occurred.");
    }
    setSubmitting(false);
  };

  const openApplyForm = async () => {
    setShowForm(true);
    // Load accounts when opening the form
    try {
      const res = await fetch("/api/loans/apply");
      // This won't give us accounts. The server page should pass accounts.
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Loans</h1>
          <p className="text-sm text-text-secondary mt-1">Apply for a loan or view your applications</p>
        </div>
        <Button variant="accent" onClick={openApplyForm}>
          Apply for Loan
        </Button>
      </div>

      {/* Loan Types */}
      <div className="grid gap-6 md:grid-cols-3">
        {loanTypes.map((loan) => {
          const Icon = loan.icon;
          return (
            <div
              key={loan.value}
              className="rounded-lg border border-border bg-bg-elevated p-6 flex flex-col"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-base mb-4">
                <Icon className="h-6 w-6 text-accent-gold" />
              </div>
              <h3 className="text-lg font-medium mb-2">{loan.label}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">
                {loan.value === "personal" && "Get quick access to funds for personal needs. Flexible repayment terms from 3 to 24 months."}
                {loan.value === "business" && "Grow your business with tailored financing solutions. Competitive rates for SMEs and corporates."}
                {loan.value === "mortgage" && "Make your dream home a reality with our flexible mortgage plans for residential properties."}
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Interest Rate</span>
                  <span className="font-medium">{loan.rate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Maximum</span>
                  <span className="font-medium">{loan.max}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => { setLoanType(loan.value); openApplyForm(); }}>
                Apply Now
              </Button>
            </div>
          );
        })}
      </div>

      {/* Loan Application Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for a Loan</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit your loan application.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((lt) => (
                    <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="10000"
                step="0.01"
                placeholder="10000"
                value={amount}
                onKeyDown={amountPattern.onKeyDown}
                onChange={amountPattern.onChange}
                required
              />
              {amountError && <p className="text-xs text-red-500">{amountError}</p>}
              {!amountError && parsedAmount >= 10000 && (
                <p className="text-xs text-success">Eligible amount</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (Months)</Label>
              <Select value={tenure} onValueChange={setTenure}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repayment period" />
                </SelectTrigger>
                <SelectContent>
                  {tenureOptions.map((t) => (
                    <SelectItem key={t} value={t.toString()}>{t} months</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">Disburse to Account</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length > 0 ? accounts.map((acct) => (
                    <SelectItem key={acct.id} value={acct.id}>
                      {acct.accountType} - {acct.accountNumber} ({formatCurrency(parseFloat(acct.balance))})
                    </SelectItem>
                  )) : (
                    <SelectItem value="placeholder" disabled>No accounts found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose (Optional)</Label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-text-primary"
                rows={2}
                placeholder="What will the loan be used for?"
              />
            </div>

            {formError && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
                {formError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="accent"
              disabled={submitting || !!amountError || !loanType || !tenure || !accountId}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Past Applications */}
      <div>
        <h3 className="text-base font-medium mb-4">Your Loan Applications</h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-text-secondary" />
          </div>
        ) : applications.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-surface border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tenure</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => {
                  const StatusIcon = statusIcon[app.status] || Clock;
                  return (
                    <tr key={app.id} className="bg-bg-elevated">
                      <td className="px-4 py-3 capitalize">{app.loanType}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(parseFloat(app.amount))}</td>
                      <td className="px-4 py-3">{app.tenure} months</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs capitalize ${statusColor[app.status] || "text-text-secondary"}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {app.createdAt ? formatDate(app.createdAt) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-border bg-bg-elevated">
            <Landmark className="h-8 w-8 text-text-secondary mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No loan applications yet</p>
          </div>
        )}
      </div>

      {/* Eligibility section */}
      <div className="rounded-lg border border-border bg-bg-elevated p-6">
        <h3 className="text-base font-medium mb-4">Eligibility Criteria</h3>
        <ul className="space-y-3 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Must have an active Vaulté account for at least 6 months
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Regular income deposits into your Vaulté account
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Good transaction history with no defaults
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Valid government-issued ID and proof of address
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold mt-0.5">•</span>
            Minimum monthly income of ₦100,000 for personal loans
          </li>
        </ul>
      </div>
    </div>
  );
}
