"use client";

import {
  Shield,
  Zap,
  CreditCard,
  Globe,
  LineChart,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, FadeUpStagger, fadeUpItem } from "@/components/ui/fade-up";

const features = [
  {
    icon: Shield,
    title: "Military Encryption",
    description:
      "256-bit AES encryption and biometric MFA on every login and transaction.",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description:
      "Send to any bank in under 10 seconds. Real-time balance updates included.",
  },
  {
    icon: CreditCard,
    title: "Smart Cards",
    description:
      "Virtual cards for online spending. Physical cards delivered in 48 hours.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description:
      "Hold, convert, and send in 12+ currencies at interbank rates.",
  },
  {
    icon: LineChart,
    title: "Wealth Insights",
    description:
      "Automated categorization, monthly reports, and savings goals in one dashboard.",
  },
  {
    icon: Lock,
    title: "Vault Mode",
    description:
      "Lock your account instantly from the app. Freeze cards, pause transfers, full control.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-text-primary mb-4">
              Everything your money needs
            </h2>
            <p className="text-base text-text-secondary">One account. Total control.</p>
          </div>
        </FadeUp>

        <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUpItem}
                whileHover={{
                  y: -4,
                  boxShadow: "0 0 20px #C9A84C33",
                }}
                className="group rounded-xl border border-[#222220] bg-[#111113] p-6 md:p-8 transition-colors duration-200 hover:border-accent-gold/30"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center mb-4 group-hover:bg-accent-gold/20 transition-colors duration-200">
                  <Icon className="h-5 w-5 text-accent-gold" />
                </div>
                <h3 className="text-base font-medium text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </FadeUpStagger>
      </div>
    </section>
  );
}
