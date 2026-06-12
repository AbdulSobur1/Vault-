import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, accounts } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

function generateCardNumber(): string {
  const rand = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `4${rand().slice(1)}${rand()}${rand()}${rand()}`;
}

function maskCardNumber(full: string): string {
  return `**** **** **** ${full.slice(-4)}`;
}

function generateExpiry(): string {
  const now = new Date();
  const expYear = now.getFullYear() + 3;
  const expMonth = String(now.getMonth() + 1).padStart(2, "0");
  return `${expMonth}/${String(expYear).slice(-2)}`;
}

function generateCVV(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    // Verify account belongs to user
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)));

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Check user doesn't already have an active virtual card on this account
    const [existingCard] = await db
      .select()
      .from(cards)
      .where(and(
        eq(cards.userId, session.user.id),
        eq(cards.accountId, accountId),
        eq(cards.cardType, "virtual"),
        eq(cards.isActive, true)
      ));

    if (existingCard) {
      return NextResponse.json({ error: "You already have an active virtual card for this account." }, { status: 409 });
    }

    const rawCVV = generateCVV();
    const hashedCVV = await bcrypt.hash(rawCVV, 10);
    const fullCardNumber = generateCardNumber();
    const expiry = generateExpiry();

    await db.insert(cards).values({
      id: randomUUID(),
      userId: session.user.id,
      accountId,
      cardNumber: maskCardNumber(fullCardNumber),
      cardType: "virtual",
      expiryDate: expiry,
      cvv: hashedCVV,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      card: {
        cardNumber: fullCardNumber.replace(/(\d{4})/g, "$1 ").trim(),
        expiryDate: expiry,
        cvv: rawCVV,
        cardType: "virtual",
      },
      message: "Save your card details now. CVV will not be shown again.",
    });
  } catch (error) {
    console.error("Card request error:", error);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
