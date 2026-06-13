"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, Download } from "lucide-react";
import { SUPPORTED_CURRENCIES, formatCurrency, getCurrency } from "@/lib/currencies";
import { countries } from "@/lib/countries";
import { useToast } from "@/components/ui/toast";

export default function InternationalTransferPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [wallets, setWallets] = useState<any[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [step, setStep] = useState<"form" | "review" | "success">("form");

  // Form fields
  const [fromCurrency, setFromCurrency] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [narration, setNarration] = useState("");

  // FX quote
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  // Determine toCurrency from recipient country
  const selectedCountry = countries.find((c) => c.name === recipientCountry);
  const toCurrency = selectedCountry?.currency || "";

  // Fetch wallets
  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((data) => {
        setWallets(data.wallets ?? []);
        if (data.wallets?.length > 0) setFromCurrency(data.wallets[0].currency);
      })
      .finally(() => setLoadingWallets(false));
  }, []);

  // Debounced FX quote
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !toCurrency) {
      setQuote(null);
      return;
    }
    const timer = setTimeout(fetchQuote, 600);
    return () => clearTimeout(timer);
  }, [fromAmount, fromCurrency, toCurrency]);

  const fetchQuote = useCallback(async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch(
        `/api/exchange-rates/convert?from=${fromCurrency}&to=${toCurrency}&amount=${fromAmount}`
      );
      const data = await res.json();
      if (res.ok) setQuote(data);
    } catch {
      // Silently fail
    } finally {
      setLoadingQuote(false);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const selectedWallet = wallets.find((w) => w.currency === fromCurrency);
  const balance = selectedWallet ? parseFloat(selectedWallet.balance) : 0;
  const parsedAmount = parseFloat(fromAmount) || 0;
  const exceedsBalance = parsedAmount > balance;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fromCurrency || !fromAmount || !recipientName || !recipientAccount || !recipientCountry) {
      setError("Please fill in all required fields.");
      return;
    }
    if (parsedAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (exceedsBalance) {
      setError("Insufficient balance.");
      return;
    }
    if (!toCurrency) {
      setError("Could not determine destination currency for this country.");
      return;
    }
    if (!quote) {
      setError("Please wait for the exchange rate to load.");
      return;
    }

    setStep("review");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/transfer/international", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          fromAmount: parsedAmount,
          recipientName,
          recipientBank: recipientBank || undefined,
          recipientAccount,
          recipientCountry,
          swiftCode: swiftCode || undefined,
          routingNumber: routingNumber || undefined,
          narration: narration || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Transfer failed");
        setSubmitting(false);
        return;
      }

      setSuccessData(data);
      setStep("success");
      toast({
        title: "Transfer submitted",
        description: `Reference: ${data.reference}`,
        variant: "success",
      });
    } catch {
      setError("An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFromAmount("");
    setRecipientName("");
    setRecipientCountry("");
    setRecipientAccount("");
    setRecipientBank("");
    setSwiftCode("");
    setRoutingNumber("");
    setNarration("");
    setQuote(null);
    setError("");
    setStep("form");
    setSuccessData(null);
  };

  if (loadingWallets) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-[#555250]" />
      </div>
    );
  }

  // Success screen
  if (step === "success" && successData) {
    const conv = successData.conversion;
    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Transfer Submitted</h2>
          <p className="text-sm text-[#8A8682] mb-6">{successData.message}</p>

          <div className="bg-[#0F0F0F] rounded-lg p-5 space-y-3 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-[#555250]">Reference</span>
              <span className="text-white font-mono text-xs">{successData.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Amount sent</span>
              <span className="text-white font-medium">
                {formatCurrency(parsedAmount, fromCurrency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Amount received</span>
              <span className="text-white font-medium">
                {formatCurrency(conv.toAmount, toCurrency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Exchange rate</span>
              <span className="text-white font-mono">
                1 {fromCurrency} = {conv.clientRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Recipient</span>
              <span className="text-white text-right max-w-[200px] truncate">{recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Estimated arrival</span>
              <span className="text-white">{successData.estimatedArrival}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetForm}
              className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-white text-sm font-medium hover:bg-[#1C1C1C] transition-colors"
            >
              New Transfer
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fromFlag = getCurrency(fromCurrency)?.flag || "";
  const toFlag = getCurrency(toCurrency)?.flag || "";
  const selectedCountryName = selectedCountry?.name || recipientCountry;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#8A8682] hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <h1 className="text-xl font-semibold text-white">International Transfer</h1>
        <p className="text-sm text-[#8A8682] mt-1">Send money abroad in any currency</p>
      </div>

      <form onSubmit={handleReview} className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 space-y-5">
        {/* From wallet */}
        <div className="space-y-2">
          <label className="text-xs text-[#555250]">From Wallet</label>
          <select
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              setQuote(null);
            }}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
          >
            {wallets.map((w) => {
              const info = getCurrency(w.currency);
              return (
                <option key={w.currency} value={w.currency}>
                  {info?.flag || ""} {w.currency} — {formatCurrency(parseFloat(w.balance), w.currency)}
                </option>
              );
            })}
          </select>
          {selectedWallet && (
            <p className="text-xs text-[#555250]">
              Available: {formatCurrency(balance, fromCurrency)}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs text-[#555250]">Amount to send</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white">
              <span className="text-lg leading-none">{fromFlag}</span>
              <span className="font-medium">{fromCurrency}</span>
            </div>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          {exceedsBalance && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={12} />
              Insufficient funds
            </p>
          )}
        </div>

        {/* Recipient receives — live quote */}
        {toCurrency && (
          <div className="space-y-2">
            <label className="text-xs text-[#555250]">Recipient receives</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white">
                <span className="text-lg leading-none">{toFlag}</span>
                <span className="font-medium">{toCurrency}</span>
              </div>
              <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white flex items-center">
                {loadingQuote ? (
                  <Loader2 size={14} className="animate-spin text-[#555250]" />
                ) : quote ? (
                  <span className="text-white font-medium">
                    {formatCurrency(quote.toAmount, toCurrency)}
                  </span>
                ) : (
                  <span className="text-[#555250]">
                    {fromAmount ? "Enter an amount..." : "0.00"}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-[#2A2A2A]" />

        {/* Recipient details */}
        <div className="space-y-2">
          <label className="text-xs text-[#555250]">Recipient Full Name *</label>
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Full legal name"
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#555250]">Recipient Country *</label>
          <select
            value={recipientCountry}
            onChange={(e) => setRecipientCountry(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            required
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#555250]">
            Account Number / IBAN *
          </label>
          <input
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            placeholder="Recipient's account or IBAN number"
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#555250]">Bank Name (Optional)</label>
          <input
            value={recipientBank}
            onChange={(e) => setRecipientBank(e.target.value)}
            placeholder="Recipient's bank name"
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        {/* SWIFT code — shown for international */}
        <div className="space-y-2">
          <label className="text-xs text-[#555250]">SWIFT / BIC Code (Optional)</label>
          <input
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
            placeholder="e.g. BOFAUS3N"
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        {/* Routing number — shown for USD transfers */}
        {toCurrency === "USD" && (
          <div className="space-y-2">
            <label className="text-xs text-[#555250]">Routing Number (Required for US)</label>
            <input
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder="9-digit routing number"
              className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs text-[#555250]">Narration / Description (Optional)</label>
          <textarea
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="What's this transfer for?"
            rows={2}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:border-[#C9A84C] resize-none"
          />
        </div>

        {/* Live quote breakdown (shown before review) */}
        {quote && (
          <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#555250]">
              <span>Exchange rate</span>
              <span className="text-white font-mono">
                1 {fromCurrency} = {quote.clientRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between text-[#555250]">
              <span>Vaulté fee (1.5%)</span>
              <span className="text-white">{formatCurrency(quote.spreadAmount, fromCurrency)}</span>
            </div>
            <div className="border-t border-[#2A2A2A] pt-2 flex justify-between">
              <span className="text-[#555250]">Recipient receives</span>
              <span className="text-[#C9A84C] font-semibold">
                {formatCurrency(quote.toAmount, toCurrency)}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} />
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={
            !fromCurrency ||
            !fromAmount ||
            !recipientName ||
            !recipientAccount ||
            !recipientCountry ||
            exceedsBalance ||
            parsedAmount <= 0
          }
          className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Review Transfer
        </button>
      </form>

      {/* Review Dialog */}
      {step === "review" && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setStep("form")} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 max-w-md mx-auto space-y-5">
            <h3 className="text-white font-semibold">Confirm International Transfer</h3>

            <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#555250]">You send</span>
                <span className="text-white font-medium">
                  {formatCurrency(parsedAmount, fromCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555250]">Recipient receives</span>
                <span className="text-[#C9A84C] font-semibold">
                  {quote ? formatCurrency(quote.toAmount, toCurrency) : "—"}
                </span>
              </div>
              <div className="border-t border-[#2A2A2A]" />
              <div className="flex justify-between">
                <span className="text-[#555250]">Recipient</span>
                <span className="text-white text-right max-w-[180px] truncate">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555250]">Country</span>
                <span className="text-white">{selectedCountryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555250]">Account</span>
                <span className="text-white font-mono text-xs max-w-[180px] truncate text-right">
                  {recipientAccount}
                </span>
              </div>
              {recipientBank && (
                <div className="flex justify-between">
                  <span className="text-[#555250]">Bank</span>
                  <span className="text-white">{recipientBank}</span>
                </div>
              )}
              {narration && (
                <div className="flex justify-between">
                  <span className="text-[#555250]">Narration</span>
                  <span className="text-white text-right max-w-[180px] truncate">{narration}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-white text-sm font-medium hover:bg-[#1C1C1C] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
