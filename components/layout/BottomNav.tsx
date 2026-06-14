"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Globe,
  Coins,
  Settings,
} from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/wallets", label: "Wallets", icon: Globe },
  { href: "/crypto", label: "Crypto", icon: Coins },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-surface border-t border-border">
      <div className="flex items-stretch h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] tracking-wide transition-colors relative ${
                isActive
                  ? "text-accent-gold"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span>{label}</span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
