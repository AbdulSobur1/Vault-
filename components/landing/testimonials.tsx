"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, FadeUpStagger, fadeUpItem } from "@/components/ui/fade-up";

const testimonials = [
  {
    quote:
      "I moved ₦15M through Vaulté in under a minute. Traditional banks would have taken 3 days.",
    author: "Ade O.",
    role: "Entrepreneur",
    location: "Lagos",
    rating: 5,
  },
  {
    quote:
      "The card controls are insane. I froze my card mid-fraud attempt and lost nothing.",
    author: "Kemi A.",
    role: "Finance Director",
    location: "Abuja",
    rating: 5,
  },
  {
    quote:
      "Finally a Nigerian bank that looks and works like it belongs in 2026.",
    author: "Tunde B.",
    role: "Tech Founder",
    location: "Port Harcourt",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#0D0D0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-text-primary mb-4">
              Trusted by those who value discretion
            </h2>
            <p className="text-base text-text-secondary">
              Hear from our clients.
            </p>
          </div>
        </FadeUp>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <FadeUpStagger className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible">
          {testimonials.map((t) => (
            <motion.div
              key={t.author}
              variants={fadeUpItem}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start rounded-xl border border-[#222220] bg-[#111113] p-6 md:p-8 relative flex-shrink-0 lg:flex-shrink"
            >
              {/* Gold quote mark */}
              <div className="absolute top-6 right-6">
                <svg
                  width="32"
                  height="24"
                  viewBox="0 0 32 24"
                  fill="none"
                  className="text-accent-gold/20"
                >
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8v8h8v-8H4c0-2.2 1.8-4 4-4V0zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V0z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent-gold text-accent-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-text-secondary leading-relaxed mb-6 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t.author}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t.role}, {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  );
}
