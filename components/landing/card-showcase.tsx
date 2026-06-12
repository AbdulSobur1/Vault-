"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/fade-up";

const benefits = [
  "Virtual card generated instantly",
  "Freeze/unfreeze in one tap",
  "Spend limit controls",
  "0% foreign transaction fees",
];

export function CardShowcase() {
  return (
    <section id="cards" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Large card mockup */}
          <FadeUp>
            <div className="relative flex justify-center">
              <motion.div
                whileHover={{ rotate: 0, scale: 1.02 }}
                initial={{ rotate: -8 }}
                className="relative w-full max-w-[420px] aspect-[2.7/1.6] rounded-2xl bg-gradient-to-br from-[#1A1A1E] via-[#222220] to-[#0A0A0B] border border-[#333] p-6 md:p-8 overflow-hidden shadow-2xl cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_40px_#C9A84C22]"
              >
                {/* Gold accent lines */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-30" />

                {/* Card top */}
                <div className="flex items-start justify-between mb-6">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 28 28"
                    fill="none"
                    className="text-accent-gold"
                  >
                    <rect x="2" y="4" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <rect x="6" y="8" width="6" height="4" rx="1" fill="currentColor" opacity="0.6" />
                    <circle cx="14" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                  <span className="text-xs font-mono text-text-tertiary tracking-[4px]">
                    VAULTÉ
                  </span>
                </div>

                {/* Chip */}
                <div className="w-12 h-8 rounded bg-gradient-to-br from-accent-gold to-[#E8D48B] mb-5 opacity-90" />

                {/* Card number */}
                <p className="font-mono text-xl md:text-2xl tracking-[6px] text-text-primary mb-5">
                  •••• •••• •••• 4291
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-[2px] mb-0.5">
                      Card Holder
                    </p>
                    <p className="text-sm text-text-primary font-medium">
                      A. Sobur
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-5 rounded-full bg-red-500 opacity-60 border border-white/10" />
                    <div className="w-8 h-5 rounded-full bg-yellow-400 opacity-60 -ml-4 border border-white/10" />
                  </div>
                </div>

                {/* Expiry */}
                <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 text-right">
                  <p className="text-[10px] text-text-tertiary uppercase tracking-[2px] mb-0.5">
                    Expires
                  </p>
                  <p className="text-xs text-text-primary font-mono">09/29</p>
                </div>

                {/* Glow */}
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent-gold opacity-[0.05] blur-[80px] rounded-full" />
              </motion.div>
            </div>
          </FadeUp>

          {/* Right: Benefits */}
          <FadeUp delay={0.2}>
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text-primary mb-6">
                Your card, <br />
                <span className="text-gradient-gold italic">your identity</span>
              </h2>
              <ul className="space-y-4 mb-10">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/10 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 text-accent-gold" />
                    </span>
                    <span className="text-text-secondary">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-[#0A0A0B] font-medium rounded-full text-sm transition-all duration-200 hover:bg-[#D4B96A]"
              >
                Get your card
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
