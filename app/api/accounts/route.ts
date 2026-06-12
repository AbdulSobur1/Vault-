import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userAccounts = await db.query.accounts.findMany({
      where: eq(accounts.userId, session.user.id),
    });

    const serialized = userAccounts.map((a) => ({
      id: a.id,
      accountNumber: a.accountNumber,
      accountType: a.accountType,
      balance: a.balance.toString(),
      currency: a.currency,
      isActive: a.isActive,
    }));

    return NextResponse.json({ accounts: serialized });
  } catch (error) {
    console.error("Accounts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
