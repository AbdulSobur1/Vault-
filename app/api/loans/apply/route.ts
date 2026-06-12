import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { loanApplications, accounts } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { loanType, amount, tenure, purpose, accountId } = await req.json();

    if (!loanType || !amount || !tenure || !accountId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    if (parsedAmount < 10000) {
      return NextResponse.json({ error: "Minimum loan amount is ₦10,000" }, { status: 400 });
    }

    // Verify account belongs to user
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)));

    if (!account) {
      return NextResponse.json({ error: "Invalid account" }, { status: 404 });
    }

    await db.insert(loanApplications).values({
      userId: session.user.id,
      accountId,
      loanType,
      amount: String(parsedAmount),
      tenure,
      purpose: purpose || null,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Loan application submitted. We will review and respond within 2–3 business days.",
    });
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json({ error: "Failed to submit loan application" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.query.loanApplications.findMany({
      where: eq(loanApplications.userId, session.user.id),
      orderBy: (apps: any, { desc }: any) => [desc(apps.createdAt)],
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Loan fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch loan applications" }, { status: 500 });
  }
}
