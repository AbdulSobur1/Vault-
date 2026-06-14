'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const COIN_ICONS: Record<string, { symbol: string; color: string; bg: string }> = {
  ETH:  { symbol: 'Ξ',  color: '#627EEA', bg: 'from-[#627EEA] to-[#A78BFA]' },
  USDT: { symbol: '₮',  color: '#26A17B', bg: 'from-[#26A17B] to-[#1a7a5c]' },
  USDC: { symbol: '$',  color: '#2775CA', bg: 'from-[#2775CA] to-[#1a5a99]' },
  BNB:  { symbol: 'B',  color: '#F3BA2F', bg: 'from-[#F3BA2F] to-[#d4a020]' },
  BTC:  { symbol: '₿',  color: '#F7931A', bg: 'from-[#F7931A] to-[#d4790f]' },
};

interface CryptoBalanceRowProps {
  coin: string;
  balance: string;
  balanceUSD: number;
  price: {
    priceUSD: number;
    change24h: number;
    sparkline7d: number[];
  };
  onClick?: () => void;
}

export function CryptoBalanceRow({ coin, balance, balanceUSD, price, onClick }: CryptoBalanceRowProps) {
  const icon = COIN_ICONS[coin] ?? { symbol: coin[0], color: '#C9A84C', bg: 'from-[#C9A84C] to-[#b8973d]' };
  const isPositive = price.change24h >= 0;

  const sparkData = price.sparkline7d.slice(-24).map((p, i) => ({ i, p }));

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-4 rounded-lg cursor-pointer hover:bg-[#1C1C1C] transition-colors group"
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${icon.bg} flex items-center justify-center shrink-0`}>
        <span className="text-white text-sm font-bold">{icon.symbol}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{coin}</p>
          <span className={`flex items-center gap-0.5 text-[10px] font-medium ${isPositive ? 'text-[#4CAF82]' : 'text-[#E05252]'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(price.change24h).toFixed(2)}%
          </span>
        </div>
        <p className="text-xs text-[#555250] mt-0.5">
          {parseFloat(balance).toFixed(6)} {coin} · ${price.priceUSD.toLocaleString()}
        </p>
      </div>

      <div className="w-16 h-8 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="p"
              stroke={isPositive ? '#4CAF82' : '#E05252'}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-medium text-white">
          ${balanceUSD.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
