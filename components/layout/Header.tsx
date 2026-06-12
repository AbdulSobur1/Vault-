"use client";

"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
        {mounted && (
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}
        <Link href="/settings">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
