'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Wallet, Unplug } from 'lucide-react';

export function ConnectExternalWallet() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <Wallet size={15} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-xs font-medium text-white">{connector?.name}</p>
            <p className="text-[10px] text-[#555250] font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1.5 text-xs text-[#E05252] hover:text-[#f87171] transition-colors"
        >
          <Unplug size={12} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <button
          onClick={openConnectModal}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-md border border-[#2A2A2A] text-[#8A8682] text-sm hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
        >
          <Wallet size={15} />
          Connect External Wallet
        </button>
      )}
    </ConnectButton.Custom>
  );
}
