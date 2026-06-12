import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FundClient } from "./client";

export default async function FundPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
  });

  if (userAccounts.length === 0) {
    redirect("/login");
  }

  const serializedAccounts = userAccounts.map((a) => ({
    ...a,
    balance: a.balance.toString(),
  }));

  return <FundClient accounts={serializedAccounts} />;
}
