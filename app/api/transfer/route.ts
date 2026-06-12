import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, transactions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
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
    const { fromAccountId, toAccountNumber, amount, description } = body;

    // Validate required fields
    if (!fromAccountId || !toAccountNumber || !amount) {
      return NextResponse.json(
        { success: false, message: "From account, recipient account number, and amount are required." },
        { status: 400 }
      );
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid transfer amount." },
        { status: 400 }
      );
    }

    // Get sender's account
    const senderAccount = await db.query.accounts.findFirst({
      where: eq(accounts.id, fromAccountId),
    });

    if (!senderAccount) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    // Verify ownership
    if (senderAccount.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access to this account." },
        { status: 403 }
      );
    }

    // Check sufficient balance
    const senderBalance = parseFloat(senderAccount.balance);
    if (senderBalance < transferAmount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance." },
        { status: 400 }
      );
    }

    // Get receiver's account
    const receiverAccount = await db.query.accounts.findFirst({
      where: eq(accounts.accountNumber, toAccountNumber),
    });

    if (!receiverAccount) {
      return NextResponse.json(
        { success: false, message: "Recipient account not found." },
        { status: 404 }
      );
    }

    // Cannot transfer to self
    if (receiverAccount.id === senderAccount.id) {
      return NextResponse.json(
        { success: false, message: "Cannot transfer to your own account." },
        { status: 400 }
      );
    }

    const reference = generateReference();

    // Perform the transfer in a transaction
    await db.transaction(async (tx) => {
      // Debit sender
      await tx
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} - ${transferAmount.toString()}`,
        })
        .where(eq(accounts.id, senderAccount.id));

      // Credit receiver
      await tx
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${transferAmount.toString()}`,
        })
        .where(eq(accounts.id, receiverAccount.id));

      // Insert debit transaction for sender
      await tx.insert(transactions).values({
        accountId: senderAccount.id,
        type: "debit",
        amount: transferAmount.toString(),
        description: description || `Transfer to ${toAccountNumber}`,
        reference,
        status: "completed",
      });

      // Insert credit transaction for receiver
      await tx.insert(transactions).values({
        accountId: receiverAccount.id,
        type: "credit",
        amount: transferAmount.toString(),
        description: description || `Transfer from ${senderAccount.accountNumber}`,
        reference: `${reference}-RCV`,
        status: "completed",
      });
    });

    // Get updated balance
    const updatedAccount = await db.query.accounts.findFirst({
      where: eq(accounts.id, senderAccount.id),
    });

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully.",
      reference,
      newBalance: updatedAccount?.balance || senderAccount.balance,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Transfer failed. Please try again." },
      { status: 500 }
    );
  }
}
