import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, transactions } from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";

async function getGreeting(firstname: string) {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const firstname = session.user.firstname || "User";
  const greeting = await getGreeting(firstname);

  // Get user's accounts
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  if (userAccounts.length === 0) {
    redirect("/accounts");
  }

  const primaryAccount = userAccounts[0];

  // Get last 5 transactions
  const recentTransactions = await db.query.transactions.findMany({
    where: eq(transactions.accountId, primaryAccount.id),
    orderBy: [desc(transactions.createdAt)],
    limit: 5,
  });

  // Get monthly stats
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const monthlyTransactions = await db.query.transactions.findMany({
    where: and(
      eq(transactions.accountId, primaryAccount.id),
      sql`${transactions.createdAt} >= ${firstOfMonth.toISOString()}`
    ),
  });

  const totalCredits = monthlyTransactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalDebits = monthlyTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Serialize for client
  const serializedAccounts = userAccounts.map((a) => ({
    ...a,
    balance: a.balance.toString(),
  }));

  const serializedTransactions = recentTransactions.map((t) => ({
    ...t,
    amount: t.amount.toString(),
    createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return (
    <DashboardClient
      greeting={greeting}
      firstname={firstname}
      accounts={serializedAccounts}
      primaryAccountId={primaryAccount.id}
      transactions={serializedTransactions}
      totalCredits={totalCredits}
      totalDebits={totalDebits}
    />
  );
}
