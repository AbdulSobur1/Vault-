"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-gold/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 30}%`,
            animation: `particle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent-gold opacity-[0.03] blur-[120px] pointer-events-none" />

      <Particles />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Ready to move your wealth?
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg text-text-secondary mb-10">
            Join 50,000+ people already banking with Vaulté.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-accent-gold text-[#0A0A0B] font-medium rounded-full text-base transition-all duration-200 hover:bg-[#D4B96A]"
            >
              Open Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#"
              className="group inline-flex items-center gap-2 px-8 py-3.5 border border-[#222220] text-text-secondary hover:text-text-primary rounded-full text-base transition-all duration-200"
            >
              Talk to us
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
