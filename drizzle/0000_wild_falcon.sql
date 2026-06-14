CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_number" text NOT NULL,
	"account_type" text NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE "card_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sudo_card_id" text NOT NULL,
	"sudo_transaction_id" text,
	"type" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" text NOT NULL,
	"merchant" text,
	"category" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "card_transactions_sudo_transaction_id_unique" UNIQUE("sudo_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sudo_customer_id" text,
	"sudo_card_id" text,
	"last4" text,
	"expiry_month" text,
	"expiry_year" text,
	"card_type" text DEFAULT 'virtual' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"brand" text DEFAULT 'Visa',
	"status" text DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"spending_limit_amount" numeric(15, 2),
	"spending_limit_interval" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cards_sudo_card_id_unique" UNIQUE("sudo_card_id")
);
--> statement-breakpoint
CREATE TABLE "connected_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address" text NOT NULL,
	"wallet_type" text NOT NULL,
	"label" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"connected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crypto_fx_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"direction" text NOT NULL,
	"fiat_currency" text NOT NULL,
	"crypto_coin" text NOT NULL,
	"fiat_amount" numeric(20, 8) NOT NULL,
	"crypto_amount" numeric(20, 8) NOT NULL,
	"price_per_coin_usd" numeric(20, 8) NOT NULL,
	"price_per_coin_fiat" numeric(20, 8) NOT NULL,
	"spread_rate" numeric(5, 4) DEFAULT '0.015' NOT NULL,
	"spread_amount_fiat" numeric(20, 8) NOT NULL,
	"reference" text NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crypto_fx_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "crypto_price_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coin" text NOT NULL,
	"price_usd" numeric(20, 8) NOT NULL,
	"change_24h" numeric(10, 4),
	"market_cap" numeric(20, 2),
	"sparkline_7d" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crypto_price_cache_coin_unique" UNIQUE("coin")
);
--> statement-breakpoint
CREATE TABLE "crypto_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_address" text NOT NULL,
	"type" text NOT NULL,
	"coin" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"amount_usd" numeric(20, 2),
	"to_address" text,
	"from_address" text,
	"tx_hash" text,
	"block_explorer_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"gas_used" numeric(20, 8),
	"gas_fee_usd" numeric(10, 4),
	"network" text DEFAULT 'ethereum' NOT NULL,
	"reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	CONSTRAINT "crypto_transactions_tx_hash_unique" UNIQUE("tx_hash"),
	CONSTRAINT "crypto_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "crypto_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address" text NOT NULL,
	"encrypted_private_key" text NOT NULL,
	"encrypted_mnemonic" text NOT NULL,
	"network" text DEFAULT 'ethereum' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crypto_wallets_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "currency_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"currency" text NOT NULL,
	"balance" numeric(20, 8) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currency_wallets_user_id_currency_unique" UNIQUE("user_id","currency")
);
--> statement-breakpoint
CREATE TABLE "fx_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"from_amount" numeric(20, 8) NOT NULL,
	"to_amount" numeric(20, 8) NOT NULL,
	"exchange_rate" numeric(20, 8) NOT NULL,
	"spread_rate" numeric(5, 4) DEFAULT '0.015' NOT NULL,
	"spread_amount" numeric(20, 8) NOT NULL,
	"reference" text NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fx_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "international_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"from_amount" numeric(20, 8) NOT NULL,
	"to_amount" numeric(20, 8) NOT NULL,
	"exchange_rate" numeric(20, 8) NOT NULL,
	"recipient_name" text NOT NULL,
	"recipient_bank" text,
	"recipient_account" text NOT NULL,
	"recipient_country" text NOT NULL,
	"swift_code" text,
	"routing_number" text,
	"narration" text,
	"reference" text NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "international_transfers_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "loan_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"loan_type" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"tenure" integer NOT NULL,
	"purpose" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	"session_token" text NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"description" text,
	"reference" text NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"surname" text NOT NULL,
	"firstname" text NOT NULL,
	"middlename" text,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text,
	"dob" date,
	"gender" text,
	"nationality" text,
	"address" text,
	"nin" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_transactions" ADD CONSTRAINT "card_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connected_wallets" ADD CONSTRAINT "connected_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_fx_transactions" ADD CONSTRAINT "crypto_fx_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_transactions" ADD CONSTRAINT "crypto_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_wallets" ADD CONSTRAINT "crypto_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_wallets" ADD CONSTRAINT "currency_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fx_transactions" ADD CONSTRAINT "fx_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "international_transfers" ADD CONSTRAINT "international_transfers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;