"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, FadeUpStagger, fadeUpItem } from "@/components/ui/fade-up";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Get started with the basics.",
    features: [
      "1 account",
      "Virtual card only",
      "5 free transfers/month",
      "Standard support",
    ],
    cta: "Get Started Free",
    href: "/register",
    featured: false,
  },
  {
    name: "Private",
    price: "₦2,500",
    period: "/month",
    description: "The most popular plan for active users.",
    features: [
      "3 accounts",
      "Virtual + Physical card",
      "Unlimited transfers",
      "Priority support",
      "Wealth insights dashboard",
    ],
    cta: "Open Private Account",
    href: "/register",
    featured: true,
  },
  {
    name: "Elite",
    price: "₦7,500",
    period: "/month",
    description: "For those who demand the absolute best.",
    features: [
      "Unlimited accounts",
      "Multiple physical cards",
      "Dedicated relationship manager",
      "Concierge support 24/7",
      "Early access to new features",
    ],
    cta: "Contact Us",
    href: "#",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-text-secondary">
              No hidden fees. No surprises.
            </p>
          </div>
        </FadeUp>

        {/* Grid: 1 col mobile, 3 col desktop */}
        <FadeUpStagger className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUpItem}
              whileHover={
                plan.featured
                  ? { scale: 1.01 }
                  : { scale: 1.02 }
              }
              className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                plan.featured
                  ? "bg-[#111113] border-2 border-accent-gold/50 shadow-[0_0_40px_#C9A84C22] scale-[1.02] md:scale-[1.04]"
                  : "bg-[#111113] border border-[#222220]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-[11px] font-medium uppercase tracking-[2px] text-[#0A0A0B] bg-accent-gold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl text-text-primary">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-text-tertiary">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-gold/10 mt-0.5 shrink-0">
                      <Check className="h-3 w-3 text-accent-gold" />
                    </span>
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full inline-flex items-center justify-center px-6 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                  plan.featured
                    ? "bg-accent-gold text-[#0A0A0B] hover:bg-[#D4B96A]"
                    : "border border-[#222220] text-text-secondary hover:text-text-primary hover:border-text-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  );
}
