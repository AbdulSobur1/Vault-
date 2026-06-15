"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Settings,
  PlusCircle,
  Send,
  Globe,
  Coins,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/SignOutButton";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    firstname?: string | null;
  };
}

import { Receipt } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/wallets", label: "Wallets", icon: Globe },
  { href: "/crypto", label: "Crypto", icon: Coins },
  { href: "/crypto/convert", label: "  Convert", icon: ArrowUpDown },
  { href: "/fund", label: "Fund Account", icon: PlusCircle },
  { href: "/transfer", label: "Transfer", icon: Send },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/bills", label: "Bills", icon: Receipt },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r border-border bg-bg-surface overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">            <span className="text-xl font-medium tracking-tight">
            Vault<span className="text-accent-gold">é</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#C9A84C]/5 text-white border-l-2 border-accent-gold pl-[10px]"
                  : "text-[#8A8682] hover:text-white hover:bg-[#1C1C1C] border-l-2 border-transparent pl-[10px]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user.name || "User"}</p>
            <p className="text-xs text-text-secondary truncate">{user.email || ""}</p>
          </div>
        </div>
        <SignOutButton variant="sidebar" />
      </div>
    </aside>
  );
}
