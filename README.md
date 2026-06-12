# Vaulté — Where wealth is kept.

A modern, minimalist private banking web application built with Next.js 16, Auth.js, Neon (PostgreSQL), Drizzle ORM, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Auth:** Auth.js v5 (next-auth@beta) — credentials provider
- **Database:** Neon (PostgreSQL, serverless)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (custom components)
- **Icons:** Lucide React
- **Password:** bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)

### 1. Clone & Install

```bash
git clone <repository-url>
cd vaulte
npm install
```

### 2. Environment Variables

Copy `.env.local` and fill in your values:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
AUTH_SECRET=<a-random-32-char-secret>
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure random secret:
```bash
openssl rand -base64 32
```

### 3. Push Database Schema

```bash
npx drizzle-kit push
```

### 4. Seed Demo Data

```bash
npx tsx scripts/seed.ts
```

This creates a demo user:
- **Email:** demo@vaulte.app
- **Password:** Demo1234!
- **Account balance:** ₦250,000.00
- **Sample transactions:** 10

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(auth)           → Login, Register, Forgot Password pages
  /(dashboard)      → Dashboard, Accounts, Transfer, Transactions, Cards, Loans, Settings
  /api              → API routes (auth, register, transfer, transactions)
/components
  /ui               → shadcn/ui base components
  /layout           → Sidebar, Header, MobileNav
  /dashboard        → BalanceCard, TransactionRow, QuickActions, SpendingChart
/lib
  schema.ts         → Drizzle ORM schema
  db.ts             → Database client
  auth.ts           → Auth.js configuration
  utils.ts          → Utility functions
/scripts
  seed.ts           → Database seed script
/drizzle            → Migration files (generated)
```

## Features

- 🔐 **Authentication** — Email/password login with Auth.js v5
- 💰 **Dashboard** — Balance overview, recent transactions, monthly stats
- 💳 **Accounts** — View and manage bank accounts
- 💸 **Transfers** — Send money to other accounts
- 📊 **Transactions** — Full transaction history with filters
- 💳 **Cards** — Virtual and physical card management
- 🏦 **Loans** — Loan product information
- ⚙️ **Settings** — Profile, security, and preferences
- 🌓 **Dark Mode** — Full dark mode support

## Design

- **Primary:** #0A0A0A (near black)
- **Accent:** #C9A84C (muted gold)
- **Surface:** #F9F8F6 (warm off-white)
- **Font:** Inter (Google Fonts)
- Clean, minimalist private banking aesthetic

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Set the same environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`) in your Vercel project settings.
