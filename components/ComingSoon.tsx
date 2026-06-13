import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Minimal nav */}
      <header className="border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold tracking-tight">
          Vaulté<span className="text-[#C9A84C]">.</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#8A8682] hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full border border-[#2A2A2A] flex items-center justify-center mb-6">
          <span className="text-[#C9A84C] text-xl">✦</span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-3">{title}</h1>
        <p className="text-[#8A8682] text-sm leading-relaxed mb-8">{description}</p>
        <p className="text-xs text-[#555250]">Coming soon — we&apos;re working on it.</p>
      </main>
    </div>
  );
}
