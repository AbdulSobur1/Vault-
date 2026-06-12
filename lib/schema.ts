import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  date,
  integer,
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
  nin: text("nin").unique(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
