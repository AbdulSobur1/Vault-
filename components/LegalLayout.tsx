import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalLayout({ title, lastUpdated, children }: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <header className="border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold tracking-tight">
          Vaulté<span className="text-[#C9A84C]">.</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#8A8682] hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">{title}</h1>
          <p className="text-sm text-[#555250]">Last updated: {lastUpdated}</p>
        </div>
        <div className="space-y-8 text-[#8A8682] text-sm leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#2A2A2A] px-6 py-6 text-center text-xs text-[#555250]">
        &copy; {new Date().getFullYear()} Vaulté Financial Services Ltd. All rights reserved.
      </footer>
    </div>
  );
}
