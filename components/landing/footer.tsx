import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Security", href: "#security" },
      { label: "Cards", href: "#cards" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "NDIC Notice", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Twitter/X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#222220] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                className="text-accent-gold"
              >
                <rect x="2" y="4" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="6" y="8" width="6" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <circle cx="14" cy="18" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-lg font-serif tracking-tight text-text-primary">
                Vault<span className="text-accent-gold">é</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary mb-6 max-w-xs">
              Private banking for the modern era. Where wealth is kept.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-text-tertiary hover:text-text-secondary transition-colors text-sm"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-[2px] mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#222220]">
          <p className="text-xs text-text-tertiary text-center leading-relaxed">
            &copy; 2026 Vaulté Financial Technologies Ltd. Regulated by the CBN. Member NDIC.
          </p>
        </div>
      </div>
    </footer>
  );
}
