import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CardsClient } from "./client";

export default async function CardsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [userCards, userAccounts] = await Promise.all([
    db.query.cards.findMany({
      where: eq(cards.userId, session.user.id),
    }),
    db.query.accounts.findMany({
      where: eq(accounts.userId, session.user.id),
    }),
  ]);

  const serializedAccounts = userAccounts.map((a) => ({
    id: a.id,
    accountType: a.accountType,
    accountNumber: a.accountNumber,
    balance: a.balance.toString(),
  }));

  return <CardsClient cards={userCards} userId={session.user.id} accounts={serializedAccounts} />;
}
