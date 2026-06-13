import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, transactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { generateReference } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { accountId, amount } = body;

    if (!accountId || !amount) {
      return NextResponse.json(
        { success: false, message: "Account ID and amount are required." },
        { status: 400 }
      );
    }

    const fundAmount = parseFloat(amount);
    if (isNaN(fundAmount) || fundAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    // Calculate fee
    const FUNDING_FEE_RATE = 0.015;
    const FUNDING_FEE_CAP = 2000;
    const fee = Math.min(fundAmount * FUNDING_FEE_RATE, FUNDING_FEE_CAP);
    const netCredit = fundAmount - fee;

    // Verify account belongs to user
    const account = await db.query.accounts.findFirst({
      where: and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)),
    });

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    const reference = generateReference();

    // Update balance and create transaction
    await db.transaction(async (tx) => {
      await tx
        .update(accounts)
        .set({
          balance: String(parseFloat(account.balance) + netCredit),
        })
        .where(eq(accounts.id, account.id));

      await tx.insert(transactions).values([
        {
          accountId: account.id,
          type: "credit",
          amount: fundAmount.toString(),
          description: "Account funding",
          reference,
          status: "completed",
        },
        {
          accountId: account.id,
          type: "debit",
          amount: fee.toString(),
          description: "Processing fee",
          reference: `${reference}-FEE`,
          status: "completed",
        },
      ]);
    });

    const updatedAccount = await db.query.accounts.findFirst({
      where: eq(accounts.id, account.id),
    });

    return NextResponse.json({
      success: true,
      message: "Account funded successfully.",
      reference,
      newBalance: updatedAccount?.balance || account.balance,
    });
  } catch (error) {
    console.error("Funding error:", error);
    return NextResponse.json(
      { success: false, message: "Funding failed. Please try again." },
      { status: 500 }
    );
  }
}
