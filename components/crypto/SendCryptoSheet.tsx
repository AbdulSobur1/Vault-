'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';

interface SendCryptoSheetProps {
  coin: string;
  availableBalance: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendCryptoSheet({ coin, availableBalance, onClose, onSuccess }: SendCryptoSheetProps) {
  const [toAddress, setToAddress]   = useState('');
  const [amount, setAmount]         = useState('');
  const [step, setStep]             = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ txHash: string; blockExplorerUrl: string } | null>(null);
  const [error, setError]           = useState('');

  const isValidAddress = ethers.isAddress(toAddress);
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= parseFloat(availableBalance);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/crypto/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin, toAddress, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStep('success');
      onSuccess();
    } catch (err: any) {
      setError(err.message ?? 'Transaction failed');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#111111] border-l border-[#2A2A2A] flex flex-col shadow-2xl
                      max-sm:top-auto max-sm:right-0 max-sm:left-0 max-sm:bottom-0 max-sm:max-w-full max-sm:rounded-t-2xl max-sm:border-l-0 max-sm:border-t">

        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A]">
          <h2 className="text-white font-semibold">Send {coin}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8682] hover:bg-[#1C1C1C]">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'success' && result ? (
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-[#4CAF82]" />
              </div>
              <h3 className="text-white font-semibold text-lg">Transaction Sent</h3>
              <p className="text-sm text-[#8A8682]">
                {amount} {coin} sent to {toAddress.slice(0, 6)}...{toAddress.slice(-4)}
              </p>
              <div className="w-full bg-[#0F0F0F] rounded-lg p-4 text-left space-y-2">
                <p className="text-xs text-[#555250]">Transaction Hash</p>
                <code className="text-xs text-white font-mono break-all">{result.txHash}</code>
              </div>
              <a
                href={result.blockExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#C9A84C] hover:underline"
              >
                View on Block Explorer <ExternalLink size={13} />
              </a>
            </div>
          ) : step === 'confirm' ? (
            <div className="space-y-4">
              <div className="bg-[#0F0F0F] rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555250]">Sending</span>
                  <span className="text-white font-medium">{amount} {coin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555250]">To</span>
                  <span className="text-white font-mono text-xs">{toAddress.slice(0, 10)}...{toAddress.slice(-6)}</span>
                </div>
                <div className="border-t border-[#2A2A2A] pt-3">
                  <p className="text-xs text-[#E05252]">
                    ⚠️ Crypto transactions are irreversible. Double-check the address before confirming.
                  </p>
                </div>
              </div>
              {error && (
                <p className="text-sm text-[#E05252] bg-[#E05252]/10 rounded-lg px-4 py-3">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs text-[#555250] uppercase tracking-wider">Recipient Address</label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white font-mono placeholder-[#555250] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                />
                {toAddress && !isValidAddress && (
                  <p className="text-xs text-[#E05252]">Invalid Ethereum address</p>
                )}
                {toAddress && isValidAddress && (
                  <p className="text-xs text-[#4CAF82]">✓ Valid address</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs text-[#555250] uppercase tracking-wider">Amount</label>
                  <button
                    onClick={() => setAmount(availableBalance)}
                    className="text-xs text-[#C9A84C] hover:underline"
                  >
                    Max: {parseFloat(availableBalance).toFixed(6)} {coin}
                  </button>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-md px-4 py-2.5 text-sm text-white placeholder-[#555250] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                />
                {amount && !isValidAmount && parseFloat(amount) > parseFloat(availableBalance) && (
                  <p className="text-xs text-[#E05252]">Insufficient balance</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-[#E05252] bg-[#E05252]/10 rounded-lg px-4 py-3">{error}</p>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#2A2A2A] shrink-0">
          {step === 'form' && (
            <button
              onClick={() => setStep('confirm')}
              disabled={!isValidAddress || !isValidAmount}
              className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Review Transaction
            </button>
          )}
          {step === 'confirm' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 h-10 rounded-md border border-[#2A2A2A] text-[#8A8682] text-sm hover:bg-[#1C1C1C] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSend}
                disabled={loading}
                className="flex-1 h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Confirm Send</>}
              </button>
            </div>
          )}
          {step === 'success' && (
            <button onClick={onClose} className="w-full h-10 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors">
              Done
            </button>
          )}
        </div>
      </div>
    </>
  );
}
