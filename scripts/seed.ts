import { db } from "../lib/db";
import { users, accounts, transactions, currencyWallets, cryptoWallets } from "../lib/schema";
import { hash } from "bcryptjs";
import { generateAccountNumber, generateReference } from "../lib/utils";
import { generateWallet } from "../lib/crypto-wallet";

async function seed() {
  console.log("🌱 Seeding Vaulté database...");

  // Check if demo user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "demo@vaulte.app"),
  });

  if (existingUser) {
    console.log("Demo user already exists. Skipping seed.");
    process.exit(0);
  }

  // Create demo user
  const passwordHash = await hash("Demo1234!", 12);

  const [user] = await db
    .insert(users)
    .values({
      surname: "Demo",
      firstname: "User",
      email: "demo@vaulte.app",
      passwordHash,
      phone: "+2348012345678",
      gender: "male",
      nationality: "Nigerian",
      nin: "12345678901",
      address: "123 Sample Street, Lagos, Nigeria",
    })
    .returning();

  console.log(`✓ Created demo user: ${user.email}`);

  // Create savings account with ₦250,000 balance
  const [savingsAccount] = await db
    .insert(accounts)
    .values({
      userId: user.id,
      accountNumber: generateAccountNumber(),
      accountType: "savings",
      balance: "250000.00",
      currency: "NGN",
    })
    .returning();

  console.log(`✓ Created savings account: ${savingsAccount.accountNumber} (₦250,000.00)`);

  // Create 10 sample transactions
  const sampleTransactions = [
    { type: "credit" as const, amount: "150000.00", description: "Salary deposit - February 2026", daysAgo: 2 },
    { type: "debit" as const, amount: "35000.00", description: "Transfer to Adeleke O.", daysAgo: 3 },
    { type: "credit" as const, amount: "50000.00", description: "Freelance payment - Web project", daysAgo: 5 },
    { type: "debit" as const, amount: "12000.00", description: "Electricity bill payment", daysAgo: 7 },
    { type: "debit" as const, amount: "8500.00", description: "Grocery - Fresh Farms Market", daysAgo: 8 },
    { type: "credit" as const, amount: "25000.00", description: "Refund - Order #12345", daysAgo: 10 },
    { type: "debit" as const, amount: "45000.00", description: "Transfer to Chioma M.", daysAgo: 12 },
    { type: "credit" as const, amount: "75000.00", description: "Consulting fee - January 2026", daysAgo: 14 },
    { type: "debit" as const, amount: "5500.00", description: "Netflix subscription", daysAgo: 15 },
    { type: "credit" as const, amount: "10000.00", description: "Interest payment", daysAgo: 18 },
  ];

  for (const txn of sampleTransactions) {
    const date = new Date();
    date.setDate(date.getDate() - txn.daysAgo);

    await db.insert(transactions).values({
      accountId: savingsAccount.id,
      type: txn.type,
      amount: txn.amount,
      description: txn.description,
      reference: generateReference(),
      status: "completed",
      createdAt: date,
    });
  }

  console.log("✓ Created 10 sample transactions");

  // Create multi-currency wallets for demo user
  await db.insert(currencyWallets).values([
    { userId: user.id, currency: "NGN", balance: "250000" },
    { userId: user.id, currency: "USD", balance: "500" },
    { userId: user.id, currency: "GBP", balance: "200" },
    { userId: user.id, currency: "EUR", balance: "350" },
  ]);

  console.log("✓ Created multi-currency wallets (NGN, USD, GBP, EUR)");

  // Generate crypto wallet for demo user
  const { address, encryptedPrivateKey, encryptedMnemonic } = generateWallet();
  await db.insert(cryptoWallets).values({
    userId: user.id,
    address,
    encryptedPrivateKey,
    encryptedMnemonic,
    network: 'ethereum',
  });

  console.log(`✓ Created crypto wallet: ${address}`);
  console.log("\n✅ Seed completed successfully!");
  console.log("\n📧 Demo login: demo@vaulte.app");
  console.log("🔑 Password: Demo1234!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
