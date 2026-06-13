import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { currencyWallets, fxTransactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { calculateConversion } from "@/lib/exchange-rates";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { fromCurrency, toCurrency, fromAmount } = await req.json();

  const parsedAmount = parseFloat(fromAmount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  // Fetch source wallet
  const [sourceWallet] = await db
    .select()
    .from(currencyWallets)
    .where(
      and(
        eq(currencyWallets.userId, userId),
        eq(currencyWallets.currency, fromCurrency)
      )
    );

  if (!sourceWallet) return Response.json({ error: "Source wallet not found" }, { status: 404 });
  if (parseFloat(sourceWallet.balance) < parsedAmount) {
    return Response.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // Fetch or create destination wallet
  let [destWallet] = await db
    .select()
    .from(currencyWallets)
    .where(
      and(
        eq(currencyWallets.userId, userId),
        eq(currencyWallets.currency, toCurrency)
      )
    );

  if (!destWallet) {
    [destWallet] = await db
      .insert(currencyWallets)
      .values({
        userId,
        currency: toCurrency,
        balance: "0",
      })
      .returning();
  }

  // Calculate conversion
  const conversion = await calculateConversion(fromCurrency, toCurrency, parsedAmount);
  const reference = `VLT-FX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Execute atomically
  await db.transaction(async (tx) => {
    // Deduct from source
    await tx
      .update(currencyWallets)
      .set({ balance: String(parseFloat(sourceWallet.balance) - parsedAmount) })
      .where(eq(currencyWallets.id, sourceWallet.id));

    // Credit destination
    await tx
      .update(currencyWallets)
      .set({ balance: String(parseFloat(destWallet.balance) + conversion.toAmount) })
      .where(eq(currencyWallets.id, destWallet.id));

    // Record FX transaction
    await tx.insert(fxTransactions).values({
      userId,
      fromCurrency,
      toCurrency,
      fromAmount: String(parsedAmount),
      toAmount: String(conversion.toAmount),
      exchangeRate: String(conversion.midRate),
      spreadRate: String(conversion.spreadRate),
      spreadAmount: String(conversion.spreadAmount),
      reference,
      status: "completed",
    });
  });

  return Response.json({
    success: true,
    reference,
    conversion,
  });
}
