"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/transactions": "Transactions",
  "/transfer": "Transfer",
  "/cards": "Cards",
  "/loans": "Loans",
  "/settings": "Settings",
  "/crypto": "Crypto",
  "/wallets": "Wallets",
};

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const title = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path)
  )?.[1] || "Dashboard";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-bg-base lg:bg-transparent">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="lg:hidden text-lg font-semibold tracking-tight">
            Vault<span className="text-accent-gold">é</span>.
          </span>
        </Link>
        <span className="hidden lg:block text-sm text-text-secondary font-medium">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/settings">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
