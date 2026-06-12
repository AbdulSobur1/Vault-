"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";

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
    <header className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-bg-surface">
      <div className="flex items-center gap-2">
        <MobileNav />
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-medium tracking-tight">
            Vault<span className="text-accent-gold">é</span>
          </span>
        </Link>
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
