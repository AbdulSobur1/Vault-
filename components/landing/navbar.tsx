"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Cards", href: "#cards" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-sm border-b border-[#222220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-accent-gold"
            >
              <rect
                x="2"
                y="4"
                width="24"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <rect x="6" y="8" width="6" height="4" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="14" y="16" width="8" height="2" rx="1" fill="currentColor" opacity="0.6" />
              <circle cx="14" cy="18" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-xl font-serif tracking-tight text-text-primary">
              Vault<span className="text-accent-gold">é</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium text-[#0A0A0B] bg-accent-gold hover:bg-[#D4B96A] rounded-full transition-all duration-200"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0B] border-b border-[#222220] flex flex-col items-center gap-6 py-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="text-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <hr className="w-16 border-[#222220]" />
          <a
            href="/login"
            onClick={handleLinkClick}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            onClick={handleLinkClick}
            className="h-9 px-6 rounded-md bg-accent-gold text-[#0A0A0B] text-sm font-medium flex items-center"
          >
            Open Account
          </a>
        </div>
      )}
    </header>
  );
}
