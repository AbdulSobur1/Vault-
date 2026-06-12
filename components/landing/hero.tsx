"use client";

import Link from "next/link";
import { Play, ArrowDown } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[800px] rounded-full bg-accent-gold opacity-[0.03] blur-[120px] animate-pulse-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="relative z-10">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#222220] bg-[#111113] text-xs text-text-secondary mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Bank-grade security · 256-bit encryption
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[72px] leading-[1.1] tracking-tight mb-6">
                <span className="text-text-primary">Where wealth</span>
                <br />
                <span className="text-gradient-gold italic">is kept.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl mb-10">
                Private banking built for the modern era. Instant transfers,
                multi-currency accounts, and cards that work everywhere — secured
                by military-grade encryption.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-gold text-[#0A0A0B] font-medium rounded-full text-base hover:bg-[#D4B96A] transition-all duration-200"
                >
                  Open Account
                  <ArrowDown className="h-4 w-4 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#222220] text-text-secondary hover:text-text-primary rounded-full text-base transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </span>
                  See how it works
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="flex flex-wrap gap-6">
                {[
                  { value: "50K+", label: "accounts" },
                  { value: "₦2B+", label: "transferred" },
                  { value: "99.9%", label: "uptime" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-sm font-mono text-accent-gold">{stat.value}</span>
                    <span className="text-sm text-text-tertiary">{stat.label}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right: Card mockup */}
          <FadeUp delay={0.3} className="hidden lg:flex items-center justify-center relative">
            <div className="relative">
              {/* Floating card */}
              <div className="animate-float">
                <div className="w-[340px] h-[200px] rounded-2xl bg-gradient-to-br from-[#1A1A1E] via-[#222220] to-[#0A0A0B] border border-[#333] p-6 relative overflow-hidden shadow-2xl">
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-60" />

                  {/* Card top */}
                  <div className="flex items-start justify-between mb-6">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 28 28"
                      fill="none"
                      className="text-accent-gold"
                    >
                      <rect x="2" y="4" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <rect x="6" y="8" width="6" height="4" rx="1" fill="currentColor" opacity="0.6" />
                      <circle cx="14" cy="18" r="1.5" fill="currentColor" />
                    </svg>
                    <span className="text-[10px] font-mono text-text-tertiary tracking-widest">VAULTÉ</span>
                  </div>

                  {/* Chip */}
                  <div className="w-10 h-7 rounded bg-gradient-to-br from-accent-gold to-[#D4B96A] mb-4 opacity-80" />

                  {/* Card number */}
                  <p className="font-mono text-lg tracking-[4px] text-text-primary mb-4">
                    •••• •••• •••• 4291
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-text-tertiary uppercase tracking-widest mb-0.5">Card Holder</p>
                      <p className="text-xs text-text-primary font-medium">A. Sobur</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-4 rounded-full bg-red-500 opacity-60" />
                      <div className="w-6 h-4 rounded-full bg-yellow-400 opacity-60 -ml-3" />
                    </div>
                  </div>

                  {/* Glow overlay */}
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-gold opacity-[0.04] blur-[60px] rounded-full" />
                </div>
              </div>

              {/* Decorative glow behind card */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent-gold opacity-[0.06] blur-[80px] rounded-full pointer-events-none" />
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-text-tertiary uppercase tracking-[3px]">Scroll</span>
        <ArrowDown className="h-4 w-4 text-text-tertiary animate-bounce-down" />
      </div>
    </section>
  );
}
