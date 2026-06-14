'use client';

import { useState, useEffect } from 'react';
import { CryptoWalletCard } from '@/components/crypto/CryptoWalletCard';
import { CryptoBalanceRow } from '@/components/crypto/CryptoBalanceRow';
import { SendCryptoSheet } from '@/components/crypto/SendCryptoSheet';
import { ConnectExternalWallet } from '@/components/crypto/ConnectExternalWallet';
import { RefreshCw, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function CryptoPage() {
  const [data, setData]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [showSend, setShowSend]       = useState(false);
  const [refreshing, setRefreshing]   = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/crypto/balances');
      if (!res.ok) {
        console.error('Failed to fetch crypto balances:', res.status);
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch crypto balances:', err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  const totalUSD = data?.balances?.reduce((sum: number, b: any) => sum + b.balanceUSD, 0) ?? 0;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Crypto</h1>
          <p className="text-sm text-[#8A8682] mt-1">Manage your digital assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/crypto/convert">
            <button className="flex items-center gap-2 h-9 px-4 rounded-md bg-[#C9A84C] text-[#0A0A0A] text-sm font-medium hover:bg-[#b8973d] transition-colors">
              <ArrowUpDown size={14} />
              Buy / Sell
            </button>
          </Link>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-md text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] transition-colors ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-[#161616] border border-[#2A2A2A] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-5">
            <p className="text-xs text-[#555250] uppercase tracking-wider mb-1">Total Crypto Value</p>
            <p className="text-3xl font-semibold text-white">${totalUSD.toFixed(2)}</p>
          </div>

          {data?.walletAddress && (
            <CryptoWalletCard
              address={data.walletAddress}
              network={data.network}
            />
          )}

          <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A2A2A]">
              <p className="text-xs text-[#555250] uppercase tracking-wider">Your Assets</p>
            </div>
            <div className="divide-y divide-[#2A2A2A]">
              {data?.balances?.map((b: any) => (
                <CryptoBalanceRow
                  key={b.coin}
                  coin={b.coin}
                  balance={b.balance}
                  balanceUSD={b.balanceUSD}
                  price={b.price}
                  onClick={() => { setSelectedCoin(b); setShowSend(true); }}
                />
              ))}
            </div>
          </div>

          {data?.prices && (
            <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A2A2A]">
                <p className="text-xs text-[#555250] uppercase tracking-wider">Market Prices</p>
              </div>
              <div className="divide-y divide-[#2A2A2A]">
                {data.prices.map((p: any) => (
                  <div key={p.coin} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium text-white">{p.coin}</span>
                    <div className="text-right">
                      <p className="text-sm text-white">${p.priceUSD.toLocaleString()}</p>
                      <p className={`text-xs ${p.change24h >= 0 ? 'text-[#4CAF82]' : 'text-[#E05252]'}`}>
                        {p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-[#555250] uppercase tracking-wider">External Wallets</p>
            <ConnectExternalWallet />
          </div>
        </>
      )}

      {showSend && selectedCoin && (
        <SendCryptoSheet
          coin={selectedCoin.coin}
          availableBalance={selectedCoin.balance}
          onClose={() => { setShowSend(false); setSelectedCoin(null); }}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
