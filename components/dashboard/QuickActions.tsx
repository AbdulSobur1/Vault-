"use client";

import { ArrowLeftRight, Wallet, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  { href: "/transfer", label: "Transfer", icon: ArrowLeftRight, description: "Send money" },
  { href: "/accounts", label: "Accounts", icon: Wallet, description: "View accounts" },
  { href: "/cards", label: "Cards", icon: CreditCard, description: "Manage cards" },
  { href: "/loans", label: "Loans", icon: Landmark, description: "Apply for loans" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border border-border",
              "bg-bg-elevated",
              "hover:bg-bg-surface transition-colors"
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-base">
              <Icon className="h-5 w-5 text-accent-gold" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-text-secondary">{action.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
