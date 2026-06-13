"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/lib/currencies";
import { useToast } from "@/components/ui/toast";
import { AmountInput } from "@/components/ui/AmountInput";

export function FXConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [fromAmount, setFromAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [converting, setConverting] = useState(false);
  const { toast } = useToast();

  // Debounced quote fetch
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
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
      // Silently fail — quote will just not show
    } finally {
      setLoadingQuote(false);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setQuote(null);
  };

  const handleConvert = async () => {
    if (!quote) return;
    setConverting(true);
    try {
      const res = await fetch("/api/fx/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCurrency, toCurrency, fromAmount: parseFloat(fromAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Conversion successful",
          description: `${formatCurrency(parseFloat(fromAmount), fromCurrency)} → ${formatCurrency(
            data.conversion.toAmount,
            toCurrency
          )}`,
          variant: "success",
        });
        setFromAmount("");
        setQuote(null);
      } else {
        toast({
          title: "Conversion failed",
          description: data.error,
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Conversion failed",
        description: "An unexpected error occurred",
        variant: "error",
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 space-y-4">
      <h2 className="text-sm font-medium text-[#8A8682] uppercase tracking-wider">Currency Converter</h2>

      {/* From */}
      <div className="space-y-2">
        <label className="text-xs text-[#555250]">You send</label>
        <div className="flex gap-2">
          <select
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              setQuote(null);
            }}
            className="w-28 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <AmountInput
            value={fromAmount}
            onChange={setFromAmount}
            placeholder="0.00"
            className="flex-1"
          />
        </div>
      </div>

      {/* Swap button */}
      <div className="relative flex items-center justify-center my-1">
        {/* Horizontal line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-[#2A2A2A]" />
        {/* Swap button sits on the line */}
        <button
          onClick={handleSwap}
          type="button"
          className="relative z-10 w-8 h-8 rounded-full border border-[#2A2A2A] bg-[#161616] flex items-center justify-center text-[#8A8682] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors"
        >
          <ArrowLeftRight size={14} />
        </button>
      </div>

      {/* To */}
      <div className="space-y-2">
        <label className="text-xs text-[#555250]">They receive</label>
        <div className="flex gap-2">
          <select
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              setQuote(null);
            }}
            className="w-28 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white flex items-center">
            {loadingQuote ? (
              <Loader2 size={14} className="animate-spin text-[#555250]" />
            ) : (
              <span className={quote ? "text-white" : "text-[#555250]"}>
                {quote ? formatCurrency(quote.toAmount, toCurrency) : "0.00"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rate breakdown */}
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
          <div className="flex justify-between text-[#555250]">
            <span>Mid-market rate</span>
            <span className="text-[#555250] font-mono">
              1 {fromCurrency} = {quote.midRate.toFixed(4)} {toCurrency}
            </span>
          </div>
          <div className="border-t border-[#2A2A2A] pt-2 flex justify-between">
            <span className="text-[#555250]">You receive</span>
            <span className="text-[#C9A84C] font-semibold">{formatCurrency(quote.toAmount, toCurrency)}</span>
          </div>
        </div>
      )}

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={!quote || converting || loadingQuote}
        className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {converting && <Loader2 size={14} className="animate-spin" />}
        {converting ? "Converting..." : "Convert Now"}
      </button>
    </div>
  );
}
