"use client";

import { UserPlus, ArrowRightToLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, FadeUpStagger, fadeUpItem } from "@/components/ui/fade-up";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description: "Bring your email, verify your identity in 60 seconds. No branch visits, no paperwork.",
  },
  {
    number: "02",
    icon: ArrowRightToLine,
    title: "Fund your vault",
    description: "Transfer in from any bank in Nigeria. Instant confirmation, zero fees.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Spend with confidence",
    description: "Cards, transfers, multi-currency — all from one dashboard. Total control.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-text-secondary">
              No queues, no paperwork. Just your wealth.
            </p>
          </div>
        </FadeUp>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-accent-gold/40 via-accent-gold/20 to-accent-gold/40" />

          {/* Connecting line (mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-[36px] w-[2px] bg-gradient-to-b from-accent-gold/40 via-accent-gold/20 to-accent-gold/40" />

          <FadeUpStagger className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUpItem}
                  className="relative md:text-center"
                >
                  {/* Number + Icon (desktop) */}
                  <div className="hidden md:flex flex-col items-center mb-6">
                    <span className="font-serif text-7xl text-accent-gold/20 leading-none mb-2">
                      {step.number}
                    </span>
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                      <Icon className="h-6 w-6 text-accent-gold" />
                    </div>
                  </div>

                  {/* Number + Icon (mobile) */}
                  <div className="flex md:hidden items-start gap-4 mb-0">
                    <div className="relative z-10 w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 shrink-0">
                      <Icon className="h-6 w-6 text-accent-gold" />
                    </div>
                    <div className="pt-2">
                      <span className="font-serif text-lg text-accent-gold/40">
                        Step {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:mt-6 md:px-4 ml-[72px] md:ml-0">
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </FadeUpStagger>
        </div>
      </div>
    </section>
  );
}
