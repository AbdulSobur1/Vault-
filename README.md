# Vaulté — Where wealth is kept.

A modern, minimalist private banking application built with Next.js 16, featuring multi-currency accounts, crypto wallet support, real-time FX conversion, and a sleek dark-mode interface.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-31648c)](https://neon.tech)

---

## Overview

Vaulté is a full-stack digital banking platform that combines traditional banking features with modern Web3 capabilities. Built with a focus on security, performance, and user experience.

### Core Features

- **Dashboard** — Real-time balance overview, transaction history, and monthly spending analytics
- **Multi-Currency Accounts** — Hold and manage NGN, USD, GBP, EUR, and more
- **Crypto Wallets** — Non-custodial Ethereum wallet for ETH, USDT, and USDC with on-chain sends
- **FX Conversion** — Live exchange rates with built-in currency conversion
- **Transfers** — Send money between accounts and internationally
- **Cards** — Virtual and physical card management
- **Transaction History** — Full searchable history with downloadable PDF receipts
- **External Wallet Connect** — Connect MetaMask, WalletConnect, or Coinbase Wallet

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Authentication | Auth.js v5 (Credentials provider) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix Primitives |
| Web3 | wagmi, viem, RainbowKit, ethers.js |
| Charts | Recharts |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
git clone <repository-url>
cd vaulte
npm install
```

### Environment Setup

Configure the following environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random 32-char secret for session encryption |
| `WALLET_ENCRYPTION_KEY` | Encryption key for crypto wallet private keys |
| `ALCHEMY_API_KEY` | Alchemy RPC API key for blockchain reads |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID |

### Database

Push the schema and seed demo data:

```bash
npx drizzle-kit push
npx tsx scripts/seed.ts
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Architecture

```
app/
├── (auth)/           → Login, Register, Forgot Password
├── (dashboard)/      → Dashboard, Wallets, Crypto, Transfer, Cards
├── api/              → Route handlers (REST endpoints)
components/
├── ui/               → Base UI primitives (shadcn/ui)
├── layout/           → Sidebar, Header, Bottom navigation
├── dashboard/        → Balance cards, transaction rows, receipts
├── crypto/           → Wallet card, balance rows, send sheet
├── landing/          → Marketing page sections
lib/
├── auth.ts           → Auth.js configuration
├── schema.ts         → Drizzle ORM schema definitions
├── db.ts             → Database client
├── crypto-wallet.ts  → Wallet generation, encryption, on-chain operations
├── crypto-prices.ts  → CoinGecko price integration
└── utils.ts          → Utility functions
```

## Design Philosophy

- **Dark-first UI** — Every screen built for a dark environment with gold accents
- **Minimalist** — Clean layouts with deliberate whitespace and typographic hierarchy
- **Responsive** — Desktop sidebar layout collapses to bottom tab navigation on mobile
- **Performance** — Server components by default, streaming, and optimized bundle splits

## Deployment

Deploy to Vercel with zero configuration:

```bash
npm run build
```

Set all required environment variables in your Vercel project dashboard.

## Security

- Passwords hashed with bcryptjs (12 rounds)
- Crypto private keys encrypted with AES via crypto-js
- Never expose private keys or mnemonics to the client
- Server-side wallet address validation on all transactions
- Rate-limited send endpoints (5 transactions per hour per user)
- Session management via Auth.js with JWT strategy

## License

Private — All rights reserved. Vaulté Financial Technologies Ltd.
