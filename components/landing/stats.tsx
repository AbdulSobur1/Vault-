"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { FadeUp } from "@/components/ui/fade-up";

function Counter({
  value,
  prefix = "",
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500 });
  const displayValue = useTransform(spring, (latest) =>
    latest.toFixed(decimals)
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-accent-gold mb-1">
        {prefix && <span>{prefix}</span>}
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

const stats = [
  { value: 2, prefix: "₦", suffix: "B+", label: "Total transferred", decimals: 0 },
  { value: 50000, prefix: "", suffix: "+", label: "Active accounts", decimals: 0 },
  { value: 99.9, prefix: "", suffix: "%", label: "Uptime SLA", decimals: 1 },
  { value: 10, prefix: "<", suffix: "s", label: "Average transfer time", decimals: 0 },
];

export function Stats() {
  return (
    <section className="py-24 md:py-32 bg-grid border-y border-[#222220]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <Counter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                decimals={stat.decimals}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
