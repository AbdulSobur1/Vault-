'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, Loader2, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_CURRENCIES, formatCurrency } from '@/lib/currencies';
import { useToast } from '@/components/ui/toast';

const SUPPORTED_COINS = [
  { code: 'ETH',  name: 'Ethereum',  symbol: 'Ξ',  color: '#627EEA' },
  { code: 'USDT', name: 'Tether',    symbol: '₮',  color: '#26A17B' },
  { code: 'USDC', name: 'USD Coin',  symbol: '$',  color: '#2775CA' },
];

type Direction = 'buy' | 'sell';
type Step = 'form' | 'confirm' | 'success';

export default function CryptoConvertPage() {
  const [direction, setDirection]   = useState<Direction>('buy');
  const [coin, setCoin]             = useState('ETH');
  const [fiatCurrency, setFiat]     = useState('NGN');
  const [inputAmount, setInput]     = useState('');
  const [quote, setQuote]           = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [step, setStep]             = useState<Step>('form');
  const [converting, setConverting] = useState(false);
  const [result, setResult]         = useState<any>(null);
  const [history, setHistory]       = useState<any[]>([]);
  const { toast } = useToast();

  // Debounced quote fetch — fires 700ms after user stops typing
  useEffect(() => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) { setQuote(null); return; }
    const timer = setTimeout(fetchQuote, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAmount, direction, coin, fiatCurrency]);

  // Fetch history on mount and after each conversion
  useEffect(() => {
    fetch('/api/crypto/convert/history')
      .then(r => r.json())
      .then(d => setHistory(d.history ?? []))
      .catch(() => {});
  }, [result]);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch(
        `/api/crypto/convert/quote?direction=${direction}&coin=${coin}&fiat=${fiatCurrency}&amount=${inputAmount}`
      );
      const data = await res.json();
      if (res.ok) setQuote(data);
      else toast({ title: 'Quote failed', description: data.error, variant: 'error' });
    } catch {
      toast({ title: 'Quote failed', description: 'Could not fetch live price', variant: 'error' });
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const res = await fetch('/api/crypto/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, coin, fiatCurrency, inputAmount: parseFloat(inputAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStep('success');
      } else {
        toast({ title: 'Conversion failed', description: data.error, variant: 'error' });
        setStep('form');
      }
    } catch {
      toast({ title: 'Conversion failed', description: 'Network error', variant: 'error' });
      setStep('form');
    } finally {
      setConverting(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setInput('');
    setQuote(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Convert</h1>
        <p className="text-sm text-[#8A8682] mt-1">Buy and sell crypto with your fiat wallets</p>
      </div>

      {/* Buy / Sell toggle */}
      <div className="flex border border-[#2A2A2A] rounded-lg p-1 bg-[#161616] w-fit">
        {(['buy', 'sell'] as Direction[]).map((dir) => (
          <button
            key={dir}
            onClick={() => { setDirection(dir); setQuote(null); setInput(''); setStep('form'); }}
            className={`px-8 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              direction === dir
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'text-[#8A8682] hover:text-white'
            }`}
          >
            {dir}
          </button>
        ))}
      </div>

      {step === 'success' && result ? (
        /* ── Success state ── */
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-8 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-[#4CAF82]" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg mb-1">Conversion Complete</h2>
            <p className="text-sm text-[#8A8682]">Your {direction === 'buy' ? 'purchase' : 'sale'} was successful</p>
          </div>
          <div className="w-full bg-[#0F0F0F] rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#555250]">You paid</span>
              <span className="text-white font-medium">{result.paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">You received</span>
              <span className="text-[#4CAF82] font-medium">{result.received}</span>
            </div>
            <div className="flex justify-between border-t border-[#2A2A2A] pt-3">
              <span className="text-[#555250]">Rate</span>
              <span className="text-[#8A8682] text-xs font-mono">{result.rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">Reference</span>
              <span className="text-[#8A8682] text-xs font-mono">{result.reference}</span>
            </div>
          </div>
          <p className="text-xs text-[#555250] text-center">
            Your {coin} will be credited to your Vaulté wallet within minutes.
            For the demo, this is simulated instantly.
          </p>
          <button
            onClick={handleReset}
            className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors"
          >
            Make another conversion
          </button>
        </div>

      ) : step === 'confirm' && quote ? (
        /* ── Confirm state ── */
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 space-y-5">
          <h2 className="text-white font-semibold">Review Conversion</h2>

          {/* Summary card */}
          <div className="bg-[#0F0F0F] rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#555250]">You {direction === 'buy' ? 'pay' : 'sell'}</span>
              <span className="text-white font-medium">
                {direction === 'buy'
                  ? formatCurrency(quote.fiatAmount, fiatCurrency)
                  : `${parseFloat(quote.cryptoAmount).toFixed(6)} ${coin}`
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555250]">You receive</span>
              <span className="text-[#4CAF82] font-semibold">
                {direction === 'buy'
                  ? `${parseFloat(quote.cryptoAmount).toFixed(6)} ${coin}`
                  : formatCurrency(quote.fiatAmount, fiatCurrency)
                }
              </span>
            </div>
            <div className="border-t border-[#2A2A2A] pt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#555250]">Market rate</span>
                <span className="text-[#555250] font-mono">
                  1 {coin} = {formatCurrency(quote.pricePerCoinFiat, fiatCurrency)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#555250]">Vaulté fee (1.5%)</span>
                <span className="text-[#E05252]">− {formatCurrency(quote.spreadAmountFiat, fiatCurrency)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#555250]">Your rate</span>
                <span className="text-white font-mono">
                  1 {coin} = {formatCurrency(quote.clientPricePerCoinFiat, fiatCurrency)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-[#8A8682] text-sm hover:bg-[#1C1C1C] transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConvert}
              disabled={converting}
              className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {converting && <Loader2 size={14} className="animate-spin" />}
              {converting ? 'Converting...' : `Confirm ${direction === 'buy' ? 'Purchase' : 'Sale'}`}
            </button>
          </div>
        </div>

      ) : (
        /* ── Form state ── */
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 space-y-5">

          {/* Coin selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#555250] uppercase tracking-wider">
              {direction === 'buy' ? 'Crypto to buy' : 'Crypto to sell'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_COINS.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCoin(c.code)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border transition-all text-sm ${
                    coin === c.code
                      ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                      : 'border-[#2A2A2A] bg-[#1C1C1C] hover:border-[#3A3A3A]'
                  }`}
                >
                  <span className="text-lg font-bold" style={{ color: c.color }}>{c.symbol}</span>
                  <span className={`text-xs font-medium ${coin === c.code ? 'text-white' : 'text-[#8A8682]'}`}>
                    {c.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fiat currency selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#555250] uppercase tracking-wider">
              {direction === 'buy' ? 'Pay with' : 'Receive in'}
            </label>
            <select
              value={fiatCurrency}
              onChange={e => { setFiat(e.target.value); setQuote(null); }}
              className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#555250] uppercase tracking-wider">
              {direction === 'buy' ? `Amount (${fiatCurrency})` : `Amount (${coin})`}
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0.00"
              value={inputAmount}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>

          {/* Live quote breakdown */}
          {loadingQuote && (
            <div className="flex items-center gap-2 text-xs text-[#555250]">
              <Loader2 size={12} className="animate-spin" />
              Getting live price...
            </div>
          )}

          {quote && !loadingQuote && (
            <div className="bg-[#0F0F0F] rounded-xl p-4 space-y-2.5">
              {/* You receive */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#555250]">You receive</span>
                <span className="text-base font-semibold text-[#4CAF82]">
                  {direction === 'buy'
                    ? `${parseFloat(quote.cryptoAmount).toFixed(6)} ${coin}`
                    : formatCurrency(quote.fiatAmount, fiatCurrency)
                  }
                </span>
              </div>

              <div className="border-t border-[#2A2A2A] pt-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#555250]">
                  <span>Market price</span>
                  <span className="font-mono">1 {coin} = {formatCurrency(quote.pricePerCoinFiat, fiatCurrency)}</span>
                </div>
                <div className="flex justify-between text-[#555250]">
                  <span>Vaulté fee (1.5%)</span>
                  <span className="text-[#E05252]">− {formatCurrency(quote.spreadAmountFiat, fiatCurrency)}</span>
                </div>
                <div className="flex justify-between text-[#555250]">
                  <span>Your rate</span>
                  <span className="text-white font-mono">1 {coin} = {formatCurrency(quote.clientPricePerCoinFiat, fiatCurrency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => setStep('confirm')}
            disabled={!quote || loadingQuote || !inputAmount}
            className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {direction === 'buy' ? `Buy ${coin}` : `Sell ${coin}`}
          </button>
        </div>
      )}

      {/* Conversion history */}
      {history.length > 0 && (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <p className="text-xs text-[#555250] uppercase tracking-wider">Conversion History</p>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {history.slice(0, 10).map((h: any) => (
              <div key={h.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    h.direction === 'buy'
                      ? 'bg-[#2D6A4F]/20 text-[#4CAF82]'
                      : 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  }`}>
                    {h.direction === 'buy' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-sm text-white capitalize">
                      {h.direction === 'buy' ? `Bought ${h.cryptoCoin}` : `Sold ${h.cryptoCoin}`}
                    </p>
                    <p className="text-xs text-[#555250] mt-0.5">
                      {new Date(h.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">
                    {h.direction === 'buy'
                      ? `+${parseFloat(h.cryptoAmount).toFixed(6)} ${h.cryptoCoin}`
                      : `+${formatCurrency(parseFloat(h.fiatAmount), h.fiatCurrency)}`
                    }
                  </p>
                  <p className="text-xs text-[#555250] mt-0.5">
                    {h.direction === 'buy'
                      ? `− ${formatCurrency(parseFloat(h.fiatAmount), h.fiatCurrency)}`
                      : `− ${parseFloat(h.cryptoAmount).toFixed(6)} ${h.cryptoCoin}`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
