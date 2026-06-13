"use client";

import { useState, useEffect } from "react";
import { WalletCard } from "./WalletCard";
import { Plus, X } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";

export function WalletsGrid() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((data) => {
        setWallets(data.wallets ?? []);
        if (data.wallets?.length > 0) setSelectedWallet(data.wallets[0].currency);
      })
      .finally(() => setLoading(false));
  }, []);

  const addWallet = async (currency: string) => {
    setAdding(currency);
    const res = await fetch("/api/wallets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency }),
    });
    if (res.ok) {
      const data = await fetch("/api/wallets").then((r) => r.json());
      setWallets(data.wallets ?? []);
      setShowAddWallet(false);
    }
    setAdding(null);
  };

  const existingCurrencies = wallets.map((w) => w.currency);
  const availableCurrencies = SUPPORTED_CURRENCIES.filter((c) => !existingCurrencies.includes(c.code));

  if (loading) return <WalletsGridSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#8A8682] uppercase tracking-wider">My Wallets</h2>
        <button
          onClick={() => setShowAddWallet(true)}
          className="flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#b8973d] transition-colors"
        >
          <Plus size={13} />
          Add Currency
        </button>
      </div>

      {/* Wallets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.currency}
            currency={wallet.currency}
            balance={parseFloat(wallet.balance)}
            balanceUSD={wallet.balanceUSD}
            isSelected={selectedWallet === wallet.currency}
            onClick={() => setSelectedWallet(wallet.currency)}
          />
        ))}
      </div>

      {/* Add currency modal */}
      {showAddWallet && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowAddWallet(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[#161616] border border-[#2A2A2A] rounded-xl p-6 max-w-md mx-auto max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Currency Wallet</h3>
              <button
                onClick={() => setShowAddWallet(false)}
                className="text-[#555250] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {availableCurrencies.length === 0 ? (
                <p className="text-sm text-[#555250] text-center py-4">You already have all available wallets</p>
              ) : (
                availableCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => addWallet(currency.code)}
                    disabled={adding === currency.code}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#2A2A2A] hover:border-[#C9A84C]/50 hover:bg-[#1C1C1C] transition-all text-left disabled:opacity-50"
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{currency.code}</p>
                      <p className="text-xs text-[#555250]">{currency.name}</p>
                    </div>
                    {adding === currency.code && (
                      <span className="ml-auto text-xs text-[#C9A84C]">Adding...</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WalletsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-xl border border-[#2A2A2A] bg-[#161616] animate-pulse" />
      ))}
    </div>
  );
}
