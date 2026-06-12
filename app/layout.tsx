import { ThemeScript } from "@/components/ThemeScript";
import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/landing/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vaulte.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Vaulté — Where wealth is kept.",
    template: "%s | Vaulté",
  },
  description:
    "Private banking built for the modern era. Instant transfers, multi-currency accounts, and cards that work everywhere — secured by military-grade encryption.",
  keywords: [
    "digital banking",
    "private banking Nigeria",
    "multi-currency account",
    "virtual card Nigeria",
    "money transfer",
    "banking app",
    "Nigerian fintech",
    "Vaulté",
    "wealth management",
  ],
  authors: [{ name: "Vaulté Financial Technologies Ltd." }],
  creator: "Vaulté Financial Technologies Ltd.",
  publisher: "Vaulté Financial Technologies Ltd.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Vaulté",
    title: "Vaulté — Where wealth is kept.",
    description:
      "Private banking built for the modern era. Instant transfers, multi-currency accounts, and cards that work everywhere — secured by military-grade encryption.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaulté — Where wealth is kept.",
    description:
      "Private banking built for the modern era. Instant transfers, multi-currency accounts, and cards that work everywhere.",
    creator: "@vaulte",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Vaulté",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-bg-base text-text-primary">
        <ThemeScript />
        <SessionProvider>
          <JsonLd />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
