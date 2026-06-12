"use client";

import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, Landmark, PlusCircle, Settings, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/fund", label: "Fund Account", icon: PlusCircle },
  { href: "/transfer", label: "Transfer", icon: Send },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="lg:hidden p-2 text-text-primary hover:text-accent-gold transition-colors">
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-bg-elevated border-r border-border z-50 transform transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <span className="font-semibold text-lg tracking-tight">
            Vault<span className="text-accent-gold">é</span>
          </span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-text-secondary hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                pathname === href
                  ? "bg-accent-gold/10 text-accent-gold font-medium border-l-2 border-accent-gold"
                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
