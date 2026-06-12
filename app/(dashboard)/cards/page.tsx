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

  const userCards = await db.query.cards.findMany({
    where: eq(cards.userId, session.user.id),
  });

  return <CardsClient cards={userCards} userId={session.user.id} />;
}
