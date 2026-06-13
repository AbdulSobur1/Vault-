import { WalletsGrid } from "@/components/dashboard/WalletsGrid";
import { FXConverter } from "@/components/dashboard/FXConverter";

export default function WalletsPage() {
  return (
    <div className="w-full max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Wallets</h1>
        <p className="text-sm text-[#8A8682] mt-1">Manage your multi-currency balances</p>
      </div>
      <WalletsGrid />
      <FXConverter />
    </div>
  );
}
