import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, transactions } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { success: false, message: "Account ID is required." },
        { status: 400 }
      );
    }

    // Verify account belongs to user
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    });

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    if (account.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 403 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    const typeFilter = searchParams.get("type");

    // Build where clause
    const conditions = [eq(transactions.accountId, accountId)];
    if (typeFilter && ["credit", "debit"].includes(typeFilter)) {
      conditions.push(eq(transactions.type, typeFilter as "credit" | "debit"));
    }

    const allTransactions = await db.query.transactions.findMany({
      where: and(...conditions),
      orderBy: [desc(transactions.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      transactions: allTransactions,
      page,
      limit,
    });
  } catch (error) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}
