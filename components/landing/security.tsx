"use client";

import { Check, Shield } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";

const securityFeatures = [
  "256-bit AES Encryption",
  "Biometric + OTP Multi-Factor Authentication",
  "Real-time fraud detection",
  "NDIC insured deposits",
  "Zero-knowledge architecture",
  "Instant account freeze",
];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#222220]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <FadeUp>
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text-primary mb-6">
                Your wealth, behind{" "}
                <span className="text-gradient-gold">unbreakable walls</span>
              </h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Security isn&apos;t just a feature — it&apos;s the foundation.
                Every layer of Vaulté is built with military-grade protection to
                keep your money and data safe.
              </p>
              <ul className="space-y-3">
                {securityFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/10 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 text-accent-gold" />
                    </span>
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          {/* Right: Shield animation */}
          <FadeUp delay={0.2}>
            <div className="flex items-center justify-center relative">
              {/* Animated ring */}
              <div className="absolute w-64 h-64 rounded-full border border-accent-gold/20 animate-pulse-glow" />
              <div className="absolute w-48 h-48 rounded-full border border-accent-gold/10 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />

              {/* Shield SVG */}
              <div className="relative z-10 flex items-center justify-center w-40 h-40">
                <Shield className="w-full h-full text-accent-gold/30" strokeWidth={1.5} />
                <Shield className="absolute inset-0 w-full h-full text-accent-gold/60" strokeWidth={1} />
                <Check className="absolute w-12 h-12 text-accent-gold" strokeWidth={2.5} />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
