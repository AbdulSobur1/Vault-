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

  // 2FA
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorMethod: text("two_factor_method"), // 'totp' | 'sms' | null
  twoFactorSetupComplete: boolean("two_factor_setup_complete").notNull().default(false),

  // TOTP
  totpSecret: text("totp_secret"), // encrypted TOTP secret

  // SMS
  phoneVerified: boolean("phone_verified").notNull().default(false),
});

export const twoFactorBackupCodes = pgTable("two_factor_backup_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  codeHash: text("code_hash").notNull(),
  used: boolean("used").notNull().default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const smsOtpCodes = pgTable("sms_otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  attempts: integer("attempts").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const twoFactorSessions = pgTable("two_factor_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  sessionToken: text("session_token").unique().notNull(),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
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

export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  // Sudo Africa IDs
  sudoCustomerId: text('sudo_customer_id'),
  sudoCardId: text('sudo_card_id').unique(),

  // Card details (non-sensitive — safe to store)
  last4: text('last4'),
  expiryMonth: text('expiry_month'),
  expiryYear: text('expiry_year'),
  cardType: text('card_type').notNull().default('virtual'),
  currency: text('currency').notNull().default('USD'),
  brand: text('brand').default('Visa'),

  // Status
  status: text('status').notNull().default('active'),
  isActive: boolean('is_active').notNull().default(true),

  // Spending controls
  spendingLimitAmount: numeric('spending_limit_amount', { precision: 15, scale: 2 }),
  spendingLimitInterval: text('spending_limit_interval'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Card transactions from Sudo webhooks
export const cardTransactions = pgTable('card_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  sudoCardId: text('sudo_card_id').notNull(),
  sudoTransactionId: text('sudo_transaction_id').unique(),
  type: text('type').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  merchant: text('merchant'),
  category: text('category'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

// Crypto ↔ fiat conversion history
export const cryptoFxTransactions = pgTable('crypto_fx_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  direction: text('direction').notNull(), // 'buy' | 'sell'

  // Buy: fiat → crypto | Sell: crypto → fiat
  fiatCurrency: text('fiat_currency').notNull(),
  cryptoCoin: text('crypto_coin').notNull(),

  fiatAmount: numeric('fiat_amount', { precision: 20, scale: 8 }).notNull(),
  cryptoAmount: numeric('crypto_amount', { precision: 20, scale: 8 }).notNull(),

  pricePerCoinUSD: numeric('price_per_coin_usd', { precision: 20, scale: 8 }).notNull(),
  pricePerCoinFiat: numeric('price_per_coin_fiat', { precision: 20, scale: 8 }).notNull(),

  spreadRate: numeric('spread_rate', { precision: 5, scale: 4 }).notNull().default('0.015'),
  spreadAmountFiat: numeric('spread_amount_fiat', { precision: 20, scale: 8 }).notNull(),

  reference: text('reference').unique().notNull(),
  status: text('status').notNull().default('completed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
export type CryptoFxTransaction = typeof cryptoFxTransactions.$inferSelect;
export type NewCryptoFxTransaction = typeof cryptoFxTransactions.$inferInsert;

// Card types
export type CardTransaction = typeof cardTransactions.$inferSelect;
export type NewCardTransaction = typeof cardTransactions.$inferInsert;

export type CryptoPriceCache = typeof cryptoPriceCache.$inferSelect;
export type NewCryptoPriceCache = typeof cryptoPriceCache.$inferInsert;
