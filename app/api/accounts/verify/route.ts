import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountNumber = searchParams.get("accountNumber");

    if (!accountNumber || accountNumber.length !== 10) {
      return NextResponse.json(
        { error: "Invalid account number" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        accountNumber: accounts.accountNumber,
        accountType: accounts.accountType,
        firstName: users.firstname,
        surname: users.surname,
      })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(eq(accounts.accountNumber, accountNumber))
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      accountNumber: result[0].accountNumber,
      accountType: result[0].accountType,
      accountName: `${result[0].firstName} ${result[0].surname}`,
    });
  } catch (error) {
    console.error("Account verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify account" },
      { status: 500 }
    );
  }
}
