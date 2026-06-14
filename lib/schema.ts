import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  date,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  surname: text("surname").notNull(),
  firstname: text("firstname").notNull(),
  middlename: text("middlename"),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  dob: date("dob"),
  gender: text("gender"),
  nationality: text("nationality"),
  address: text("address"),
  nin: text("nin"), // nullable — filled in later during KYC
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  accountNumber: text("account_number").unique().notNull(),
  accountType: text("account_type", { enum: ["savings", "current"] }).notNull(),
  balance: numeric("balance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  currency: text("currency").default("NGN").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .references(() => accounts.id)
    .notNull(),
  type: text("type", { enum: ["credit", "debit"] }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  reference: text("reference").unique().notNull(),
  status: text("status", { enum: ["completed", "pending", "failed"] })
    .default("completed")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  accountId: uuid("account_id")
    .references(() => accounts.id)
    .notNull(),
  cardNumber: text("card_number").notNull(),
  cardType: text("card_type", { enum: ["virtual", "physical"] }).notNull(),
  expiryDate: text("expiry_date").notNull(),
  cvv: text("cvv").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  expires: timestamp("expires").notNull(),
  sessionToken: text("session_token").unique().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

export const loanApplications = pgTable("loan_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  accountId: uuid("account_id").references(() => accounts.id).notNull(),
  loanType: text("loan_type").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  tenure: integer("tenure").notNull(),
  purpose: text("purpose"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const currencyWallets = pgTable("currency_wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  currency: text("currency").notNull(),
  balance: numeric("balance", { precision: 20, scale: 8 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUserCurrency: unique().on(table.userId, table.currency),
}));

export const fxTransactions = pgTable("fx_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  fromAmount: numeric("from_amount", { precision: 20, scale: 8 }).notNull(),
  toAmount: numeric("to_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 20, scale: 8 }).notNull(),
  spreadRate: numeric("spread_rate", { precision: 5, scale: 4 }).notNull().default("0.015"),
  spreadAmount: numeric("spread_amount", { precision: 20, scale: 8 }).notNull(),
  reference: text("reference").unique().notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const internationalTransfers = pgTable("international_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  fromAmount: numeric("from_amount", { precision: 20, scale: 8 }).notNull(),
  toAmount: numeric("to_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 20, scale: 8 }).notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientBank: text("recipient_bank"),
  recipientAccount: text("recipient_account").notNull(),
  recipientCountry: text("recipient_country").notNull(),
  swiftCode: text("swift_code"),
  routingNumber: text("routing_number"),
  narration: text("narration"),
  reference: text("reference").unique().notNull(),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Crypto Wallets — one per user, generated by Vaulté
export const cryptoWallets = pgTable('crypto_wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  address: text('address').unique().notNull(),
  encryptedPrivateKey: text('encrypted_private_key').notNull(),
  encryptedMnemonic: text('encrypted_mnemonic').notNull(),
  network: text('network').notNull().default('ethereum'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Connected external wallets (MetaMask, WalletConnect etc.)
export const connectedWallets = pgTable('connected_wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  address: text('address').notNull(),
  walletType: text('wallet_type').notNull(),
  label: text('label'),
  isActive: boolean('is_active').notNull().default(true),
  connectedAt: timestamp('connected_at').defaultNow().notNull(),
});

// Crypto transaction history
export const cryptoTransactions = pgTable('crypto_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  walletAddress: text('wallet_address').notNull(),
  type: text('type').notNull(),
  coin: text('coin').notNull(),
  amount: numeric('amount', { precision: 20, scale: 8 }).notNull(),
  amountUSD: numeric('amount_usd', { precision: 20, scale: 2 }),
  toAddress: text('to_address'),
  fromAddress: text('from_address'),
  txHash: text('tx_hash').unique(),
  blockExplorerUrl: text('block_explorer_url'),
  status: text('status').notNull().default('pending'),
  gasUsed: numeric('gas_used', { precision: 20, scale: 8 }),
  gasFeeUSD: numeric('gas_fee_usd', { precision: 10, scale: 4 }),
  network: text('network').notNull().default('ethereum'),
  reference: text('reference').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at'),
});

// Crypto price cache
export const cryptoPriceCache = pgTable('crypto_price_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  coin: text('coin').unique().notNull(),
  priceUSD: numeric('price_usd', { precision: 20, scale: 8 }).notNull(),
  change24h: numeric('change_24h', { precision: 10, scale: 4 }),
  marketCap: numeric('market_cap', { precision: 20, scale: 2 }),
  sparkline7d: text('sparkline_7d'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type NewLoanApplication = typeof loanApplications.$inferInsert;
export type CurrencyWallet = typeof currencyWallets.$inferSelect;
export type NewCurrencyWallet = typeof currencyWallets.$inferInsert;
export type FxTransaction = typeof fxTransactions.$inferSelect;
export type NewFxTransaction = typeof fxTransactions.$inferInsert;
export type InternationalTransfer = typeof internationalTransfers.$inferSelect;
export type NewInternationalTransfer = typeof internationalTransfers.$inferInsert;

// Crypto types
export type CryptoWallet = typeof cryptoWallets.$inferSelect;
export type NewCryptoWallet = typeof cryptoWallets.$inferInsert;
export type ConnectedWallet = typeof connectedWallets.$inferSelect;
export type NewConnectedWallet = typeof connectedWallets.$inferInsert;
export type CryptoTransaction = typeof cryptoTransactions.$inferSelect;
export type NewCryptoTransaction = typeof cryptoTransactions.$inferInsert;
export type CryptoPriceCache = typeof cryptoPriceCache.$inferSelect;
export type NewCryptoPriceCache = typeof cryptoPriceCache.$inferInsert;
