"use client";

import Link from "next/link";
import { Shield, ArrowLeftRight, CreditCard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Security",
    description: "Bank-grade encryption and multi-factor authentication to protect your wealth.",
  },
  {
    icon: ArrowLeftRight,
    title: "Transfers",
    description: "Instant money transfers between accounts with real-time balance updates.",
  },
  {
    icon: CreditCard,
    title: "Cards",
    description: "Virtual and physical cards with full control over spending limits.",
  },
];

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    try {
      localStorage.setItem("vaulte-theme", newDark ? "dark" : "light");
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-medium tracking-tight text-primary dark:text-white">
            Vault<span className="text-accent">é</span>
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-primary dark:text-white mb-4">
          Vault<span className="text-accent">é</span>
        </h1>
        <p className="text-lg md:text-xl text-muted mb-10 font-light">
          Where wealth is kept.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="accent" asChild>
            <Link href="/register">Open Account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-white dark:bg-dark-card dark:border-dark-border p-6"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface dark:bg-dark-surface mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-base font-medium mb-2 text-primary dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Vaulté. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted hover:text-primary dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted hover:text-primary dark:hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
