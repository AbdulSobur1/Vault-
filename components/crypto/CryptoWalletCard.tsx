'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';

interface CryptoWalletCardProps {
  address: string;
  network: string;
}

export function CryptoWalletCard({ address, network }: CryptoWalletCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const displayAddress = showFull
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = network === 'mainnet'
    ? `https://etherscan.io/address/${address}`
    : `https://sepolia.etherscan.io/address/${address}`;

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#627EEA] to-[#A78BFA] flex items-center justify-center">
            <span className="text-white text-xs font-bold">Ξ</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white tracking-wide">Vaulté Crypto Wallet</p>
            <p className="text-[10px] text-[#555250] capitalize">{network} Network</p>
          </div>
        </div>
        {network !== 'mainnet' && (
          <span className="text-[9px] font-medium text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-2 py-0.5">
            TESTNET
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg px-4 py-3">
        <code className="flex-1 text-xs text-[#8A8682] font-mono break-all">
          {displayAddress}
        </code>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setShowFull(!showFull)} className="text-[#555250] hover:text-white transition-colors">
            {showFull ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <button onClick={handleCopy} className="text-[#555250] hover:text-[#C9A84C] transition-colors">
            {copied ? <Check size={13} className="text-[#4CAF82]" /> : <Copy size={13} />}
          </button>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
            className="text-[#555250] hover:text-[#C9A84C] transition-colors">
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
